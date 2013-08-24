// scroll to content
if (document.location.hash == '') {
  $('body').scrollTop($('#content').offset().top);
}

// TODO large popup images when hover

// TODO summary for internal wikipedia links

// add in-page links to section headlines
$('.mw-headline[id]').wrap(function () {
  return $('<a>').attr('class', 'ext-inpage-link').attr('href', '#' + $(this).attr('id'));
});
