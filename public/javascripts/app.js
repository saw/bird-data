(function(){
	
	function $(selector) {
		return document.querySelector(selector);
	}
	
	var TRANSITION     = 'transition',
		TRANSFORM      = 'transform',
		TRANSITION_END = 'transitionend',
		TRANSFORM_CSS  = 'transform',
		TRANSITION_CSS = 'transition';

	if(typeof document.body.style.webkitTransform !== "undefined") {
		TRANSITION = 'webkitTransition';
		TRANSFORM = 'webkitTransform';
		TRANSITION_END = 'webkitTransitionEnd';
		TRANSFORM_CSS = '-webkit-transform';
		TRANSITION_CSS = '-webkit-transition'
	}
	
	//a simple LRU cache to store models
	var modelCache = function() {
		
		var cache = {};
		
		var meta = [];
		
		//keep the array order by most recently sed
		function sorter(a,b){
			
			if(a.lu < b.lu) {
				return -1;
			}
			if(a.lu > b.lu) {
				return 1;
			}
			
			return 0;
		}
  
		return {
			set: function(key, value) {
				var index, toPurge, len;
				
				//index is where to find the meta in the array
				index = meta.push({key:key, lu:Date.now()});
				//cache stores a reference to the meta
				if(!cache[key]) {
					cache[key] = {val:value, i:index};
				} else {
					return;
				}
				meta.sort(sorter);
				
				//evict old values
				while(meta.length > 10) {
					toPurge = meta.shift();

					delete cache[toPurge.key];
				}
				
				var len = meta.length;

				for (var i=0; i < len; i++) {
					if(cache[meta[i].key]) {
						cache[meta[i].key].i = i;
					}
				};

			},
			
			//get function updates the last used time
			get: function(key) {
				if(cache[key]){
					meta[cache[key].i].lu = Date.now();
					return cache[key].val;
				}
			}
		}
		
	}();
	
	var birds = (function() {
		var currentBird,
		myBirdList,
			
		currentBird,
		myBirdList = birdList;
		
		var birdMap = {};
		

		function init() {
			for (var i=0, len = myBirdList.length; i < len; i++) {
				birdMap[myBirdList[i].name] = i;
			}
			
			setBird(thisBird);
		}
		
		function getInfo(id) {
			return myBirdList[id];
		}
		
		function nextBird() {
			return myBirdList[currentBird + 1];
		}
		
		function birdAtOffset(offset) {
			return myBirdList[currentBird + offset];
		}
		
		function getThisBird() {
			return myBirdList[currentBird];
		}
		
		function prevBird() {
			return myBirdList[currentBird - 1];
		}
		
		function setBird(birdname) {
			
			//if it is a path or underscore version
			if(birdname.indexOf('_') !== -1) {
				//sometimes it might have the /bird/ in front of it
				//but this thing won't car/
				matches = birdname.match(/(?:\/bird\/)?(.+)/);
				birdname = matches[1].replace('_', ' ');
			}
			console.log('setting bird to '+ birdname);
			currentBird = birdMap[birdname];
		}
		
		function shift(amount) {
			if(myBirdList[currentBird + amount]) {
				currentBird = currentBird + amount;
			}
		}
		
		return {
			init:init,
			nextBird:nextBird,
			prevBird:prevBird,
			thisBird:getThisBird,
			birdAtOffset:birdAtOffset,
			advance:function() {
				shift(1);
			},
			goBack: function() {
				shift(-1)
			},
			setBird:setBird
		}
		
	}());
	
	birds.init();
	
	 function makeRequest(url, callback, scope) {
		
		var xhr = new XMLHttpRequest();
		var cb = callback, sc = scope;
		xhr.open('get', url, true);
		
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 ) {
				cb.apply(sc, [this]);
			}
		}
		xhr.send();
	}
	
	function getBirdData(path, callback) {
		path = path.replace('/bird/', '/fragments/');
		var data = modelCache.get(path);
		
		if(data) {
			window.setTimeout(function(){
				callback && callback(data);
			}, 1);
			return;
		}
		
		makeRequest(path, function(xhr) {
			modelCache.set(path, xhr.responseText);
			callback && callback(xhr.responseText);
		})
	}

	/*
	 * id is the unique DOM idea
	 * content is the html that this slide represents
	 * and the selector is used in the case that the slide
	 * content is already on the page 
	 */
	function Slide(id, content, selector) {
		
		this.id = id;
		
		this.content = content;
		
		this._listeners = [];
		
		this.selector = selector;
		this._build();
	}
	
	/*
	 * register a listener to be notified when the
	 * transition is over 
	 */
	Slide.prototype.onMoveEnd = function(callback) {
		this._listeners.push(callback);
	}
	
	Slide.prototype._build = function(){
		
		var myNode, that, div;
		
		if(this.selector) {
			this.node = $(this.selector);
		} else {
			div = document.createElement('div');
			div.innerHTML = this.content;
			this.node = div.querySelector('.slide');
			document.querySelector('.view').appendChild(this.node);
		}
		
		this.node.id = this.id;
		myNode = this.node;
		that = this;
		this._handler = this.node.addEventListener(TRANSITION_END, function(e){
			if(!that || !that._listeners) {
				return;
			}
			var i;
			that.cleanTransitions();
			moving = false;
			for (i=0; i < that._listeners.length; i++) {
				if(typeof that._listeners[i] == "function") {
					that._listeners[i]();
				}
			};
		});
	}
	
	Slide.prototype.setLeft = function(left) {
		// this.node.style.left = left + 'px';
		this.node.style[TRANSFORM] = "translate3d(" + left + 'px,0,0)';
	}
	
	Slide.prototype.moveTo = function(pos) {
		this.node.style[TRANSITION] = TRANSFORM_CSS +' .2s ease-out';
		this.node.style[TRANSFORM] = "translate3d("+pos+"px,0,0)";
	}
	
	Slide.prototype.cleanTransitions = function() {
		this.node.style[TRANSITION] = '';
	}
	
	Slide.prototype.hide = function() {
		this.node.style.display = 'none';
	}
	
	Slide.prototype.show = function() {
		this.node.style.display = 'block';
	}
	
	/* remove from the DOM. This will also allow the garbage collector
	 * to clean up listeners
	 */
	Slide.prototype.destroy = function() {
		this._listeners = [];
		if(this.node.parentNode) {
			this.node.parentNode.removeChild(this.node);
		}	
	}

	var currentSlide, nextSlide, lastSlide,
	nextBird,
	moving = false,
	THRESHOLD = 100,
	nextSlide,
	prevSlide;
	

	
	function prepare() {
		// return;

		var nextBird = birds.nextBird(),
		    prevBird = birds.prevBird();
		
		if(nextBird && (!nextSlide || nextSlide.id !== nextBird)) {
			getBirdData(birds.nextBird().path, function(resp) {
				nextSlide = new Slide(birds.nextBird().name, resp);
				nextSlide.hide();

				nextSlide.setLeft(window.innerWidth);
			});
		} else if(!nextBird) {
			nextSlide = false;
		}
		if(prevBird && (!prevSlide || prevSlide.id != prevBird)){
			getBirdData(birds.prevBird().path, function(resp) {
				console.time('build');
				prevSlide = new Slide(birds.prevBird().name, resp);
				console.timeEnd('build');
				prevSlide.hide();
				prevSlide.setLeft(-window.innerWidth);
			});
		} else if (!prevBird){
			prevSlide = false;
		}
	}
	

	function goTo(direction) {
		moving = true;

		if(direction == 1) {

			currentSlide.onMoveEnd(function(){
				currentSlide.destroy();
				prevSlide = currentSlide;
				currentSlide = nextSlide;
				birds.advance();
				prepare();
			});
			
			currentSlide.moveTo(0 - window.innerWidth);
			nextSlide.moveTo(0);
			
		} else {
			
			currentSlide.onMoveEnd(function(){
				currentSlide.destroy();
				currentSlide = prevSlide;
				nextSlide = currentSlide;
				birds.goBack();
				prepare();
			});
			
			currentSlide.moveTo(window.innerWidth);
			nextSlide.moveTo(window.innerWidth);
			prevSlide.moveTo(0);
			
		}

	}

	function isLink(element) {
		return getAncestor(element, 'A');
	}
	
	function getAncestor(element, tag) {
		if(!element.tagName || !tag) {
			return false;
		}
		if (element.tagName == tag) {
			return element;
		} else if(element.tagName !== 'BODY'){
			return getAncestor(element.parentNode, tag);
		} else {
			return false
		}
	}
	
	var lastPos, startPoint;
	
	function handleTouch(e) {
		try {
			
		var diff, anchor, direction = 0;
		
		if(moving) {
			return;
		}
		
		//if the target is inside the scrollable area,
		//stop handling events
		if(getAncestor(e.target, 'DIV').className == 'bd') {
			nextSlide.hide();
			return;	
		} else {
			e.preventDefault();
		}
		
		switch (e.type) {
			case 'MSPointerDown':
			case 'touchstart':

				startPoint = e.touches ? e.touches[0].pageX : e.screenX;
				//make sure transitions are cleaned off
				currentSlide.cleanTransitions();
				
				//show the hidden slides
				if(nextSlide) {
					nextSlide.cleanTransitions();
					nextSlide.show();
				}
				
				if(prevSlide) {
					prevSlide.cleanTransitions();
					prevSlide.show();
				}
				
				lastPos = e.touches ? e.touches[0].pageX : e.screenX;
				break;
			case 'MSPointerMove':
			
			case 'touchmove':
				// e.preventDefault();
				diff = e.touches ? e.touches[0].pageX - startPoint : e.screenX - startPoint;
				//move all three slides together
				currentSlide.setLeft(diff);
				if(diff > 0) {
					prevSlide && prevSlide.setLeft(diff - window.innerWidth);
				} else {
					nextSlide && nextSlide.setLeft(diff + window.innerWidth);
				}
				
				lastPos = e.touches ? e.touches[0].pageX : e.screenX;
				break;
				
			case 'MSPointerUp':
			case 'touchcancel':
			case 'touchend':
				diff = lastPos - startPoint;
				
				title.innerHTML = diff;
				//if the swipe was very short,
				//and on an anchor, assume it was a tap
				if(Math.abs(diff) < 5) {
					anchor = isLink(e.target);
					if(isLink(e.target)) {
						window.location = anchor.href;
					}
				}			
				//figure out if we are advancing,
				//going back or going nowhere
				if(diff < -THRESHOLD && nextSlide) {
					goTo(1);
				}else if (diff > THRESHOLD && prevSlide) {
					goTo(-1);
				} else {
					//snap back if we are going nowhere
					currentSlide.moveTo(0);
					nextSlide.moveTo(window.innerWidth);
					prevSlide.moveTo(0-window.innerWidth);
				}
				break;
		}
		
	}catch (e) {
		alert(JSON.stringify(e));
	}
	}
	
	var previousOrientation = 0;
	function checkOrientation(){
		if(window.orientation !== previousOrientation){
			previousOrientation = window.orientation;
			THRESHOLD = 25;
		 }
	};

	window.addEventListener("resize", checkOrientation);
	window.addEventListener("orientationchange", checkOrientation);
	setInterval(checkOrientation, 2000);
	
	//The First slide
	currentSlide = new Slide(thisBird, false, '.slide');
	prepare();
	
	document.addEventListener('touchstart', handleTouch);
	document.addEventListener('touchmove', handleTouch);
	document.addEventListener('touchend', handleTouch);
	
	var title = document.querySelector('.title');
	var targ = document.querySelector('body');
	
	document.addEventListener('MSPointerDown', handleTouch, false);
	document.addEventListener('MSPointerMove', handleTouch, false);
	document.addEventListener('MSPointerUp', handleTouch, false);
	title.innerHTML = 478;
	
	//prime the cache
	birds.birdAtOffset(-2) && getBirdData(birds.birdAtOffset(-2).path);
	birds.birdAtOffset(2) && getBirdData(birds.birdAtOffset(2).path);
	birds.birdAtOffset(3) && getBirdData(birds.birdAtOffset(3).path);

}());