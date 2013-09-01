// TODO + summary for internal wikipedia links
// TODO + network graph with reading progress indicator (body of knowledge)

// large popover images when hover
var popover,
    onPopover = false,
    widthPattern = /\/(\d+)px-/,
    html = $('html'),
    body = $('body'),
    // right-to-left language pages tend to have images on the left side
    direction = html.attr('dir');

$('#content a[class!="internal"] img').not('.fullImageLink img').mouseenter(function (event) {
  var imgElmt = $(this),
      src = $(this).attr('src'),
      // enlarge images 2X
      width = +src.match(widthPattern)[1] * 2;
  if (popover == undefined) {
    popover = $('<img>').attr('class', 'ext-popover-image');
    body.append(popover);
  }
  if (!imgElmt.attr('data-large-img-src')) {
    imgElmt.attr('data-large-img-src', src.replace(widthPattern, '/' + width + 'px-'));
    popover.one('error', function () {
        // show the full resolution image (which is < 2X larger)
        var originalSrc = src.replace(/\/thumb\//, '/').replace(/\/\d+px-.+/, '');
        $(this).attr('src', originalSrc)
          .removeAttr('width')
          .removeAttr('height');
        imgElmt.attr('data-large-img-src', originalSrc);
      });
  }
  popover.attr('width', this.width * 2)
    .attr('height', this.height * 2)
    .attr('src', imgElmt.attr('data-large-img-src'))
    .show();
})
.mousemove(function (event) {
  if (direction == 'rtl') {
    popover.css('left', Math.min(event.pageX, html.width() - popover.outerWidth(true)));
  } else {
    popover.css('right', Math.min(html.width() - event.pageX, html.width() - popover.outerWidth(true)));
  }
  popover.css('top', Math.min(event.pageY, body.scrollTop() + html.height() - popover.outerHeight(true)));
})
.mouseleave(function (event) {
  if (!onPopover) {
    popover.hide();
  }
});

// add in-page links to section headlines
$('.mw-headline[id]').wrap(function () {
  return $('<a>').attr('class', 'ext-inpage-link').attr('href', '#' + $(this).attr('id'));
});

// show snippet for internal Wikipedia links
var searchUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=1&srinfo=suggestion&srprop=snippet&format=json&srsearch=';
function stripHtmlTags(html) {
  return html.replace(/<.+?>/g, '');
}
var a = $('a[href^="/wiki/"][title][class!="internal"]');
// a.each(function() {
a.mouseenter(function() {
  console.log(this.title);
  var link = this;
  $.getJSON(searchUrl + this.title, function (data, ts) {
    console.log(ts, data.query.search[0].snippet);
    link.title += ' : ' + stripHtmlTags(data.query.search[0].snippet);
  });
});