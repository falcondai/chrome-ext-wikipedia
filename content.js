// TODO improve page snippet results
// TODO + network graph with reading progress indicator (body of knowledge)

// large popover images when hover
var popover,
    onPopover = false,
    widthPattern = /\/(\d+)px-/,
    html = $('html'),
    body = $('body'),
    // right-to-left language pages tend to have images on the left side
    direction = html.attr('dir');

chrome.storage.local.get(['zoom', 'zoomLevel'], function(items) {
  if (items.zoom == 'on') {
    $('#content a[class!="internal"] img').not('.fullImageLink img').mouseenter(function (event) {
      var imgElmt = $(this),
      src = $(this).attr('src'),
      width = Math.min(+src.match(widthPattern)[1] * Math.floor(items.zoomLevel), html.width() - 30);
      if (popover == undefined) {
	popover = $('<img>').attr('class', 'ext-popover-image');
	body.append(popover);
      }
      if (!imgElmt.attr('data-large-img-src')) {
	imgElmt.attr('data-large-img-src', src.replace(widthPattern, '/' + width + 'px-'));
	popover.unbind('error');
	popover.bind('error', function () {
          $(this).unbind('error');
	  // when thumbnail of the desired size is unavailable
          // show the full resolution image
          var originalSrc = src.replace(/\/thumb\//, '/').replace(/\/\d+px-.+/, '');
          $(this).attr('src', originalSrc);
          imgElmt.attr('data-large-img-src', originalSrc);
	});
      }
      popover
	.attr('src', imgElmt.attr('data-large-img-src'))
	.show();
    })
    .mousemove(function (event) {
      if (direction == 'rtl') {
	popover.css('left', Math.min(event.pageX, html.width() - popover.outerWidth(true)));
      } else {
	popover.css('right', Math.min(html.width() - event.pageX, html.width() - popover.outerWidth(true)));
      }
      popover.css('top', Math.max(event.pageY - popover.outerHeight(true), body.scrollTop()));
    })
    .mouseleave(function (event) {
      if (!onPopover) {
	popover.hide();
      }
    });
  }
});

// add in-page links to section headlines
chrome.storage.local.get('link', function(items) {
  if (items.link == 'on') {
    $('.mw-headline[id]').wrap(function () {
      var hash = '#' + $(this).attr('id');
      return $('<a>').attr('class', 'ext-inpage-link')
	.attr('href', hash)
        .click(function(event) {
	  console.log('clicked title link', hash);
	  event.preventDefault();
	  history.pushState({}, '', hash);
	  // .location.hash = this.hash; 
	  body.animate({
	    scrollTop: $(this).offset().top
	  }, 400);
	  return false;
	});
    });
  }
});

// show snippet for internal Wikipedia links
var wikiApiRoot = '//' + document.location.host + '/w/api.php',
    searchEndpoint = wikiApiRoot + '?action=query&list=search&srlimit=1&srinfo=suggestion&srprop=snippet&format=json&srsearch=',
    redirectEndpoint = wikiApiRoot + '?action=query&redirects&format=json&titles=';

function stripHtmlTags(html) {
  return html.replace(/<.+?>/g, '');
}
function addSnippet(linkElmt, entry) {
  $.getJSON(searchEndpoint + entry, function (data, status) {
    // console.log(status, data);
    if (status == 'success' && data.query.search.length > 0 && !linkElmt['data-excerpt']) {
      linkElmt['data-excerpt'] = stripHtmlTags(data.query.search[0].snippet);
      linkElmt.title += ' : ' + linkElmt['data-excerpt'];
    }
    linkElmt['data-requesting'] = false;
  });
}

chrome.storage.local.get('snippet', function(items) {
  if (items.snippet == 'on') {
    $('#content a[href^="/wiki/"][title][class!="internal"]').not('[href^="/wiki/File:"]')
    .mouseover(function() {
      var linkElmt = this;
      if (!this['data-excerpt'] && !this['data-requesting']) {
	this['data-requesting'] = true;
	if ($(this).hasClass('mw-redirect')) {
	  // redirecting entities
	  $.getJSON(redirectEndpoint + this.title, function (data, status) {
            // console.log('redirect', status, data);
            if (status == 'success' && data.query.redirects.length > 0) {
	      // console.log(data.query.redirects[0].to);
	      addSnippet(linkElmt, data.query.redirects[0].to);
            }
	  });  
	} else {
	  addSnippet(this, this.title);
	}
      }
    });
  }
});
