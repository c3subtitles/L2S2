31C3 Live Subtiteling
=====================
*Die "mal schnell was fummeln" Lösung.*

The Application provides a minimal web interface for the live subtitling writers at the 31C3. The idea is to have multiple people writing interleaved sentences, each seeing what the others do. The live written lines are provided via WebSockets to possible consumers, for example a Reader-App viewable on mobile Devices in the Room, Live-Viewer on the Streaming-Page or – in H­all 1 – on the Beamer.

Development Setup
````
git clone https://github.com/MaZderMind/live-subtitles-test-backend
cd live-subtitles-test-backend
npm install
node backend.js
````

GUIs
----
By default the Server-System will listen on Port 33133. You can therefore access `http://localhost:33133/` to see the Readers GUI. It is intended for People participating the 31C3 to be used in the Rooms. After selecting the room you will see Live Subtitles written in that room.

The Writers GUI can be accessed at `http://localhost:33133/write`. It requires a login. Logins are saved in the `users.json` where also some default logins can be found. The writers GUI basically is a Chat with extra features. Every writer can see what every other writer for that room is typing; by pressing enter the currently written line is published to all connected reader Sockets. The writers GUI features some more special features like
 - Shortcuts
 - Speakername-Fetching from Fahrplan
 - Writer-GUI locking
 - User-Management

which you will for sure find yourself out.


Getting Data out
----------------
The simplest way to get Data out is using nodejs and socketio. For a web application you can take a look at [beamer.js](public/js/beamer.js), which is close to the simplest possible web-client. If all you want ist a command line output, take a look at [cli.js](cli.js) which is event simpler.

Subtitle Logs
-------------
Every line written is published to the folder /public/logs/ (for the 31C3: http://c3voc.mazdermind.de:33133/logs/). Each line consists of a Microsecond-Timestamp, a Tab and the Text. There is [a tool](https://github.com/luto/c3subtitles-srt-converter) to convert parts of it to SRTs.
