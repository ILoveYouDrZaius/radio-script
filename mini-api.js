var express = require('express');
var app = express();
var firebase = require("firebase");

var config = {
   apiKey: "AIzaSyAasuPpwOGW5rpIAB69Ng0YtcKYEXkQVFY",
   authDomain: "radiointeractiva-9a96d.firebaseapp.com",
   databaseURL: "https://radiointeractiva-9a96d.firebaseio.com",
   projectId: "radiointeractiva-9a96d",
   storageBucket: "radiointeractiva-9a96d.appspot.com",
   messagingSenderId: "946787529311"
};
firebase.initializeApp(config);
var db = firebase.database();

function song_to_play(){
  return new Promise((resolve, reject)=>{
    var query = db.ref('database/active-emission').orderByChild('nominated').equalTo(true).once('value', snaps => {
    }).then((data) => {
      let winnerSong = '';
      let maxVotes = 0;
      // Las 3 canciones
      console.log(data.val());
      data.forEach( child => {
        if (data.child(child.key).val().emission_votes > maxVotes) {
          maxVotes = data.child(child.key).val().emission_votes;
          winnerSong = child.key;
        }
      });
      // La canción ganadora
      // console.log(winnerSong);
      // console.log(data.child(winnerSong).key);
      resolve(data.child(winnerSong));
    });
  });
}

function set_playing_false(){
  return new Promise((resolve, reject)=>{
    var query = db.ref('database/active-emission').orderByChild('playing').equalTo(true).once('value').then((data) => {
      console.log('LONGITUD:');
      console.log(data.numChildren());
      if(data.numChildren() > 1){
        reject ('Error. Hay mas de una cancion con playing true');
      }else{
        data.forEach(child => {
          console.log('CHILDKEY');
          console.log(child.key);
          db.ref('database/active-emission/'+child.key).update({
            'playing': false
          });
        });
        resolve(data);
      }
    });
  });
}

function set_playing(id){
  return new Promise((resolve, reject)=>{
    var query = db.ref('database/active-emission').orderByChild('playing').equalTo(true).once('value', snaps => {
    }).then((data) => {      
      // data.forEach( child => {
      //   if (data.child(child.key).val().emission_votes > maxVotes) {
      //     maxVotes = data.child(child.key).val().emission_votes;
      //     winnerSong = child.key;
      //   }
      // });
      
      resolve(data);
    });
  });
}

app.get('/songtoplay', function (req, res) {
  set_playing_false().then((setPlayingFalse)=>{
    song_to_play().then((winnerSong)=>{
      res.send(winnerSong.val());
      set_playing(winnerSong.key);
    });
  });
});

app.listen(3500, function () {
  console.log('Mini API ejecutándose en el puerto 3500...');
});
