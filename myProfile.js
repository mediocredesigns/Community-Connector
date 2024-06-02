if (localStorage.authToken) {
	sendToXano();
} else {
	alert("You must be logged in to access this page");
	window.location.href = "/";
}

const logOutBtn = document.getElementById("logout-button");
let user;

async function sendToXano() {
	try {
		const response = await fetch(
			"https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/auth/me",
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: localStorage.authToken,
				},
			}
		);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json();
		user = data;
		console.log(user);
		updateUserInterface(data);
		updateProfile(data);
	} catch (error) {
		console.error("There was a problem with the fetch operation:", error);
	}
}

function updateUserInterface(user) {
	document.getElementById("userName").innerHTML = user.name;

	if (user.UserOrgName) {
		const str = user.UserOrgName;
		document.getElementById("userOrganization").innerText =
			str[0].toUpperCase() + str.slice(1);
	}

	const filterOneLabel = document.getElementById("filterOneLabel");
	const filterOne = document.getElementById("filterOne");
	const filterOneWrapper = document.getElementById("filterOneWrapper");

	const filterTwoLabel = document.getElementById("filterTwoLabel");
	const filterTwo = document.getElementById("filterTwo");
	const filterTwoWrapper = document.getElementById("filterTwoWrapper");

	if (user._organization.orgFilterOne) {
		filterOneLabel.innerHTML = user._organization.orgFilterOne;
		populateSelectOptions(filterOne, user._organization.filterOneOptions);
		filterOne.value = user.userFilterOne;
	} else {
		filterOneWrapper.classList.add("hide");
	}

	if (user._organization.orgFilterTwo) {
		filterTwoLabel.innerHTML = user._organization.orgFilterTwo;
		populateSelectOptions(filterTwo, user._organization.filterTwoOptions);
		filterTwo.value = user.userFilterTwo;
	} else {
		filterTwoWrapper.classList.add("hide");
	}

	const childNameWrapper = document
		.getElementById("childName")
		.closest(".form_field-wrapper");
	if (!user._organization.includeChild) {
		childNameWrapper.classList.add("hide");
	} else {
		childNameWrapper.classList.remove("hide");
	}
}

function populateSelectOptions(selectElement, options) {
	if (options && options.length) {
		selectElement.innerHTML = '<option value="">Select one...</option>'; // Reset options
		options.forEach((option) => {
			const optionElement = document.createElement("option");
			optionElement.value = option;
			optionElement.textContent = option;
			selectElement.appendChild(optionElement);
		});
	}
}

function updateProfile(user) {
	document.getElementById("name").value = user.name;
	document.getElementById("email-profile").value = user.email;
	document.getElementById("preferences").value = user.preference || "";
	document.getElementById("phone").value = user.phone || "";
	document.getElementById("includedMap").checked = user.includedMap;
	document.getElementById("includedDirectory").checked = user.includedDirectory;
	document.getElementById("childName").value = user.childName || ""; // Added childName

	initMap(user);
}

function initMap(user) {
	let lat, lng, map, marker;
	const loader = document.getElementById("loadingFill");

	const setPosition = (latitude, longitude) => {
		lat = latitude;
		lng = longitude;
		map = L.map("map").setView([lat, lng], 12);
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
			map
		);

		marker = L.marker([lat, lng], { draggable: true }).addTo(map);
		marker
			.bindPopup("<b>This is you!</b><br>Drag to desired position")
			.openPopup();

		loader.classList.toggle("hide");
		document.getElementById("lat").value = lat;
		document.getElementById("lng").value = lng;

		marker.on("drag", (e) => {
			const position = e.target.getLatLng();
			document.getElementById("lat").value = position.lat;
			document.getElementById("lng").value = position.lng;
		});
	};

	if (user.lat && user.lng) {
		setPosition(user.lat, user.lng);
	} else if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setPosition(position.coords.latitude, position.coords.longitude);
			},
			() => {
				alert("Geolocation is not supported by this browser.");
			}
		);
	} else {
		alert("Geolocation is not supported by this browser.");
	}
}

document
	.getElementById("userForm")
	.addEventListener("submit", async (event) => {
		event.preventDefault();
		event.stopPropagation();

		const formData = {
			user_id: user.id,
			email: user.email,
			phone: document.getElementById("phone").value,
			name: document.getElementById("name").value,
			childName: document.getElementById("childName").value, // Added childName
			preference: document.getElementById("preferences").value,
			lat: parseFloat(document.getElementById("lat").value),
			lng: parseFloat(document.getElementById("lng").value),
			includedMap: document.getElementById("includedMap").checked,
			includedDirectory: document.getElementById("includedDirectory").checked,
			userFilterOne: document.getElementById("filterOne").value,
			userFilterTwo: document.getElementById("filterTwo").value,
		};

		try {
			console.log("update");
			const response = await fetch(
				`https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/user/${user.id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					Authorization: localStorage.authToken,
					body: JSON.stringify(formData),
				}
			);

			document.getElementById("updatedText").style.opacity = 1;
			setTimeout(() => {
				document.getElementById("updatedText").style.opacity = 0;
			}, 3000);

			console.log("response", response);
		} catch (error) {
			console.error("There was an error updating the profile:", error);
		}
	});

logOutBtn.addEventListener("click", () => {
	console.log("click");
	localStorage.clear();
	alert("You are not logged in");
	window.location.href = "/";
});
