# Scriptable widget for Strava

This is a widget for IOS based on the "Scriptable" framework.

It displays the last completed Strava activity including relevant data and a small map:

<img src="https://github.com/marvnsch/Scriptable-widget-for-Strava/blob/main/docs/widgetExample.png" width="550">

Supported workout types until now: 
 - Runs
 - Bike rides


## How to use it?

1. Enable API connection for your Strava-Account [here](https://www.strava.com/settings/api)
2. Download the [UpdateScript.js](https://github.com/marvnsch/Scriptable-widget-for-Strava/blob/main/UpdateScript.js) and replace ClientID and ClientSecret with the information from your API-Client:

```JavaScript
// API config
const clientID = ''; // <-- Client ID from Strava API goes here
const clientSecret = ''; // <-- Client secret from Strava API goes here
```
3. Execute the "UpdateScript_example.js" within the Scriptable-App (this downloads the actual widget script)
4. Execute the Scriptable-Widget-for-Strava script within the Scriptable-App once to initiate the widget-setup
5. Follow the steps from the setup and enjoy :)


For more information about the Strava API see the [Official Strava API Documentation](https://developers.strava.com/docs/reference/)
