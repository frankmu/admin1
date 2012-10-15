Backbone.emulateHTTP = true;
Backbone.emulateJSON = true;

/***
	SINGLE ORG MODEL
***/
var Org = Backbone.Model.extend({
	url: CONF['api-host'],
	/*
		Save org to database - make an API call to org_create
	*/
	save: function(){
		function onErr(err) {
			alert('Error '+err.status);
		}
		var postBody = {name: this.get('name'), domain: this.get('domain')};
		var that = this;
		API.post('org_create', postBody, true, onErr, function(res){
			console.log(res);		
			that.set({token: res.token});
		});
		
	},
	
	remove: function(){
		function onErr(err) {
			alert('Error '+err.status);
		}
		var postBody = {token: this.get('token')};
		var that = this;
		API.post('org_delete', postBody, true, onErr, function(res){
			console.log(res);
		});
	}
});

/***
	SINGLE ORG VIEW
***/
var OrgView = Backbone.View.extend({
	tagName : "li",
	className : "org_view",
	events:{
		"click .org_delete": "delete_this",
		"click .org_edit": "select_this"
	},
	initialize: function(){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'select_this', 'delete_this');
	},
	render: function(){
	 	$(this.el).html("<div class='org_name'>"+this.model.get('name')+"</div><div class='org_edit'>Edit</div><div class='org_delete'>Delete</div>");
		return this;
	},
	/*
		Select this Org for editing
	*/
	select_this: function(){
		console.log(this.model.get('token'));
		// screens collection
		var screensCollection = new Screens([], {token: this.model.get('token')});
		var screensView = new ScreensView({collection: screensCollection, model: this.model});
		// render to screen
		screensCollection.fetch({
		  success : function(org) {
			$('#main').html(screensView.render().el);
		  },
		  error: function() {
			console.log('error fetching orgs collection!');
		  }
		});
	},
	/*
		Delete this Org from the list
	*/
	delete_this: function(){
		if (confirm('Are you sure you want to delete '+this.model.get('name')+'?')) {
			this.model.remove();
			this.collection.remove(this.model);
		}
	}
});

/***
	ORGS COLLECTION
***/
var Orgs = Backbone.Collection.extend({
  model : Org,
  url : function() {
    return CONF['api-host']+"/orgs";
  }
});

/***
	ORGS LIST VIEW
***/
var OrgsView = Backbone.View.extend({
  
  tagName : "ul",
  events:{
	"click .org_add":"add_org"  
  },
  
  initialize: function(){
	// every function that uses 'this' as the current object should be in here
	_.bindAll(this, 'render', 'add_org'); 
	
	// re-render when new comment is added
	this.collection.bind('add', this.render);
	this.collection.bind('remove', this.render);
  },
  
  render : function() {
	$(this.el).html(''); // clear element
    // for each comment, create a view and prepend it to the list.
    this.collection.each(function(org) {
      var orgView = new OrgView({ model : org, collection:this.collection });
	  $(this.el).append(orgView.render().el);
    }, this);
	
	//also append addOrg button
	$(this.el).prepend('<h1>Webitap Organizations</h1>');
	$(this.el).append('<li class="org_add">Add Org</li>');
	
    return this;
  },
  /*
  	Add org - open a form to add an org
  */
  add_org: function(){
	  // new form view
	  var add_org_view = new AddOrgView({collection:this.collection});
	  // append form to existin view
	  $(this.el).append(add_org_view.render().el);
	  
  }
  
});

/***
	ADD ORG VIEW
***/
var AddOrgView = Backbone.View.extend({
	tagName: 'div',
	className: 'addOrg_form',
	events:{
		"click #org_save": "org_save",
		"click #org_cancel": "org_cancel"
	},
	initialize: function(){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'org_save', 'org_cancel'); 
	},
	render: function(){
		var form = '<span>Name</span><br /><textarea rows="1" class="noresize" id="org_name"></textarea><br /><br /><span>Domain</span><br /> <textarea rows="1" class="noresize" id="org_domain"></textarea><br /><button id="org_cancel">Cancel</button><button id="org_save">Save</button>';
		$(this.el).html(form);
		return this;
	},
	
	org_save: function(){
		// new org model
		var org = new Org({'name':$('#org_name').val(), 'domain':$('#org_domain').val()});
		// add Org model to collection
		this.collection.add(org);
		//update database
		org.save();
		//remove this view
		$(this.el).remove();
	},
	
	org_cancel: function(){
		//remove this view
		$(this.el).remove();
	}

});
