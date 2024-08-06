if (localStorage.authToken) {
	getUserInfo();
} else {
	getMagicToken();
}

let user;

// Function to handle URL change
function getMagicToken() {
	const magicToken = extractTokenFromURL();
	if (magicToken) {
		performFetch(magicToken);
	} else {
		window.location.href = "/password-request";
	}
}

function extractTokenFromURL() {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get("token");
}

function performFetch(magicToken) {
	fetch("https://x8ki-letl-twmt.n7.xano.io/api:pzfh3age/auth/magic-login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			magic_token: magicToken,
		}),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then((data) => {
			const authToken = data;
			localStorage.setItem("authToken", authToken);
			location.reload();
		})
		.catch((error) => {
			// Handle error here
		});
}

async function getUserInfo() {
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
			// Do something with the response data
			user = data;
			document.getElementById("emailReset").value = user.email;
		})
		.catch((error) => {
			console.error("There was a problem with the fetch operation:", error);
		});
}

document
	.getElementById("userForm")
	.addEventListener("submit", function (event) {
		event.preventDefault(); // Prevent the default form submission
		event.stopPropagation();

		let password = document.getElementById("passwordReset1").value;

		const formData = {
			email: user.email,
			password: password,
			user_id: user.id,
		};

		fetch(`https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/user/${user.id}/pw`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: localStorage.authToken,
			},
			body: JSON.stringify(formData),
		})
			.then((response) => {
				if (!response.ok) {
					return response.json().then((errorData) => {
						// Display server error message, if available
						console.error("Server Error:", errorData);
						throw new Error("Network response was not ok");
					});
				}
				return response.json();
			})
			.then((data) => {
				document.getElementById("pw-update-text").style.opacity = 1;
				setTimeout(() => {
					document.getElementById("pw-update-text").style.opacity = 0;
				}, 2000);
				window.location.href = "/connect";
			})
			.catch((error) => {
				console.error("There was a problem with the fetch operation:", error);
			});
	});
