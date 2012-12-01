(function(){
    router.addRoute(/^\/$/, homePage, homePage);
    router.addRoute(/\/bird\/(.+)/, birdPage, birdPage);
	
	
	function homePage(path) {
	    console.log('home!');
	}
	
	function birdPage(path) {
	    console.log('bird');
	}
	
	document.body.addEventListener('click', function(e){
	    e.preventDefault();
	    router.handleRoute(e.target.href);
	})
}());