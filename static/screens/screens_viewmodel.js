/***
	SINGLE SCREEN MODEL
***/
var Screen = Backbone.Model.extend({
	url: CONF['api-host'],
	/*
		Save org to database - make an API call to org_create
	*/
	save: function(){
		function onErr(err) {
			alert('Error '+err.status);
		}
		var postBody = {org_token: this.get('org_token'), name: this.get('name'), type: this.get('type')};
		var that = this;
		API.post('screen_create', postBody, true, onErr, function(res){
			console.log(res);		
			that.set({token: res.token});
		});
		
	},
	
	remove: function(){
		function onErr(err) {
			alert('Error '+err.status);
		}
		var postBody = {org_token: this.get('org_token'), token: this.get('token')};
		var that = this;
		API.post('screen_delete', postBody, true, onErr, function(res){
			console.log(res);
		});
	}
});

/***
	SINGLE SCREEN VIEW. Model: ScreenModel
***/
var ScreenView = Backbone.View.extend({
	tagName : "li",
	className : "screen_view",
	events:{
		"click .screen_delete": "delete_this",
		"click .screen_edit": "select_this"
	},
	initialize: function(){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'select_this', 'delete_this');
	},
	render: function(){
	 	$(this.el).html("<div class='screen_name'>"+this.model.get('name')+"</div><div class='screen_edit'>Edit</div><div class='screen_delete'>Delete</div>");
		return this;
	},
	/*
		Select this Screen for editing
	*/
	select_this: function(){
		console.log(this.model.get('token'));
		// screens collection
		var itemsCollection = new Items([], {token: this.model.get('token')});
		var itemsView = new ItemsView({collection: itemsCollection, model: this.model});
		// render to screen
		itemsCollection.fetch({
		  success : function() {
			$('#main').html(itemsView.render().el);
		  },
		  error: function() {
			console.log('error fetching screens collection!');
		  }
		});
	},
	/*
		Delete this Screen from the list
	*/
	delete_this: function(){
		if (confirm('Are you sure you want to delete '+this.model.get('name')+'?')) {
			this.model.remove();
			this.collection.remove(this.model);
		}
	}
});

/*** 
	SCREENS LIST VIEW
***/		
var ScreensView = Backbone.View.extend({
	tagName : "ul",
	className : "screens_view",
	events: {
		"click .screen_add":"add_screen"
	},
	initialize: function(){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'add_screen'); 
		
		// re-render when new comment is added
		this.collection.bind('add', this.render);
		this.collection.bind('remove', this.render);
	},
	
	render : function() {
		$(this.el).html(''); // clear element
		// for each comment, create a view and prepend it to the list.
		this.collection.each(function(Screen) {
		  var screenView = new ScreenView({ model : Screen, collection:this.collection });
		  $(this.el).append(screenView.render().el);
		}, this);
		
		//also append addOrg button
		$(this.el).prepend('<div class="screen_add">Add Screen</div>');
		$(this.el).prepend('<h1>'+this.model.get('name')+' Screens</h1>');
		
		return this;
	},
	/*
	Add screen - open a form to add a screen
	*/
	add_screen: function(){
	  // new form view
	  var add_screen_view = new AddScreenView({collection:this.collection, model:this.model});
	  // append form to existin view
	  $(this.el).append(add_screen_view.render().el);
	  
	}
});

/***
	SCREENS COLLECTION
***/
var Screens = Backbone.Collection.extend({
  model : Screen,
  initialize : function(models, options) {
    this.token = options.token; // item_token
  },
  url : function() {
    return CONF['api-host']+"/org_screens?token="+this.token;
  }
});

/***
	ADD SCEREN VIEW. Model: OrgModel, Collection:ScreensCollection
***/
var AddScreenView = Backbone.View.extend({
	tagName: 'div',
	className: 'addScreen_form',
	events:{
		"click #screen_save": "screen_save",
		"click #screen_cancel": "screen_cancel",
		"click input": "select_type"
	},
	initialize: function(){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'screen_save', 'screen_cancel', 'select_type'); 
	},
	render: function(){
		var form = '<span>Name</span><br /><textarea rows="1" class="noresize" id="screen_name"></textarea><br /><br /><span>Type</span><br /><input type="radio" name="type" value="menu_list">menu_list</input><input type="radio" name="type" value="splash">splash</input><br/><button id="screen_cancel">Cancel</button><button id="screen_save">Save</button>'
		$(this.el).html(form);
		return this;
	},
	
	select_type: function(ev){
		this.type = $(ev.target).val();
	},
	
	screen_save: function(){
		// new org model
		var newScreen = new Screen({'org_token': this.model.get('token'), 'name':$('#screen_name').val(), 'type':this.type});
		// add Org model to collection
		this.collection.add(newScreen);
		//update database
		newScreen.save();
		//remove this view
		$(this.el).remove();
	},
	
	screen_cancel: function(){
		//remove this view
		$(this.el).remove();
	}

});