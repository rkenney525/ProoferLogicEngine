chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('proofer.html', {
    'bounds': {
      'width': 1280,
      'height': 720
    }
  });
});