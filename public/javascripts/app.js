(function(){
    
    var modelCache = function() {
        
        var cache = {};
        
        var meta = [];
        
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
                
                var index = meta.push({key:key, lu:Date.now()});
                console.log(index);
                cache[key] = {val:value, i:index};
                meta.sort(sorter);
                
                var toPurge;
                while(meta.length > 10) {
                    toPurge = meta.shift();
                    console.log('evicting ' + toPurge.key);
                    delete cache[toPurge.key];
                }
                
                var len = meta.length;
                
                for (var i=0; i < len; i++) {
                    cache[meta[i].key].i = i;
                };
                console.log('meta length', meta.length);
                console.log(cache);
            },
            
            get: function(key) {
                if(cache[key]){
                    meta[cache[key].i].lu = Date.now();
                    return cache[key].val;
                }
            }
        }
        
    }();
    
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
                },
                
                hover: function(e) {
                    var name = e.target.href.match(/\/bird\/(.+)/);
                    if(name){
                        var model = new BirdModel({name:name[1]});
                        model.load();
                        modelCache[name[1]] = model;
                    }
                }
            }
        }
    });
	
	function homePage(path) {
	    if(birdView) {
	        birdView.destroy();
    	    birdView = null;
	    }
	    
	    homeView.render();
	}
	
	var birdView = false;
	function birdPage(path) {
	    var name = path.match(/bird\/(.+)/)[1];
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