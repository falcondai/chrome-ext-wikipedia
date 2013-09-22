chrome.runtime.onInstalled.addListener(function (details) {
  console.log('installed:', details);
  chrome.storage.local.get(['link', 'zoom', 'snippet', 'zoomLevel'], function(items) {
    chrome.storage.local.set({
      link: items.link || 'on',
      zoom: items.zoom || 'on',
      zoomLevel: items.zoomLevel || 2,
      snippet: items.snippet || 'on',
    });
  });

  if (details.reason == 'update') {
    var notification = webkitNotifications.createNotification(
      '/assets/image/icon.png', 
      'Wikipedia Plus is updated',
      'click to visit the new options page'
    );
    notification.onclick = function () {
      chrome.tabs.create({
	url: chrome.extension.getURL('/options.html')
      });
      this.cancel();
    };
    notification.show();
    
    // minor update message
    // setTimeout(function () {
    //   notification.cancel();
    // }, 5000);
  }
});
