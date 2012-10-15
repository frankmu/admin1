CONF={
	'api-host' : 'http://192.168.1.102:8080'	
}

function setStarsRating(id, rating){
	$(id).each(function(index) {	
		if(index<rating){
			$(this).attr('src', 'img/star_yellow.png');
		}
		else{
			$(this).attr('src', 'img/star_dark_grey.png');	
		}
	})
}

$(document).ready(function() {
	// show Org screens
	//fetch ORgs from server
	var orgsCollection = new Orgs();
	var orgsView = new OrgsView({ collection : orgsCollection });
	
	orgsCollection.fetch({
	  success : function(org) {
		$('#main').html(orgsView.render().el);
	  },
	  error: function() {
		console.log('error fetching orgs collection!');
	  }
	});
		
});