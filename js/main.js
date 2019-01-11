(function($) {
	"use strict";

	$(window).on('load', function() {
	    $(".preloader").fadeOut("slow", function() {
	        $(".preloader-left").addClass("slide-left");
	    });
	    $("body").css("overflow-y", "auto");
	});

	$(window).scroll(function () {
		//set scroll position in session storage
		sessionStorage.scrollPos = $(window).scrollTop();
	});
	var init = function () {
		 //return scroll position in session storage
		 $(window).scrollTop(sessionStorage.scrollPos || 0)
	};
	window.onload = init;

	$(document).ready(function() {
	    //Portfolio masonry
	    var $container = $('#portfolio-container');
	    $container.isotope({
	        masonry: {
	            columnWidth: '.portfolio-item'
	        },
	        itemSelector: '.portfolio-item'
	    });
	    /* $('#filters').on('click', 'li', function() {
	        $('#filters li').removeClass('active');
	        $(this).addClass('active');
	        var filterValue = $(this).attr('data-filter');
	        $container.isotope({ filter: filterValue });
	    }); */
	});

	//Photoswipe Init

	var initPhotoSwipeFromDOM = function(gallerySelector) {

	  // parse slide data (url, title, size ...) from DOM elements 
	  // (children of gallerySelector)
	  var parseThumbnailElements = function(el) {
	    var thumbElements = el.childNodes,
	      numNodes = thumbElements.length,
	      items = [],
	      figureEl,
	      linkEl,
	      size,
	      item;

	    for(var i = 0; i < numNodes; i++) {

	      figureEl = thumbElements[i]; // <figure> element

	      // include only element nodes 
	      if(figureEl.nodeType !== 1) {
	        continue;
	      }

	      linkEl = figureEl.children[0]; // <a> element

	      size = linkEl.getAttribute('data-size').split('x');

	      // create slide object
	      item = {
	        src: linkEl.getAttribute('href'),
	        w: parseInt(size[0], 10),
	        h: parseInt(size[1], 10)
	      };



	      if(figureEl.children.length > 1) {
	        // <figcaption> content
	        item.title = figureEl.children[1].innerHTML; 
	      }

	      if(linkEl.children.length > 0) {
	        // <img> thumbnail element, retrieving thumbnail url
	        item.msrc = linkEl.children[0].getAttribute('src');
	      } 

	      item.el = figureEl; // save link to element for getThumbBoundsFn
	      items.push(item);
	    }

	    return items;
	  };

	  // find nearest parent element
	  var closest = function closest(el, fn) {
	    return el && ( fn(el) ? el : closest(el.parentNode, fn) );
	  };

	  // triggers when user clicks on thumbnail
	  var onThumbnailsClick = function(e) {
	    e = e || window.event;
	    e.preventDefault ? e.preventDefault() : e.returnValue = false;

	    var eTarget = e.target || e.srcElement;

	    // find root element of slide
	    var clickedListItem = closest(eTarget, function(el) {
	      return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
	    });

	    if(!clickedListItem) {
	      return;
	    }

	    // find index of clicked item by looping through all child nodes
	    // alternatively, you may define index via data- attribute
	    var clickedGallery = clickedListItem.parentNode,
	      childNodes = clickedListItem.parentNode.childNodes,
	      numChildNodes = childNodes.length,
	      nodeIndex = 0,
	      index;

	    for (var i = 0; i < numChildNodes; i++) {
	      if(childNodes[i].nodeType !== 1) { 
	        continue; 
	      }

	      if(childNodes[i] === clickedListItem) {
	        index = nodeIndex;
	        break;
	      }
	      nodeIndex++;
	    }



	    if(index >= 0) {
	      // open PhotoSwipe if valid index found
	      openPhotoSwipe( index, clickedGallery );
	    }
	    return false;
	  };

	  // parse picture index and gallery index from URL (#&pid=1&gid=2)
	  var photoswipeParseHash = function() {
	    var hash = window.location.hash.substring(1),
	    params = {};

	    if(hash.length < 5) {
	      return params;
	    }

	    var vars = hash.split('&');
	    for (var i = 0; i < vars.length; i++) {
	      if(!vars[i]) {
	        continue;
	      }
	      var pair = vars[i].split('=');  
	      if(pair.length < 2) {
	        continue;
	      }           
	      params[pair[0]] = pair[1];
	    }

	    if(params.gid) {
	      params.gid = parseInt(params.gid, 10);
	    }

	    return params;
	  };

	  var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
	    var pswpElement = document.querySelectorAll('.pswp')[0],
	      gallery,
	      options,
	      items;

	    items = parseThumbnailElements(galleryElement);

	    // define options (if needed)
	    options = {

	      // define gallery index (for URL)
	      galleryUID: galleryElement.getAttribute('data-pswp-uid'),

	      getThumbBoundsFn: function(index) {
	        // See Options -> getThumbBoundsFn section of documentation for more info
	        var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
	          pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
	          rect = thumbnail.getBoundingClientRect(); 

	        return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
	      }
	    };

	    // PhotoSwipe opened from URL
	    if(fromURL) {
	      if(options.galleryPIDs) {
	        // parse real index when custom PIDs are used 
	        // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
	        for(var j = 0; j < items.length; j++) {
	          if(items[j].pid == index) {
	            options.index = j;
	            break;
	          }
	        }
	      } else {
	        // in URL indexes start from 1
	        options.index = parseInt(index, 10) - 1;
	      }
	    } else {
	      options.index = parseInt(index, 10);
	    }

	    // exit if index not found
	    if( isNaN(options.index) ) {
	      return;
	    }

	    if(disableAnimation) {
	      options.showAnimationDuration = 0;
	    }

	    // Pass data to PhotoSwipe and initialize it
	    gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
	    gallery.init();
	  };

	  // loop through all gallery elements and bind events
	  var galleryElements = document.querySelectorAll( gallerySelector );

	  for(var i = 0, l = galleryElements.length; i < l; i++) {
	    galleryElements[i].setAttribute('data-pswp-uid', i+1);
	    galleryElements[i].onclick = onThumbnailsClick;
	  }

	  // Parse URL and open gallery if it contains #&pid=3&gid=1
	  var hashData = photoswipeParseHash();
	  if(hashData.pid && hashData.gid) {
	    openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
	  }
	};

	// execute above function
	initPhotoSwipeFromDOM('.project-gallery');


	// Intialize Map
	google.maps.event.addDomListener(window, 'load', init);

	function init() {
	    // Basic options for a simple Google Map
	    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
	    var mapOptions = {
	        // How zoomed in you want the map to start at (always required)
	        zoom: 14,

	        // The latitude and longitude to center the map (always required)
	        center: new google.maps.LatLng(40.8637, 29.3194),

	        scrollwheel: false,


	        // How you would like to style the map.
	        // This is where you would paste any style found on Snazzy Maps.
	        styles:[{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":80}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]
	    };    


	    // Get the HTML DOM element that will contain your map
	    // We are using a div with id="map" seen below in the <body>
	    var mapElement = document.getElementById('map');

	    // Create the Google Map using our element and options defined above
	    var map = new google.maps.Map(mapElement, mapOptions);

	    var image = 'images/mappin.png';
	    // Let's also add a marker while we're at it
	    var marker = new google.maps.Marker({
	        position: new google.maps.LatLng(40.8620592, 29.334109800000004),
	        map: map,
	        icon: image,
	        draggable: true,
	        animation: google.maps.Animation.DROP
	    });
	    marker.addListener('click', toggleBounce);

	    function toggleBounce() {
	        if (marker.getAnimation() !== null) {
	            marker.setAnimation(null);
	        } else {
	            marker.setAnimation(google.maps.Animation.BOUNCE);
	        }
	    }
	}
})(jQuery);