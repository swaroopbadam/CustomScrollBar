/*!
 * Javascript for CustomScrollBar.
 * https://github.com/swaroopkumar/CustomScrollBar
 * @author Swaroop Kumar Badam (created on 26-12-2011)
 */

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
	this.scrollBarEl = this.createScrollBarElement();
//	this.attachMouseOverHandlers();
	var obj = this;
	this.scrollBarEl.on('mousedown', function(evt){obj.onScrollBarMouseDown(evt);});
	var mousewheelevt = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
	this.container.on(mousewheelevt, function(evt){obj.onMouseScroll(evt);});
	var contentHeight = this.getContentHeight(this.container[0]);
	this.container[0].scrollTop = contentHeight;
	this.maxScrollTop = this.container[0].scrollTop;
	this.container[0].scrollTop = 0;
	this.mouseX = 0;
	this.mouseY = 0;
}

CustomScroll.prototype.createScrollBarElement = function() {
	var div = $('<div></div>');
	div.width('15px');
	div.height('100px');
	div.css('position', 'absolute');
	div.css('background-color', 'black');
	div.css('border-radius', '8px');
	div.css('cursor', 'pointer');
	div.css('opacity', '0.5');
	div.css('top', this.container[0].offsetTop + 'px');
	div.css('left', (this.container.width() + this.container[0].offsetLeft - 15) + 'px');
	return div.appendTo(this.container[0].offsetParent);
}

CustomScroll.prototype.attachMouseOverHandlers = function() {
	var obj = this;
	this.container.on('mouseover', function(){obj.scrollBarEl.css('display', 'block');});
	this.container.on('mouseout', function(){obj.scrollBarEl.css('display', 'none');});
}

CustomScroll.prototype.onScrollBarMouseDown = function(evt) {
	this.mouseY = evt.pageY;
	var obj = this;
	$(document).on('mousemove', function(evt){obj.onDocumentMouseMove(evt);});
	$(document).one('mouseup', function(evt){obj.onDocumentMouseUp(evt);});
};

CustomScroll.prototype.onMouseScroll = function(evt) {
	evt = evt.originalEvent;
	var delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta;
	delta = -(delta);
	if (delta > 0 && this.container[0].scrollTop >= this.maxScrollTop) {
		return;
	}
	if (delta < 0 && this.container[0].scrollTop == 0) {
		return;
	}
	this.container[0].scrollTop += delta;
	var unit = 0;
	if (delta > 0) {
		unit = this.getScrollBarDownLimit()/((this.maxScrollTop - this.container[0].scrollTop)/120);
	} else {
		unit = -(this.scrollBarEl[0].offsetTop - this.container[0].offsetTop)/(this.container[0].scrollTop/120);
	}
//	console.log('this.container[0].scrollTop:' + this.container[0].scrollTop);
//	console.log('unit:' + unit);
	this.setScrollBarPosition(Math.round(unit));
};

CustomScroll.prototype.getScrollUnit = function(mouseMoveY) {
	if (mouseMoveY > 0) {
		return this.getDownScrollUnit();
	} else if (mouseMoveY < 0) {
		return this.getUpScrollUnit();
	}
	return 0;
}

CustomScroll.prototype.onDocumentMouseMove = function(evt) {
	window.getSelection().removeAllRanges();
	var mouseY = this.mouseY;
	var mouseMoveY = evt.pageY - mouseY;
	this.mouseY = evt.pageY;
	var unit = this.getScrollUnit(mouseMoveY);
	if (mouseMoveY > 0 && ((this.scrollBarEl[0].offsetTop + this.scrollBarEl[0].offsetHeight - this.container[0].offsetTop) > this.container[0].offsetHeight)) {
	  return;
	}
	if (mouseMoveY < 0 && this.scrollBarEl[0].offsetTop <= this.container[0].offsetTop) {
	  return;
	}
//	console.log('mouseMoveY * Math.round(unit):' + mouseMoveY * Math.round(unit));
	this.container[0].scrollTop += mouseMoveY * Math.round(unit);
//	console.log('mouseMoveY: ' + mouseMoveY);
//	console.log('before scrollBarOffset: ' + this.scrollBarEl[0].offsetTop);
	this.setScrollBarPosition(mouseMoveY);
//	console.log('after scrollBarOffset: ' + this.scrollBarEl[0].offsetTop);
};

CustomScroll.prototype.setScrollBarPosition = function(mouseMoveY) {
	if (mouseMoveY > 0 && mouseMoveY > (this.container[0].offsetHeight - (this.scrollBarEl[0].offsetHeight + this.scrollBarEl[0].offsetTop - this.container[0].offsetTop))) {
		this.scrollBarEl.css('top', (this.container[0].offsetHeight - this.scrollBarEl[0].offsetHeight + this.container[0].offsetTop) + 'px');
		return;
	} else if (mouseMoveY < 0 && Math.abs(mouseMoveY) > (this.scrollBarEl[0].offsetTop - this.container[0].offsetTop)) {
		this.scrollBarEl.css('top', this.container[0].offsetTop + 'px');
		return;
	}
	this.scrollBarEl.css('top', (this.scrollBarEl[0].offsetTop + mouseMoveY) + 'px');
};

CustomScroll.prototype.onDocumentMouseUp = function(evt) {
	$(document).off('mousemove');
};

CustomScroll.prototype.getDownScrollUnit = function() {
	var scrollBarHeight = this.scrollBarEl[0].offsetHeight;
	var containerHeight = this.container[0].offsetHeight;
//	console.log('scrollBarHeight: ' + scrollBarHeight);
//	console.log('containerHeight: ' + containerHeight);
//	console.log('this.maxScrollTop: ' + this.maxScrollTop);
//	console.log('this.container[0].scrollTop: ' + this.container[0].scrollTop);
//	console.log('this.container[0].offsetTop: ' + this.container[0].offsetTop);
//	console.log('this.scrollBarEl[0].offsetTop: ' + this.scrollBarEl[0].offsetTop);
	var numerator = this.maxScrollTop - this.container[0].scrollTop;
	var denominator = this.getScrollBarDownLimit();
//	console.log('unit:' + numerator/denominator);
	if (!denominator || denominator < 0 || numerator < 0) {
		return 0;
	}
	return numerator/denominator;
}

CustomScroll.prototype.getScrollBarDownLimit = function() {
	return (this.container[0].offsetHeight - (this.scrollBarEl[0].offsetHeight + this.scrollBarEl[0].offsetTop - this.container[0].offsetTop));
}

CustomScroll.prototype.getUpScrollUnit = function() {
//	console.log('this.container[0].scrollTop: ' + this.container[0].scrollTop);
//	console.log('this.container[0].offsetTop: ' + this.container[0].offsetTop);
//	console.log('this.scrollBarEl[0].offsetTop: ' + this.scrollBarEl[0].offsetTop); 
	var numerator = this.container[0].scrollTop;
	var denominator = this.scrollBarEl[0].offsetTop - this.container[0].offsetTop;
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
