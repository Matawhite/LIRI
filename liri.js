//packages
var fs = require('fs');
var request = require('request');
var keys = require('./keys.js');
var Twitter = require('twitter');
var spotify = require('spotify');

//parse user input
var verb = process.argv[2];
var userInput = [];

for(var i = 3; i < process.argv.length; i++){
  userInput.push(process.argv[i]);
}

var subject = userInput.join(" ");

//read user input
switch(verb) {
    case 'movie-this':
        lookUpMovieData(subject);
        break;
    case 'tweet-this':
        getTweets();
        break;
    case 'spotify-this':
        searchSpotify(subject);
        break;
    case 'do-what-it-says':
        readFromFile()
          break;
    default:
        help();
}

//action functions
function lookUpMovieData(subject){
  subject = encodeURI(subject);
  var movieURL = 'http://www.omdbapi.com/?t='+ subject +'&plot=short&&tomatoes=true&r=json';
  request(movieURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log('\nMovie Title: ' + JSON.parse(body)['Title']);
        console.log('Movie Year: ' + JSON.parse(body)['Year']);
        console.log('IMDB Rating: ' + JSON.parse(body)['imdbRating']);
        console.log('Country: ' + JSON.parse(body)['Country']);
        console.log('Language: ' + JSON.parse(body)['Language']);
        console.log('Plot: ' + JSON.parse(body)['Plot']);
        console.log('Actors: ' + JSON.parse(body)['Actors']);
        console.log('Rotten Tomatoes Rating: ' + JSON.parse(body)['tomatoRating']);
        console.log('Rotten Tomatoes URL: ' + JSON.parse(body)['tomatoURL']);
    }else{
        console.log(error);
      }
    })
}

function getTweets(){
  var client = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
  });

  var params = {screen_name: 'matawhite_atx', count: 20};
  client.get('statuses/user_timeline', params, function(error, tweets, response){
  if (!error) {
    var count = 0
    var disTweets = tweets.forEach(function(eached){
      count ++
      console.log(count + ': ' + eached.text);
    })
  }else{
    console.log(error);
    }
  });
}

function searchSpotify(subject){

  spotify.search({ type: 'track', query: subject}, function(error,data){
    console.log(subject)
    if(error){
      console.log(error);
    }else{
      var artistsName = data.tracks.items[0].artists[0].name;
      var songName = data.tracks.items[0].name;
      var albumName = data.tracks.items[0].album.name;
      var songURL = data.tracks.items[0].album.external_urls;
      var printURL = function(){
        for(url in songURL){
          return songURL[url];
        }
      }
      console.log('Artists Name: ' + artistsName);
      console.log('Song Name: ' + songName);
      console.log('Album Name: ' + albumName);
      console.log('songURL: ' + printURL());
    }//END OF ELSE STATEMENT
  })
}//end of function

function readFromFile(){
  fs.readFile('./random.txt', function read(err, data) {
      if (err) {
          throw err;
      }
      var output = data.toString();
      output = output.replace(/\n$/, '');
      var songName = output.split(',');
      searchSpotify(songName[1]);
  });
}

function help(){
  console.log('Welcome to L.I.R.I, SIRI\'s twice removed cousin.');
  console.log('L.I.R.I has three core functions: \nMovie Look up, \nSong Look up, \nand see the last 20 tweets of my maker.')
  console.log('To use the movie look up, type this: "node liri.js movie-this movie title"');
  console.log('To use the song look up, type this: "node liri.js spotify-this song title"');
  console.log('To see the last 20 tweets of my maker, simply type: "node liri.js tweet-this"');
  console.log('Lastly, and because the homework instructions got a little confusing, type: "node liri.js do-what-it-says" to something interesting')
}
