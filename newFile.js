document
	.getElementById("userForm")
	.addEventListener("submit", function (event) {
		event.preventDefault(); // Prevent the default form submission

		let warningModal = document.getElementById("warning-modal");
		let warningText = document.getElementById("warning-text");

		if (localStorage.authToken) {
			alert("A user is already logged in!");
			window.location.href = "/my-profile";
		}
		const formData = {
			name: document.getElementById("nameSU").value,
			email: document.getElementById("emailSU").value,
			password: document.getElementById("passwordSU").value,
			orgName: document.getElementById("school").value,
			orgKey: document.getElementById("schoolKey").value,

			// UserOrgName: document.getElementById("school").value,
		};

		fetch("https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/auth/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		})
			.then((response) => {
				if (response.ok) {
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
					const xanoResponse = data;
					// console.log("xanoResponse", xanoResponse);
					const authToken = xanoResponse.authToken;
					localStorage.setItem("authToken", authToken);
					document.getElementById("userForm").reset();
					window.location.href = "/my-profile";
				}
			})
			.catch((error) => console.error("Error:", error));
	});
