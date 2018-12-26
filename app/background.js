var port = null;
var hostName = "com.google.chrome.custom.messaging";

function appendMessage(text) {}

function updateUiState() {}

function onNativeMessage(message) {}

function sendNativeMessage() {
    message = {
        "text": document.getElementById('input-text').value
    };
    port.postMessage(message);
    appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function onDisconnected() {
    appendMessage("Failed to connect: " + chrome.runtime.lastError.message);
    port = null;
    updateUiState();
}

function connect() {
    appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
    port = chrome.runtime.connectNative(hostName);
    port.onMessage.addListener(onNativeMessage);
    port.onDisconnect.addListener(onDisconnected);
    updateUiState();
}

if (chrome.runtime) {
    var events = [
        chrome.runtime.onStartup,
        chrome.runtime.onInstalled
    ];
    events.forEach(function(event) {
        event.addListener(function() {
            connect();
            console.log('Connection Initiated');
        });
    });
    // chrome.runtime.onStartup.addListener(function() {
    //     connect();
    // });
}

if (chrome.browserAction) {
    chrome.browserAction.onClicked.addListener(function(activeTab) {
        var newURL = "./main.html";
        chrome.tabs.create({
            url: newURL
        });
    });
}
