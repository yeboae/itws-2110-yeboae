Lab 3
Hey! For this lab, I created a weather dashboard that's way more engaging than your typical weather app. Instead of just showing boring temperature numbers, I combined real weather data with daily jokes to make checking the weather actually fun.

The app shows current conditions for Troy, NY with all the important details temperature, humidity, wind speed, even sunrise/sunset times. Plus there's a 5-day forecast so you can plan your week. But the real twist is the joke section that gives you a random chuckle every time you visit.

The Journey
This started pretty basic. just pulling data from the OpenWeatherMap API and displaying it. But I ran into some issues early on where the weather data wouldn't load because I was missing some key JavaScript functions. Once I sorted that out, I focused on making the design really stand out.

I went with a sunny yellow color scheme because, well, it's a weather app! The colors make it feel warm and inviting. I also used Font Awesome icons instead of emojis to keep things looking professional.

For the second API, I chose JokeAPI because it's free, doesn't require any keys, and let's be honest. everyone could use a good laugh. The jokes load automatically and there's a refresh button if you want a new one.

The coolest feature I added is the geolocation option. you can click "Use My Location" and it'll show you the weather wherever you actually are, not just Troy. That was a fun bonus to figure out.

Behind the Scenes
APIs I Used:

OpenWeatherMap for all the weather data

JokeAPI for the daily laughs
Github i came across for it:https://github.com/15Dkatz/official_joke_api

HTML5's built-in geolocation for the location feature

Tools & Frameworks:

Bootstrap 5 for the responsive layout

Font Awesome for all the icons

Custom CSS for the yellow theme and animations

The Tech Stuff:

Pure JavaScript (no jQuery) for the API calls

Async/await for handling the data fetching

Proper error handling so it still works if APIs are down


Mobile responsive design that looks good on any device
