/*
 * Javascript for CustomScrollBar.
 *
 * @author Swaroop Kumar Badam (created on 26-12-2011)
 *
 */

$(document).ready(function() {

	var scrollBarMouseDown = function(evt) {
		$(document).on('mousemove', {mouseY: evt.pageY}, docMouseMove);
		$(document).one('mouseup', docMouseUp);
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
		//$(document).off('mouseup', docMouseUp);
	};

	var scrollBar = $('#scrollBar');
	var stopScroll = false;
	var fixedContainer = $('#fixedContainer');
	//scrollBar.on('mousedown', scrollBarMouseDown);
	window.scrollBarObj = new CustomScroll('fixedContainer');

});

function CustomScroll(id, config) {
	if (!id || !$('#' + id)) {
		return false;
	}
	this.container = $('#' + id);
	if (config) {
		this.config = config;
	}
	this.init();
}

CustomScroll.prototype.init = function() {
	this.container.css('overflow', 'hidden');
//	this.scrollBarEl = $('#scrollBar');
	this.scrollBarEl = this.createScrollBarElement();
//	this.attachMouseOverHandlers();
	var obj = this;
	this.scrollBarEl.on('mousedown', function(evt){obj.onScrollBarMouseDown(evt);});
	var contentHeight = this.getContentHeight(this.container[0]);
	this.container[0].scrollTop = contentHeight;
	this.maxScrollTop = this.container[0].scrollTop;
	this.container[0].scrollTop = 0;
	this.mouseX = 0;
	this.mouseY = 0;
}

CustomScroll.prototype.attachMouseOverHandlers = function() {
	var obj = this;
	$(this.container).on('mouseover', function(){obj.scrollBarEl.css('display', 'block');});
	$(this.container).on('mouseout', function(){obj.scrollBarEl.css('display', 'none');});
}

CustomScroll.prototype.onScrollBarMouseDown = function(evt) {
	this.mouseY = evt.pageY;
	var obj = this;
	$(document).on('mousemove', function(evt){obj.onDocumentMouseMove(evt);});
	$(document).one('mouseup', function(evt){obj.onDocumentMouseUp(evt);});
};

CustomScroll.prototype.onDocumentMouseMove = function(evt) {
	window.getSelection().removeAllRanges();
	var unit = 0;
	var mouseY = this.mouseY;
	var mouseMoveY = evt.pageY - mouseY;
	this.mouseY = evt.pageY;
	if (mouseMoveY > 0) {
		unit = this.getDownScrollUnit();
	} else {
		unit = this.getUpScrollUnit();
	}
	var scrollBarOffset = this.scrollBarEl.offset();
	var containerOffset = this.container.offset();
	if (mouseMoveY > 0 && ((scrollBarOffset.top + this.scrollBarEl.height()) > this.container.height())) {
	  return;
	}
	if (mouseMoveY < 0 && scrollBarOffset.top <= 0) {
	  return;
	}
	this.container[0].scrollTop += mouseMoveY * unit;
	this.scrollBarEl.css('top', (scrollBarOffset.top + mouseMoveY) + 'px');
};

CustomScroll.prototype.onDocumentMouseUp = function(evt) {
	$(document).off('mousemove');
};

CustomScroll.prototype.createScrollBarElement = function() {
	var div = $('<div></div>');
	div.width('15px');
	div.height('100px');
	div.css('position', 'absolute');
	div.css('background-color', 'black');
	div.css('border-radius', '8px');
	div.css('opacity', '0.5');
	div.css('top', '0');
	div.css('left', (this.container.width() - 15) + 'px');
	return div.appendTo(this.container);
}

CustomScroll.prototype.getDownScrollUnit = function() {
	var scrollBarHeight = this.scrollBarEl[0].offsetHeight;
	var containerHeight = this.container[0].offsetHeight;
/*	console.log('scrollBarHeight: ' + scrollBarHeight);
	console.log('containerHeight: ' + containerHeight);
	console.log('this.maxScrollTop: ' + this.maxScrollTop);
	console.log('this.container[0].scrollTop: ' + this.container[0].scrollTop);
	console.log('this.scrollBarEl[0].offsetTop: ' + this.scrollBarEl[0].offsetTop); */
	var numerator = this.maxScrollTop - this.container[0].scrollTop;
	var denominator = containerHeight - scrollBarHeight - this.scrollBarEl[0].offsetTop;
//	console.log('unit:' + numerator/denominator);
	if (!denominator || denominator < 0 || numerator < 0) {
		return 0;
	}
	return numerator/denominator;
}

CustomScroll.prototype.getUpScrollUnit = function() {
	var scrollBarHeight = this.scrollBarEl[0].offsetHeight;
	var containerHeight = this.container[0].offsetHeight;
/*	console.log('scrollBarHeight: ' + scrollBarHeight);
	console.log('containerHeight: ' + containerHeight);
	console.log('this.maxScrollTop: ' + this.maxScrollTop);
	console.log('this.container[0].scrollTop: ' + this.container[0].scrollTop);
	console.log('this.scrollBarEl[0].offsetTop: ' + this.scrollBarEl[0].offsetTop); */
	var numerator = this.container[0].scrollTop;
	var denominator = this.scrollBarEl[0].offsetTop;
//	console.log('unit:' + denominator);
	if (!denominator || denominator < 0 || numerator < 0) {
		return 0;
	}
	return numerator/denominator;
}

CustomScroll.prototype.getContentHeight = function(element) {
  var children = element.children;
  var len = children.length;
  var height = 0;
  for (var i = 0; i < len; i++) {
    height += children[i].offsetHeight;
  }
  return height;
}
