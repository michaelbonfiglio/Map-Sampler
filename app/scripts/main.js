/* jshint devel:true */

L.mapbox.accessToken = 'pk.eyJ1IjoibWljaGFlbGJvbmZpZ2xpbyIsImEiOiJjVnNWekRzIn0.hUReBCzKH6cs4Seh7yUZ4g';
// Create a map in the div #map

var sampMap = 'michaelbonfiglio.k4blgij8';

$('#sampmapID').val(sampMap);



// var map0 = L.mapbox.map('map0', sampMap);
// var map1 = L.mapbox.map('map1', sampMap);
// var map2 = L.mapbox.map('map2', sampMap);
// var map3 = L.mapbox.map('map3', sampMap);
// var map4 = L.mapbox.map('map4', sampMap);

var sampZoomMin = 0;
var sampZoomMax = 18;

var longMin = -180;
var longMax = 180;
var latMin = -90;
var latMax = 90;

var sampleMaps = [];
var mapCount = 7;

for (var i = 0; i < mapCount; ++i) {
	//console.log('map' + i);
    sampleMaps[i] = L.mapbox.map('map' + i, sampMap, {zoomControl:false, attributionControl:false});

}

function randomCoordinate(min,max) {
	return (Math.random()*(max-min+1)+min).toFixed(4);
}

function randomInterger(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}

function featureCheck(i) {

	jQuery.ajax( {
	    url: 'https://api.mapbox.com/v4/geocode/mapbox.places/' + sampObj[i].sampLong +',' + sampObj[i].sampLat + '.json?access_token=' + L.mapbox.accessToken,
	    type: 'GET',
	    success: function( response ) {
	       //console.log(sampObj[i].sampLong); 

	    	if(response.features.length > 0) {
	    		console.log(sampObj[i].sampLong, sampObj[i].sampLat);
       			sampleMaps[i].setView([sampObj[i].sampLat, sampObj[i].sampLong]).setZoom(sampObj[i].sampZoom);

       			//window['map' + i].setView([sampObj[i].sampLat, sampObj[i].sampLong]).setZoom(sampObj[i].sampZoom);
       		}
       		else {
       			sampObj[i].sampLat = randomCoordinate(latMin, latMax);
				sampObj[i].sampLong = randomCoordinate(longMin,longMax);
       			featureCheck(i);
       		}
	    }
	});
}


var sampObj = [];

$('#button1').click(function() {
	event.preventDefault();

	for (var k = 0; k < mapCount; k++) {
		sampObj[k] = {};
		sampObj[k].sampLat = randomCoordinate(latMin, latMax);
		sampObj[k].sampLong = randomCoordinate(longMin,longMax);
		sampObj[k].sampZoom = randomInterger(sampZoomMin, sampZoomMax);

		featureCheck(k);
		
	}
});


$( "#slider-range" ).slider({
	range: true,
	min: sampZoomMin,
	max: sampZoomMax,
	values: [ sampZoomMin, sampZoomMax ],
	slide: function( event, ui ) {
		$( "#amount" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
		sampZoomMin = ui.values[ 0 ];
		sampZoomMax = ui.values[ 1 ];
	}
});
$( "#amount" ).val( $( "#slider-range" ).slider( "values", 0 ) + " - " + $( "#slider-range" ).slider( "values", 1 ) );

$('#btn-sampmapID').click(function() {
	event.preventDefault();
	inactiveSampMap = sampMap;
	sampMap = $('#sampmapID').val();
	for (var i = 0; i < mapCount; ++i) {
		sampleMaps[i].removeLayer(L.mapbox.tileLayer(inactiveSampMap));
		sampleMaps[i].addLayer(L.mapbox.tileLayer(sampMap));
	}
	
	// for (var i = 0; i < mapCount; ++i) {
		
	// }
	
});


