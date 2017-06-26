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

// Create a new service object
// var svc = new Service({
//  name:'Hello World',
//  description: 'The nodejs.org example web server.',
// script: './script.js'
//});

// Listen for the "install" event, which indicates the
// process is available as a service.
//svc.on('install',function(){
//  svc.start();
//});

//svc.install();



var db = firebase.database();

var query = db.ref('active-emission/').orderByChild('nominated').equalTo(true);
//.orderByChild('nominated').equalTo(true);
query.once("value", snapshots => {
  console.log(snapshots.val());
});
