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
// var days = "";
// var city = "";

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
	//localStorage.setItem("destinationLat", lat1)
//console.log(lat1)


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
			high = response.trip.temp_high.avg.F;
			low = response.trip.temp_low.avg.F;
		})

		var newDay = $("<div>");
		var newDayContent = $("<div>");
		var calendarDay = moment(localStorage.getItem("startDate")).add([i] - 1, "days").format("dddd - M/D/YY");
		newDay.addClass("card");
		newDayContent.addClass("card-content");
		newDayContent.append("<span class='card-title'><span class='orange-text text-darken-4 dayHeader'>Day " + [i] + "</span><span class='black-text'> " + calendarDay + "</span>");
		newDayContent.append("<p><span id='day" + [i] + "Weather'>Avg High: " + "high" + "&deg;F | Avg Low: " + "low" + "&deg;F</span></p>");
		newDayContent.append("<p>The day's activities</p>");
		newDay.append(newDayContent);
		$("#planner").append(newDay);
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

// });