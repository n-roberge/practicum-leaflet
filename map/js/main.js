var map = L.map('map').setView([5, 20.15], 3.25);

var basemap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZG9yYWt1NDE3IiwiYSI6ImNrNTR3Y2czbDBucmszanI1bnI2dWRvcjkifQ.sJB2t5gxDp0I5dJBNkJ5DA'
});

var controlLayers = L.control.layers().addTo(map);

basemap.addTo(map);

$.getJSON("data/acled.geojson", function(data) {
    var clusters = L.markerClusterGroup();
    // add GeoJSON layer to the map once the file is loaded
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
