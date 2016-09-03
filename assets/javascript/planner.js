// $( document ).ready(function() {
//     console.log( "ready!" );

// initiate database
var config = {
	apiKey: "AIzaSyBadNobcnUDFdZpD_h7AFyn-V5AhLV4M34",
	authDomain: "gottogo-dbe65.firebaseapp.com",
	databaseURL: "https://gottogo-dbe65.firebaseio.com",
	storageBucket: "gottogo-dbe65.appspot.com",
};
  
firebase.initializeApp(config);

var database = firebase.database();

// variables
var destination = "";
var startDate = "";
var endDate = "";
var days = "";

// button clicks
$('#startButton').on('click', function () {
	destination = $('#pac-input').val().trim();
	startDate = $('#startDate').val();
	endDate = $('#endDate').val();

	// switch to firebase eventually
	localStorage.clear();
	localStorage.setItem("destination", destination); 
	localStorage.setItem("startDate", startDate);
	localStorage.setItem("endDate", endDate);
})

// make this only run on a certain page?
// populates nav bar
$("#destinationDisplay").html(localStorage.getItem("destination"));
$("#startDateDisplay").html(moment(localStorage.getItem("startDate")).format("M/D/YY"));
$("#endDateDisplay").html(moment(localStorage.getItem("endDate")).format("M/D/YY"));

// populates main body planner
days = moment(localStorage.getItem("endDate")).diff(moment(localStorage.getItem("startDate")), "days") + 1;

for (var i = 1; i <= days; i++) {
	var newDay = $("<div>");
	var newDayContent = $("<div>");
	var calendarDay = moment(localStorage.getItem("startDate")).add([i] - 1, "days").format("M/D/YY");
	newDay.addClass("card");
	newDayContent.addClass("card-content black-text");
	newDayContent.append("<span class='card-title'>Day " + [i] + " - " + calendarDay + "</span>");
	newDayContent.append("<p><span id='day" + [i] + "Weather'> High | Low | Conditions</span></p>");
	newDayContent.append("<p>The day's activities</p>");
	newDay.append(newDayContent);

	$("#planner").append(newDay);
}

// });