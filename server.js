const express = require('express');
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const Spotify = require('node-spotify-api');
let spotify = new Spotify({
    id: "2bcd045b46dd40a99b4da7120f4c4926",
    secret: "a7cd104972dd4aacaef8f44824b99d3f"
});

var spotifyData;
var spotify30;

// Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
    console.log(req.body);

    spotify
        .search({ type: req.body.type, query: req.body.term, limit: '1' })
        .then(function (response) {
            // case for track, artist, and album, display different data
            console.log(response.tracks.items[0].album.images[0])
            //case for TRACK
            spotifyData = [
                "Artist: " + response.tracks.items[0].album.artists[0].name,
                "Album: " + response.tracks.items[0].album.name,
                "Song Title: " + response.tracks.items[0].name,
                "Preview Link: " + response.tracks.items[0].external_urls.spotify,
                "30 Second Preview: " + response.tracks.items[0].preview_url
            ]//.join("\n\n");

            spotifyData2 = {
                artist: response.tracks.items[0].album.artists[0].name,
                album: response.tracks.items[0].album.name,
                albumImg: response.tracks.items[0].album.images[0].url,
                songTitle: response.tracks.items[0].name,
                previewLink: response.tracks.items[0].external_urls.spotify,
                thirty: response.tracks.items[0].preview_url
            }

            spotify30 = response.tracks.items[0].preview_url

            // console.log(spotifyData);

            //case for ARTIST

            //case for ALBUM

            //IF PREVIEW IS NULL

            if (spotify30 === null) {
                res.send(`Unfortunately, a preview for this song is unavailable.`);
            }
            else {
                //ELSE

                //This is the App.js body
                /*res.send(
                    `Searching for "${req.body.term}" with the filter "${req.body.type}... Preview Link"${spotify30}"`
                );*/

                res.json(spotifyData2);

                /*res.json(
                    {
                        artist: response.tracks.items[0].album.artists[0].name,

                        album: response.tracks.items[0].album.name,

                        songTitle: response.tracks.items[0].name,

                        previewLink: response.tracks.items[0].external_urls.spotify,

                        thirty: response.tracks.items[0].preview_url
                    }
                    );*/

            };
        })
        .catch(function (err) {
            console.log(err)
        })

});

/* DB Config
const db = require('./config/keys').mongoURI;

mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Use Routes
app.use('/api/articles', articles);
*/

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`
));

