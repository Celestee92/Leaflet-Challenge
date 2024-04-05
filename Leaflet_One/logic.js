// After including Leaflet's CSS and JavaScript files in your HTML, initialize the map
var myMap = L.map('map').setView([37.8, -96], 4); // You may need to adjust the coordinates and zoom level

// Add a base layer (tiles)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Function to determine marker size based on earthquake magnitude
function markerSize(magnitude) {
    return magnitude * 30000; // Scale factor for visibility, adjust as needed
}

// Function to determine marker color based on earthquake depth
function markerColor(depth) {
    if (depth > 90) return '#ea2c2c';
    else if (depth > 70) return '#ea822c';
    else if (depth > 50) return '#ee9c00';
    else if (depth > 30) return '#eecc00';
    else if (depth > 10) return '#d4ee00';
    else return '#98ee00';
}

// Fetch the GeoJSON data and add it to the map
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                return L.circle(latlng, {
                    radius: markerSize(feature.properties.mag),
                    fillColor: markerColor(feature.geometry.coordinates[2]),
                    color: "#000",
                    weight: 0.5,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>
                                 <p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
            }
        }).addTo(myMap);
    });


    function markerColor(depth) {
        return depth > 90 ? '#d73027' :
               depth > 70 ? '#fc8d59' :
               depth > 50 ? '#fee08b' :
               depth > 30 ? '#d9ef8b' :
               depth > 10 ? '#91cf60' :
                            '#1a9850';
    }
    


    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create('div', 'info legend'),
            depths = [-10, 10, 30, 50, 70, 90],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
        }

        return div;
    };
    
    legend.addTo(myMap);
// Assume you have the tectonic plates data in a GeoJSON format available at a certain URL
var tectonicPlatesURL = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';

// Fetch and add the tectonic plates data as a new layer
fetch(tectonicPlatesURL)
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            color: '#ff6500',
            weight: 2
        }).addTo(myMap);
    });
    