if (localStorage.authToken) {
	fetchUserEntries();
} else {
	alert("You must be logged in to access this page");
	window.location.href = "/";
}

const entryNameSelect = document.getElementById("entryNameSelect");

let orgInfo;
let orgLat, orgLng, orgTitle;
let fullData, map;

async function fetchUserEntries() {
	fetch("https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/getUserEntries", {
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
			let entryID = data[0].id;
			entries = data;

			if (entries.length) {
				populateSelectOptions(entryNameSelect, entries);
			} else {
				entryNameSelect.innerHTML = '<option value="">Select one...</option>';
			}

			fetchOrgData(entryID);
		})
		.catch((error) => {
			console.error("There was a problem with the fetch operation:", error);
		});
}

function populateSelectOptions(selectElement, options) {
	selectElement.innerHTML = '<option value="">Select one...</option>';

	if (options && options.length) {
		// Sort options alphabetically by entryName
		options.sort((a, b) => a.entryName.localeCompare(b.entryName));

		options.forEach((option) => {
			const optionElement = document.createElement("option");
			optionElement.value = option.id;
			optionElement.textContent = option.entryName;
			selectElement.appendChild(optionElement);
		});

		let firstOption = options[0].id;
		selectElement.value = firstOption;
		getDirectoryEntries(firstOption);
		getMapEntries(firstOption);
	}
}

async function fetchOrgData(entryID) {
	fetch(
		`https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/organization?entryID=${entryID}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: localStorage.authToken,
			},
		}
	)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then((data) => {
			orgInfo = data;
			orgLat = data.orgLat;
			orgLng = data.orgLng;
			orgTitle = data.OrgName;
			document.getElementById("orgTitle").innerText = orgTitle;
		})
		.catch((error) => {
			console.error("There was a problem with the fetch operation:", error);
		});
}

entryNameSelect.addEventListener("change", async () => {
	await fetchOrgData(entryNameSelect.value);
	await getMapEntries(entryNameSelect.value);
	await getDirectoryEntries(entryNameSelect.value);
});

async function getDirectoryEntries(entryID) {
	fetch(
		`https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/getDirectoryEntries?entryID=${entryID}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: localStorage.authToken,
			},
		}
	)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then((data) => {
			fullData = data;
			loadDirectory(data);
		})
		.catch((error) => {
			console.error("There was a problem with your fetch operation:", error);
		});
}

async function getMapEntries(entryID) {
	fetch(
		`https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/getMapEntries?entryID=${entryID}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: localStorage.authToken,
			},
		}
	)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then((data) => {
			loadMap(data);
		})
		.catch((error) => {
			console.error("There was a problem with your fetch operation:", error);
		});
}

function loadDirectory(users) {
	let tableWrap = document.getElementById("table_wrap");
	tableWrap.innerHTML = ""; // Clear previous content
	document.getElementById("countInitial").textContent = users.length;

	// Sort users alphabetically by entryName
	users.sort((a, b) =>
		a.entryName.toLowerCase().localeCompare(b.entryName.toLowerCase())
	);

	// Create column headers if orgInfo filters are present
	let columnHeader1 = orgInfo.orgFilterOne
		? `
        <div role="columnheader" class="table4_column is-header-column">
            <a fs-cmssort-desc="is-desc" fs-cmssort-element="trigger" fs-cmssort-field="IDENTIFIER" fs-cmssort-asc="is-asc" href="#" class="table4_header-link w-inline-block">
                <div id="filterOneLabel" class="text-weight-semibold">${orgInfo.orgFilterOne}</div>
            </a>
        </div>`
		: "";

	let columnHeader2 = orgInfo.orgFilterTwo
		? `
        <div role="columnheader" class="table4_column is-header-column">
            <a fs-cmssort-desc="is-desc" fs-cmssort-element="trigger" fs-cmssort-field="IDENTIFIER" fs-cmssort-asc="is-asc" href="#" class="table4_header-link w-inline-block">
                <div id="filterTwoLabel" class="text-weight-semibold">${orgInfo.orgFilterTwo}</div>
            </a>
        </div>`
		: "";

	// Create row header
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

	// Iterate through each user and create a row
	users.forEach((item) => {
		const name = item._user.name;
		const email = item._user.email;
		const { entryPhone, entryFilterOne, entryFilterTwo, entryName } = item;

		// Create user filter inserts if orgInfo filters are present
		let userFilterInsert1 = orgInfo.orgFilterOne
			? `
            <div role="cell" class="table4_column">
                <div id="filterOneText" fs-cmsfilter-field="filterOne">
                    ${entryFilterOne || "Not Listed"}
                </div>
            </div>`
			: "";

		let userFilterInsert2 = orgInfo.orgFilterTwo
			? `
            <div role="cell" class="table4_column">
                <div id="filterTwoText" fs-cmsfilter-field="filterTwo">
                    ${entryFilterTwo || "Not Listed"}
                </div>
            </div>`
			: "";

		// Create HTML for the user row
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

		tableWrap.insertAdjacentHTML("beforeend", htmlInsert); // Append new content inside tableWrap
	});
}

function loadMap(users) {
	if (map) {
		map.eachLayer(function (layer) {
			if (layer !== map) {
				map.removeLayer(layer);
			}
		});
	} else {
		map = L.map("map");
	}

	map.setView([orgLat, orgLng], 13); // Recenter the map

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

	const layer = L.marker([orgLat, orgLng], {
		icon: schoolIcon,
	}).addTo(map);
	layer.bindPopup(`This is ${orgTitle}!`).openPopup();

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
		let childInsert =
			orgInfo.includeChild && childName
				? `<b>Student:</b> ${entryName}<br>`
				: "";

		let popUpInsert = `
            <div><b>Family:</b> ${name}<div>
            <div>${childInsert}</div>
            <div class="spacer-xxsmall"></div>
            <div>${emailInsert}</div>
            <div>${phoneInsert}</div>
            
            <div class="spacer-xxsmall"></div>
            <div><b>Preference:</b><br> ${entryPreference}</div>`;

		newMarker.addTo(map).bindPopup(popUpInsert);
	});
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

	// Close the document to ensure the content is fully loaded before printing
	printWindow.document.close();

	// Wait for the content to be fully loaded and then call the print function
	printWindow.onload = function () {
		printWindow.print();
		printWindow.close();
	};
}
