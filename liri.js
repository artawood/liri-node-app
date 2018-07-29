require("dotenv").config();

const keys = require("./keys");
const Twitter = require("twitter");
const inquire = require("inquirer");
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require("fs");

let spotify = new Spotify(keys.spotify);
let twitterClient = new Twitter(keys.twitter);
let content;

inquire.prompt([{
        type: "list",
        message: "This is LIRI. How can I help you?",
        choices: ["Check my twitter", "Spotify this song", "Watch movie", "Ask a question"],
        name: "command"
    }]).then((userInput) => {
        if (userInput.command === "Check my twitter") {
            const params = {
                screen_name: "ic_da28"
            }
            twitterClient.get('statuses/user_timeline', params, function (error, tweets) {
                if (!error) {
                    tweets.forEach(tweet => {
                        console.log(tweet.text);
                    });
                }
            })
        } else if (userInput.command === "Spotify this song") {
            inquire.prompt([
                {
                type: "input",
                message: "What song do you want to spotify?",
                name: "song"
                }
            ]).then((userInput) => {
                if (userInput.song === "") {
                    spotify.search({
                        type: 'track',
                        query: "Umbrella",
                        limit: 5
                    }, function (err, data) {
                        if (err) {
                            throw err;
                        }
                        let songs = data.tracks.items

                        let getArtistNames = function (artist) {
                            return artist.name;
                        };
                        songs.forEach(song => {
                            const displaySong = [
                                "-----------------------------------",
                                "artist(s): " + song.artists.map(getArtistNames),
                                "song name: " + song.name,
                                "preview song: " + song.preview_url,
                                "album: " + song.album.name,
                                "-----------------------------------"
                            ].join("\n\n");
                            console.log(displaySong);
                        });
                    });
                } else {
                    spotify.search({
                        type: 'track',
                        query: userInput.song,
                        limit: 5
                    }, function (err, data) {
                        if (err) {
                            throw err;
                        }
                        let songs = data.tracks.items

                        let getArtistNames = function (artist) {
                            return artist.name;
                        };
                        songs.forEach(song => {
                            const displaySong = [
                                "-----------------------------------",
                                "artist(s): " + song.artists.map(getArtistNames),
                                "song name: " + song.name,
                                "preview song: " + song.preview_url,
                                "album: " + song.album.name,
                                "-----------------------------------"
                            ].join("\n\n");
                            console.log(displaySong);
                        });
                    });
                }
            });    
        } else if (userInput.command === "Watch movie") {
            inquire.prompt([{
                type: "input",
                message: "What movie do you want to watch?",
                name: "movie"
            }]).then((userInput) => {
                if (userInput.movie === '') {
                    const queryURL = "http://www.omdbapi.com/?t=" + "mr+nobody" + "&y=&plot=full&tomatoes=true&apikey=trilogy";

                    request(queryURL, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            let jsonData = JSON.parse(body);
                            const displayMovie = [
                            "Title: " + jsonData.Title,
                            "Year: " + jsonData.Year,
                            "Rated: " + jsonData.Rated,
                            "IMDB Rating: " + jsonData.imdbRating,
                            "Country: " + jsonData.Country,
                            "Language: " + jsonData.Language,
                            "Plot: " + jsonData.Plot,
                            "Actors: " + jsonData.Actors,
                            "Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value,
                            ].join("\n");
                            console.log(displayMovie);
                        }
                    });
                } else {
                    const queryURL = "http://www.omdbapi.com/?t=" + userInput.movie + "&y=&plot=full&tomatoes=true&apikey=trilogy";
                    request(queryURL, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            let jsonData = JSON.parse(body);
                            //console.log(jsonData.response, jsonData);
                            if (jsonData.Response !== "False") {
                                let jsonData = JSON.parse(body);
                                const displayMovie = [
                                "Title: " + jsonData.Title,
                                "Year: " + jsonData.Year,
                                "Rated: " + jsonData.Rated,
                                "IMDB Rating: " + jsonData.imdbRating,
                                "Country: " + jsonData.Country,
                                "Language: " + jsonData.Language,
                                "Plot: " + jsonData.Plot,
                                "Actors: " + jsonData.Actors,
                                "Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value,
                                ].join("\n");
                                console.log(displayMovie);
                            } else {
                                console.log("No data!");
                            }
                        }
                    });
                }
            });
        } else if (userInput.command === "Ask a question") {
            fs.readFile("./random.txt", "utf-8", function read(err, data) {
                if (err) {
                    throw err;
                }
                content = data;
                console.log(content);
            });
        }
    });
