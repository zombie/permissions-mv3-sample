chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("page.html")
  });
});

chrome.scripting.registerContentScripts([
  {
    id: "a-style",
    css: ["border.css"],
    matches: ["<all_urls>"],
  },
]);