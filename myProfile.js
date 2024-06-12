if (localStorage.authToken) {
	sendToXano();
} else {
	alert("You must be logged in to access this page");
	window.location.href = "/";
}

const logOutBtn = document.getElementById("logout-button");
let user;
let entry;
let map; // Declare the map variable at the top level
let marker; // Declare the marker variable at the top level

async function sendToXano() {
	try {
		const response = await fetch(
			"https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/auth/me_entries",
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

		entry =
			user.entry_id && user.entry_id.length && user.entry_id[0].length
				? user.entry_id[0][0]
				: null;
		console.log(entry);
		if (entry) {
			updateUserInterface(entry);
			updateProfile(entry);
		}
	} catch (error) {
		console.error("There was a problem with the fetch operation:", error);
	}
}

function updateUserInterface(entry) {
	document.getElementById("userName").innerHTML = user.name;

	if (entry._organization.OrgName) {
		const orgName = entry._organization.OrgName;
		document.getElementById("userOrganization").innerText =
			orgName[0].toUpperCase() + orgName.slice(1);
	}

	const filterOneLabel = document.getElementById("filterOneLabel");
	const filterOne = document.getElementById("filterOne");
	const filterOneWrapper = document.getElementById("filterOneWrapper");

	const filterTwoLabel = document.getElementById("filterTwoLabel");
	const filterTwo = document.getElementById("filterTwo");
	const filterTwoWrapper = document.getElementById("filterTwoWrapper");

	const entryNameSelect = document.getElementById("entryNameSelect");

	if (entry._organization.orgFilterOne) {
		filterOneLabel.innerHTML = entry._organization.orgFilterOne;
		populateSelectOptions(filterOne, entry._organization.filterOneOptions);
		filterOne.value = entry.entryFilterOne;
	} else {
		filterOneWrapper.classList.add("hide");
	}

	if (entry._organization.orgFilterTwo) {
		filterTwoLabel.innerHTML = entry._organization.orgFilterTwo;
		populateSelectOptions(filterTwo, entry._organization.filterTwoOptions);
		filterTwo.value = entry.entryFilterTwo;
	} else {
		filterTwoWrapper.classList.add("hide");
	}

	let entryArray = user.entry_id;
	let entryArrayNames = entryArray.map((entry) => entry[0].entryName);

	if (entryArrayNames.length) {
		populateEntryOptions(entryNameSelect, entryArrayNames);
	} else {
		entryNameSelect.innerHTML = '<option value="">Select one...</option>';
	}

	const childNameWrapper = document
		.getElementById("childName")
		.closest(".form_field-wrapper");
	if (!entry._organization.includeChild) {
		childNameWrapper.classList.add("hide");
	} else {
		childNameWrapper.classList.remove("hide");
	}
}

function populateEntryOptions(selectElement, options) {
	selectElement.innerHTML = '<option value="">Select one...</option>';
	if (options && options.length) {
		options.forEach((option) => {
			const optionElement = document.createElement("option");
			optionElement.value = option;
			optionElement.textContent = option;
			selectElement.appendChild(optionElement);
		});
	}
	// Adding the last item
	const lastItem = document.createElement("option");
	lastItem.value = "add_new_entry";
	lastItem.textContent = "✳️ Add a new entry ✳️";
	selectElement.appendChild(lastItem);
}

function populateSelectOptions(selectElement, options) {
	selectElement.innerHTML = '<option value="">Select one...</option>';
	if (options && options.length) {
		options.forEach((option) => {
			const optionElement = document.createElement("option");
			optionElement.value = option;
			optionElement.textContent = option;
			selectElement.appendChild(optionElement);
		});
	}
}

function updateProfile(entry) {
	document.getElementById("childName").value = entry.entryName || "";
	document.getElementById("preferences").value = entry.entryPreference || "";
	document.getElementById("phone").value = entry.entryPhone || "";
	document.getElementById("includedMap").checked = entry.includedMap;
	document.getElementById("includedDirectory").checked =
		entry.includedDirectory;
	document.getElementById("entryNameSelect").value = entry.entryName || "";

	initMap(entry);
}

function initMap(entry) {
	let lat = entry.lat;
	let lng = entry.lng;
	const loader = document.getElementById("loadingFill");

	const setPosition = (latitude, longitude) => {
		lat = latitude;
		lng = longitude;

		if (map) {
			map.setView([lat, lng], 12);
			marker.setLatLng([lat, lng]);
		} else {
			map = L.map("map").setView([lat, lng], 12);
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
				map
			);

			marker = L.marker([lat, lng], { draggable: true }).addTo(map);
			marker
				.bindPopup("<b>This is you!</b><br>Drag to desired position")
				.openPopup();

			marker.on("drag", (e) => {
				const position = e.target.getLatLng();
				document.getElementById("lat").value = position.lat;
				document.getElementById("lng").value = position.lng;
			});
		}

		loader.classList.toggle("hide");
		document.getElementById("lat").value = lat;
		document.getElementById("lng").value = lng;
	};

	if (lat && lng) {
		setPosition(lat, lng);
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

// Add event listener to entryNameSelect to handle changes
document
	.getElementById("entryNameSelect")
	.addEventListener("change", (event) => {
		const selectedEntryName = event.target.value;

		if (selectedEntryName) {
			if (selectedEntryName === "add_new_entry") {
				// Redirect to the '/new-entry' page
				window.location.href = "/new-entry";
			} else {
				const selectedEntry = user.entry_id.find(
					(entry) => entry[0].entryName === selectedEntryName
				);

				if (selectedEntry) {
					entry = selectedEntry[0];
					updateUserInterface(entry);
					updateProfile(entry);
				}
			}
		}
	});

document
	.getElementById("userForm")
	.addEventListener("submit", async (event) => {
		event.preventDefault();
		event.stopPropagation();

		const formData = {
			user_id: user.id,
			user_email: user.email,
			entryPhone: document.getElementById("phone").value,
			entryName: document.getElementById("childName").value,
			entryPreference: document.getElementById("preferences").value,
			lat: parseFloat(document.getElementById("lat").value),
			lng: parseFloat(document.getElementById("lng").value),
			includedMap: document.getElementById("includedMap").checked,
			includedDirectory: document.getElementById("includedDirectory").checked,
			entryFilterOne: document.getElementById("filterOne").value,
			entryFilterTwo: document.getElementById("filterTwo").value,
		};

		try {
			const response = await fetch(
				`https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/entry/${entry.id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: localStorage.authToken,
					},
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
