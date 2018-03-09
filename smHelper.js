(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], function(exports) {
      factory((root.smHelper = exports));
    });
  } else if (typeof exports === 'object') {
    factory(exports);
  } else {
    factory((root.smHelper = {}));
  }
}(this, function(exports) {
  exports.toggler = function(el, value) {
    var display = (window.getComputedStyle ? getComputedStyle(el, null) : el.currentStyle).display;
    if (display == 'none') el.style.display = value;
    else el.style.display = 'none';
  };
  exports.grabber = function( elems, callback, invert ) {
    var callbackInverse,
    matches = [],
    i = 0,
    length = elems.length,
    callbackExpect = !invert;

    // Go through the array, only saving the items
    // that pass the validator function
    for ( ; i < length; i++ ) {
      callbackInverse = !callback( elems[ i ], i );
      if ( callbackInverse !== callbackExpect ) {
        matches.push( elems[ i ] );
      }
    }
    return matches;
  };

  exports.hide = function (el) {
    el.style.display = 'none';
  };

  exports.show = function(el, value) {
    el.style.display = value;
  };

  exports.uniqueUsingSet = function(array){
    var seen = new Set;
    return array.filter(function(item){
      if (!seen.has(item)) {
        seen.add(item);
        return true;
      }
    });
  };

  exports.find_duplicates = function(arr) {
    var len=arr.length,
    out=[],
    counts={};
    for (var i=0;i<len;i++) {
      var item = arr[i];
      counts[item] = counts[item] >= 1 ? counts[item] + 1 : 1;
      if (counts[item] === 2) {
        out.push(item);
      }
    }

    return out;
  };

  exports.is_touch_device = function() {
    if('ontouchstart' in window){
      try {
        document.createEvent("TouchEvent");
        return true;
      } catch (e) {
        return false;
      }
    }
    return navigator.maxTouchPoints;       // works on IE10/11 and Surface
  };
  exports.triggerEvent = function(el, type){
    if ('createEvent' in document) {
      // old standard
      var e = document.createEvent('HTMLEvents');
      e.initEvent(type, true, true);
      el.dispatchEvent(e);
    } else if('createEventObject' in document) {
      // IE 8
      var e = document.createEventObject();
      e.eventType = type;
      el.fireEvent('on'+e.eventType, e);
    } else {
      // modern standard
      var e  = new Event(type , {'view':window, 'bubbles':true, 'cancelable': true});
      el.dispatchEvent(e);
    }
  };

  exports.isMac = function(){
    if (navigator.userAgent.indexOf('Mac OS X') != -1 || navigator.platform.indexOf('Mac') != -1 ) {
      return true;
    }
    return false;
  };
  exports.scrollTop = function(scrollDuration) {
    var   scrollHeight = window.pageYOffset,
    scrollStep = Math.PI / ( scrollDuration / 15 ),
    cosParameter = scrollHeight / 2;
    var     scrollCount = 0,
    scrollMargin,
    scrollInterval = setInterval( function() {
      if ( window.pageYOffset != 0 ) {
        scrollCount = scrollCount + 1;
        scrollMargin = cosParameter - cosParameter * Math.cos( scrollCount * scrollStep );
        window.scrollTo( 0, ( scrollHeight - scrollMargin ) );
      } else { clearInterval(scrollInterval); }
    }, 15 );
  };
  exports.readmore = function(options){
    var readmore = document.getElementsByClassName(options.class);
    for (var i = 0; i < readmore.length; i++) {
      if(readmore[i].offsetHeight > options.height){
        readmore[i].style.height = options.height + 'px';
        readmore[i].style.overflowY = 'hidden';
        var readmoreLink = document.createElement('a');
        readmoreLink.href = '#' + readmore[i].id;
        readmoreLink.innerHTML = 'Read More...';
        readmore[i].appendChild(readmoreLink);
        readmoreLink.addEventListener('click', function(event){
          event.preventDefault();
          if(this.innerHTML=='Read More...'){
            this.parentNode.style.height = '';
            this.innerHTML='Read Less';
          } else {
            this.parentNode.style.height = options.height + 'px';
            this.innerHTML='Read More...';
            smHelper.scrollTop(500);
          }
        });
      }
    }
  }
  var ShareButton = { render: function render(button) {
    return '<a class="share-link" target="_blank" href="' + button.url + '" rel="noopener">\n <i class="fa fa-' + button.icon + '" title="' + button.name + ' Link"></i>\n </a>';
  }
};
var encodeHtmlEntity = function(str) {
  var buf = [];
  for (var i=str.length-1;i>=0;i--) {
    if(str[i]=='&'){
      buf.unshift('&#32;and&#32;');
    } else if(str[i]=='"'){
      buf.unshift('&#32;');
    }else {
buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
}

  }
  return buf.join('');
};
exports.shareButtons = function(share) {
  share.title = encodeHtmlEntity(share.title);
  share.url = encodeURIComponent(share.url);
  share.img = encodeURIComponent(share.img);
  return '<div class="share-buttons">\n ' + ShareButton.render({
    name: 'linkedin',
    icon: 'linkedin',
    url: 'https://www.linkedin.com/shareArticle?mini=true&summary=&source&url=' + share.url + '&title=' + share.title.replace('&#124;',' ')
  }) + '\n ' + ShareButton.render({
    name: 'twitter',
    icon: 'twitter',
    url: 'https://twitter.com/intent/tweet?url=' + share.url + '&text=' + share.title.split('&#124;')[0]
  }) + '\n ' + ShareButton.render({
    name: 'facebook',
    icon: 'facebook',
    url: 'https://www.facebook.com/sharer/sharer.php?u=' + share.url
  }) + '\n ' + ShareButton.render({
    name: 'google-plus',
    icon: 'google-plus', url: 'https://plus.google.com/share?url=' + share.url
  }) + '\n ' + ShareButton.render({
    name: 'pinterest',
    icon: 'pinterest', url: 'https://pinterest.com/pin/create/button/?url=' + share.url + '&media=' + share.img + '&description=' + share.title
  }) + '\n ' + ShareButton.render({
    name: 'email',
    icon: 'envelope', url: 'mailto:?Subject=' + share.title + '&body=' + share.url
  }) + '\n </div>';
};
exports.pager = function() {
  this.first = '|&lt;';
  this.last  = '&gt;|';
  this.next  = '&gt;';
  this.prev  = '&lt;';
  this.numLinks = 8;
  this.pageLimit = 10;
  this.showPage = function(page, filteredNewsCount) {
    if(page < 1){
      page = 1;
    }
    var numPages = 0;
    numPages = Math.ceil(filteredNewsCount / this.pageLimit);
    this.render(page, numPages);
  }
  this.render = function(currentPage, numPages) {

    var pagingControls = '<div class="page-link-container">';
    if (currentPage > 1) {
      pagingControls += '<a class="page-link" href="#1" data-page="1"><span>' + this.first + '</span></a>';

      if (currentPage - 1 === 1) {
        pagingControls += '<a class="page-link" href="#1" data-page="1"><span>' + this.prev + '</span></a>';
      } else {
        pagingControls += '<a class="page-link" href="#' + (currentPage - 1) + '" data-page="' + (currentPage - 1) + '"><span>' + this.prev+ '</span></a>';
      }
    }
    if(numPages > 1){
      var start, end;
      if (numPages <= this.numLinks) {
        start = 1;
        end = numPages;
      } else {
        start = currentPage - Math.floor(this.numLinks / 2);
        end = currentPage + Math.floor(this.numLinks / 2);

        if (start < 1) {
          end += Math.abs(start) + 1;
          start = 1;
        }
        if (end > numPages) {
          start -= (end - numPages);
          end = numPages;
        }
      }
      /* page loop */
      for (var i = start; i <= end; i++) {
        if (i != currentPage) {
          pagingControls += '<a class="page-link" href="#' + i + '" data-page="' + i + '"><span>' + i + '</span></a>';
        } else {
          pagingControls += '<span>' + i + '</span>';
        }
      }
      /*loop end*/
    }
    if (currentPage < numPages) {
      pagingControls += '<a class="page-link" href="#' + (currentPage + 1) + '"  data-page="' + (currentPage + 1) + '"><span>' + this.next + '</span></a>';
      pagingControls += '<a class="page-link" href="#' + numPages + '" data-page="' + numPages + '"><span>' + this.last + '</span></a>';
    }
    pagingControls += '</div>';
    document.getElementById('paginator').innerHTML = pagingControls;
  }
};
smHelper.observerContent = [];
smHelper.observerPos = 0;
exports.contentObserve = function contentObserve(targetId, mutationList) {
  var observerPos = (function () {
    return smHelper.observerPos;
  })();
  var mutationCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
  if (window.navigator.userAgent.indexOf('Trident/') != -1) {
    document.addEventListener("DOMNodeInserted", function (e) {
      var mutationKey = mutationList.findKeyIndex('mutationId', e.target.id);
      if ( mutationKey > -1) {
        mutationList[mutationKey].callback();
        mutationList.splice(mutationKey,1);
      }
    }, false);
  } else {
    var targetContent = document.getElementById(targetId);
    smHelper.observerContent[observerPos] = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (addedNode){
          var mutationKey = mutationList.findKeyIndex('mutationId', addedNode.id);
          if ( mutationKey > -1) {
            mutationList[mutationKey].callback();
            mutationList.splice(mutationKey,1);
          }
          if(mutationList.length==0){
            smHelper.observerContent[observerPos].disconnect();
          }
        });
      });
    });
    var configContent = { childList: true, attributes: true, characterData: true };
    smHelper.observerContent[observerPos].observe(targetContent, configContent);
    smHelper.observerPos++;
  }
};
}));
