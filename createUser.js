document.addEventListener("DOMContentLoaded", function () {
	document
		.getElementById("userForm")
		.addEventListener("submit", function (event) {
			event.preventDefault(); // Prevent default form submission

			// Get form data
			const formData = {
				name: document.getElementById("name").value,
				email: document.getElementById("email").value,
				password: document.getElementById("password").value,
				school: document.getElementById("school").value,
				schoolKey: document.getElementById("schoolKey").value,
			};

			// Send request to Xano backend to verify school and school key
			fetch("https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					operation: "verifySchool",
					parameters: formData,
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.valid) {
						// School and school key are valid, proceed to create user
						createUser(formData);
					} else {
						// School and school key are not valid, display error message
						alert("Invalid school or school key");
					}
				})
				.catch((error) => {
					console.error("Error:", error);
				});
		});

	// Function to create user in Xano database
	function createUser(userData) {
		fetch("YOUR_XANO_API_ENDPOINT", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				operation: "createUser",
				parameters: userData,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("User created successfully:", data);
				// Optionally, redirect to a success page or display a success message
			})
			.catch((error) => {
				console.error("Error:", error);
				// Display error message if user creation fails
			});
	}
});
