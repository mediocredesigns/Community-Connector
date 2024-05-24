window.onload = function () {
	if (localStorage.authToken == null) {
		alert("You are not logged in");
		window.location.href = "/";
	} else {
		console.log(localStorage.authToken);
		toggleButtons();
		getUser();
	}
};

let orgInfo;

async function getUser() {
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
			orgInfo = data._organization;
			let orgFilter = data.UserOrgName;

			// data._organization.orgFilterOne
			// 	? (document.getElementById("filterOneLabel").innerText =
			// 			data._organization.orgFilterOne)
			// 	: document.getElementById("filterOneLabel").classList.add("hide");

			// data._organization.orgFilterTwo
			// 	? (document.getElementById("filterTwoLabel").innerText =
			// 			data._organization.orgFilterTwo)
			// 	: document.getElementById("filterTwoLabel").classList.add("hide");

			let orgTitle = data._organization.OrgName;
			orgTitle = orgTitle
				.split(" ")
				.map((word) => word[0].toUpperCase() + word.slice(1))
				.join(" ");
			document.getElementById("orgTitle").innerText = orgTitle;

			// // console.log(orgLat, orgLng);
			getUsers(orgFilter);
		})
		.catch((error) => {
			console.error("There was a problem with the fetch operation:", error);
		});
}

let fullData;

// Replace 'yourOrgName' with the actual orgName
function getUsers(orgFilter) {
	fetch(
		`https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/getUsersDirectory?orgName=${orgFilter}`,
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

	// data._organization.orgFilterTwo
	// 				? (document.getElementById("filterTwoLabel").innerText =
	// 						data._organization.orgFilterTwo)

	let columnHeader1 = `<div role="columnheader" class="table4_column is-header-column">
		<a
			fs-cmssort-desc="is-desc"
			fs-cmssort-element="trigger"
			fs-cmssort-field="IDENTIFIER"
			fs-cmssort-asc="is-asc"
			href="#"
			class="table4_header-link w-inline-block"
			><div id="filterOneLabel" class="text-weight-semibold">${orgInfo.orgFilterOne}</div></a
		>
		</div>`;

	let columnHeader2 = `
		<div role="columnheader" class="table4_column is-header-column">
		<a
			fs-cmssort-desc="is-desc"
			fs-cmssort-element="trigger"
			fs-cmssort-field="IDENTIFIER"
			fs-cmssort-asc="is-asc"
			href="#"
			class="table4_header-link w-inline-block"
			><div id="filterOneLabel" class="text-weight-semibold">${orgInfo.orgFilterTwo}</div></a
		>
		</div>`;

	let rowHeader = `
	<div class="table4_header-row">
	<div role="columnheader" class="table4_column is-header-column">
		<a
			fs-cmssort-desc="is-desc"
			fs-cmssort-element="trigger"
			fs-cmssort-field="IDENTIFIER"
			fs-cmssort-asc="is-asc"
			href="#"
			class="table4_header-link w-inline-block"
			><div class="text-weight-semibold">Name</div></a
		>
	</div>
	<div role="columnheader" class="table4_column is-header-column">
		<a
			fs-cmssort-desc="is-desc"
			fs-cmssort-element="trigger"
			fs-cmssort-field="IDENTIFIER"
			fs-cmssort-asc="is-asc"
			href="#"
			class="table4_header-link w-inline-block"
			><div class="text-weight-semibold">Email</div></a>
	</div>
	<div role="columnheader" class="table4_column is-header-column">
		<a
			fs-cmssort-desc="is-desc"
			fs-cmssort-element="trigger"
			fs-cmssort-field="IDENTIFIER"
			fs-cmssort-asc="is-asc"
			href="#"
			class="table4_header-link w-inline-block"
			><div class="text-weight-semibold">Phone</div></a>
	</div>
${orgInfo.orgFilterOne ? columnHeader1 : ""}
${orgInfo.orgFilterTwo ? columnHeader2 : ""}
</div>
	`;

	tableWrap.insertAdjacentHTML("beforeend", rowHeader);

	users.forEach((item) => {
		const { name, email, phone, preference, userFilterOne, userFilterTwo } =
			item;

		let userFilterInsert1 = `<div role="cell" class="table4_column">
                   		<div id="filterOneText" fs-cmsfilter-field="filterOne">
                   		 ${userFilterOne ? userFilterOne : "Not Listed"}
                   		 </div>
					</div>`;

		let userFilterInsert2 = `<div role="cell" class="table4_column">
                    	<div id="filterOneText" fs-cmsfilter-field="filterOne">
                    	${userFilterTwo ? userFilterTwo : "Not Listed"}
                   		</div>
					</div>`;

		let htmlInsert = `<div role="row" class="table4_item">
                    <div role="cell" class="table4_column">
                        <div
                            id="nameText"
                            fs-cmsfilter-field="name"
                            class="text-weight-medium">
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
                    ${orgInfo.orgFilterOne ? userFilterInsert1 : ""}
                    ${orgInfo.orgFilterTwo ? userFilterInsert2 : ""}
                </div>`;

		tableWrap.insertAdjacentHTML("beforeend", htmlInsert); // Append new content inside tableWrap
	});
}

const searchForm = document.getElementById("search-form");
const filterInput = document.getElementById("searchBox");

searchForm.addEventListener("submit", function (e) {
	e.preventDefault();
});

filterInput.addEventListener("input", function () {
	let filteredData = [];
	const filterValue = filterInput.value.toLowerCase();
	filteredData = fullData.filter(
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

function toggleButtons() {
	const signUp_button = document.getElementById("sign-up_button");
	const logIn_button = document.getElementById("log-in_button");
	const logIn_buttonMobile = document.getElementById("log-in_button-mobile");

	const myProfile_button = document.getElementById("my-profile_button");
	const map_button = document.getElementById("map_button");
	const directory_button = document.getElementById("directory_button");

	signUp_button.classList.toggle("hide");
	logIn_button.classList.toggle("hide");
	myProfile_button.classList.toggle("hide");
	map_button.classList.toggle("hide");
	directory_button.classList.toggle("hide");
	logIn_buttonMobile.classList.toggle("hide");
}
