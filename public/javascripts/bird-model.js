(function(){
    
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
	
    function BirdModel(data) {
        Model.apply(this, arguments);
    } 

    BirdModel.prototype = new Model();

    BirdModel.prototype.load = function(){

        makeRequest('/bird/' + this._data['name'] + '?data=1', function(resp){
            
            var response = JSON.parse(resp.responseText);
            
            this.setData(response);
            
        }, this);
    }
    
    window.BirdModel = BirdModel;
    
}());

