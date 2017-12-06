let express = require('express');
let cors = require('cors');
let path = require('path');
let bodyParser = require('body-parser');

let YoutubeMp3Downloader = require("youtube-mp3-downloader");

//Configure YoutubeMp3Downloader with your settings
let YD = new YoutubeMp3Downloader({
    "ffmpegPath": "ffmpeg.exe", // Where is the FFmpeg binary located?
    "outputPath": "./", // Where should the downloaded and encoded files be stored?
    "youtubeVideoQuality": "highest", // What video quality should be used?
    "queueParallelism": 2, // How many parallel downloads/encodes should be started?
    "progressTimeout": 2000                 // How long should be the interval of the progress reports
});

YD.on("finished", function (err, data) {
    console.log(JSON.stringify(data));
});

YD.on("error", function (error) {
    console.log(error);
});

YD.on("progress", function (progress) {
    console.log(JSON.stringify(progress));
});

/*
 * API Server
 */

const app = express();
app.use(cors()); // Needed for file sharing.
// Needed for POST requests.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const port = process.env.PORT || '3000';
app.set('port', port);

// convert youtube video to mp3

app.post('/convert/:videoId', (req, res) => {
    YD.download(req.params.videoId);
});

/*
 * HTTP Server
 */

// Point static path to dist
app.use(express.static(path.join(__dirname, '/frontend/dist')));

// Catch all other routes and return the index file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/frontend/dist/index.html'));
});

// Start the HTTP server.
app.listen(port, (errorThatOccurs) => {
    if (errorThatOccurs) {
        return console.log('Something bad happened.', errorThatOccurs);
    }

    console.log(`Server running on localhost:${port}`);
});