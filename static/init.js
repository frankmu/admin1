CONF={
	'api-host' : 'http://192.168.1.106:8080'	
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