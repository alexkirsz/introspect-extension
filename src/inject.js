const script = document.createElement("script");
script.id = "introspectScript";
script.src = chrome.extension.getURL("lib/hook.js") + "?" + chrome.runtime.id;
script.async = false;
document.documentElement.appendChild(script);
