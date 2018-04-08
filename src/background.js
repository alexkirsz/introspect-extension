chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    fetch(types[request.type], {
      method: "POST",
      body: JSON.stringify(request.data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => sendResponse(res));
    return true;
  }
);
