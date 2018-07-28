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
                    for (let i = 0; i < tweets.length; i++) {
                        console.log(tweets[i].text);

                    }
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
                        query: "The Sign",
                        limit: 5
                    }, function (err, data) {
                        var songs = data.tracks.items
                        var getArtistNames = function (artist) {
                            return artist.name;
                        };
                        for (var i = 0; i < songs.length; i++) {
                            console.log(i);
                            console.log("artist(s): " + songs[i].artists.map(getArtistNames));
                            console.log("song name: " + songs[i].name);
                            console.log("preview song: " + songs[i].preview_url);
                            console.log("album: " + songs[i].album.name);
                            console.log("-----------------------------------");
                        }
                    })
                } else {
                    spotify.search({
                        type: 'track',
                        query: userInput.song,
                        limit: 5
                    }, function (err, data) {
                        var songs = data.tracks.items

                        var getArtistNames = function (artist) {
                            return artist.name;
                        };

                        for (var i = 0; i < songs.length; i++) {
                            console.log(i);
                            console.log("artist(s): " + songs[i].artists.map(getArtistNames));
                            console.log("song name: " + songs[i].name);
                            console.log("preview song: " + songs[i].preview_url);
                            console.log("album: " + songs[i].album.name);
                            console.log("-----------------------------------");
                        }
                    });
                }
            })
                
        } else if (userInput.command === "Watch movie") {
            inquire
                .prompt([{
                    type: "input",
                    message: "What movie do you want to watch?",
                    name: "movie"
                }]).then((userInput) => {
                    if (userInput.movie === '') {
                        var urlHit = "http://www.omdbapi.com/?t=" + "mr+nobody" + "&y=&plot=full&tomatoes=true&apikey=trilogy";

                        request(urlHit, function (error, response, body) {
                            if (!error && response.statusCode === 200) {
                                var jsonData = JSON.parse(body);

                                console.log("Title: " + jsonData.Title);
                                console.log("Year: " + jsonData.Year);
                                console.log("Rated: " + jsonData.Rated);
                                console.log("IMDB Rating: " + jsonData.imdbRating);
                                console.log("Country: " + jsonData.Country);
                                console.log("Language: " + jsonData.Language);
                                console.log("Plot: " + jsonData.Plot);
                                console.log("Actors: " + jsonData.Actors);
                                console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
                            }
                        });
                    }



                    var urlHit = "http://www.omdbapi.com/?t=" + userInput.movie + "&y=&plot=full&tomatoes=true&apikey=trilogy";

                    request(urlHit, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            var jsonData = JSON.parse(body);
                            //console.log(jsonData.response, jsonData);
                            if (jsonData.Response !== "False") {
                                console.log("Title: " + jsonData.Title);
                                console.log("Year: " + jsonData.Year);
                                console.log("Rated: " + jsonData.Rated);
                                console.log("IMDB Rating: " + jsonData.imdbRating);
                                console.log("Country: " + jsonData.Country);
                                console.log("Language: " + jsonData.Language);
                                console.log("Plot: " + jsonData.Plot);
                                console.log("Actors: " + jsonData.Actors);
                                console.log("Rotten Tomatoes Rating: " + (jsonData.Ratings.length > 0) ? jsonData.Ratings[1].Value : '');
                            } else {
                                console.log("No data!");
                            }
                        }
                    });

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
    })
