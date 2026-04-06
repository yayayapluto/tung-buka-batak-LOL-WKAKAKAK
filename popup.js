const CONFIGS = {
  chatgpt: "https://chatgpt.com/c/69d2ea01-62e4-8320-bdbf-600422e0d525",
  claude: "https://claude.ai/chat/48a699a3-9dbc-4832-9782-c13d4e287899",
  gemini: "https://gemini.google.com/app/73b2ab5244de041d",
  qwen: "https://chat.qwen.ai/c/bcf06bcc-8d3f-42fe-8e3b-72e438381361",
  grok: "https://grok.com/c/638d67de-9885-4a71-a47c-6a2a59e76393?rid=14fde69e-71cc-44ba-ad9b-d4f9a4313c7f",
  deepseek:
    "https://chat.deepseek.com/a/chat/s/7f835978-3b14-434f-b33e-cc2fcc5ceddb",
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
