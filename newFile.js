document
	.getElementById("userForm")
	.addEventListener("submit", function (event) {
		event.preventDefault(); // Prevent the default form submission
		if (localStorage.authToken) {
			alert("A user is already logged in!");
			window.location.href = "/my-profile";
		}
		const formData = {
			name: document.getElementById("name").value,
			email: document.getElementById("email").value,
			password: document.getElementById("password").value,
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
				console.log("response", response);
				if (response.ok) {
					return response.json();
				} else {
					alert(
						"Request not completed - make sure password has both letters and numbers."
					);
					throw new Error("Something went wrong with the request.");
				}
			})
			.then((data) => {
				if (!data) {
					console.log("NULL DATA");
					alert("Organization and/or Passkey are incorrect");
				} else {
					const xanoResponse = data;
					console.log("xanoResponse", xanoResponse);
					const authToken = xanoResponse.authToken;
					localStorage.setItem("authToken", authToken);
					document.getElementById("userForm").reset();
					window.location.href = "/my-profile";
				}
			})
			.catch((error) => console.error("Error:", error));
	});
