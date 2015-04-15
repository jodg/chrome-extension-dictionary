var disabled = true;

function updateIcon() {
    if (disabled) {
        disabled = false;
        chrome.browserAction.setIcon({path: {'38': 'dictionary_disable.png'}});
    } else {
        disabled = true;
        chrome.browserAction.setIcon({path: {'38': 'dictionary_enable.png'}});
    }
}

chrome.browserAction.onClicked.addListener(updateIcon);
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "xhttp") {
        var xhttp = new XMLHttpRequest();
        var method = 'GET';
        var url = 'http://dict-co.iciba.com/api/dictionary.php?type=json&w=' + request.data + '&key=A0E7185BDAF6A3F23B8C3FF0E194A99F';
        xhttp.onload = function () {
            sendResponse(xhttp.responseText);
        };
        xhttp.onerror = function () {
            sendResponse();
        };
        xhttp.open(method, url, true);
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhttp.send();
    } else if (request.action == "audio") {
        var myAudio = new Audio();        // create the audio object
        myAudio.src = request.data; // assign the audio file to it
        myAudio.play();                   // play the music
    } else if (request.action == "disabled") {
        sendResponse({disabled: disabled});
    }
    return true;
});