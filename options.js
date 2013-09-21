// set up UI
chrome.storage.local.get(function(items) {
  console.log('loaded settings:', items);
  $('.link input[type=checkbox]').attr('checked', items.link == 'on');
  $('.zoom input[type=checkbox]').attr('checked', items.zoom == 'on');
  $('.zoom input[type=range]').val(items.zoomLevel);
  $('.zoom input[type=range]').attr('disabled', items.zoom != 'on');
  $('.zoom span').text(items.zoomLevel + 'X');
  $('.snippet input[type=checkbox]').attr('checked', items.snippet == 'on');
});

$('.link input[type=checkbox]').change(function() {
  chrome.storage.local.set({
    link: this.checked ? 'on' : 'off'
  });
});

$('.zoom input[type=checkbox]').change(function() {
  chrome.storage.local.set({
    zoom: this.checked ? 'on' : 'off'
  });
  $('.zoom input[type=range]').attr('disabled', !this.checked);
});

$('.zoom input[type=range]').change(function() {
  chrome.storage.local.set({
    zoomLevel: Math.max(2, Math.min(this.value, 4))
  });
  $('.zoom span').text(this.value + 'X');
});

$('.snippet input[type=checkbox]').change(function() {
  chrome.storage.local.set({
    snippet: this.checked ? 'on' : 'off'
  });
});

// set up action links
var eid = chrome.runtime.id,
    extensionName = chrome.runtime.getManifest().name,
    supportUrl = 'https://chrome.google.com/webstore/support/' + eid,
    storeUrl = 'https://chrome.google.com/webstore/detail/' + eid;
$('#ask').attr('href', supportUrl + '#question');
$('#suggest').attr('href', supportUrl + '#feature');
$('#report').attr('href', supportUrl + '#bug');
$('#rate').attr('href', storeUrl + '/reviews');

//share links
$('#facebook').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=' + storeUrl);
$('#twitter').attr('href', 'https://twitter.com/intent/tweet?text=' + extensionName + ' Chrome extension&via=falcondai&url=' + storeUrl);
$('#gplus').attr('href', 'https://plus.google.com/share?url=' + storeUrl);

$('#share').click(function () {
  $('#social').toggleClass('show');
  return false;
});
