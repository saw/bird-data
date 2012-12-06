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
				cache[key] = {val:value, i:index};
				meta.sort(sorter);
				
				//evict old values
				while(meta.length > 10) {
					toPurge = meta.shift();
					delete cache[toPurge.key];
				}
				
				var len = meta.length;
				
				for (var i=0; i < len; i++) {
					cache[meta[i].key].i = i;
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
		
		
		
		function nextBird() {
			console.log('next id', currentBird + 1);
			return myBirdList[currentBird + 1];
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
			
			currentBird = birdMap[birdname];
		}
		
		
		return {
			init:init,
			nextBird:nextBird,
			prevBird:prevBird,
			thisBird:getThisBird,
			advance:function() {
				if(myBirdList[currentBird + 1]) {
					currentBird++;
				}
			},
			setBird:setBird
		}
		
	}());
	
	birds.init();

	
	
	function Slide(id, data, selector) {
		
		this.id = id;
		
		this.data = data;
		
		this._listeners = [];
		
		this.selector = selector;
		this._build();
	}
	
	Slide.prototype.onMoveEnd = function(callback) {
		this._listeners.push(callback);
	}
	
	Slide.prototype._build = function(){
		if(this.selector) {
			this.node = $(this.selector);
		} else {
			var div = document.createElement('div');
			div.innerHTML = Handlebars.templates.birds(this.data);
			this.node = div.querySelector('.slide');
			document.querySelector('.view').appendChild(this.node);
		}
		
		this.node.id = this.id;
		this.node.style.height = window.innerHeight + "px";
		this.node.style.width = window.innerWidth + "px";
		
		var myNode = this.node;
		var that = this;
		this.node.addEventListener('webkitTransitionEnd', function(e){
			myNode.style.webkitTransition = '';
			
			for (var i=0; i < that._listeners.length; i++) {
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
		this.node.style.webkitTransition = '-webkit-transform 1s ease-out';
		this.node.style.webkitTransform = "translate3d("+pos+"px,0,0)";
	}
	
	Slide.prototype.cleanTransitions = function() {
		this.node.style.webkitTransition = '';
	}
	
	Slide.prototype.destroy = function() {
		this.node.parentNode.removeChild(this.node);
	}

	var startSlide, nextSlide, lastSlide;
	
	var nextBird;
	

		var startSlide = new Slide(thisBird, {}, '.slide');
		var nextSlide;

		nextBird = new BirdModel({name:birds.nextBird().name.replace(' ', '_')});
		nextBird.on('change', function(){
			nextSlide = new Slide('Black-billed_Magpie', nextBird.toJSON());
			nextSlide.setLeft(window.innerWidth);
		});
		nextBird.load();


	
	var lastPos, startPoint;
	
	function isLink(element) {
		if(!element.tagName) {
			return false;
		}
		
		if (element.tagName == 'A') {
			return true;
		} else if(element.tagName !== 'BODY'){
			return isLink(element.parentNode);
		} else {
			return false
		}
	}
	
	function handleTouch(e) {
		e.preventDefault();
		var diff;
		
		switch (e.type) {
			case 'touchstart':
				startPoint = e.touches[0].pageX;
				startSlide.cleanTransitions();
				nextSlide.cleanTransitions();
				lastPos = e.touches[0].pageX;
				break;
			case 'touchmove':
				diff = e.touches[0].pageX - startPoint
				startSlide.setLeft(diff);
				nextSlide.setLeft(diff + window.innerWidth);
				lastPos = e.touches[0].pageX;
				break;
			case 'touchcancel':
			case 'touchend':
				diff = lastPos - startPoint;
				if(Math.abs(diff) < 5) {
					if(isLink(e.target)) {
						alert('link');
					}
				}
				
				if(diff < -200) {
					startSlide.moveTo(0 - window.innerWidth);
					nextSlide.moveTo(0);
					startSlide.onMoveEnd(function(){
						
						startSlide.destroy();
						startSlide = nextSlide;
						birds.advance();
						nextBird = new BirdModel({name:birds.nextBird().name.replace(' ', '_')});
						nextBird.on('change', function(){
							nextSlide = new Slide(nextBird.get('id'), nextBird.toJSON());
							nextSlide.setLeft(window.innerWidth);
						});
						nextBird.load();
						
					})
				} else {
					startSlide.moveTo(0);
					nextSlide.moveTo(window.innerWidth);
				}
				break;
		}

		
	}
	
	document.addEventListener('touchstart', handleTouch);
	document.addEventListener('touchmove', handleTouch);
	document.addEventListener('touchend', handleTouch);
	
	
	

}());