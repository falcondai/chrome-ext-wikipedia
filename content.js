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

$('#content a img').not('.fullImageLink img').mouseenter(function (event) {
  var imgElmt = $(this),
      src = $(this).attr('src'),
      // enlarge images 2X
      width = +src.match(widthPattern)[1] * 2;
  if (popover == undefined) {
    popover = $('<img>').attr('class', 'ext-popover-image');
    body.append(popover);
  }
  popover.one('error', function () {
      // show the full resolution image (which is < 2X larger)
      $(this).attr('src', src.replace(/\/thumb\//, '/').replace(/\/\d+px-.+/, ''))
        .removeAttr('width')
        .removeAttr('height')
    })
    .attr('width', this.width * 2)
    .attr('height', this.height * 2)
    .attr('alt', 'enlarged image')
    .attr('src', src.replace(widthPattern, '/' + width + 'px-'))
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
