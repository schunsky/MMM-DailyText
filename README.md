# MMM-DailyText

This is a Magic Mirror Module which loads daily text (theme scripture, body text) from jw.org.

## Installation

1. Clone this repo into `~/MagicMirror/modules` directory.
1. Run command `npm install` in `~/MagicMirror/modules/MMM-DailyText` directory, to install all dependencies.
1. Configure `~/MagicMirror/config/config.js`:


```javascript

    {
        module: 'MMM-DailyText',
        position: 'top_right',
        config: {
				baseURL: "https://wol.jw.org/en/wol/dt/r1/lp-e/",
				updateTime: "00:00"
		}
    },

```

## Config Options

| **Option** | **Default** | **Description** |
| --- | --- | --- |
| `baseURL` | 'https://wol.jw.org/en/wol/dt/r1/lp-e/' |  Base URL of meeting page in wol.jw.org. <br> Ex. <br> English:	https://wol.jw.org/en/wol/dt/r1/lp-e/ <br> German:		https://wol.jw.org/de/wol/dt/r10/lp-x/|
| `updateTime` | `00:00` | Time to update daily text

## Dependencies
- [jsdom](https://www.npmjs.com/package/jsdom) (installed via `npm install`)
