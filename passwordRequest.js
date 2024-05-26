console.log("Hi");
document
	.getElementById("emailForm")
	.addEventListener("submit", function (event) {
		event.preventDefault();

		const email1 = document.getElementById("email1").value;
		const email2 = document.getElementById("email2").value;

		if (email1 !== email2) {
			alert("Emails do not match.");
			return;
		}
		console.log(email1);

		fetch(
			`https://x8ki-letl-twmt.n7.xano.io/api:pzfh3age/auth/magic-link?email=${email1}`,
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
				console.log(data);
				document.getElementById("email1").value = "";
				document.getElementById("email2").value = "";

				let textElement = document.getElementById("successText");
				textElement.style.opacity = 1; // Display the text
				setTimeout(function () {
					textElement.style.opacity = 0; // Hide the text after 5 seconds
				}, 3000); // 5000 milliseconds = 5 seconds
			})
			.catch((error) => console.error("Error:", error));
	});
