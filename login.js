window.onload = function () {
	if (localStorage.authToken == null) {
		console.log("No user found");
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
					let loginMessage = document.getElementById("login-message");
					loginMessage.innerHTML = `Forgot Password? <a href="/password-request">Reset Password</a>`;
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				const xanoResponse = data;
				const authToken = xanoResponse.authToken;
				localStorage.setItem("authToken", authToken);
				toggleButtons();
				document.getElementById("login-modal-mobile").style.display = "none";
				document.getElementById("login-modal").style.display = "none";
			})
			.catch((error) => {
				alert("That email and/or password does not match our records");
				console.error("There was a problem with the fetch operation:", error);
			});
	});

document
	.getElementById("login-form-mobile")
	.addEventListener("submit", function (event) {
		event.preventDefault(); // Prevent the form from submitting normally

		// Get form data
		const formData = new FormData(event.target);
		const email = document.getElementById("email-mobile").value;
		const password = document.getElementById("password-mobile").value;

		// Construct the request body
		const requestBody = {
			email: email,
			password: password,
		};

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
					let loginMessage = document.getElementById("login-message-mobile");
					loginMessage.innerHTML = `Forgot Password? <a href="/password-request">Reset Password</a>`;
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				const xanoResponse = data;
				const authToken = xanoResponse.authToken;
				localStorage.setItem("authToken", authToken);
				toggleButtons();
				document.getElementById("login-modal-mobile").style.display = "none";
				document.getElementById("login-modal").style.display = "none";
			})
			.catch((error) => {
				alert("That email and/or password does not match our records");
				console.error("There was a problem with the fetch operation:", error);
			});
	});

let logOutBtnMenu = document.getElementById("log-out-menu");

logOutBtnMenu.addEventListener("click", () => {
	localStorage.clear();
	alert("You are not logged in");
	window.location.href = "/";
});

function toggleButtons() {
	const signUp_button = document.getElementById("sign-up_button");
	const logIn_button = document.getElementById("log-in_button");
	const logIn_buttonMobile = document.getElementById("log-in_button-mobile");

	const myProfile_button = document.getElementById("my-profile_button");
	const app_button = document.getElementById("app_button");

	const footerLogIn = document.getElementById("footer-log-in");
	const footerApp = document.getElementById("footer-app");

	logOutBtnMenu.classList.toggle("hide");
	signUp_button.classList.toggle("hide");
	logIn_button.classList.toggle("hide");
	myProfile_button.classList.toggle("hide");
	app_button.classList.toggle("hide");
	logIn_buttonMobile.classList.toggle("hide");
	footerLogIn.classList.toggle("hide");
	footerApp.classList.toggle("hide");
}
