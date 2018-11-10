require("dotenv").config();
const express = require('express');
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var request = require('request');
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = process.env.SPOTIFY_ID;
var client_secret = process.env.SPOTIFY_SECRET;
var redirect_uri = 'http://localhost:8888/callback';

var spotifyData;
var spotify30;
const Spotify = require('node-spotify-api');
let spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
});

var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var stateKey = 'spotify_auth_state';

const app = express();

// Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());

app.get('/login', function (req, res) {

    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    var scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

app.get('/callback', function (req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {

                var access_token = body.access_token,
                    refresh_token = body.refresh_token;

                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function (error, response, body) {
                    console.log(body);
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect('http://localhost:3000/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
});

app.get('/refresh_token', function (req, res) {

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Your results will display here.' });
});

app.post('/api/world', (req, res) => {
    console.log(req.body);

    spotify
        .search({ type: req.body.type, query: req.body.term, limit: '3' })
        .then(function (response) {
            // case for track, artist, and album, display different data
            //case for TRACK

            switch (req.body.type) {
                case "track":
                    searchTrack();
                    break;
                case "artist":
                    searchArtist();
                    break;
                case "album":
                    searchAlbum();
                    break;
            };

            function searchTrack() {

                spotifyData = {
                    artist1: response.tracks.items[0].album.artists[0].name,
                    album1: response.tracks.items[0].album.name,
                    albumImg1: response.tracks.items[0].album.images[1].url,
                    songTitle1: response.tracks.items[0].name,
                    previewLink1: response.tracks.items[0].external_urls.spotify,
                    thirty1: response.tracks.items[0].preview_url,

                    artist2: response.tracks.items[1].album.artists[0].name,
                    album2: response.tracks.items[1].album.name,
                    albumImg2: response.tracks.items[1].album.images[1].url,
                    songTitle2: response.tracks.items[1].name,
                    previewLink2: response.tracks.items[1].external_urls.spotify,
                    thirty2: response.tracks.items[1].preview_url,

                    artist3: response.tracks.items[2].album.artists[0].name,
                    album3: response.tracks.items[2].album.name,
                    albumImg3: response.tracks.items[2].album.images[1].url,
                    songTitle3: response.tracks.items[2].name,
                    previewLink3: response.tracks.items[2].external_urls.spotify,
                    thirty3: response.tracks.items[2].preview_url
                }

                spotify30 = response.tracks.items[0].preview_url

                if (spotify30 === null) {
                    res.send("null");
                }

                else {
                    res.json(spotifyData);
                };

            };

            function searchArtist() {
                console.log(response.artists.items);
            };

            function searchAlbum() {
                console.log(response.albums.items);
            }

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

const port = process.env.PORT || 8888;

app.listen(port, () => console.log(`Server started on port ${port}`
));

