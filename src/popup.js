const CONFIGS = {
  chatgpt: process.env.URL_CHATGPT,
  claude: process.env.URL_CLAUDE,
  gemini: process.env.URL_GEMINI,
  qwen: process.env.URL_QWEN,
  grok: process.env.URL_GROK,
  deepseek: process.env.URL_DEEPSEEK,
};

let position = "right";

document.getElementById("posLeft").addEventListener("click", () => {
  position = "left";
  document.getElementById("posLeft").classList.add("active");
  document.getElementById("posRight").classList.remove("active");
});

document.getElementById("posRight").addEventListener("click", () => {
  position = "right";
  document.getElementById("posRight").classList.add("active");
  document.getElementById("posLeft").classList.remove("active");
});

function open(url) {
  chrome.runtime.sendMessage({ action: "openMini", url, position });
  window.close();
}

Object.entries(CONFIGS).forEach(([key, url]) => {
  document
    .getElementById(`btn-${key}`)
    .addEventListener("click", () => open(url));
});
