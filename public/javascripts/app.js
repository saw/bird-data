(function(){
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
	
	
	function homePage(path) {
	    homeView.render();
	}
	
	function birdPage(path) {
	    var name = path.match(/bird\/(.+)/)[1];
	    var bird = new BirdModel({name:name});
	    var view = new BirdView({
	        container: '.view',
	        model: bird
	    });
	    view.init();
	    view.render();
	    bird.load();
	}

	document.body.addEventListener('click', function(e){
	    

	})
}());