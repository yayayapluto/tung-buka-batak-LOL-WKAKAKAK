const WINDOW_SIZE = { width: 200, height: 300 };
const trackedWindows = new Map(); // windowId -> url

chrome.windows.onRemoved.addListener((windowId) => {
  const url = trackedWindows.get(windowId);
  if (url) {
    chrome.history.deleteUrl({ url });
    trackedWindows.delete(windowId);
  }
});

async function openMini(url, position) {
  const windows = await chrome.windows.getAll({ windowTypes: ["popup"] });
  for (const win of windows) {
    const tabs = await chrome.tabs.query({ windowId: win.id });
    const match = tabs.find((t) => t.url?.startsWith(new URL(url).origin));
    if (match) {
      await chrome.windows.update(win.id, { focused: true });
      return;
    }
  }
  const { left, top } = await getSpawnPosition(position);
  const newWin = await chrome.windows.create({
    ...WINDOW_SIZE,
    type: "popup",
    url,
    left,
    top,
    focused: true,
  });
  await chrome.windows.update(newWin.id, { focused: true });
  trackedWindows.set(newWin.id, url);
}

async function getSpawnPosition(position) {
  try {
    const screen = await chrome.system.display.getInfo();
    const display = screen[0].workArea;
    const top = display.top + display.height - WINDOW_SIZE.height - 16;
    const left =
      position === "left"
        ? display.left + 16
        : display.left + display.width - WINDOW_SIZE.width - 16;
    return { left, top };
  } catch {
    const win = await chrome.windows.getCurrent();
    const top = Math.max(0, win.top + win.height - WINDOW_SIZE.height - 16);
    const left =
      position === "left"
        ? Math.max(0, win.left + 16)
        : Math.max(0, win.left + win.width - WINDOW_SIZE.width - 16);
    return { left, top };
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "openMini" && message.url && message.position) {
    openMini(message.url, message.position);
  }
});
