$( document ).ready(function() {
    console.log( "ready!" );

// var config = {
// 	apiKey: "AIzaSyBadNobcnUDFdZpD_h7AFyn-V5AhLV4M34",
// 	authDomain: "gottogo-dbe65.firebaseapp.com",
// 	databaseURL: "https://gottogo-dbe65.firebaseio.com",
// 	storageBucket: "gottogo-dbe65.appspot.com",
// };
  
// firebase.initializeApp(config);

// database = firebase.database();

$('#startButton').on('click', function () {
	destination = $('#destination').val().trim();
	startDate = $('#startDate').val();  //might need adjustment for moment.js
	endDate = $('#endDate').val(); //might need adjustment for moment.js

	$('#mapStart').fadeOut(2000);
	$('#startContainer').fadeOut(2000);

   })

});