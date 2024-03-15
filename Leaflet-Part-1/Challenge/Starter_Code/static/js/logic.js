//url = https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson


// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Add the base map layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fetch earthquake data from the provided URL
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson')
  .then(response => response.json())
  .then(data => {
    // Loop through the earthquake data and create markers
    data.features.forEach(function (quake) {
      var magnitude = quake.properties.mag;
      console.log('Magnitude:', magnitude); // Log the magnitude value

      var depth = quake.geometry.coordinates[2];
      console.log('FillColor:', getMarkerColor(magnitude)); // Log the fill color
      

      // Create a circle marker for each earthquake
      L.circleMarker([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
        radius: getMarkerSize(magnitude),
        // fillColor: getMarkerColor(depth),
        // radius: getMarkerSize(depth),
        fillColor: getMarkerColor(magnitude),
        color: 'black',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).bindPopup(`<strong>Location:</strong> ${quake.properties.place}<br><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth} km`).addTo(map);
    });
  })
  .catch(error => console.error('Error fetching earthquake data:', error));


// Define a function to get marker size based on earthquake magnitude
function getMarkerSize(magnitude) {
  return magnitude * 1.25; // You can adjust this multiplier as needed
}


// // Define a function to get marker size based on earthquake magnitude
// function getMarkerSize(depth) {
//   return depth * 1.5; // You can adjust this multiplier as needed


  // Define a function to get marker color based on earthquake magnitude
function getMarkerColor(magnitude) {
    if (magnitude <= 3.5) {
      return 'yellow';
    } else if (magnitude <= 4.5) {
      return 'green';
    } else if (magnitude <= 5.5) {
        return 'blue';
     } else {
      return 'darkred';  // Default color for magnitudes greater than 6.0
    }
  }



// Create a legend
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += '<strong>Magnitude and Depth Legend</strong><br>';
  div.innerHTML += '<i style="background: yellow"></i> Magnitude <= 3.5<br>';
  div.innerHTML += '<i style="background: green"></i> < Magnitude <= 4.5<br>';
  div.innerHTML += '<i style="background: blue"></i>  < Magnitude <= 5.5<br>';
  div.innerHTML += '<i style="background: darkred"></i> Magnitude > 5.5<br>';
  div.innerHTML += '<br>';

  return div;
};
legend.addTo(map);