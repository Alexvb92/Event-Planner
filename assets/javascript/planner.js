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

// button clicks
$('#startButton').on('click', function () {

	destination = $('#pac-input').val().trim();
	startDate = $('#startDate').val();
	endDate = $('#endDate').val();

	// switch to firebase eventually
	// localStorage.clear();
	localStorage.setItem("destination", destination); 
	localStorage.setItem("startDate", startDate);
	localStorage.setItem("endDate", endDate);
})

// make this only run on a certain page?
// populates nav bar
$(".destinationDisplay").html(localStorage.getItem("destination"));
$(".startDateDisplay").html(moment(localStorage.getItem("startDate")).format("M/D/YY"));
$(".endDateDisplay").html(moment(localStorage.getItem("endDate")).format("M/D/YY"));

// populates main body planner with dynamic days and weather forecast (or historical weather info)
var coordinates = localStorage.getItem("destinationLat") + "," + localStorage.getItem("destinationLong");
var days = moment(localStorage.getItem("endDate")).diff(moment(localStorage.getItem("startDate")), "days") + 1;
var key = "1d150de371b4d1a3"
var weatherForecastURL = "http://api.wunderground.com/api/" + key + "/forecast10day/geolookup/q/" + coordinates + ".json";

// generates weather summary if forecast is unavailable
if (localStorage.getItem("startDate") > moment().add(10, "days").format("YYYY-MM-DD")) {
	var dateHistoricalStart = moment(localStorage.getItem("startDate")).format("MMDD");
	var dateHistoricalEnd = moment(localStorage.getItem("endDate")).format("MMDD");
	var weatherPlannerURL = "http://api.wunderground.com/api/" + key + "/planner_" + dateHistoricalStart + dateHistoricalEnd + "/q/" + coordinates + ".json";

	$.ajax({url: weatherPlannerURL, method: 'GET'}).done(function(response) {
		var high = response.trip.temp_high.avg.F;
		var low = response.trip.temp_low.avg.F;
		var newSummary = $("<div>");
		var newSummaryContent = $("<div>");
		newSummary.addClass("card");
		newSummaryContent.addClass("card-content");
		newSummaryContent.append("<span class='card-title'><span class='orange-text text-darken-4 dayHeader'>Weather Summary</span>");
		newSummaryContent.append("<p><span id='weatherSummary'>Expect an avgerage high of " + high + "&deg;F and an average low of " + low + "&deg;F during your trip.</span></p>");
		newSummary.append(newSummaryContent);
		$("#planner").prepend(newSummary);
	})

	for (var i = 1; i <= days; i++) {
		var newDay = $("<div>");
		var newDayContent = $("<div>");
		var calendarDay = moment(localStorage.getItem("startDate")).add([i] - 1, "days").format("dddd - M/D/YY");
		newDay.addClass("card");
		newDayContent.addClass("card-content");
		newDayContent.append("<span class='card-title'><span class='orange-text text-darken-4 dayHeader'>Day " + [i] + "</span><span class='black-text'> " + calendarDay + "</span>");
		newDayContent.append("<p>The day's activities</p>");
		newDay.append(newDayContent);
		$("#planner").append(newDay);
	}
} 

// generates actual forecast
else {
	$.ajax({url: weatherForecastURL, method: 'GET'}).done(function(response) {	
		console.log(response);
		for (var i = 1; i <= days; i++) {
			var newDay = $("<div>");
			var newDayContent = $("<div>");
			var calendarDay = moment(localStorage.getItem("startDate")).add([i] - 1, "days").format("dddd - M/D/YY");
			var high = response.forecast.simpleforecast.forecastday[i].high.fahrenheit;
			var low = response.forecast.simpleforecast.forecastday[i].low.fahrenheit;
			var forecast = response.forecast.simpleforecast.forecastday[i].conditions;
			newDay.addClass("card");
			newDayContent.addClass("card-content");
			newDayContent.append("<span class='card-title'><span class='orange-text text-darken-4 dayHeader'>Day " + [i] + "</span><span class='black-text'> " + calendarDay + "</span>");
			newDayContent.append("<p><span id='day" + [i] + "Weather'>High: " + high + "&deg;F | Low: " + low + "&deg;F | Forecast: " + forecast + "</span></p>");
			newDayContent.append("<p>The day's activities</p>");
			newDay.append(newDayContent);
			$("#planner").append(newDay);
		}
	});
}

var firebaseArray = [];
var arrayCount = 1;
database.ref().on("child_added", function(childSnapshot) {

	var element = {
		arrayCounter: arrayCount,
		// checkCounter: childSnapshot.val().name.checkCounter,
		// textInput: childSnapshot.val().name.textInput
		
	}
	firebaseArray.push(childSnapshot);
	
	newLine = $('<p id="newEntry" class="col s11"><input type="checkbox" id="test' + childSnapshot.val().name.checkCounter + '" /><label id="textInput" for="test' + childSnapshot.val().name.checkCounter + '">' + childSnapshot.val().name.textInput + '</label></p>');
	$('#tBody').prepend(newLine);
	newLine.attr("id", "item-" + toDoCount);

	XButton = $('<button id="remove" class="col s1">x</button>');
	XButton.removeClass("col s1");
	XButton.addClass("xyz cols1");

	XButton.attr("toDo", toDoCount);
	XButton.attr("id", "item-" + toDoCount);

	$(newLine).prepend(XButton);

	checkCounter++;
	toDoCount++;

	arrayCount++;

	// console.log(arrayCount);

}, function (errorObject) {

		// In case of error this will print the error
	  	console.log("The read failed: " + errorObject.code);
	

	})

$(document.body).on('click', '.xyz', function () {

	var todoNumber = $(this).attr("toDo");
	$("#item-" + todoNumber).remove();

	// console.log(firebaseArray[todoNumber]);

	firebaseArray[todoNumber].ref.remove();
});

var checkCounter = 5;
toDoCount = 0;
var textInput;


$(document).keypress(function(e) {
  if(e.which == 13) {
    textInput = $('#text-input').val().trim();
    newLine = $('<p id="newEntry" class="col s11"><input type="checkbox" id="test' + checkCounter + '" /><label id="textInput" for="test' + checkCounter + '">' + textInput + '</label></p>');

	newLine.attr("toDo", toDoCount);
	newLine.attr("id", "item-" + toDoCount);
	$('#text-input').val("");

	checkCounter++;
	toDoCount++;

	database.ref().push({
		name: {
		textInput: textInput,
		checkCounter: checkCounter,
		toDo: toDoCount + 1
		}
	});

  }
});

$(".button-collapse").sideNav();

// });