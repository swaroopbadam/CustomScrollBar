/*
  Javascript for CustomScrollBar.

  @author Swaroop Kumar Badam (created on 26-12-2011)

  */

$(document).ready(function() {

  var scrollBarMouseDown = function(evt) {
    $(document).on('mousemove', {mouseY: evt.pageY}, docMouseMove);
  };
  
  var docMouseMove = function(evt) {
      //if (fixedContainer.scrollTop < (getContentHeight(fixedContainer) - fixedContainer.offsetHeight)) {
        //var unit = scrollUnit(fixedContainer.offsetHeight, getContentHeight(fixedContainer));
        var unit = 2;
        var mouseY = evt.data.mouseY;
        var scrollAmount = evt.pageY - mouseY;
        var scrollBarOffset = scrollBar.offset();
        var fixedContainerOffset = fixedContainer.offset();
        if (scrollAmount > 0 && ((scrollBarOffset.top + scrollBar.height()) > fixedContainer.height())) {
          return;
        }
        if (scrollAmount < 0 && scrollBarOffset.top <= 0) {
          return;
        }
        fixedContainer[0].scrollTop += scrollAmount * unit;
        scrollBar.css('top', (scrollBarOffset.top + scrollAmount) + 'px');
      //}
  };

  var docMouseUp = function(evt) {
    $(document).off('mousemove',docMouseMove)
  };

  var scrollBar = $('#scrollBar');
  var stopScroll = false;
  var fixedContainer = $('#fixedContainer');
  scrollBar.on('mousedown', scrollBarMouseDown);
  $(document).on('mouseup', docMouseUp);

});

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
