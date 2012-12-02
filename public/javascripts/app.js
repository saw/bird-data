(function(){
	
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
	
	var currentViews = {};
	
	router.addRoute(/^\/$/, homePage, homePage);
	router.addRoute(/\/bird\/(.+)/, birdPage, birdPage);
	
	var homeModel = new Model({birds:window.birdList});
	
	var homeView = new View({
		model: homeModel,
		template:Handlebars.templates.indexs,
		container:'.view',
		events:{
			'a': {
				click: function(e){
					if(router.handleRoute(e.target.href)) {
						e.preventDefault();
					}
				}
			}
		}
	});
	
	var navModel = new Model({
		birds:window.birdList,
		currentBird:null,
		nextBird:null,
		prevBird:null
	});
	
	navModel.setBird = function(name) {
		var birds = this.get('birds');
		var name = name.replace('_', ' ');
		for (var i=0, len = birds.length; i < len; i++) {
			if(birds[i].name == name) {
				this.setData({
					currentBird:birds[i],
					prev:birds[i-1],
					next:birds[i+1]
				});
			}
		}

	}
	
	var navView = new View({
		container:'#nav',
		model:navModel,
		events: {
			'.navlink' : {
				click: function(e){
					if(router.handleRoute(e.target.href)) {
						e.preventDefault();
					}
				}
			}
		},
		init:function(){
			var that = this;
			this.model.on('change', function(){
				that.render();
			});
		}
	});
	
	navView.render = function() {
		var container = this.getContainer();
		var model = this.model;
		if(model.get('next')) {
			container.querySelector('.next').href = model.get('next').path;
		}
	}
	
	function homePage(path) {
		if(birdView) {
			birdView.destroy();
			birdView = null;
		}
		
		homeView.render();
	}
	
	var birdView = false;
	function birdPage(path) {
		if(birdView) {
			birdView.destroy();
		}
		
		var name = path.match(/bird\/(.+)/)[1];
		navModel.setBird(name);
		var bird = modelCache.get(name);
		if(!bird) {
			bird = new BirdModel({name:name});
			modelCache.set(name, bird);
		}
		birdView = new BirdView({
			container: '.view',
			model: bird
		});
		birdView.init();
		birdView.render();
		bird.load();
	}

	document.body.addEventListener('click', function(e){
		

	})
}());