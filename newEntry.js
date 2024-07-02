if (localStorage.authToken) {
	sendToXano();
} else {
	alert("You must be logged in to access this page");
	window.location.href = "/";
}

let user;

async function fetchOrganization() {
	try {
		const response = await fetch(
			"https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/getAllOrgs",
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
		return data;
	} catch (error) {
		console.error("There was a problem with the fetch operation:", error);
	}
}

async function populateSelect() {
	const data = await fetchOrganization();
	if (data) {
		// Sort the data alphabetically by OrgName
		data.sort((a, b) => a.OrgName.localeCompare(b.OrgName));

		const selectElement = document.getElementById("school");
		data.forEach((org) => {
			const option = document.createElement("option");
			option.value = org.OrgName;
			option.textContent = org.OrgName;
			selectElement.appendChild(option);
		});
	}
}

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
		updateForm(data);
		populateSelect();

		// updateProfile(data);
	} catch (error) {
		console.error("There was a problem with the fetch operation:", error);
	}
}

function updateForm(user) {
	document.getElementById("nameSU").value = user.name;
	document.getElementById("emailSU").value = user.email;
}

document
	.getElementById("userForm")
	.addEventListener("submit", function (event) {
		event.preventDefault(); // Prevent the default form submission

		let warningModal = document.getElementById("warning-modal");
		let warningText = document.getElementById("warning-text");

		const formData = {
			name: document.getElementById("nameSU").value,
			entryName: document.getElementById("entryName").value,
			email: document.getElementById("emailSU").value,
			orgName: document.getElementById("school").value,
			orgKey: document.getElementById("schoolKey").value,
		};

		fetch("https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/auth/signup_entry", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: localStorage.authToken,
			},
			body: JSON.stringify(formData),
		})
			.then((response) => {
				if (response.ok) {
					console.log(response);
					return response.json();
				} else {
					return response.json().then((errorData) => {
						warningText.innerHTML = errorData.message;
						warningModal.style.display = "flex";

						// alert(errorData.message);
						throw new Error(errorData.message);
					});
				}
			})
			.then((data) => {
				if (!data) {
					warningText.innerHTML =
						"Passkey does not match organization.  Try again or contact your organization.";
					warningModal.style.display = "flex";
				} else {
					// const xanoResponse = data;
					// console.log("xanoResponse", xanoResponse);

					document.getElementById("userForm").reset();
					window.location.href = "/my-profile";
				}
			})
			.catch((error) => console.error("Error:", error));
	});
