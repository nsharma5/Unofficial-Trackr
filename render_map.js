// First, create an object containing LatLng and population for each city.
var dataFileNames = ["2014_unofficial_crimes.json", "2015_unofficial_crimes(1).json", "Unofficial2016.json"]
var dataLocationRoot = "https://raw.githubusercontent.com/adinger/Unofficial-Trackr/master/";
var json1, json2, json3;
var locmap = {};
var map;
var circles = [];
var obj;


// create the map
function initMap() {

	// retrieve all the data from a public location (github)
	$.when(
		$.getJSON(dataLocationRoot + dataFileNames[0]),
		$.getJSON(dataLocationRoot + dataFileNames[1]),
		$.getJSON(dataLocationRoot + dataFileNames[2])
	).done(function (data2014, data2015, data2016) {
		json1 = JSON.parse(data2014[2].responseText);
		json2 = JSON.parse(data2015[2].responseText);
		json3 = JSON.parse(data2016[2].responseText);


		obj = json1;
		console.log(obj);

		// what does this loop do???
		for (i = 0; i < obj.crimes.length; i++){	
			var size=1;
			obj.crimes[i].time = Number(obj.crimes[i].time);
			locmap['crime' + i] = {};
			locmap['crime' + i]['center'] = {}
			locmap['crime' + i]['center']['lat'] = obj.crimes[i].location.lat;
			locmap['crime' + i]['center']['lng'] = obj.crimes[i].location.lng;

			for (j=0; j<obj.crimes.length; j++){
				// what does this if's condition do???
				if (obj.crimes[i].location==obj.crimes[j].location 
						&& obj.crimes[i].time==obj.crimes[j].time){	
					size+=2;
				}
			}
			locmap['crime' + i]['number'] = size;
		}
		console.log(locmap);

		(obj.crimes).sort(function(a,b){return a['time']-b['time']});
		console.log(obj.crimes)
	});

	// map's initial configuration
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 14,
		center: {lat: 40.110588, lng: -88.20727},
		mapTypeId: google.maps.MapTypeId.TERRAIN
	});

	// Construct the circle for each value in citymap.
	// Note: We scale the area of the circle based on the population.
	var i=0;
	for (var place in locmap) {
			var contentString = "Charge: " + obj.crimes[i]['charge'] + "<br>" + 
													"Time: " + obj.crimes[i]['time'] + "<br>" + 
													"School/city person is from: " + obj.crimes[i]['school/city'];
			i++;

			var infowindow = new google.maps.InfoWindow({
				content: contentString
			});
			// Add the circle for this city to the map.
			var circle = new google.maps.Circle({
				position: locmap[place].center,
				strokeColor: '#FFA07A',
				strokeOpacity: 0,
				strokeWeight: 2,
				fillColor: '#DC143C',
				fillOpacity: 0.35,
				map: map,
				center: locmap[place].center,
				radius: Math.sqrt(locmap[place].number) * 40
			});

			circles.push(circle);
			//circle.bindTo('center', marker, 'position');
			bindInfoWindow(circle, map, infowindow);
			//sleep(50);
		}
		map.setOptions({styles: styles});
}	 // end initMap()

var previousInfoWindow;
function bindInfoWindow(circle, map, infowindow) {
	
	circle.addListener('click', function() {
		if(previousInfoWindow){
		previousInfoWindow.close();
		}

		infowindow.open(map, this);
		
		previousInfoWindow = infowindow;

	});

	// ???
	function addMarkerWithTimeout(position, contentString,timeout) {
		window.setTimeout(function() {
		console.log('test');
		var infowindow = new google.maps.InfoWindow({
				content: contentString
			});
		var local_circle =new google.maps.Circle({
				position: position,
				strokeColor: '#FFA07A',
				strokeOpacity: 0,
				strokeWeight: 2,
				fillColor: '#DC143C',
				fillOpacity: 0.35,
				map: map,
				center: position,
				radius: Math.sqrt(locmap[place].number) * 40
				});

		circles.push(local_circle);
		bindInfoWindow(local_circle, map, infowindow);

		}, timeout);
	}

	function clearMarkers() {
		for (var i = 0; i < circles.length; i++) {
			circles[i].setMap(null);
		}
		circles = [];
	}
}

// ???
function drop() {
	clearMarkers();
	var i=0;
	for (place in locmap){
	var contentString = "Charge: " + obj.crimes[i]['charge'] + "<br>" + 
											"Time: " + obj.crimes[i]['time'] + "<br>" + 
											"School/city person is from: " + obj.crimes[i]['school/city'];
		console.log(locmap[place]['center']);
		addMarkerWithTimeout(locmap[place]['center'],contentString, i * 200);
		i++;
	}
}

// ???
function refresh(year, txt) {
	console.log(year)
	if (year=='2014'){
		console.log('im in 2014')
		document.getElementById('name').innerHTML = txt;
		obj = json1;
	}
	if (year=='2015'){
		console.log('im in 2015')
		document.getElementById('name').innerHTML = txt;
		obj = json2;
	}

	refresh_helper();
	initMap();
}


function refresh_helper(){
	locmap = {};
	console.log(obj);

	for (i=0; i<obj.crimes.length; i++){
		var size=1;
		obj.crimes[i].time = Number(obj.crimes[i].time);
		locmap['crime' + i] = {};
		locmap['crime' + i]['center'] = {}
		locmap['crime' + i]['center']['lat'] = obj.crimes[i].location.lat;
		locmap['crime' + i]['center']['lng'] = obj.crimes[i].location.lng;
		for (j=0; j<obj.crimes.length; j++){
			if (obj.crimes[i].location==obj.crimes[j].location && obj.crimes[i].time==obj.crimes[j].time){
				size+=2;
			}
		}
		locmap['crime' + i]['number'] = size;
	}
	console.log(locmap);

	(obj.crimes).sort(function(a,b){return a['time']-b['time']});
	console.log(obj.crimes)
}