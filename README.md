## Usage in your own programs
Copy `control.html` and `control.js` into your own webapp directory. Create `api_key.js` [(as shown below)](#api-key-setup). Tell users to go to `control.html` (whatever its URL is in the case of your webapp) on Google Chrome on their mobile phone and to hold the phone horizontally.

## API key setup
Sign up for [Ably](https://ably.com/). Create a new app. In the dashboard, select your app and view the API key. Give the API key permissions to push and subscribe. Copy the API key into a file called `api_key.js`. Put the file into this repository (cloned locally). In the file, type `const API_KEY = "Whatever your API key is";`.
