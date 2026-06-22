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

	if(link.href == "./index.html" && window.location.href.endsWith("/") || window.location.href.includes((link.href).split("./").pop()))
	{
		anchor.removeAttribute("href");
		anchor.style.cursor = "default";
		anchor.classList.add("text_slant");
	}
	else
		anchor.classList.add("text_slant", "hover_slant");
	
	navFlexCenter.appendChild(anchor);
});

navigation.appendChild(navFlexCenter);
document.body.insertBefore(navigation, document.body.firstChild);

/* FOOTER */
const footer = document.createElement("footer");
footer.classList.add("footer");

const flexCenter = document.createElement("div");
flexCenter.classList.add("center_grid");

const footerText = document.createElement("p");
footerText.textContent = "Copyright © 2026 Namespace Development. All rights reserved.";

const pageInformation = document.createElement("div");
const updateText = document.createElement("p");
updateText.style.fontSize = "0.8rem";
updateText.style.marginTop = "0.5rem";

const pageVersion = document.createElement("p");
pageVersion.style.fontSize = "0.8rem";
pageVersion.style.marginTop = "0.5rem";

pageInformation.appendChild(updateText);
pageInformation.appendChild(pageVersion);

flexCenter.appendChild(footerText);
flexCenter.appendChild(pageInformation);
footer.appendChild(flexCenter);

document.body.appendChild(footer);

function SetFooterInformation(updateTime, version)
{
	updateText.textContent = "Last Updated:" + updateTime;
	pageVersion.textContent = "Page Version: " + version;
}