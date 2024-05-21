export function fetchData() {
	let jsonData = [];

	let cmsData = document.querySelectorAll('[data-map="map"]');
	console.log(cmsData);
	cmsData.forEach((card) => {
		const json = JSON.parse(card.innerHTML);
		jsonData.push(json);
	});
	jsonData.forEach((item) => {
		console.log(item);

		const { name, contact, lat, lng, preference } = item;
		const newMaker = L.marker([lat, lng], {
			title: name,
			riseOnHover: true,
		}).addTo(map);
		newMaker
			.addTo(map)
			.bindPopup(
				`<b>Family:</b> ${name}<br><b>Contact:</b> ${contact}<br><br><b>Preference:</b><br> ${preference}`
			);
	});
}

// const endpointUrl = "https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/user";

// fetch(endpointUrl, {
// 	method: "GET",
// 	headers: {
// 		// Authorization: `Bearer ${secretApiKey}`,
// 		"Content-Type": "application/json",
// 	},
// })
// 	.then((response) => {
// 		if (!response.ok) {
// 			throw new Error("Network response was not ok");
// 		}
// 		return response.json();
// 	})
// 	.then((data) => {
// 		const filteredData = data.filter((item) => item.school === orgName);
// 		console.log(filteredData);
// 		return filteredData;
// 	})
// 	.then((items) => {
// 		items.forEach((item) => {
// 			// console.log(item.fields);
// 			//   console.log(Lat, Lng);
// 			const { name, contact, lat, lng, preference } = item;
// 			const newMaker = L.marker([lat, lng], {
// 				title: name,
// 				riseOnHover: true,
// 			}).addTo(map);
// 			newMaker
// 				.addTo(map)
// 				.bindPopup(
// 					`<b>Family:</b> ${name}<br><b>Contact:</b> ${contact}<br><br><b>Preference:</b><br> ${preference}`
// 				);
// 		});
// 	})
// 	.catch((error) => {
// 		console.error("Error fetching data from Airtable:", error);
// 	});
