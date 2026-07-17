const STORAGE_KEY = "custom-portfolio-config";

const defaultConfig = {
  name: "Your Name",
  title: "Creative Developer",
  bio: "I create thoughtful web experiences that feel modern, useful, and memorable.",
  websiteUrl: "https://yourwebsite.com",
  imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
  primaryColor: "#4f46e5",
  accentColor: "#f59e0b",
  backgroundColor: "#0f172a",
  imageData: ""
};

const form = document.getElementById("portfolioForm");
const nameInput = document.getElementById("nameInput");
const titleInput = document.getElementById("titleInput");
const bioInput = document.getElementById("bioInput");
const websiteInput = document.getElementById("websiteInput");
const imageUrlInput = document.getElementById("imageUrlInput");
const imageUpload = document.getElementById("imageUpload");
const primaryColorInput = document.getElementById("primaryColorInput");
const accentColorInput = document.getElementById("accentColorInput");
const backgroundColorInput = document.getElementById("backgroundColorInput");
const resetButton = document.getElementById("resetButton");
const displayName = document.getElementById("displayName");
const displayTitle = document.getElementById("displayTitle");
const displayBio = document.getElementById("displayBio");
const websiteButton = document.getElementById("websiteButton");
const profileImage = document.getElementById("profileImage");

function getStoredConfig() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultConfig, ...JSON.parse(stored) } : { ...defaultConfig };
  } catch {
    return { ...defaultConfig };
  }
}

function saveConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

function populateForm(config) {
  nameInput.value = config.name;
  titleInput.value = config.title;
  bioInput.value = config.bio;
  websiteInput.value = config.websiteUrl;
  imageUrlInput.value = config.imageUrl;
  primaryColorInput.value = config.primaryColor;
  accentColorInput.value = config.accentColor;
  backgroundColorInput.value = config.backgroundColor;
}

function renderConfig(config) {
  displayName.textContent = config.name;
  displayTitle.textContent = config.title;
  displayBio.textContent = config.bio;
  websiteButton.href = config.websiteUrl || "#";
  websiteButton.textContent = config.websiteUrl ? "Visit my website" : "Add a website link";

  if (config.imageData) {
    profileImage.src = config.imageData;
  } else if (config.imageUrl) {
    profileImage.src = config.imageUrl;
  }

  document.documentElement.style.setProperty("--primary-color", config.primaryColor);
  document.documentElement.style.setProperty("--accent-color", config.accentColor);
  document.documentElement.style.setProperty("--background-color", config.backgroundColor);
}

function collectFormValues() {
  return {
    name: nameInput.value.trim() || defaultConfig.name,
    title: titleInput.value.trim() || defaultConfig.title,
    bio: bioInput.value.trim() || defaultConfig.bio,
    websiteUrl: websiteInput.value.trim() || defaultConfig.websiteUrl,
    imageUrl: imageUrlInput.value.trim() || defaultConfig.imageUrl,
    primaryColor: primaryColorInput.value || defaultConfig.primaryColor,
    accentColor: accentColorInput.value || defaultConfig.accentColor,
    backgroundColor: backgroundColorInput.value || defaultConfig.backgroundColor,
    imageData: profileImage.src.startsWith("data:image") ? profileImage.src : ""
  };
}

function applyAndSave() {
  const config = collectFormValues();
  renderConfig(config);
  saveConfig(config);
}

form.addEventListener("input", applyAndSave);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  applyAndSave();
});

imageUpload.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result;
    if (typeof dataUrl === "string") {
      profileImage.src = dataUrl;
      const config = collectFormValues();
      config.imageData = dataUrl;
      saveConfig(config);
      renderConfig(config);
    }
  };
  reader.readAsDataURL(file);
});

resetButton.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  const resetConfig = { ...defaultConfig };
  populateForm(resetConfig);
  renderConfig(resetConfig);
});

const initialConfig = getStoredConfig();
populateForm(initialConfig);
renderConfig(initialConfig);
