chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('proofer.html', {
    'bounds': {
      'width': 1026,
      'height': 768
    }
  });
});