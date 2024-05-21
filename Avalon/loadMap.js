export function loadMap() {
	const orglat = document.querySelector("#org-lat").innerHTML;
	const orglng = document.querySelector("#org-lng").innerHTML;
	const orgName = document.querySelector("#org-name").innerHTML;

	console.log(orglat, orglng, orgName);
	//   const devBtn = document.querySelector('#devBtn');
	//   const subBtn = document.querySelector('#subBtn');
	//   const devText = document.querySelector('#devText');
	//   const latForm = document.querySelector('#lat');
	//   const lngForm = document.querySelector('#lng');

	///////////////////////////////////////////////////////
	const map = L.map("map").setView([orglat, orglng], 12);

	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution:
			'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	}).addTo(map);
	// L.Control.geocoder().addTo(map);

	const schoolIcon = L.icon({
		iconUrl:
			"https://img.icons8.com/fluency-systems-filled/512/school-building.png",
		iconSize: [30, 30],
		iconAnchor: [15, 15],
	});

	const layer = L.marker([orglat, orglng], {
		icon: schoolIcon,
	}).addTo(map);
	layer.bindPopup(`This is ${orgName}`).openPopup();

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
