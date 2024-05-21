//   <div id="map"></div>

//   <form id="pinForm">
//     Latitude: <input type="text" id="latitude" name="latitude"><br>
//     Longitude: <input type="text" id="longitude" name="longitude"><br>
//   </form>
let loader = document.querySelector("#loadingFill");

let lat, lng, map, marker;

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		alert("Geolocation is not supported by this browser.");
	}
}

function showPosition(position) {
	lat = position.coords.latitude;
	lng = position.coords.longitude;

	map = L.map("map").setView([lat, lng], 12); // Default view
	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

	marker = L.marker([lat, lng], {
		draggable: true,
	}).addTo(map);
	marker
		.bindPopup("<b>This is you!</b><br>Drag to desired position")
		.openPopup();

	loader.classList.toggle("hide");
	document.getElementById("lat").value = lat;
	document.getElementById("lng").value = lng;

	marker.on("drag", function (e) {
		updateMarker(e);
	});
}

getLocation();

// Function to update marker position
function updateMarker(e) {
	lat = e.target.getLatLng().lat;
	lng = e.target.getLatLng().lng;
	marker.setLatLng([lat, lng]);
	console.log(lat, lng);
	document.getElementById("lat").value = lat;
	document.getElementById("lng").value = lng;
}

// Update marker on marker drag

// // Update marker on map move

// map.on("move", function (e) {
// 	let latlng = marker.getLatLng();
// 	console.log(latlng);
// 	// document.getElementById("lat").value = lat;
// 	// document.getElementById("lng").value = lng;
// });
