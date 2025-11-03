const buttonPrice = document.getElementById("buttonPrice");
const targetSectionPrice = document.getElementById("targetSectionPrice");

const buttonMoreInformation = document.getElementById("buttonMoreInformation");
const targetInformation = document.getElementById("targetInformation");

const buttonCallAndEmail = document.getElementById("buttonCallAndEmail");
const targetCallAndEmail = document.getElementById("targetCallAndEmail");

buttonPrice.addEventListener("click", () => {
  targetSectionPrice.scrollIntoView({ behavior: "smooth" });
});
buttonMoreInformation.addEventListener("click", () => {
  targetInformation.scrollIntoView({ behavior: "smooth" });
});
buttonCallAndEmail.addEventListener("click", () => {
  targetCallAndEmail.scrollIntoView({ behavior: "smooth" });
});
