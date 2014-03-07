function closeWindow() {
    // TODO closeWindow() doesnt work in chrome app
    //if (chrome.app.window != null) {
        chrome.app.window.close();
        window.close();
    //} else {
    //    window.open('', '_self', '');
    //    window.close();
    //}
}