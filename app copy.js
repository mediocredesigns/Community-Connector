if (localStorage.authToken) {
	fetchUserData();
} else {
	alert("You must be logged in to access this page");
	window.location.href = "/";
}

let orgInfo;
let orgLat, orgLng, orgTitle;
let fullData;

async function fetchUserData() {
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
		orgInfo = data._organization;
		orgLat = data._organization.orgLat;
		orgLng = data._organization.orgLng;
		let orgFilter = data.UserOrgName;

		orgTitle = data._organization.OrgName.split(" ")
			.map((word) => word[0].toUpperCase() + word.slice(1))
			.join(" ");
		document.getElementById("orgTitle").innerText = orgTitle;

		fetchUsersDirectory(orgFilter);
		fetchUsersMap(orgFilter);
	} catch (error) {
		console.error("There was a problem with the fetch operation:", error);
		alert("Invalid Authorization");
		window.location.href = "/";
	}
}

async function fetchUsersDirectory(orgFilter) {
	try {
		const response = await fetch(
			`https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/getUsersDirectory?orgName=${orgFilter}`,
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
		fullData = data;
		loadDirectory(data);
	} catch (error) {
		console.error("There was a problem with the fetch operation:", error);
	}
}

async function fetchUsersMap(orgFilter) {
	try {
		const response = await fetch(
			`https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/getUsersMap?orgName=${orgFilter}`,
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
		loadMap(data);
	} catch (error) {
		console.error("There was a problem with the fetch operation:", error);
	}
}

function loadDirectory(users) {
	let tableWrap = document.getElementById("table_wrap");
	tableWrap.innerHTML = ""; // Clear previous content
	document.getElementById("countInitial").textContent = users.length;

	// Sort users alphabetically by name
	users.sort((a, b) => {
		if (a.name.toLowerCase() < b.name.toLowerCase()) {
			return -1;
		}
		if (a.name.toLowerCase() > b.name.toLowerCase()) {
			return 1;
		}
		return 0;
	});

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

	let rowHeader = `
        <div class="table4_header-row">
            <div role="columnheader" class="table4_column is-header-column">
                <a fs-cmssort-desc="is-desc" fs-cmssort-element="trigger" fs-cmssort-field="IDENTIFIER" fs-cmssort-asc="is-asc" href="#" class="table4_header-link w-inline-block">
                    <div class="text-weight-semibold">Name</div>
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
        </div>
    `;

	tableWrap.insertAdjacentHTML("beforeend", rowHeader);

	users.forEach((item) => {
		const { name, email, phone, userFilterOne, userFilterTwo } = item;

		let userFilterInsert1 = orgInfo.orgFilterOne
			? `
            <div role="cell" class="table4_column">
                <div id="filterOneText" fs-cmsfilter-field="filterOne">
                    ${userFilterOne ? userFilterOne : "Not Listed"}
                </div>
            </div>`
			: "";

		let userFilterInsert2 = orgInfo.orgFilterTwo
			? `
            <div role="cell" class="table4_column">
                <div id="filterTwoText" fs-cmsfilter-field="filterTwo">
                    ${userFilterTwo ? userFilterTwo : "Not Listed"}
                </div>
            </div>`
			: "";

		let htmlInsert = `
            <div role="row" class="table4_item">
                <div role="cell" class="table4_column">
                    <div id="nameText" fs-cmsfilter-field="name" class="text-weight-medium">
                        ${name}
                    </div>
                </div>
                <div role="cell" class="table4_column">
                    <div id="emailText">
                        ${email ? email : "Not Listed"}
                    </div>
                </div>
                <div role="cell" class="table4_column">
                    <div id="phoneText">
                        ${phone ? phone : "Not Listed"}
                    </div>
                </div>
                ${userFilterInsert1}
                ${userFilterInsert2}
            </div>`;

		tableWrap.insertAdjacentHTML("beforeend", htmlInsert); // Append new content inside tableWrap
	});
}

function loadMap(users) {
	const map = L.map("map").setView([orgLat, orgLng], 12);

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
		const { name, lat, lng, email, phone, preference } = item;
		const newMarker = L.marker([lat, lng], {
			title: name,
			riseOnHover: true,
		}).addTo(map);

		let phoneInsert = phone ? `<b>Phone:</b> ${phone}<br>` : "";
		let emailInsert = email ? `<b>Email:</b> ${email}<br>` : "";

		let popUpInsert = `
            <div><b>Family:</b> ${name}</div>
            <div class="spacer-tiny"></div>
            <div>${emailInsert}</div>
            <div>${phoneInsert}</div>
            <div class="spacer-tiny"></div>
            <div><b>Preference:</b><br> ${preference}</div>`;

		newMarker.bindPopup(popUpInsert);
	});
}

const searchForm = document.getElementById("search-form");
const filterInput = document.getElementById("searchBox");

searchForm.addEventListener("submit", function (e) {
	e.preventDefault();
});

filterInput.addEventListener("input", function () {
	const filterValue = filterInput.value.toLowerCase();
	const filteredData = fullData.filter(
		(item) =>
			item.name.toLowerCase().includes(filterValue) ||
			(item.email && item.email.toLowerCase().includes(filterValue)) ||
			(item.userFilterOne &&
				item.userFilterOne.toLowerCase().includes(filterValue)) ||
			(item.userFilterTwo &&
				item.userFilterTwo.toLowerCase().includes(filterValue))
	);

	loadDirectory(filteredData);
});

document.getElementById("printButton").addEventListener("click", function () {
	var divToPrint = document.getElementById("table_wrap");
	var newWin = window.open("");
	newWin.document.write("<html><head><title>Print Table</title>");
	newWin.document.write(
		"<style>table { width: 100%; border-collapse: collapse; } table, th, td { border: 1px solid black; } th, td { padding: 8px; text-align: left; } th { background-color: #f2f2f2; }</style>"
	);
	newWin.document.write("</head><body>");
	newWin.document.write(divToPrint.outerHTML);
	newWin.document.write("</body></html>");
	newWin.document.close();
	newWin.print();
	newWin.close();
});
