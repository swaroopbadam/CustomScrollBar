var $ = function(id) {
  return document.getElementById(id);
}

window.onload = function() {
  var scrollBar = $('scrollBar');
  var stopScroll = false;
  var fixedContainer = $('fixedContainer');
  var mouseY = 0;
  scrollBar.onmousedown = function(evt) {
    mouseY = evt.clientY;
    document.onmousemove = function(evt) {
      if (fixedContainer.scrollTop < (getContentHeight(fixedContainer) - fixedContainer.offsetHeight)) {
        var unit = scrollUnit(fixedContainer.offsetHeight, getContentHeight(fixedContainer));
        var scrollAmount = evt.clientY - mouseY;
        mouseY = evt.clientY;
        if (scrollAmount > 0 && (scrollBar.offsetTop + scrollBar.offsetHeight) > (fixedContainer.offsetHeight)) {
          return;
        }
        if (scrollAmount < 0 && scrollBar.offsetTop <= 0) {
          return;
        }
        fixedContainer.scrollTop += scrollAmount * unit;
        scrollBar.style.top = (scrollBar.offsetTop + scrollAmount) + 'px';
      }
    }
  }
  fixedContainer.onscroll = function(evt) {
    console.log(evt.clientY);
  }
  document.onmouseup = function(evt) {
    document.onmousemove = null;
  }
}

var scrollUnit = function(containerHeight, contentHeight) {
  return contentHeight / containerHeight;
}

var getContentHeight = function(element) {
  var children = element.children;
  var len = children.length;
  var height = 0;
  for (var i = 0; i < len; i++) {
    height += children[i].offsetHeight;
  }
  return height;
}