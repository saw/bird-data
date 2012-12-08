(function(){
	
	function $(selector) {
		return document.querySelector(selector);
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

	function Slide(id, content, selector) {
		
		this.id = id;
		
		this.content = content;
		
		this._listeners = [];
		
		this.selector = selector;
		this._build();
	}
	
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
		this._handler = this.node.addEventListener('webkitTransitionEnd', function(e){
			if(!that || !that._listeners) {
				return;
			}
			var i;
			myNode.style.webkitTransition = '';
			moving = false;
			for (i=0; i < that._listeners.length; i++) {
				if(typeof that._listeners[i] == "function") {
					that._listeners[i]();
				}
			};
		});
	}
	
	Slide.prototype.setLeft = function(left) {
		
		this.node.style.webkitTransform = "translate3d(" + left + 'px,0,0)';
	}
	
	Slide.prototype.moveTo = function(pos) {
		this.node.style.webkitTransition = '-webkit-transform .2s ease-out';
		this.node.style.webkitTransform = "translate3d("+pos+"px,0,0)";
	}
	
	Slide.prototype.cleanTransitions = function() {
		this.node.style.webkitTransition = '';
	}
	
	Slide.prototype.hide = function() {
		this.node.style.display = 'none';
	}
	
	Slide.prototype.show = function() {
		this.node.style.display = 'block';
	}
	
	Slide.prototype.destroy = function() {
		console.log('destroying', this.id);
		this._listeners = [];
		if(this.node.parentNode) {
			this.node.parentNode.removeChild(this.node);
		}
		
	}

	var startSlide, nextSlide, lastSlide;
	var nextBird;
	var moving = false;
	var THRESHOLD = 100;
	var startSlide = new Slide(thisBird, false, '.slide');
	var nextSlide;
	var prevSlide;
	console.log(birds.nextBird());
	getBirdData(birds.nextBird().path, function(resp) {
		nextSlide = new Slide(birds.nextBird().name,  resp);
		nextSlide.hide();
		nextSlide.setLeft(window.innerWidth);
	});
	
	if(birds.prevBird()){
		getBirdData(birds.prevBird().path, function(resp) {
			prevSlide = new Slide(birds.prevBird().name, resp);
			prevSlide.hide();
			prevSlide.setLeft(-window.innerWidth);
		});
	}
	

	birds.birdAtOffset(-2) && getBirdData(birds.birdAtOffset(-2).path);
	birds.birdAtOffset(2) && getBirdData(birds.birdAtOffset(2).path);
	birds.birdAtOffset(3) && getBirdData(birds.birdAtOffset(3).path);
	
	function prepare() {
		if(birds.nextBird()) {
			getBirdData(birds.nextBird().path, function(resp) {
				nextSlide = new Slide(birds.nextBird().name, resp);
				nextSlide.hide();
				nextSlide.setLeft(window.innerWidth);
			});
		} else {
			prevSlide = false;
		}
		
		if(birds.prevBird()){
			getBirdData(birds.prevBird().path, function(resp) {
				prevSlide = new Slide(birds.prevBird().name, resp);
				prevSlide.hide();
				prevSlide.setLeft(-window.innerWidth);
			});
		} else {
			prevSlide = false;
		}
	}
	

	function goTo(direction) {
		moving = true;
		console.log('going to');
		if(direction == 1) {
			startSlide.moveTo(0 - window.innerWidth);
			nextSlide.moveTo(0);

			startSlide.onMoveEnd(function(){
				startSlide.destroy();
				prevSlide = startSlide;
				startSlide = nextSlide;
				birds.advance();
				prepare();
			});
		} else {
			startSlide.moveTo(window.innerWidth);
			nextSlide.moveTo(window.innerWidth);
			startSlide.onMoveEnd(function(){
				console.log('move end' + Math.random());
				console.log('destruction', startSlide.id);
				startSlide.destroy();
				startSlide = prevSlide;
				nextSlide = startSlide;
				birds.goBack();
				prepare();
			});
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
		var diff, anchor, direction = 0;
		
		if(moving) {
			return;
		}
		
		if(getAncestor(e.target, 'DIV').className == 'bd') {
			nextSlide.hide();
			return;
			
		} else {
			e.preventDefault();
		}
		
		switch (e.type) {
			case 'touchstart':
			
				startPoint = e.touches[0].pageX;
				startSlide.cleanTransitions();
				if(nextSlide) {
					nextSlide.cleanTransitions();
					nextSlide.show();
				}
				
				if(prevSlide) {
					prevSlide.cleanTransitions();
					prevSlide.show();
				}
				
				lastPos = e.touches[0].pageX;
				break;
				
			case 'touchmove':
				e.preventDefault();
				diff = e.touches[0].pageX - startPoint;

				
				startSlide.setLeft(diff);
				
				if(diff > 0) {
					prevSlide && prevSlide.setLeft(diff - window.innerWidth);
				} else {
					nextSlide && nextSlide.setLeft(diff + window.innerWidth);
				}
				
				lastPos = e.touches[0].pageX;
				break;
				
			case 'touchcancel':
			case 'touchend':
				diff = lastPos - startPoint;
				
				if(Math.abs(diff) < 5) {
					anchor = isLink(e.target);
					if(isLink(e.target)) {
						window.location = anchor.href;
					}
				}
				
				if(diff < -THRESHOLD && nextSlide) {
					goTo(1);
				}else if (diff > THRESHOLD && prevSlide) {
					goTo(-1);
				} else {
					startSlide.moveTo(0);
					nextSlide.moveTo(window.innerWidth);
					prevSlide.moveTo(-window.innerWidth);
				}
				break;
		}

		
	}
	
	var header = document.querySelector('.header');
	document.addEventListener('touchstart', handleTouch);
	document.addEventListener('touchmove', handleTouch);
	document.addEventListener('touchend', handleTouch);
	
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
	
	
	

}());