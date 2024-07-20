if (localStorage.authToken) {
	initializePage();
} else {
	alert("You must be logged in to access this page");
	window.location.href = "/";
}

const entryNameSelect = document.getElementById("entryNameSelect");
let map, orgTitle, fullData;

async function initializePage() {
	try {
		const data = await fetchEntries();

		if (data.length) {
			populateSelectOptions(entryNameSelect, data);
		} else {
			entryNameSelect.innerHTML = '<option value="">Select one...</option>';
		}

		const initialEntryID = data[0].id;
		orgTitle = data[0]._organization.OrgName;

		entryNameSelect.addEventListener("change", async () => {
			if (entryNameSelect.value === "add_new_entry") {
				window.location.href = "/new-entry";
			} else {
				fetchEntryData(entryNameSelect.value);
			}
		});
		fetchEntryData(initialEntryID);
	} catch (error) {
		console.error("Error initializing page:", error);
	}
}

async function fetchEntries() {
	const response = await fetch(
		"https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/getUserEntries",
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

	return response.json();
}

async function fetchEntryData(entryID) {
	try {
		const response = await fetch(
			`https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/getAppEntries_v2?entryID=${entryID}`,
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
		document.getElementById("orgTitle").innerText =
			data[0]._organization.OrgName;
		orgTitle = data[0]._organization.OrgName;
		const directoryEntries = data.filter((item) => item.includedDirectory);
		const mapEntries = data.filter((item) => item.includedMap);
		fullData = directoryEntries;
		loadDirectory(directoryEntries);
		loadMap(mapEntries);
		return { directoryEntries, mapEntries };
	} catch (error) {
		console.error("There was a problem with your fetch operation:", error);
	}
}

function populateSelectOptions(selectElement, options) {
	selectElement.innerHTML = '<option value="">Select one...</option>';

	if (options && options.length) {
		options.sort((a, b) => a.entryName.localeCompare(b.entryName));

		options.forEach((option) => {
			const optionElement = document.createElement("option");
			optionElement.value = option.id;
			optionElement.textContent = `${option.entryName} (${option._organization.OrgName})`;
			selectElement.appendChild(optionElement);
		});

		const firstOption = options[0].id;
		selectElement.value = firstOption;
		const lastItem = document.createElement("option");
		lastItem.value = "add_new_entry";
		lastItem.textContent = "Add a new entry ✳️";
		selectElement.appendChild(lastItem);
		document.getElementById("orgTitle").innerText =
			options[0]._organization.OrgName;
	}
}

function loadDirectory(users) {
	let tableWrap = document.getElementById("table_wrap");
	tableWrap.innerHTML = "";
	document.getElementById("countInitial").textContent = users.length;

	users.sort((a, b) =>
		a.entryName.toLowerCase().localeCompare(b.entryName.toLowerCase())
	);

	let columnHeader1 = users[0]._organization.orgFilterOne
		? `<div role="columnheader" class="table4_column is-header-column">
            <a fs-cmssort-desc="is-desc" fs-cmssort-element="trigger" fs-cmssort-field="IDENTIFIER" fs-cmssort-asc="is-asc" href="#" class="table4_header-link w-inline-block">
                <div id="filterOneLabel" class="text-weight-semibold">${users[0]._organization.orgFilterOne}</div>
            </a>
        </div>`
		: "";

	let columnHeader2 = users[0]._organization.orgFilterTwo
		? `<div role="columnheader" class="table4_column is-header-column">
            <a fs-cmssort-desc="is-desc" fs-cmssort-element="trigger" fs-cmssort-field="IDENTIFIER" fs-cmssort-asc="is-asc" href="#" class="table4_header-link w-inline-block">
                <div id="filterTwoLabel" class="text-weight-semibold">${users[0]._organization.orgFilterTwo}</div>
            </a>
        </div>`
		: "";

	let rowHeader = `
        <div class="table4_header-row">
            <div role="columnheader" class="table4_column is-header-column">
                <a fs-cmssort-desc="is-desc" fs-cmssort-element="trigger" fs-cmssort-field="IDENTIFIER" fs-cmssort-asc="is-asc" href="#" class="table4_header-link w-inline-block">
                    <div class="text-weight-semibold">Community Member</div>
                </a>
            </div>
            <div role="columnheader" class="table4_column is-header-column">
                <a fs-cmssort-desc="is-desc" fs-cmssort-element="trigger" fs-cmssort-field="IDENTIFIER" fs-cmssort-asc="is-asc" href="#" class="table4_header-link w-inline-block">
                    <div class="text-weight-semibold">Contact Name</div>
                </a>
            </div>
            <div role="columnheader" class="table4_column is-header-column">
                <a fs-cmssort-desc="is-desc" fs-cmssort-element="trigger" fs-cmssort-field="IDENTIFIER" fs-cmssort-asc="is-asc" href="#" class="table4_header-link w-inline-block">
                    <div class="text-weight-semibold">Email</div>
                </a>
            </div>
            <div role="columnheader" class="table4_column is-header-column">
                <a fs-cmssort-desc="is-desc" fs-cmssort-element="trigger" fs-cmssort-field="IDENTIFIER" fs-cmssort-asc="is-asc" href="#" class="table4_header-link w-inline-block">
                    <div class="text-weight-semibold">Phone</div>
                </a>
            </div>
            ${columnHeader1}
            ${columnHeader2}
        </div>`;

	tableWrap.insertAdjacentHTML("beforeend", rowHeader);

	users.forEach((item) => {
		const name = item._user.name;
		const email = item._user.email;
		const { entryPhone, entryFilterOne, entryFilterTwo, entryName } = item;

		let userFilterInsert1 = users[0]._organization.orgFilterOne
			? `<div role="cell" class="table4_column">
                <div id="filterOneText" fs-cmsfilter-field="filterOne">
                    ${entryFilterOne || "Not Listed"}
                </div>
            </div>`
			: "";

		let userFilterInsert2 = users[0]._organization.orgFilterTwo
			? `<div role="cell" class="table4_column">
                <div id="filterTwoText" fs-cmsfilter-field="filterTwo">
                    ${entryFilterTwo || "Not Listed"}
                </div>
            </div>`
			: "";

		let htmlInsert = `
            <div role="row" class="table4_item">
                <div role="cell" class="table4_column">
                    <div id="entryNameText" fs-cmsfilter-field="entryName">
                        ${entryName || "Not Listed"}
                    </div>
                </div>
                <div role="cell" class="table4_column">
                    <div id="nameText" fs-cmsfilter-field="name" class="text-weight-medium">
                        ${name}
                    </div>
                </div>
                <div role="cell" class="table4_column">
                    <div id="emailText">
                        ${email || "Not Listed"}
                    </div>
                </div>
                <div role="cell" class="table4_column">
                    <div id="phoneText">
                        ${entryPhone || "Not Listed"}
                    </div>
                </div>
                ${userFilterInsert1}
                ${userFilterInsert2}
            </div>`;

		tableWrap.insertAdjacentHTML("beforeend", htmlInsert);
	});
}

let controlOne, controlTwo, filterButton; // Declare controls globally

function loadMap(users) {
	console.log(users);

	// Initialize map and layers
	if (map) {
		map.eachLayer(function (layer) {
			if (layer !== map) {
				map.removeLayer(layer);
			}
		});
	} else {
		map = L.map("map");
	}

	let orgInfo = users[0]._organization;
	map.setView([orgInfo.orgLat, orgInfo.orgLng], 13);

	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution:
			'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	}).addTo(map);

	const schoolIcon = L.icon({
		iconUrl:
			"https://img.icons8.com/fluency-systems-filled/512/school-building.png",
		iconSize: [30, 30],
		iconAnchor: [15, 15],
	});

	const layer = L.marker([orgInfo.orgLat, orgInfo.orgLng], {
		icon: schoolIcon,
	}).addTo(map);
	layer.bindPopup(`This is ${orgInfo.OrgName}!`).openPopup();

	// Remove existing filter controls if they exist
	if (controlOne) {
		map.removeControl(controlOne);
	}
	if (controlTwo) {
		map.removeControl(controlTwo);
	}
	if (filterButton) {
		map.removeControl(filterButton);
	}

	// Objects to store layer groups for each unique filter
	let filterOneGroups = {};
	let filterTwoGroups = {};

	users.forEach((item) => {
		const name = item._user.name;
		const email = item._user.email;
		const {
			entryPhone,
			entryPreference,
			entryFilterOne,
			entryFilterTwo,
			lat,
			lng,
			entryName,
		} = item;
		const newMarker = L.marker([lat, lng], {
			title: name,
			riseOnHover: true,
		});

		let phoneInsert = entryPhone ? `<b>Phone:</b> ${entryPhone}<br>` : "";
		let emailInsert = email ? `<b>Email:</b> ${email}<br>` : "";
		let filterOneInsert = entryFilterOne
			? `<b>${orgInfo.orgFilterOne}:</b> ${entryFilterOne}<br>`
			: "";
		let filterTwoInsert = entryFilterTwo
			? `<b>${orgInfo.orgFilterTwo}:</b> ${entryFilterTwo}<br>`
			: "";
		let childInsert = entryName ? `<b>Student:</b> ${entryName}<br>` : "";

		let popUpInsert = `
            <div><b>Family:</b> ${name}<div>
            <div>${emailInsert}</div>
            <div>${phoneInsert}</div>
            <div class="spacer-xxsmall"></div>
            <div>${childInsert}</div>
            <div>${filterOneInsert}</div>
            <div>${filterTwoInsert}</div>
            <div class="spacer-xxsmall"></div>
            <div><b>Preference:</b><br> ${entryPreference}</div>`;

		newMarker.bindPopup(popUpInsert);

		// Add marker to the appropriate filter group
		if (entryFilterOne) {
			if (!filterOneGroups[entryFilterOne]) {
				filterOneGroups[entryFilterOne] = L.layerGroup().addTo(map);
			}
			newMarker.addTo(filterOneGroups[entryFilterOne]);
		} else {
			newMarker.addTo(map);
		}

		if (entryFilterTwo) {
			if (!filterTwoGroups[entryFilterTwo]) {
				filterTwoGroups[entryFilterTwo] = L.layerGroup().addTo(map);
			}
			newMarker.addTo(filterTwoGroups[entryFilterTwo]);
		} else {
			newMarker.addTo(map);
		}
	});

	// Create filter control for filterOne
	let filterOneOverlays = {};
	for (let filter in filterOneGroups) {
		let label = `${orgInfo.orgFilterOne}: ${filter}`;
		filterOneOverlays[label] = filterOneGroups[filter];
	}

	// Create filter control for filterTwo
	let filterTwoOverlays = {};
	for (let filter in filterTwoGroups) {
		let label = `${orgInfo.orgFilterTwo}: ${filter}`;
		filterTwoOverlays[label] = filterTwoGroups[filter];
	}

	// Add control layer for the filters with collapsed: true
	controlOne = L.control
		.layers(null, filterOneOverlays, { position: "topright", collapsed: true })
		.addTo(map);
	controlTwo = L.control
		.layers(null, filterTwoOverlays, { position: "topright", collapsed: true })
		.addTo(map);

	// Hide the controls initially
	controlOne._container.style.display = "none";
	controlTwo._container.style.display = "none";

	// Create filter button
	filterButton = L.control({ position: "topleft" });
	filterButton.onAdd = function (map) {
		let div = L.DomUtil.create(
			"div",
			"leaflet-bar leaflet-control leaflet-control-custom"
		);
		div.innerHTML =
			'<button style="background-color: white; border: 2px solid black; color: black; padding: 5px 10px; font-size: 14px;">Filters</button>';
		div.style.backgroundColor = "transparent";
		div.style.cursor = "pointer";
		div.style.border = "none";

		div.onclick = function () {
			let display =
				controlOne._container.style.display === "none" ? "block" : "none";
			controlOne._container.style.display = display;
			controlTwo._container.style.display = display;
		};

		return div;
	};
	filterButton.addTo(map);
}

const searchForm = document.getElementById("search-form");
const filterInput = document.getElementById("searchBox");

searchForm.addEventListener("submit", function (e) {
	e.preventDefault();
});

filterInput.addEventListener("input", function () {
	const filterValue = filterInput.value.toLowerCase();
	const filteredData = fullData.filter((item) => {
		return (
			item._user.name.toLowerCase().includes(filterValue) ||
			(item._user.email &&
				item._user.email.toLowerCase().includes(filterValue)) ||
			(item.entryFilterOne &&
				item.entryFilterOne.toLowerCase().includes(filterValue)) ||
			(item.entryFilterTwo &&
				item.entryFilterTwo.toLowerCase().includes(filterValue)) ||
			(item.entryName && item.entryName.toLowerCase().includes(filterValue))
		);
	});

	loadDirectory(filteredData);
});

document
	.getElementById("printButton")
	.addEventListener("click", printTableWrap);

function printTableWrap() {
	// Get the content of the element with ID 'table_wrap'
	const tableWrapContent = document.getElementById("table_wrap").outerHTML;

	const printWindow = window.open("", "", "height=800,width=1200");

	printWindow.document.write(
		`<html><head><title>${orgTitle}'s Directory, printed by Community Connector.  Connect with your community at: Connector.Community</title>`
	);
	printWindow.document.write("<style>");
	// Add any styles you want for the print
	printWindow.document.write(`
	.
    .table4_list-wrapper {color: black; font-family: Arial, sans-serif; width: 100%; }
    .table4_header-row { background-color: #f1f1f1; display: flex; }
    .table4_column { padding: 8px; border: 1px solid #ddd; flex: 1; }
    .text-weight-semibold { font-weight: bold; }
    .text-weight-medium { font-weight: 500; }
    .table4_item { border-bottom: 1px solid #ddd; display: flex; }
	 .table4_header-link { color: black; text-decoration: none; }
	 h1 { font-size: 18pt; font-weight: bold; }
	     .print-title { text-align: right; font-size: 12pt; font-weight: normal; }
  `);
	printWindow.document.write("</style>");
	printWindow.document.write(`<h1>${orgTitle}'s Directory</h1>`);
	printWindow.document.write("</head><body>");
	printWindow.document.write(tableWrapContent);
	printWindow.document.write("</body></html>");

	printWindow.document.close();

	printWindow.onload = function () {
		printWindow.print();
		printWindow.close();
	};
}
