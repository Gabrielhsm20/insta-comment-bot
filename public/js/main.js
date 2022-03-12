function execFunction(func, params) {
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { func, params: params });
    });
}

function addComments() {
    const startButton = document.querySelector("#start");

    startButton.setAttribute('disabled', true);

    let listComments = document.querySelector('#listComments');
    let intervalBetweenComments = document.querySelector('#intervalBetweenComments');
    let intervalGroupComments = document.querySelector('#intervalGroupComments');
    let groupOfComments = document.querySelector('#groupOfComments');

    let retorno = execFunction('addComments', {
        listComments: listComments.value,
        intervalBetweenComments: intervalBetweenComments.value,
        intervalGroupComments: intervalGroupComments.value,
        groupOfComments: groupOfComments.value
    });

    if(!retorno) startButton.setAttribute('disabled', false);
}

window.onload = function () {
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        chrome.tabs.executeScript(tabs[0].id, { file: 'public/js/functions.js' });
    });

    document.querySelector("#start").onclick = () => addComments();
}