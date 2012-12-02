(function(){


    function BirdView(config) {
        View.apply(this, arguments);
        
        this.events = {
            'a': {
                click: function(e) {
                    e.preventDefault();
                    console.log(e);
                }
            }
        }
        
        this.template = Handlebars.templates.birds;
        
        this.init = function() {
            var that = this;	
			this.model.on('change', function(){
			    console.log('change');
				that.render();
			});
        }
        
    }
    
    BirdView.prototype = new View({});
    
    window.BirdView = BirdView;
    
}());