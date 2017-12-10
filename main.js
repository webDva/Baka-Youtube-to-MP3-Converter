let express = require('express');
let cors = require('cors');
let path = require('path');
let bodyParser = require('body-parser');

let YoutubeMp3Downloader = require("youtube-mp3-downloader");

let Downloader = function () {

    let self = this;

    //Configure YoutubeMp3Downloader with your settings
    self.YD = new YoutubeMp3Downloader({
        "ffmpegPath": "ffmpeg.exe", // Where is the FFmpeg binary located?
        "outputPath": "videos", // Where should the downloaded and encoded files be stored?
        "youtubeVideoQuality": "highest", // What video quality should be used?
        "queueParallelism": 2, // How many parallel downloads/encodes should be started?
        "progressTimeout": 2000                 // How long should be the interval of the progress reports
    });

    self.callbacks = {};

    self.YD.on("finished", function (error, data) {

        if (self.callbacks[data.videoId]) {
            self.callbacks[data.videoId](error, data);
        } else {
            console.log("Error: No callback for videoId!");
        }

    });

    self.YD.on("error", function (error, data) {

        // remove this in production/on launch
        console.error(error + " on videoId " + data.videoId);

        if (self.callbacks[data.videoId]) {
            self.callbacks[data.videoId](error, data);
        } else {
            console.log("Error: No callback for videoId!");
        }

    });
};

Downloader.prototype.getMP3 = function (videoId, callback) {

    var self = this;

    // Register callback
    self.callbacks[videoId] = callback;
    // Trigger download
    self.YD.download(videoId);

};

let downloader = new Downloader();

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

let videos = [];

// convert youtube video to mp3

app.post('/convert/:videoId', (req, res) => {
    downloader.getMP3(req.params.videoId, (err, result) => {
        if (!res.headersSent) {
            if (err) {
                res.send({'failed': true});
            } else {
                res.send(result);
            }
        }
    });
});

app.get('/download/:file', (req, res) => {
    res.sendFile(req.params.file, {root: __dirname + '/videos/'});
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