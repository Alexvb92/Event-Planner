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

	// retrieve coordinates of string value google search (response1.results[0].geometry.location. for coords)
	var key1 = 'AIzaSyBQEj4ozak2ZfYSTfrVB8nEhOnHe4dUWSA';
	var URL1 =  "https://maps.googleapis.com/maps/api/geocode/json?address=" + destination + "&key=" + key1;
	
	// ajax call
	$.ajax({url: URL1, method: 'GET'}).done(function(response1) {	
		// console.log(response1);
		localStorage.setItem("destinationLat", response1.results[0].geometry.location.lat);
		localStorage.setItem("destinationLong", response1.results[0].geometry.location.lng);

	});

	// switch to firebase eventually
	// localStorage.clear();
	localStorage.setItem("destination", destination); 
	localStorage.setItem("startDate", startDate);
	localStorage.setItem("endDate", endDate);

	// debugger;
})

// make this only run on a certain page?
// populates nav bar
$("#destinationDisplay").html(localStorage.getItem("destination"));
$("#startDateDisplay").html(moment(localStorage.getItem("startDate")).format("M/D/YY"));
$("#endDateDisplay").html(moment(localStorage.getItem("endDate")).format("M/D/YY"));

// populates main body planner with dynamic days and weather forecast (or historical weather info)
var coordinates = localStorage.getItem("destinationLat") + "," + localStorage.getItem("destinationLong");
var days = moment(localStorage.getItem("endDate")).diff(moment(localStorage.getItem("startDate")), "days") + 1;
var key = "1d150de371b4d1a3"
var weatherForecastURL = "http://api.wunderground.com/api/" + key + "/forecast10day/geolookup/q/" + coordinates + ".json";

if (localStorage.getItem("startDate") > moment().add(10, "days").format("YYYY-MM-DD")) {
	for (var i = 1; i <= days; i++) {
		var dateHistorical = moment(localStorage.getItem("startDate")).add([i] - 1, "days").format("MMDD");
		var weatherPlannerURL = "http://api.wunderground.com/api/" + key + "/planner_" + dateHistorical + dateHistorical + "/q/" + coordinates + ".json";

		$.ajax({url: weatherPlannerURL, method: 'GET'}).done(function(response) {	
			// console.log(response);
			var high = response.trip.temp_high.avg.F;
			var low = response.trip.temp_low.avg.F;

			// following code will go in here?

			var newDay = $("<div>");
			var newDayContent = $("<div>");
			var calendarDay = moment(localStorage.getItem("startDate")).add([i], "days").format("dddd - M/D/YY");
			newDay.addClass("card");
			newDayContent.addClass("card-content");
			newDayContent.append("<span class='card-title'><span class='orange-text text-darken-4 dayHeader'>Day " + [i] + "</span><span class='black-text'> " + calendarDay + "</span>");
			newDayContent.append("<p><span id='day" + [i] + "Weather'>Avg High: " + high + "&deg;F | Avg Low: " + low + "&deg;F</span></p>");
			newDayContent.append("<p>The day's activities</p>");
			newDay.append(newDayContent);
			$("#planner").append(newDay);
		})

		// var newDay = $("<div>");
		// var newDayContent = $("<div>");
		// var calendarDay = moment(localStorage.getItem("startDate")).add([i] - 1, "days").format("dddd - M/D/YY");
		// newDay.addClass("card");
		// newDayContent.addClass("card-content");
		// newDayContent.append("<span class='card-title'><span class='orange-text text-darken-4 dayHeader'>Day " + [i] + "</span><span class='black-text'> " + calendarDay + "</span>");
		// newDayContent.append("<p><span id='day" + [i] + "Weather'>Avg High: " + "high" + "&deg;F | Avg Low: " + "low" + "&deg;F</span></p>");
		// newDayContent.append("<p>The day's activities</p>");
		// newDay.append(newDayContent);
		// $("#planner").append(newDay);
	}
} 

else {
	$.ajax({url: weatherForecastURL, method: 'GET'}).done(function(response) {	
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

// database.ref().on('value', function(snapshot) {
// 	console.log(snapshot);

// }, function (errorObject) {

// 		// In case of error this will print the error
// 	  	console.log("The read failed: " + errorObject.code);
	
// });

var checkCounter = 5;
toDoCount = 0;
$(document).keypress(function(e) {
  if(e.which == 13) {
    textInput = $('#text-input').val().trim();
	newLine = $('<p id="newEntry" class="col s11"><input type="checkbox" id="test' + checkCounter + '" /><label for="test' + checkCounter + '">' + textInput + '</label></p>');
	newLine.attr("toDo", toDoCount);
	newLine.attr("id", "item-" + toDoCount);
	$('#tBody').prepend(newLine);
	$('#text-input').val("");

	XButton = $('<button id="remove" class="col s1">x</button>');
	XButton.removeClass("col s1");
	XButton.addClass("xyz cols1");
	XButton.attr("toDo", toDoCount);
	$(newLine).prepend(XButton);
	checkCounter++;
	toDoCount++;
	console.log(newLine.attr("toDo"));

	database.ref().set({
		toDo: newLine
	});
  }
});

$(document.body).on('click', '#remove', function () {
	var todoNumber = $(this).attr("toDo");
	$("#item-" + todoNumber).remove();

	console.log($(this).attr("toDo"))

})

// });