var map;
map = L.map('map').setView([5, 20.15], 3.4);

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
function createAcledOverlay(data, layerName){
  var clusters = L.markerClusterGroup();
  var acledOverlay = L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      var marker = L.marker(latlng);
      marker.bindPopup('Event type: ' + feature.properties.event_type + ': ' + feature.properties.sub_event_type + '<br/>' + 'Date: ' + feature.properties.event_date + '<br/>' + 'Country: ' + feature.properties.country + '<br/>' + 'Location: ' + feature.properties.admin1 + ' , ' + feature.properties.admin2 + '<br/>' + 'Actor 1: ' + feature.properties.actor1 + '<br/>' + 'Actor 2: ' + feature.properties.actor2 + '<br/>' + 'Notes: ' + feature.properties.notes);
      return marker;
    },
    onEachFeature: function (feature, layer) {
      layer.addTo(clusters);
    }
  });
  // map.addLayer(clusters);
  layerControl.addOverlay(clusters, layerName)
}
$.getJSON("data/ACLED_2.geojson", function(data) { createAcledOverlay(data, "Armed Conflict & Location Data")});

//IMR data
function getColor(d) {
  return d > 100 ? '#4A1486' :
         d > 75  ? '#6A51A3' :
         d > 50  ? '#807DBA' :
         d > 25  ? '#9E9AC8' :
         d > 10  ? '#BCBDDC' :
                   '#DADAEB' ;
};

function addIMRdata (imrData, layerName){
  var imrOverlay =L.geoJson(imrData, {
    style: function (feature) {
      return {
        fillColor: getColor(feature.properties.IMR),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '2',
        fillOpacity: 0.6
      };
    }
    }).bindPopup(function (layer) {
        return "IMR per 1000: " + layer.feature.properties.IMR
  })
  layerControl.addOverlay(imrOverlay, layerName)
}

$.getJSON("data/africa_imr.json", function(imrData) { addIMRdata(imrData, "Infant Mortality Rate")});

//Drought Raster
var drought = L.imageOverlay("data/drought_africa_1.png", [[75.5,-180.5],[-65.5,180.5]])

//Potential Areas of Concern Raster
var potentialAreas = L.imageOverlay("data/potentialAreas.png", [[75.5,-180],[-65.5,180]]).addTo(map);

//Rainfed Crops Raster
var rainCrops = L.imageOverlay("data/cropped_areas_2.png", [[75.5,-180],[-65.5,180]])

//layer control
var overlays = {
  "Susceptible Areas": potentialAreas,
  "Drought Prediction": drought,
  "Rainfed Crops": rainCrops
}

var layerControl = L.control.layers(null, overlays).addTo(map);