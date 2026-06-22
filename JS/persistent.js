/* NAVIGATION */
const navigation = document.createElement("nav");
const navFlexCenter = document.createElement("div");
navFlexCenter.classList.add("flex_center");

const navLinks = [
	{ text: "Home", href: "./index.html" },
	{ text: "About Us", href: "./about.html" },
	{ text: "Projects", href: "./projects.html" },
	{ text: "Contact", href: "./contact.html" }
];

navLinks.forEach(link => {
	const anchor = document.createElement("a");
	anchor.href = link.href;
	anchor.textContent = link.text;
	anchor.classList.add("text_slant", "hover_slant");
	navFlexCenter.appendChild(anchor);
});

navigation.appendChild(navFlexCenter);
document.body.insertBefore(navigation, document.body.firstChild);

/* FOOTER */
const footer = document.createElement("footer");
footer.classList.add("footer");

const flexCenter = document.createElement("div");
flexCenter.classList.add("flex_center");

const footerText = document.createElement("p");
footerText.textContent = "Copyright © 2026 Namespace Development. All rights reserved.";

flexCenter.appendChild(footerText);
footer.appendChild(flexCenter);

document.body.appendChild(footer);