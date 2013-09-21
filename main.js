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

  var notification = webkitNotifications.createNotification(
    '/assets/image/icon.png', 
    details.reason == 'update' ? 'Wikipedia Plus is updated' : 'Thanks for using Wikipedia Plus',
    'click to visit the ' + (details.reason == 'update' ? 'new ' : '') + 'options page'
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
});
