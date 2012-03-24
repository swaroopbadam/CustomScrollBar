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
		this.initConfig(config);
	} else {
		this.config = this.DEFAULT_CONFIG;
	}
	this.init();
}

CustomScroll.prototype.DEFAULT_CONFIG = {
	barW : '15',
	barH : 'auto',
	colW : '15',
	colH : 'auto',
	barColor : 'black',
	barOpacity : '0.5',
	colColor : 'black',
	colOpacity : '0.2',
	verticalColumn : 'true',
	topArrow : 'true',
	bottomArrow : 'true'
};

CustomScroll.prototype.initConfig = function(config) {
	if (typeof(config) != 'object') {
		this.config = this.DEFAULT_CONFIG;
	}
	for (var i in this.DEFAULT_CONFIG) {
		if (!config[i]) {
			config[i] = this.DEFAULT_CONFIG[i];
		}
	}
	this.config = config;
};

CustomScroll.prototype.init = function() {
	this.container.css('overflow-y', 'hidden');
	this.container.attr('tabindex', '0');
	this.createScrollBar();
	this.initEventHandlers();
	this.updateMaxScrollTop();
	this.mouseX = 0;
	this.mouseY = 0;
};

CustomScroll.prototype.updateMaxScrollTop = function() {
	var scrollTop = this.container[0].scrollTop;
	var contentHeight = this.getContentHeight(this.container[0]);
	this.container[0].scrollTop = contentHeight;
	this.maxScrollTop = this.container[0].scrollTop;
	this.container[0].scrollTop = scrollTop;
};

CustomScroll.prototype.createScrollBar = function() {
	this.scrollBarWrap = $('<div></div>').appendTo(this.container[0].offsetParent);
	if (this.config.verticalColumn == 'true') {
		var columnDiv = $('<div></div>');
		columnDiv.width(parseInt(this.config.colW) + 'px');
		columnDiv.height(this.container[0].offsetHeight);
		columnDiv.css('position', 'absolute');
		columnDiv.css('background-color', this.config.colColor);
//		columnDiv.css('border-radius', '8px');
		columnDiv.css('opacity', this.config.colOpacity);
		columnDiv.css('top', this.container[0].offsetTop + 'px');
		columnDiv.css('left', (this.container[0].offsetWidth + this.container[0].offsetLeft - parseInt(this.config.colW)) + 'px');
		this.scrollBarColumn = columnDiv.appendTo(this.scrollBarWrap);
	}
	var scrollBarDiv = $('<div></div>');
	scrollBarDiv.width(parseInt(this.config.barW) + 'px');
	if (this.config.barH == 'auto') {
		scrollBarDiv.height(this.getScrollBarHeight() + 'px');
	} else {
		scrollBarDiv.height(parseInt(this.config.barH) + 'px');
	}
	scrollBarDiv.css('position', 'absolute');
	scrollBarDiv.css('background-color', this.config.barColor);
//	scrollBarDiv.css('border-radius', '8px');
	scrollBarDiv.css('cursor', 'pointer');
	scrollBarDiv.css('opacity', this.config.barOpacity);
	scrollBarDiv.css('top', this.container[0].offsetTop + 'px');
	scrollBarDiv.css('left', (this.container[0].offsetWidth + this.container[0].offsetLeft - parseInt(this.config.barW)) + 'px');
	this.scrollBarEl = scrollBarDiv.appendTo(this.scrollBarWrap);
/*	var scrollUpButton = $('<div></div>');
	scrollUpButton.width('15px');
	scrollUpButton.height('20px');
	scrollUpButton.css('position', 'absolute');
	scrollUpButton.css('background-color', 'black');
	scrollUpButton.css('border-radius', '8px');
	scrollUpButton.css('opacity', '0.5');
	scrollUpButton.css('top', this.container[0].offsetTop + 'px');
	scrollUpButton.css('left', (this.container.width() + this.container[0].offsetLeft - 15) + 'px');
	this.scrollUpButton = scrollUpButton.appendTo(this.scrollBarWrap);
*/
};

CustomScroll.prototype.getScrollBarHeight = function() {
	var contentHt = this.getContentHeight(this.container[0]);
	var scrollBarHeight = Math.pow(this.container[0].offsetHeight, 2) / contentHt;
	return scrollBarHeight > 20 ? scrollBarHeight : 20;
};

CustomScroll.prototype.initEventHandlers = function() {
	var obj = this;
	this.scrollBarEl.on('mousedown', function(evt){obj.onScrollBarMouseDown(evt);});
	var mousewheelevt = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
	this.container.on(mousewheelevt, function(evt){obj.onMouseScroll(evt);});
	this.container.on('keydown', function(evt){obj.onKeyDown(evt);});
	if (this.scrollBarColumn) {
		this.scrollBarColumn.on('mousedown', function(evt){obj.onColumnMouseDown(evt);});
		this.scrollBarColumn.on('mouseup', function(evt){obj.onColumnMouseUp(evt);});
	}
//	this.container.on('scroll', function(evt){obj.onScroll(evt);});
//	this.attachMouseOverHandlers();
};

CustomScroll.prototype.reInit = function() {
	this.updateMaxScrollTop();
	if (this.config.barH == 'auto') {
		this.scrollBarEl.height(this.getScrollBarHeight() + 'px');
	}
	this.adjustScrollBarPosition();
};

CustomScroll.prototype.onColumnMouseDown = function(evt) {
	if (evt.target == this.scrollBarEl[0]) {
		return;
	}
	var obj = this;
	this.columnMouseDown = true;
	this.columnMouseDownPageY = evt.pageY;
	setTimeout(function(){obj.columnMouseDownScroll();}, 0);
};

CustomScroll.prototype.columnMouseDownScroll = function() {
	var obj = this;
	if (!this.columnMouseDown) {
		return;
	}
//	console.log("columnMouseDownPageY:" + this.columnMouseDownPageY);
//	console.log("total height:" + (this.container[0].offsetTop + this.scrollBarEl[0].offsetTop + this.scrollBarEl[0].offsetHeight));
	if (this.columnMouseDownPageY < this.scrollBarEl[0].offsetTop) {
		this.scrollBy(-400);
		if (this.columnMouseDownPageY > this.scrollBarEl[0].offsetTop) {
			this.columnMouseDown = false;
			return;
		}
	} else if (this.columnMouseDownPageY > (this.scrollBarEl[0].offsetTop + this.scrollBarEl[0].offsetHeight)) {
		this.scrollBy(400);
		if (this.columnMouseDownPageY < (this.scrollBarEl[0].offsetTop + this.scrollBarEl[0].offsetHeight)) {
			this.columnMouseDown = false;
			return;
		}
	} else {
		this.columnMouseDown = false;
	}
	setTimeout(function(){obj.columnMouseDownScroll();}, 10);
};

CustomScroll.prototype.onColumnMouseUp = function(evt) {
	this.columnMouseDown = false;
};

CustomScroll.prototype.onKeyDown = function(evt) {
	if (evt.keyCode == '38') {	// Up Arrow
		this.scrollBy(-40);
	} else if (evt.keyCode == '40') {	// Down Arrow
		this.scrollBy(40);
	} else if (evt.keyCode == '33') {	// Page Up
		this.scrollBy(-430);
	} else if (evt.keyCode == '34') {	// Page Down
		this.scrollBy(430);
	} else if (evt.keyCode == '36') {	// Home
		this.scrollToHome();
	} else if (evt.keyCode == '35') {	// End
		this.scrollToEnd();
	} else if (evt.keyCode == '32') {	// Space Bar
		this.scrollBy(430);
	}
	if (!this.hasScrolledToTopOrBottom()) {
		evt.preventDefault();
	}
};

CustomScroll.prototype.hasScrolledToTopOrBottom = function() {
	if (this.container[0].scrollTop == 0) {
		return true;
	}
	if (this.container[0].scrollTop == this.maxScrollTop) {
		return true;
	}
};

CustomScroll.prototype.scrollToHome = function() {
	this.container[0].scrollTop = 0;
	this.scrollBarEl.css('top', this.container[0].offsetTop + 'px');
};

CustomScroll.prototype.scrollToEnd = function() {
	this.updateMaxScrollTop();
	this.container[0].scrollTop = this.maxScrollTop;
	this.scrollBarEl.css('top', (this.container[0].offsetTop + this.container[0].offsetHeight - this.scrollBarEl[0].offsetHeight)+ 'px');
};

CustomScroll.prototype.attachMouseOverHandlers = function() {
	var obj = this;
	this.container.on('mouseover', function(){obj.scrollBarWrap.css('display', 'block');});
	this.container.on('mouseout', function(){obj.scrollBarWrap.css('display', 'none');});
};

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
	this.scrollBy(delta);
	if (!this.hasScrolledToTopOrBottom()) {
		evt.preventDefault();
	}
};

CustomScroll.prototype.onScroll = function(evt) {
	evt = evt.originalEvent;
	if (!this.hasScrolledToTopOrBottom()) {
		evt.preventDefault();
	}
};

CustomScroll.prototype.scrollBy = function(amount) {
	this.updateMaxScrollTop();
	if (amount > 0 && this.container[0].scrollTop >= this.maxScrollTop) {
		return;
	}
	if (amount < 0 && this.container[0].scrollTop == 0) {
		return;
	}
//	var unit = 0;
//	if (amount > 0) {
//		unit = this.getScrollBarDownLimit()/((this.maxScrollTop - this.container[0].scrollTop)/amount);
//	} else {
//		unit = (this.scrollBarEl[0].offsetTop - this.container[0].offsetTop)/(this.container[0].scrollTop/amount);
//	}
//	console.log('this.container[0].scrollTop:' + this.container[0].scrollTop);
//	console.log('unit:' + unit);
	this.container[0].scrollTop += amount;
//	this.setScrollBarPosition(Math.round(unit));
	this.adjustScrollBarPosition();
};

CustomScroll.prototype.adjustScrollBarPosition = function() {
	var top = this.container[0].scrollTop * (this.container[0].offsetHeight - this.scrollBarEl[0].offsetHeight) / this.maxScrollTop;
	this.scrollBarEl.css('top', (this.container[0].offsetTop + top) + 'px');
};

CustomScroll.prototype.getScrollUnit = function(mouseMoveY) {
	if (mouseMoveY > 0) {
		return this.getDownScrollUnit();
	} else if (mouseMoveY < 0) {
		return this.getUpScrollUnit();
	}
	return 0;
};

CustomScroll.prototype.onDocumentMouseMove = function(evt) {
//	this.updateMaxScrollTop();
	if (window.getSelection)
		window.getSelection().removeAllRanges();
	var mouseY = this.mouseY;
	var mouseMoveY = evt.pageY - mouseY;
	this.mouseY = evt.pageY;
	var unit = this.getScrollUnit(mouseMoveY);
//	if (mouseMoveY > 0 && ((this.scrollBarEl[0].offsetTop + this.scrollBarEl[0].offsetHeight - this.container[0].offsetTop) > this.container[0].offsetHeight)) {
//	  return;
//	}
//	if (mouseMoveY < 0 && this.scrollBarEl[0].offsetTop <= this.container[0].offsetTop) {
//	  return;
//	}
	this.scrollBy(mouseMoveY * Math.round(unit));
//	console.log('mouseMoveY * Math.round(unit):' + mouseMoveY * Math.round(unit));
//	this.container[0].scrollTop += mouseMoveY * Math.round(unit);
//	console.log('mouseMoveY: ' + mouseMoveY);
//	console.log('before scrollBarOffset: ' + this.scrollBarEl[0].offsetTop);
//	this.setScrollBarPosition(mouseMoveY);
//	this.adjustScrollBarPosition();
//	console.log('after scrollBarOffset: ' + this.scrollBarEl[0].offsetTop);
};

//CustomScroll.prototype.setScrollBarPosition = function(mouseMoveY) {
//	if (mouseMoveY > 0 && mouseMoveY > (this.container[0].offsetHeight - (this.scrollBarEl[0].offsetHeight + this.scrollBarEl[0].offsetTop - this.container[0].offsetTop))) {
//		this.scrollBarEl.css('top', (this.container[0].offsetHeight - this.scrollBarEl[0].offsetHeight + this.container[0].offsetTop) + 'px');
//		return;
//	} else if (mouseMoveY < 0 && Math.abs(mouseMoveY) > (this.scrollBarEl[0].offsetTop - this.container[0].offsetTop)) {
//		this.scrollBarEl.css('top', this.container[0].offsetTop + 'px');
//		return;
//	}
//	this.scrollBarEl.css('top', (this.scrollBarEl[0].offsetTop + mouseMoveY) + 'px');
//};

CustomScroll.prototype.onDocumentMouseUp = function(evt) {
	$(document).off('mousemove');
};

CustomScroll.prototype.getDownScrollUnit = function() {
//	var scrollBarHeight = this.scrollBarEl[0].offsetHeight;
//	var containerHeight = this.container[0].offsetHeight;
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
};

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
};

CustomScroll.prototype.getScrollBarDownLimit = function() {
	return (this.container[0].offsetHeight - (this.scrollBarEl[0].offsetHeight + this.scrollBarEl[0].offsetTop - this.container[0].offsetTop));
};

CustomScroll.prototype.getScrollBarMinTop = function() {
	return this.config.topArrow == 'true' ? (this.container[0].offsetTop + this.topArrow[0].offsetHeight) : this.container[0].offsetTop;
};

CustomScroll.prototype.getScrollBarMaxTop = function() {
	var top = this.container[0].offsetTop + this.container[0].offsetHeight - this.scrollBarEl[0].offsetHeight;
	return this.config.downArrow == 'true' ? (top - this.downArrow[0].offsetHeight) : top;
};

CustomScroll.prototype.getContentHeight = function(element) {
  var children = element.children;
  var len = children.length;
  var height = 0;
  for (var i = 0; i < len; i++) {
    height += children[i].offsetHeight;
  }
  return height;
};
