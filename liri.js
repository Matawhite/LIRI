var request = require('request');


//create a for loop to get additional argv's
var verb = process.argv[2];
var subject = process.argv[3];

//change to a switch statement
if(verb === 'movie-this'){
  movieThis();
}else{
  console.log('Sorry I do not know what that means.');
}

function movieThis(){
subject = encodeURI(subject);
var movieURL = 'http://www.omdbapi.com/?t='+ subject +'&plot=short&&tomatoes=true&r=json';
request(movieURL, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log('Movie Title: ' + JSON.parse(body)['Title']);
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
