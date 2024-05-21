window.onload = function () {
	if (localStorage.authToken == null) {
		alert("You are not logged in");
		window.location.href = "/";
	} else {
		toggleButtons();
		sendToXano();
	}
};

const logOutBtn = document.getElementById("logout-button");

async function sendToXano() {
	fetch("https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/auth/me", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: localStorage.authToken,
		},
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then((data) => {
			// Do something with the response data
			user = data;
			let str = user.UserOrgName;
			document.getElementById("userName").innerHTML = user.name;
			if (user.UserOrgName)
				document.getElementById("userOrganization").innerText =
					str[0].toUpperCase() + str.slice(1);
			//Update Filter Titles from org details
			if (user._organization.orgFilterOne) {
				document.getElementById("filterOneLabel").innerHTML =
					user._organization.orgFilterOne;
				document.getElementById("filterOne").value = user.userFilterOne;
			} else document.getElementById("filterOneWrapper").classList.add("hide");
			if (user._organization.orgFilterTwo) {
				document.getElementById("filterTwoLabel").innerHTML =
					user._organization.orgFilterTwo;
				document.getElementById("filterTwo").value = user.userFilterTwo;
			} else document.getElementById("filterTwoWrapper").classList.add("hide");

			updateProfile(user);
		})
		.catch((error) => {
			console.error("There was a problem with the fetch operation:", error);
		});
}

function updateProfile(user) {
	let lat, lng, map, marker;

	let loader = document.getElementById("loadingFill");
	let name = document.getElementById("name");
	name.value = user.name;
	let email = document.getElementById("email");
	email.value = user.email;
	let preferences = document.getElementById("preferences");
	if (user.preference) preferences.value = user.preference;
	let phone = document.getElementById("phone");
	if (user.phone) phone.value = user.phone;
	//STILL NEED TO ADD FILTERS
	let includedMapBox = document.getElementById("includedMap");
	includedMapBox.checked = user.includedMap;

	let includedDirectoryBox = document.getElementById("includedDirectory");
	includedDirectoryBox.checked = user.includedDirectory;

	console.log(user);

	function getLocation() {
		if (!user.lat) {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition);
			} else {
				alert("Geolocation is not supported by this browser.");
			}
		} else showCurrentPosition();
	}

	function showCurrentPosition() {
		lat = user.lat;
		lng = user.lng;
		map = L.map("map").setView([lat, lng], 12); // Default view
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
			map
		);

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

	function showPosition(position) {
		if (position.coords) {
			lat = position.coords.latitude;
			lng = position.coords.longitude;
		}
		map = L.map("map").setView([lat, lng], 12); // Default view
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
			map
		);

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
}

document
	.getElementById("userForm")
	.addEventListener("submit", function (event) {
		event.preventDefault(); // Prevent the default form submission
		event.stopPropagation();

		const formData = {
			user_id: user.id,
			email: user.email,
			phone: document.getElementById("phone").value,
			name: document.getElementById("name").value,
			preference: document.getElementById("preferences").value,
			lat: parseFloat(document.getElementById("lat").value),
			lng: parseFloat(document.getElementById("lng").value),
			includedMap: document.getElementById("includedMap").checked,
			includedDirectory: document.getElementById("includedDirectory").checked,
			userFilterOne: document.getElementById("filterOne").value,
			userFilterTwo: document.getElementById("filterTwo").value,
		};
		console.log(formData);
		fetch(`https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/user/${user.id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		})
			.then((response) => {
				let textElement = document.getElementById("updatedText");
				textElement.style.display = "block"; // Display the text
				setTimeout(function () {
					textElement.style.display = "none"; // Hide the text after 5 seconds
				}, 5000); // 5000 milliseconds = 5 seconds

				console.log("response", response);
			})
			.catch((error) => {
				// Handle error
			});

		// fetch(`https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/user/${user.id}`, {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify(formData),
		// })
		// 	.then((response) => {
		// 		console.log("response", response);
		// 		if (response.ok) {
		// 			return response.json();
		// 		} else {
		// 			alert(
		// 				"Request not completed - make sure password has both letters and numbers."
		// 			);
		// 			throw new Error("Something went wrong with the request.");
		// 		}
		// 	})
		// 	.then((data) => {
		// 		if (!data) {
		// 			console.log("NULL DATA");
		// 			alert("Organization and/or Passkey are incorrect");
		// 		} else {
		// 			console.log(data);
		// 		}
		// 	})
		// 	.catch((error) => console.error("Error:", error));
	});
function toggleButtons() {
	const signUp_button = document.getElementById("sign-up_button");
	const logIn_button = document.getElementById("log-in_button");
	const myProfile_button = document.getElementById("my-profile_button");
	const map_button = document.getElementById("map_button");
	const directory_button = document.getElementById("directory_button");

	signUp_button.classList.toggle("hide");
	logIn_button.classList.toggle("hide");
	myProfile_button.classList.toggle("hide");
	map_button.classList.toggle("hide");
	directory_button.classList.toggle("hide");
}

logOutBtn.addEventListener("click", () => {
	console.log("click");
	localStorage.clear();
	alert("You are not logged in");
	window.location.href = "/";
});
