/* jshint devel:true */
'use strict';

L.mapbox.accessToken = 'pk.eyJ1IjoibWljaGFlbGJvbmZpZ2xpbyIsImEiOiJjVnNWekRzIn0.hUReBCzKH6cs4Seh7yUZ4g';

//Map ID
var sampMap = 'michaelbonfiglio.k4blgij8';

//Add Map ID to form field
$('#sampmapID').val(sampMap);

//Variables
var sampZoomMin = 0;
var sampZoomMax = 18;

var longMin = -180;
var longMax = 180;
var latMin = -90;
var latMax = 90;

var sampleMaps = [];
var mapCount = 7;

var sampObj = [];

//Create Maps in an array
for (var i = 0; i < mapCount; ++i) {
    sampleMaps[i] = L.mapbox.map('map' + i, sampMap, {zoomControl:false, attributionControl:false});
}

//Pick a random decimal number for Coordinates
function randomCoordinate(min,max) {
	return (Math.random()*(max-min+1)+min).toFixed(4);
}
//Pick a random interger for Zoom
function randomInterger(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}

//Sample Button
function featureCheck(i) {

	jQuery.ajax( {
	    url: 'https://api.mapbox.com/v4/geocode/mapbox.places/' + sampObj[i].sampLong +',' + sampObj[i].sampLat + '.json?access_token=' + L.mapbox.accessToken,
	    type: 'GET',
	    success: function( response ) {
	    	if(response.features.length > 0) {
       			sampleMaps[i].setView([sampObj[i].sampLat, sampObj[i].sampLong]).setZoom(sampObj[i].sampZoom);
       		}
       		else {
       			sampObj[i].sampLat = randomCoordinate(latMin, latMax);
				sampObj[i].sampLong = randomCoordinate(longMin,longMax);
       			featureCheck(i);
       		}
	    }
	});
}

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

//Zoom Slider
$( '#slider-range').slider({
	range: true,
	min: sampZoomMin,
	max: sampZoomMax,
	values: [ sampZoomMin, sampZoomMax ],
	slide: function( event, ui ) {
		$( '#amount ').val( ui.values[ 0 ] + ' - ' + ui.values[ 1 ] );
		sampZoomMin = ui.values[ 0 ];
		sampZoomMax = ui.values[ 1 ];
	}
});
$( '#amount' ).val( $( '#slider-range' ).slider( 'values', 0 ) + ' - ' + $( '#slider-range' ).slider( 'values', 1 ) );

//Map ID Field
$('#btn-sampmapID').click(function() {
	event.preventDefault();

	var inactiveSampMap = sampMap;
	sampMap = $('#sampmapID').val();

	for (var i = 0; i < mapCount; ++i) {
		sampleMaps[i].removeLayer(L.mapbox.tileLayer(inactiveSampMap));
		sampleMaps[i].addLayer(L.mapbox.tileLayer(sampMap));
	}

});


