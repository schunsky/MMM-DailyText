var NodeHelper = require("node_helper");

// Use JSDOM
const c = require('jsdom')
const { JSDOM } = c;

module.exports = NodeHelper.create({
	config: null,
	
	debug: false,
	
	init: function(){
		console.log("init module helper " + this.name);
	},

	start: function() {
		console.log(`Starting module helper: ${this.name}`);
	},

	stop: function(){
		console.log(`Stopping module helper: ${this.name}`);
	},

	// Message handler from DailyText.js
	socketNotificationReceived: function(notification, payload) {
		console.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
		
		// config
		if (notification === "config") {
			// Save config info
			this.config = payload
		}
		// getcontent
		else if(notification === "getcontent") {
			 this.getcontent()
		}
	},
	
	// Get daily text from jw.org
	getcontent: function(){

		var date = new Date();
		strDate = "YYYY/MM/DD";
		strDate = strDate.replace(/YYYY/g, date.getFullYear());
		strDate = strDate.replace(/MM/g, 1 + date.getMonth());
		strDate = strDate.replace(/DD/g, date.getDate());

		url = this.config.baseURL + strDate;

		console.log(this.name + " Getting content from " + url)
		JSDOM.fromURL(url)
			.then(
				(dom) => {
					console.log(this.name + "Data received via JSDOM");
					var content = [];
					
					// --- Get theme scripture --- //
					var nodeList = dom.window.document.querySelectorAll('p.themeScrp');
					content[0] = nodeList[0].textContent;
					
					// --- Get body text --- //
					var nodeList = dom.window.document.querySelectorAll('p.sb');
					content[1] = nodeList[0].textContent;

					// Return the content back to DailyText.js
					this.sendSocketNotification("node_data", content)
				},
				(error) => {
					console.log(this.name + "Error from JSDOM = " + error);
				}
			)
	}
});
