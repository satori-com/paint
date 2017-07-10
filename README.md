# Satori Paint Demo

![Satori Image](public/satori-logo-banner.jpg)


Satori provides an API that sends data between apps at high speed. The API uses a publish/subscribe model: Apps *publish* data of any type to a *channel*, and other apps *subscribe* to that channel and retrieve data from it. The API, based on WebSocket, transfers any amount of data with almost no delay.

The paint demo app shows you how the Satori API works. It displays a whiteboard and drawing tools. As you draw on the whiteboard, the app publishes drawing information to a channel hosted by Satori. To subscribe to the channel, you get a URL for it and send it to other users. When they open the URL, they see the drawing you do and you can see the drawings they do.

**Hint:** Send the URL to **lots** of people. No matter how many people are painting, the whiteboard immediately draws their input.

You can also get the source files for the demo and run it locally, using your own Satori project channel. To learn how, see "Run the demo locally".

# Run the online demo

1. Navigate to the [Satori paint demo site](https://paint.satori.com). The site displays a whiteboard with a toolbar at the top.
1. To share the whiteboard with others, click the share icon to display a URL for the channel. 
1. Copy the URL and send it to the users you want to share with. You can share with as many users as you want. When the users navigate to the URL in their browser, they also see a whiteboard.
1. Both you and the other users can draw on your whiteboards and see the results of other drawings.

## Draw on the whiteboard 
1. Select a color from the toolbar.
1. To draw:
    1. On a mobile device, drag your finger on the whiteboard.
    1. On a computer, drag the pencil icon on the whiteboard.
1. To erase, toggle the eraser tool. To stop erasing, toggle it again.
1. To clear the entire whiteboard, click the refresh icon.
1. To change the line width, click the small dot.

# Run the demo locally
You can get the source files for the demo and run it locally. The source includes the browser JavaScript that runs the whiteboard, the Satori API library, and a server that hosts a Satori project channel.   

## Prerequisites
To run the demo locally, you need the following:

* A computer that supports Node.js.
* Node.js version 6.0.0 or later

Ensure that the Node package manager `npm` is available.

All of the code for the demo is included in the GitHub clone, or it is installed using `npm` after you have the code.

## Get credentials from Satori
Set up a Satori account and create a project for credentials.

1. Log in or sign up for a Satori account at [https://developer.satori.com](https://developer.satori.com).
1. From the dashboard, navigate to the **Projects** page.
1. Click **Add a project**, then enter the name "Paint" and click **Add**.
1. Satori displays an `appkey` and `endpoint` for your project. These credentials let the JavaScript app connect with Satori. Make a copy of them.
1. Save the project.

## Get the demo code
The demo code is available in a public GitHub repository. It's based on React, using the [Create React App](https://github.com/facebookincubator/create-react-app) framework. As a result, you have access to all the tools provided by `react-scripts`.

To use the code, all you have to do is clone it from GitHub, build it, and run it.

*Need instructions for cloning the Git repository*

**Note:** The [Create React App documentation](https://github.com/facebookincubator/create-react-app/blob/master/README.md) describes the framework in more detail. To learn more about creating Satori projects for your own apps, see the [Dev Portal tutorial](https://www.satori.com/docs/tutorials/tutorial-steps-devportal).

1. Clone the demo source files from GitHub:

```
git clone git@github.com:satori-com/paint.git
cd paint-demo
```
1. Build the code
```
npm install
```

1. In `paint-demo`, edit `.env`, then add the `appkey` and `endpoint` values:

```
REACT_APP_ENDPOINT='<endpoint_value>'
REACT_APP_APPKEY='<appkey_value>'
```

1. Run the app server
```
npm run start
```

This starts the local server, which uses port 3000 (https://localhost:3000).

1. The local server displays a whiteboard with a toolbar at the top.
1. To share the whiteboard with others:
    1. Don't use the share button, because it just displays the URL for your local server. You need your server's IP address and channel information.
    1. Instead, switch focus to the terminal app in which you started the server. A message lists the IP address of the server on your local network.
    1. Copy the URL and send it to the users you want to share with.
1. To see the instructions for using the whiteboard, see the section "Draw on the whiteboard". 

# App architecture
The paint demo uses two components:
* `App.js`: Publishes movement events to a Satori project channel when users draw in the browser
* `Whiteboard.js`: Subscribes to the project channel, gets movement events, and draws the coordinates to the browser canvas

Notice that the online demo uses a Satori *public* channel that's shared by everyone, but your local server uses a project channel that's only available to you and the users who have your local server URL. 

## `App.js`
This component publishes mouse/touch events it detects in the browser canvas. Each event contains an event type, such as `mousedown`, and a canvas-based coordinate. When users click, tap, or drag, `App.js` publishes an event to a Satori project channel. `App.js` also publishes drawing information such as drawing color, line width, and user information. `Whiteboard.js` uses this information to control the drawing and display a list of participants.

## `Whiteboard.js`
This component subscribes to the Satori project channel and reads events and information from the channel. It tracks each user's color and line width state and draws on its canvas based on incoming mouse/touch events. 

The [Satori Motion Demo](https://github.com/satori-com/motion) and [Satori Chat Demo](https://github.com/satori-com/chat) show you other ways to interact with users. 

# Next steps
This demo shows you a simple app that shares a whiteboard among users. Try extending this application to include more complex drawing tools or more colors. You may embed this app in your other projects or the other demo projects we provide. 

# Further reading
* [Satori Developer Documentation](https://wwwstage.satori.com/docs/introduction/new-to-satori): Documentation for the entire Satori Live Data Ecosystem 
* [Satori JavaScript SDK](https://github.com/satori-com/satori-rtm-sdk-js): The Satori JavaScript API and developer tools
* [Satori JavaScript tutorial](https://wwwstage.satori.com/docs/tutorials/javascript-tutorial)):  Tutorial that shows you how to write JavaScript apps that use the SDK and the [Satori Live Messaging](https://wwwstage.satori.com/docs/using-satori/rtm-api) platform 
