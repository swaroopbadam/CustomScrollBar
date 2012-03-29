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
CustomScroll.prototype.PAGE_DOWN_KEY_SCROLL = 430;
CustomScroll.prototype.DOWN_KEY_SCROLL = 40;
CustomScroll.prototype.MOUSE_WHEEL_SCROLL = 40;


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
	this.container.css('overflow', 'hidden');
	this.container.attr('tabindex', '0');
	this.createScrollBar();
	this.initEventHandlers();
	this.mouseX = 0;
	this.mouseY = 0;
};

//CustomScroll.prototype.updateMaxScrollTop = function() {
//	var scrollTop = this.container[0].scrollTop;
//	var contentHeight = window.getContentHeight(this.container[0]);
//	this.container[0].scrollTop = contentHeight;
//	this.maxScrollTop = this.container[0].scrollTop;
//	this.container[0].scrollTop = scrollTop;
//};

CustomScroll.prototype.createScrollBar = function() {
	this.makeChildrenAsSingleNode(this.container);
	this.scrollBarWrap = $('<div></div>').appendTo(this.container);
	var columnDiv = $('<div></div>');
	columnDiv.width(parseInt(this.config.colW) + 'px');
	columnDiv.height(this.container[0].offsetHeight);
	columnDiv.css('position', 'relative');
	columnDiv.addClass('scrollBarColumn');
	columnDiv.css('float', 'left');
	columnDiv.css('top', (-this.contentEl[0].offsetHeight) + 'px');
	columnDiv.css('left', (this.container.width() - parseInt(this.config.colW)) + 'px');
	this.scrollBarColumn = columnDiv.appendTo(this.scrollBarWrap);
	if (this.config.verticalColumn == 'true') {
		columnDiv.css('background-color', this.config.colColor);
		columnDiv.css('opacity', this.config.colOpacity);
	}
	var scrollBarDiv = $('<div></div>');
	scrollBarDiv.width(parseInt(this.config.barW) + 'px');
	if (this.config.barH == 'auto') {
		scrollBarDiv.height(this.getScrollBarHeight() + 'px');
	} else {
		scrollBarDiv.height(parseInt(this.config.barH) + 'px');
	}
	scrollBarDiv.css('position', 'relative');
	scrollBarDiv.addClass('scrollBar');
	scrollBarDiv.css('background-color', this.config.barColor);
//	scrollBarDiv.css('border-radius', '8px');
	scrollBarDiv.css('cursor', 'pointer');
	scrollBarDiv.css('opacity', this.config.barOpacity);
	scrollBarDiv.css('top', (-this.contentEl[0].offsetHeight) + 'px');
	scrollBarDiv.css('left', (this.container.width() - parseInt(this.config.barW)) + 'px');
	this.scrollBarEl = scrollBarDiv.appendTo(this.scrollBarWrap);
//	var scrollUpButton = $('<div></div>');
//	scrollUpButton.width('15px');
//	scrollUpButton.height('20px');
//	scrollUpButton.css('position', 'relative');
//	scrollUpButton.css('float', 'left');
//	scrollUpButton.css('background-color', 'black');
//	scrollUpButton.css('opacity', '0.8');
//	scrollUpButton.css('top', (-this.contentEl[0].offsetHeight) + 'px');
//	scrollUpButton.css('left', (this.container.width() - 15) + 'px');
//	this.scrollUpButton = scrollUpButton.appendTo(this.scrollBarWrap);
//	var scrollDownButton = $('<div></div>');
//	scrollDownButton.width('15px');
//	scrollDownButton.height('20px');
//	scrollDownButton.css('position', 'relative');
//	scrollDownButton.css('background-color', 'black');
//	scrollDownButton.css('opacity', '0.8');
//	scrollDownButton.css('top', (-this.contentEl[0].offsetHeight + this.container[0].offsetHeight - 15) + 'px');
//	scrollDownButton.css('left', (this.container.width() - 15) + 'px');
//	this.scrollDownButton = scrollDownButton.appendTo(this.scrollBarWrap);
};

/* Calculates the scroll bar height using the expression
 * x = % of container height in content height (containerHeight * 100 / contentHeight)
 * scrollbar height = x % of container height (x * containerHeight / 100)
 * @return {Number}
 */
CustomScroll.prototype.getScrollBarHeight = function() {
	var scrollBarHeight = Math.pow(this.container[0].offsetHeight, 2) / this.contentEl[0].offsetHeight;
	return scrollBarHeight > 20 ? scrollBarHeight : 20;
};

CustomScroll.prototype.initEventHandlers = function() {
	var obj = this;
	this.scrollBarEl.on('mousedown', function(evt){obj.onScrollBarMouseDown(evt);});
	var mousewheelevt = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x
	this.container.on(mousewheelevt, function(evt){obj.onMouseScroll(evt);});
	this.container.on('keydown', function(evt){obj.onKeyDown(evt);});
	if (this.config.verticalColumn == 'true' && this.scrollBarColumn) {
		this.scrollBarColumn.on('mousedown', function(evt){obj.onColumnMouseDown(evt);});
		this.scrollBarColumn.on('mouseup', function(evt){obj.onColumnMouseUp(evt);});
	}
	this.container.on('mousedown', function(evt){obj.onContainerMouseDown(evt);});
//	this.attachMouseOverHandlers();
};

CustomScroll.prototype.reInit = function() {
	if (this.config.barH == 'auto') {
		this.scrollBarEl.height(this.getScrollBarHeight() + 'px');
	}
	this.adjustScrollBarPosition();
};

CustomScroll.prototype.onContainerMouseDown = function(evt) {
	if (evt.target == this.scrollBarEl[0]) {
		return;
	}
	var obj = this;
	this.containerMouseDownPageY = evt.pageY;
	$(document).on('mousemove', function(evt){obj.onContainerMouseMove(evt);});
	$(document).one('mouseup', function(evt){obj.onContainerMouseUp(evt);});
};

CustomScroll.prototype.onContainerMouseMove = function(evt) {
	var diff = evt.pageY - (this.container[0].offsetTop + this.container[0].offsetHeight);
	if (diff > 0) {
		this.scrollBy(diff * 5);
		return;
	}
	diff = this.container[0].offsetTop - evt.pageY;
	if (diff > 0) {
		this.scrollBy(- diff * 5);			
		return;
	}
};

CustomScroll.prototype.onContainerMouseUp = function(evt) {
	$(document).off('mousemove');
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
	// scrollBarTop : substracting container scrollTop and contentEl height to obtain the scrollbar's displacement from containers upper end.
	var scrollBarTop = parseInt(this.scrollBarEl.css('top')) - this.container[0].scrollTop - (-this.contentEl[0].offsetHeight);
	var totalTop = scrollBarTop + this.container[0].offsetTop;
	if (this.columnMouseDownPageY < totalTop) {
		this.scrollBy(-200);
		if (this.columnMouseDownPageY > totalTop) {
			this.columnMouseDown = false;
			return;
		}
	} else if (this.columnMouseDownPageY > (totalTop + this.scrollBarEl[0].offsetHeight)) {
		this.scrollBy(200);
		if (this.columnMouseDownPageY < totalTop) {
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
	} else {
		return true;
	}
	if (!this.hasScrolledToTopOrBottom()) {
		evt.stopPropagation();
	}
};

CustomScroll.prototype.hasScrolledToTopOrBottom = function() {
	if (this.container[0].scrollTop == 0) {
		return true;
	}
	if (this.container[0].scrollTop == this.getMaxScrollTop()) {
		return true;
	}
};

CustomScroll.prototype.scrollToHome = function() {
	this.container[0].scrollTop = 0;
	this.scrollBarEl.css('top', this.container[0].offsetTop + 'px');
};

CustomScroll.prototype.scrollToEnd = function() {
	this.container[0].scrollTop = this.getMaxScrollTop();
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
		evt.stopPropagation();
	}
};

CustomScroll.prototype.scrollBy = function(amount) {
	var maxScrollTop = this.getMaxScrollTop();
	if (amount > 0 && this.container[0].scrollTop >= maxScrollTop) {
		return;
	}
	if (amount < 0 && this.container[0].scrollTop == 0) {
		return;
	}
	amount = ((this.container[0].scrollTop + amount) > maxScrollTop) ? (maxScrollTop - this.container[0].scrollTop) : amount;
	this.container[0].scrollTop += amount;
	this.adjustScrollBarPosition();
	console.log('this.container[0].scrollTop:' + this.container[0].scrollTop);
};

CustomScroll.prototype.adjustScrollBarPosition = function() {
	this.scrollBarEl.css('top', (-this.contentEl[0].offsetHeight + this.container[0].scrollTop) + 'px');
	this.scrollBarColumn.css('top', (-this.contentEl[0].offsetHeight + this.container[0].scrollTop) + 'px');
	var top = this.container[0].scrollTop * (this.container[0].offsetHeight - this.scrollBarEl[0].offsetHeight) / this.getMaxScrollTop();
	this.scrollBarEl.css('top', (parseInt(this.scrollBarEl.css('top')) + top) + 'px');
};

CustomScroll.prototype.adjustContainerScrollTop = function() {
	var scrollTop = (this.scrollBarEl[0].offsetTop - this.container[0].offsetTop) * this.getMaxScrollTop() / (this.container[0].offsetHeight - this.scrollBarEl[0].offsetHeight);
	this.container[0].scrollTop = scrollTop;
};

CustomScroll.prototype.getScrollBarTopByScrollTop = function(scrollTop) {
	return scrollTop * (this.container[0].offsetHeight - this.scrollBarEl[0].offsetHeight) / this.getMaxScrollTop();
};

CustomScroll.prototype.getScrollTopByScrollBarTop = function(scrollBarTop) {
	return scrollBarTop *  this.getMaxScrollTop() / (this.container[0].offsetHeight - this.scrollBarEl[0].offsetHeight);
};

CustomScroll.prototype.onDocumentMouseMove = function(evt) {
	if (window.getSelection)
		window.getSelection().removeAllRanges();
	var mouseY = this.mouseY;
	var mouseMoveY = evt.pageY - mouseY;
	this.mouseY = evt.pageY;
	this.scrollBy(this.getScrollTopByScrollBarTop(mouseMoveY));
};

CustomScroll.prototype.onDocumentMouseUp = function(evt) {
	$(document).off('mousemove');
};

CustomScroll.prototype.getMaxScrollTop = function() {
	return this.contentEl[0].offsetHeight - this.container[0].offsetHeight;
};

CustomScroll.prototype.getScrollBarMinTop = function() {
	return this.config.topArrow == 'true' ? (-this.contentEl[0].offsetHeight + this.topArrow[0].offsetHeight) : (-this.container[0].offsetTop);
};

CustomScroll.prototype.getScrollBarMaxTop = function() {
	return this.config.downArrow == 'true' ? (-this.scrollBarEl[0].offsetHeight - this.downArrow[0].offsetHeight) : (-this.scrollBarEl[0].offsetHeight);
};

CustomScroll.prototype.makeChildrenAsSingleNode = function(element) {
	var singleNode = $('<div></div>');
	element.children().appendTo(singleNode);
	this.contentEl = singleNode.appendTo(element);
};

window.getContentHeight = function(element) {
    var children = element.children;
    var len = children.length;
    var height = 0;
    for (var i = 0; i < len; i++) {
        height += children[i].offsetHeight;
    }
    return height;
};
