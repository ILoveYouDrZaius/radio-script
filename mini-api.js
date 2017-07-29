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
      numSongsNominated = data.numChildren();
      if(numSongsNominated == 3){
        let winnerSong = '';
        let winnerSongAux = '';
        let maxVotes = 0;
        // Las 3 canciones
        data.forEach( child => {
          winnerSongAux = child.key;
          if (data.child(child.key).val().nominated_votes > maxVotes) {
            maxVotes = data.child(child.key).val().nominated_votes;
            winnerSong = child.key;
          }
          db.ref('database/active-emission/'+child.key).update({
            'emission_votes' : data.child(child.key).val().emission_votes + data.child(child.key).val().nominated_votes,
            'nominated_votes': 0,
            'nominated': false
          });
        });
        if(winnerSong === ''){
          winnerSong = winnerSongAux;
          console.log('GANADOR NUEVO: '+winnerSong);
        }
        db.ref('database/active-emission/'+winnerSong).update({
          'playing': true
        });
        
        resolve(data.child(winnerSong));
      }else{
        reject('No hay 3 canciones nominadas');
      }
    }).catch((error)=>{
      reject(error);
    });
  });
}

function nominate_songs(){
  return new Promise((resolve, reject)=>{
    var query = db.ref('database/active-emission').orderByChild('playing').equalTo(false).once('value', snaps => {
    }).then((data) => {
      numSongs = data.numChildren();
      songsReadyForNominate = [];
      data.forEach((child) => {
        if (!data.child(child.key).val().nominated){
          songsReadyForNominate.push(child.key);
        }
      });
      numSongsReadyForNom = songsReadyForNominate.length;
      var randomSongsIndex = [];
      while(randomSongsIndex.length < 3){
          var randomnumber = Math.ceil(Math.random()*numSongsReadyForNom);
          if(randomSongsIndex.indexOf(randomnumber) > -1) continue;
          randomSongsIndex[randomSongsIndex.length] = randomnumber;
      }
      console.log(randomSongsIndex);
      nominatedSongs = []; 
      for(var i=0;i<3;i++){
        nominatedSongs.push(songsReadyForNominate[randomSongsIndex[i]]);
      }
      nominatedSongs.forEach((songKey)=>{
        db.ref('database/active-emission/'+songKey).update({
            'nominated': true
          });
      });
      console.log(nominatedSongs);
      resolve(nominatedSongs);
    }).catch((error)=>{
      reject(error);
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
    }).catch((error)=>{
      reject(error);
    });
  });
}

app.get('/songtoplay', function (req, res) {
  set_playing_false().then((setPlayingFalse)=>{
    song_to_play().then((winnerSong)=>{
      nominate_songs().then((nominatedSongs)=>{
        console.log('nominated songs:');
        console.log(nominatedSongs);
        res.send(winnerSong.val());
      }).catch((error)=>{
        console.log('ERROR EN nominate_songs');
        console.error(error);
        res.send(error);
      });
    }).catch((error) => {
      console.error(error);
      res.send(error);
    });
  }).catch((error) => {
      console.error(error);
      res.send(error);
  });
});

app.listen(3500, function () {
  console.log('Mini API ejecutándose en el puerto 3500...');
});
