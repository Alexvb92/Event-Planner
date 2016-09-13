// initiate database
var config = {
	apiKey: "AIzaSyBadNobcnUDFdZpD_h7AFyn-V5AhLV4M34",
	authDomain: "gottogo-dbe65.firebaseapp.com",
	databaseURL: "https://gottogo-dbe65.firebaseio.com",
	storageBucket: "gottogo-dbe65.appspot.com",
};

firebase.initializeApp(config);

var database = firebase.database();

// button clicks
// sets destination, start date and end date to local storage
$('#startButton').on('click', function () {

	destination = $('#pac-input').val().trim();
	startDate = $('#startDate').val();
	endDate = $('#endDate').val();

	localStorage.clear();
	localStorage.setItem("destination", destination);
	localStorage.setItem("startDate", startDate);
	localStorage.setItem("endDate", endDate);
})

// enables datepicker on front page
$('.datepicker').pickadate({
    selectMonths: true, // dropdown to control month
    selectYears: 5, // dropdown to control year
    min: true, //limits selection
    format: 'm/d/yy',
});

// populates nav bar
$(".destinationDisplay").html(localStorage.getItem("destination"));
$(".startDateDisplay").html(moment(localStorage.getItem("startDate")).format("M/D/YY"));
$(".endDateDisplay").html(moment(localStorage.getItem("endDate")).format("M/D/YY"));

// generates map on main.html and runs weatherU function
var destination = localStorage.getItem('destination')
var lat1;
var long1;

// retrieve coordinates of string value google search (response1.results[0].geometry.location. for coords)
var key1 = 'AIzaSyBQEj4ozak2ZfYSTfrVB8nEhOnHe4dUWSA';
var URL1 =  "https://maps.googleapis.com/maps/api/geocode/json?address=" + destination + "&key=" + key1;
var google;

$.ajax({url: URL1, method: 'GET'}).done(function(response1) {

  	lat1 = Number(response1.results[0].geometry.location.lat);
   	long1 = Number(response1.results[0].geometry.location.lng);
   	localStorage.setItem("destinationLat", lat1);
  	localStorage.setItem("destinationLong", long1);

	initAutocomplete()
	weatherUnderground()
});

function weatherUnderground(){
	// populates main body planner with dynamic days and weather forecast (or historical weather info)
	var coordinates = localStorage.getItem("destinationLat") + "," + localStorage.getItem("destinationLong");
	var days = moment(localStorage.getItem("endDate")).diff(moment(localStorage.getItem("startDate")), "days") + 1;
	var key = "1d150de371b4d1a3"
	var weatherForecastURL = "https://api.wunderground.com/api/" + key + "/forecast10day/geolookup/q/" + coordinates + ".json";

	// generates weather summary if forecast is unavailable (see line below)
	if (moment(localStorage.getItem("startDate")).format("MM/DD/YY") > moment().add(10, "days").format("MM/DD/YY")) {
		var dateHistoricalStart = moment(localStorage.getItem("startDate")).format("MMDD");
		var dateHistoricalEnd = moment(localStorage.getItem("endDate")).format("MMDD");
		var weatherPlannerURL = "https://api.wunderground.com/api/" + key + "/planner_" + dateHistoricalStart + dateHistoricalEnd + "/q/" + coordinates + ".json";

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
			newDayContent.append("<input id='day" + [i] + "ActivityInput' data-attr='" + [i] + "' type='text' class='validate dayInput' placeholder='The day&#8217;s activities'><div id='day" + [i] + "Activity'></div>");
			newDay.append(newDayContent);
			$("#planner").append(newDay);
		}
	}

	// generates actual forecast
	else {
		$.ajax({url: weatherForecastURL, method: 'GET'}).done(function(response) {
			for (var i = 1; i <= days; i++) {
				var newDay = $("<div>");
				var newDayContent = $("<div id='newDayContent'>");
				var calendarDay = moment(localStorage.getItem("startDate")).add([i] - 1, "days").format("dddd - M/D/YY");
				var high = response.forecast.simpleforecast.forecastday[i].high.fahrenheit;
				var low = response.forecast.simpleforecast.forecastday[i].low.fahrenheit;
				var forecast = response.forecast.simpleforecast.forecastday[i].conditions;
				newDay.addClass("card");
				newDayContent.addClass("card-content");
				newDayContent.append("<span class='card-title'><span class='orange-text text-darken-4 dayHeader'>Day " + [i] + "</span><span class='black-text'> " + calendarDay + "</span>");
				newDayContent.append("<p><span id='day" + [i] + "Weather'>High: " + high + "&deg;F | Low: " + low + "&deg;F | Forecast: " + forecast + "</span></p>");
				newDayContent.append("<input id='day" + [i] + "ActivityInput' data-attr='" + [i] + "'type='text' class='validate dayInput' placeholder='The day&#8217;s activities'><div id='day" + [i] + "Activity'></div>");
				newDay.append(newDayContent);
				$("#planner").append(newDay);
			}
		});
	}
}

var storageCount = 0;
var storageArray = [];

//Planner "toDo List" entry
$('#planner').keypress(function(e) {
	if(e.which == 13) {
		var textInput = $("#day1ActivityInput").val().trim();
		var newLine = $("<p>");
		$("#day1ActivityInput").append(newLine);
		$("#day1ActivityInput").val('');
		$('#newDayContent').append(textInput + "<br>");
		storageCount++;
		storageArray.push(textInput);
		localStorage.setItem('day1ActivityInput', storageArray);
	}
});

var firebaseArray = [];
var arrayCount = 1;

// displays to do list from firebase
database.ref().on("child_added", function(childSnapshot) {

	var element = {
		arrayCounter: arrayCount,
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

	}, function (errorObject) {
	  	console.log("The read failed: " + errorObject.code);
	})

// remove item from html and firebase
$(document.body).on('click', '.xyz', function () {
	var todoNumber = $(this).attr("toDo");
	$("#item-" + todoNumber).remove();
	firebaseArray[todoNumber].ref.remove();
});

var checkCounter = 5;
toDoCount = 0;
var textInput;

// input to do items into html and firebase
$('#text-input').keypress(function(e) {
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

// enables slide out menu on mobile
$(".button-collapse").sideNav();

// generates map on index.html
function initAutocomplete1() {
    var map = new google.maps.Map(document.getElementById('mapStart'), {

        center: {lat: 35.9132, lng: -79.0558},
        zoom: 7,
        disableDefaultUI: true,
        styles: [
            {
                featureType: 'all',
                stylers: [
                    { saturation: -100 }
                ]
            },{
                featureType: 'road',
                stylers: [
                    { visibility: 'off' }
                ]
            }
        ],
      mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    $('#pac-input').removeAttr(style); //clears google's position:absolute and top:0 left: 0
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
    	searchBox.setBounds(map.getBounds());
    });
}
