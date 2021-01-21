/* Magic Mirror
 * Module:
 * 		MMM-DailyText
 *
 * Description:
 * 		Get daily text (theme scripture, body text) from jw.org.
 * 
 * Configuration:
 * 		baseURL:		Base URL of meeting page in wol.jw.org.
 * 							Ex.
 * 							English:	https://wol.jw.org/en/wol/dt/r1/lp-e/
 * 							German:		https://wol.jw.org/de/wol/dt/r10/lp-x/
 * 		updateCycle:	Internal refresh cycle in [ms]. For example, updateTime is compared to the current time.
 * 		updateTime:		Time to update daily text
 * 
 * Auther:
 * 		schunsky
 * 
 * Change history:
 * 		11.Dec. 2020	Initial release
 * 		21.Jan. 2021	Fixed an issue where sendReqContent() is not called when config.updateTime is set to "00:00".
 * 						date.getHours() and date.getMinutes() can return 1 digit number.
 * License:
 * 		MIT Licensed.
 */

Module.register("MMM-DailyText", {
	defaults: {
	  baseURL: "https://wol.jw.org/en/wol/dt/r1/lp-e/",
	  updateCycle: 30000,
	  updateTime: "00:00"
	},

	message:"DailyText starting up",
	
	// Use a CSS for this module
	getStyles: function () {
		return ["MMM-DailyText.css"];
	},
	
	start: function () {
		this.sendConfig();
		this.sendReqContent();

		var timer = setInterval(()=>{
			this.sendReqContentAtTime()
			}, this.config.updateCycle)
	},
	
	getDom: function() {
		// Make a DIV for dailytext
		var element = document.createElement("div")
		element.classList.add("dailytext")
		element.classList.add("small")					// Defined in css/main.css

		// Add a paragraph for theme scripture
		var subElement = document.createElement("p")
		subElement.id = "scripture"
		subElement.classList.add("bold")				// Defined in css/main.css
		subElement.innerHTML = this.content[0]
		element.appendChild(subElement)

		// Add a paragraph for body text
		subElement = document.createElement("p")
		subElement.id = "bodytext"
		subElement.classList.add("light")				// Defined in css/main.css
		subElement.innerHTML = this.content[1]
		element.appendChild(subElement)

		return element
	},
	
	// Send a request to node_helper.js to get contents at a defined time
	sendReqContentAtTime: function() {
		var date = new Date();
		strTime = "hh:mm";
		strTime = strTime.replace(/hh/g, ("0" + date.getHours()).slice(-2));
		strTime = strTime.replace(/mm/g, ("0" + date.getMinutes()).slice(-2));
		Log.log("sendReqContentAtTime() is called at " + strTime + " where updateTime is " + this.config.updateTime);

		// Send a request for the contents at defined time
		if(strTime == this.config.updateTime) {
			this.sendReqContent();
		}
	},
	
	// Send a request to node_helper.js to get contents
	sendReqContent: function() {
		this.message = "DailyText send a request: getcontent"
		this.sendSocketNotification("getcontent", null)
		Log.log("sendSocketNotification: getcontent");
	},
	
	// Send config data to node_helper.js to initialize 
	sendConfig: function() {
		this.sendSocketNotification("config", this.config)
		Log.log("sendSocketNotification: config");	
	},		
	
	notificationReceived: function(notification, payload) {},
  	
  	// Message hander for node_helper.js
  	socketNotificationReceived: function(notification, payload) {
		if(notification == 'node_data') {
			Log.log("DailyText received content back from node_helper.js")
			
			// Save the data
			this.content = payload;
			Log.log("There are " + this.content.length + " elements to display");

			// Is content empty?
			if(this.content.length == 0)
				this.message = "DailyText founds no contents";

			// Update the display
			this.updateDom(1)
		}
	},
})
