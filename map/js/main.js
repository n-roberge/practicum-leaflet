var map = L.map('map').setView([5, 20.15], 3.25);

//Basemap
var basemap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZG9yYWt1NDE3IiwiYSI6ImNrNTR3Y2czbDBucmszanI1bnI2dWRvcjkifQ.sJB2t5gxDp0I5dJBNkJ5DA'
});


basemap.addTo(map);

//ACLED data
$.getJSON("data/acled.geojson", function(data) {
    var clusters = L.markerClusterGroup();
    var acledData = L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
        var marker = L.marker(latlng);
        marker.bindPopup('Event type: ' + feature.properties.event_type + ': ' + feature.properties.sub_event_type + '<br/>' + 'Date: ' + feature.properties.event_date + '<br/>' + 'Country: ' + feature.properties.country + '<br/>' + 'Location: ' + feature.properties.admin1 + ' , ' + feature.properties.admin2 + '<br/>' + 'Actor 1: ' + feature.properties.actor1 + '<br/>' + 'Actor 2: ' + feature.properties.actor2 + '<br/>' + 'Notes: ' + feature.properties.notes);
        return marker;
      },
      onEachFeature: function (feature, layer) {
        layer.addTo(clusters);
      }
    });

    map.addLayer(clusters);
  });

  var controlLayers = L.control.layers().addTo(map);

//IMR data

// let geojsonData = 'map/data/Africa_IMR_FeaturesToJSON.json'

// L.choropleth(geojsonData, {
// 	valueProperty: 'IMR', // which property in the features to use
// 	scale: ['white', 'red'], // chroma.js scale - include as many as you like
// 	steps: 5, // number of breaks or steps in range
// 	mode: 'q', // q for quantile, e for equidistant, k for k-means
// 	style: {
// 		color: '#fff', // border color
// 		weight: 2,
// 		fillOpacity: 0.8
// 	},
// 	onEachFeature: function(feature, layer) {
// 		layer.bindPopup(feature.properties.value)
// 	}
// }).addTo(map)