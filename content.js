// TODO summary for internal wikipedia links

// large popover images when hover
var popover,
    onPopover = false,
    widthPattern = /\/(\d+)px-/;

$('#content a img').not('.fullImageLink img').mouseenter(function (event) {
  var imgElmt = $(this),
      src = $(this).attr('src'),
      // enlarge images 2X
      width = +src.match(widthPattern)[1] * 2;
  if (popover == undefined) {
    popover = $('<img>').attr('class', 'ext-popover-image');
    $('body').append(popover);
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
  popover.css('left', Math.max(0, event.pageX - popover.outerWidth(true)) + 'px')
    .css('top', Math.min(event.pageY, $('body').scrollTop() + $('html').height() - popover.outerHeight(true)) + 'px');
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
