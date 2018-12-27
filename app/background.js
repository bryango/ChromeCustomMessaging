
// Initial variables
var port = null;
var hostName = "com.google.chrome.custom.messaging";
var webui = 'main.html'

// Logging functions
function appendMessage(text) {
    console.log(text);
}

function updateUiState() {}

function onNativeMessage(message) {}

// Communications
function sendNativeMessage(message) {
    if (typeof message === "undefined") {
        if (typeof document.getElementById('input-text') !== "undefined") {
            message = {
                "text": document.getElementById('input-text').value
            };
        } else {
            console.log('Fail to send message: no input');
            return;
        }
    }
    port.postMessage(message);
    appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function onDisconnected() {
    appendMessage("Failed to connect: " + chrome.runtime.lastError.message);
    port = null;
    updateUiState();
}

function connect(init_msg, msg_dict = {}) {
    appendMessage("Connecting to native messaging host <b>" + hostName + "</b>");
    port = chrome.runtime.connectNative(hostName);

    msg_dict["init"] = init_msg;
    sendNativeMessage(msg_dict);

    port.onMessage.addListener(onNativeMessage);
    port.onDisconnect.addListener(onDisconnected);
    updateUiState();
}


// Background process
if (!document.URL.includes(webui)) {

    // Extension startup
    var events = [
        chrome.runtime.onStartup,
        chrome.runtime.onInstalled
    ];
    events.forEach(function(event) {
        event.addListener(function() {
            connect('trigger', {"stat": "startup"});
            console.log('Connection Initiated');
        });
    });

    // Open webui (usually for debugging)
    chrome.browserAction.onClicked.addListener(function(activeTab) {
        var newURL = "./" + webui;
        chrome.tabs.create({
            url: newURL
        });
    });

    // Background monitoring
    chrome.tabs.onUpdated.addListener(function(tabId, info) {
        if (info.status === 'complete') {
            chrome.tabs.query({
                'active': true,
                'lastFocusedWindow': true
            }, function(tabs) {
                tabsAction(tabs);
            });
        }
    });

}
