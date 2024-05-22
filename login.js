window.onload = function () {
	if (localStorage.authToken == null) {
		console.log("No user");
	} else {
		console.log("User Found");
		toggleButtons();
	}
};

document
	.getElementById("login-form")
	.addEventListener("submit", function (event) {
		event.preventDefault(); // Prevent the form from submitting normally

		// Get form data
		const formData = new FormData(event.target);
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;

		// Construct the request body
		const requestBody = {
			email: email,
			password: password,
		};

		console.log(requestBody);

		// Make the fetch request
		fetch("https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				const xanoResponse = data;
				const authToken = xanoResponse.authToken;
				localStorage.setItem("authToken", authToken);
				toggleButtons();
				document.getElementById("login-modal").style.display = "none";
			})
			.catch((error) => {
				let loginMessage = document.getElementById("login-message");
				loginMessage.innerHTML =
					'Forgot Password? <a href="/sign-up">Reset Password</a>';
				alert("That email and/or password does not match our records");
				console.error("There was a problem with the fetch operation:", error);
			});
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
