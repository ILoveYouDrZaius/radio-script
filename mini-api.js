var express = require('express');
var app = express();
var firebase = require("firebase");
var Service = require('node-linux').Service;
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

function activeemission(){
  return new Promise((resolve, reject)=>{
    var query = db.ref('active-emission/').orderByChild('nominated').equalTo(true);

    query.once("value", snapshots => {
      resolve(snapshots.val());
    });
  });
}

app.get('/emision', function (req, res) {
  activeemission().then((result)=>{
    console.log(result);
    res.send(result);
  });
});

app.listen(3500, function () {
  console.log('Mini API ejecutándose en el puerto 3500...');
});
