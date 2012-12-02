(function(){


    function BirdView(config) {
        View.apply(this, arguments);
        
        this.events = {
            'a': {
                click: function(e) {
					if(router.handleRoute(e.target.href)){
						e.preventDefault();
					}
                    
                    
                },
                
                mouseover: function(e) {
                    console.log('over');
                }
            }
        }
        
        this.template = Handlebars.templates.birds;
        
        this.init = function() {
            var that = this;	
			this.model.on('change', function(){
			    
				that.render();
			});
        }
        
    }
    
    BirdView.prototype.destroy = function(){
        
    }
    
    BirdView.prototype = new View({});
    
    window.BirdView = BirdView;
    
}());