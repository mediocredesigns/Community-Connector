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
			console.log("data", data); // Do something with the response data
			let orgFilter = data.UserOrgName;

			data._organization.orgFilterOne
				? (document.getElementById("filterOneLabel").innerText =
						data._organization.orgFilterOne)
				: document.getElementById("filterOneLabel").classList.add("hide");

			data._organization.orgFilterTwo
				? (document.getElementById("filterTwoLabel").innerText =
						data._organization.orgFilterTwo)
				: document.getElementById("filterTwoLabel").classList.add("hide");

			let orgTitle = data._organization.OrgName;
			orgTitle = orgTitle[0].toUpperCase() + orgTitle.slice(1);
			document.getElementById("orgTitle").innerText = orgTitle;
			// console.log(orgLat, orgLng);
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

	users.forEach((item) => {
		const { name, email, phone, preference, userFilterOne, userFilterTwo } =
			item;

		let htmlInsert = `<div role="row" class="table4_item">
                    <div role="cell" class="table4_column is-width-large">
                        <div
                            id="nameText"
                            fs-cmsfilter-field="name"
                            class="text-weight-medium">
                            ${name}
                        </div>
                    </div>
                    <div role="cell" class="table4_column is-width-large">
                        <div id="emailText">
                            ${email ? email : "Not Listed"}
                        </div>
                    </div>
                    <div role="cell" class="table4_column is-width-medium">
                        <div id="phoneText">
                            ${phone ? phone : "Not Listed"}
                        </div>
                    </div>
                    <div role="cell" class="table4_column is-width-medium">
                        <div id="filterOneText" fs-cmsfilter-field="filterOne">
                            ${userFilterOne ? userFilterOne : "Not Listed"}
                        </div>
                    </div>
                    <div role="cell" class="table4_column is-width-medium">
                        <div
                            id="filterTwoText"
                            fs-cmsfilter-field="filterOne"
                            fs-cmssort-type="date">
                            ${userFilterTwo ? userFilterTwo : "Not Listed"}
                        </div>
                    </div>
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
	const filterValue = filterInput.value;
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
	const myProfile_button = document.getElementById("my-profile_button");
	const map_button = document.getElementById("map_button");
	const directory_button = document.getElementById("directory_button");

	signUp_button.classList.toggle("hide");
	logIn_button.classList.toggle("hide");
	myProfile_button.classList.toggle("hide");
	map_button.classList.toggle("hide");
	directory_button.classList.toggle("hide");
}
