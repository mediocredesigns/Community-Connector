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

function fetchUsersMap(orgFilter) {
	fetch(
		`https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/getUsersMap?orgName=${orgFilter}`,
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
			// console.log(data);
			loadMap(data);
		})
		.catch((error) => {
			console.error("There was a problem with the fetch operation:", error);
		});
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
		const newMaker = L.marker([lat, lng], {
			title: name,
			riseOnHover: true,
		}).addTo(map);

		let phoneInsert = phone ? `<b>Phone:</b> ${phone}<br>` : "";

		let emailInsert = email ? `<b>Email:</b> ${email}<br>` : "";

		popUpinsert = `<div><b>Family:</b> ${name}<div>
			<div class = "spacer-tiny"></div>
			<div>${emailInsert}</div>
			<div>${phoneInsert}<div>
			<div class = "spacer-tiny"></div>
			<div><b>Preference:</b><br> ${preference}</div>`;

		newMaker.addTo(map).bindPopup(popUpinsert);
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

function printTable() {
	var table = document.getElementById("table_wrap");
	var printWindow = window.open("", "", "height=600,width=800");
	printWindow.document.write("<html><head><title>Print Table</title>");
	printWindow.document.write("<style>");
	printWindow.document.write(
		".table4_list-wrapper { font-family: Arial, sans-serif; border-collapse: collapse; width: 100%; }"
	);
	printWindow.document.write(
		".table4_list-wrapper .table4_header-row, .table4_list-wrapper .table4_item { border: 1px solid #dddddd; padding: 8px; display: table-row; }"
	);
	printWindow.document.write(
		".table4_list-wrapper .table4_header-row { background-color: #f2f2f2; font-weight: bold; }"
	);
	printWindow.document.write(
		".table4_list-wrapper .table4_column { padding: 8px; text-align: left; display: table-cell; }"
	);
	printWindow.document.write("</style>");
	printWindow.document.write("</head><body>");
	for (var i = 0; i < table.rows.length; i++) {
		printWindow.document.write('<div class="table4_item">');
		for (var j = 0; j < table.rows[i].cells.length; j++) {
			printWindow.document.write(
				'<div class="table4_column">' +
					table.rows[i].cells[j].innerHTML +
					"</div>"
			);
		}
		printWindow.document.write("</div>");
	}
	printWindow.document.write("</body></html>");
	printWindow.document.close();
	printWindow.print();
}