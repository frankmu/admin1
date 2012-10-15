/***
	SINGLE ITEM MODEL
***/
var Item = Backbone.Model.extend({
	url: CONF['api-host'],
	defaults: {
		imgPath: 'img.jpg',
		rating: 0
	},
	/*
		Save org to database - make an API call to org_create
	*/
	save: function(){
		function onErr(err) {
			alert('Error '+err.status);
		}
		var postBody = {screen_token: this.get('screen_token'), name: this.get('name'), imgPath: this.get('imgPath'), description: this.get('description'), price: this.get('price'), rating: this.get('rating')};
		var that = this;
		API.post('item_create', postBody, true, onErr, function(res){
			console.log(res);		
			that.set({token: res.token});
		});
		
	},
	
	update: function(){
		function onErr(err) {
			alert('Error '+err.status);
		}
		var postBody = {screen_token: this.get('screen_token'), name: this.get('name'), imgPath: this.get('imgPath'), description: this.get('description'), price: this.get('price'), rating: this.get('rating'), token: this.get('token')};
		var that = this;
		API.post('item_update', postBody, true, onErr, function(res){
			console.log(res);
		});
		
	},
	
	remove: function(){
		// remove item from database if present in database
		if(this.get('token')){
			function onErr(err) {
				alert('Error '+err.status);
			}
			var postBody = {screen_token: this.get('screen_token'), token: this.get('token')};
			var that = this;
			API.post('item_delete', postBody, true, onErr, function(res){
				console.log(res);
			});
		}
	}
});

/***
	SINGLE ITEM VIEW. Model: ItemModel
***/
var ItemView = Backbone.View.extend({
	tagName : "li",
	className : "item_view",
	events:{
		"click .item_delete": "delete_this",
		"click .item_edit": "select_this",
		"blur textarea": "update_info"
		//"click #+"this.model.get('token') ? this.model.get('token') : this.model.get('timestamp')"+":"rate"
	},
	initialize: function(){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'select_this', 'delete_this', 'update_info');
	},
	render: function(){
	 	// render from dust template
		data = {'name':this.model.get('name'), 'imgPath':this.model.get('imgPath'), 'description':this.model.get('description'), 'price':this.model.get('price'), rating:this.model.get('rating')};		
		// render item and append to screen
		var that = this;
		dust.render("itemView", data, function(err, out) {
			if (!err){
				$(that.el).html(out);
				$(that.el).attr('id', that.model.get('token') ? that.model.get('token') : that.model.get('timestamp'));
				$(that.el).attr('draggable', true);
			} else{
				return console.log(err);
			}
		});
		return this;
	},
	/*
		Select this Item for editing
	*/
	select_this: function(){
		console.log(this.model.get('token'));
	},
	/*
		Delete this Screen from the list
	*/
	delete_this: function(){
		if (confirm('Are you sure you want to delete '+this.model.get('name')+'?')) {
			this.model.remove();
			this.collection.remove(this.model);
		}
	},
	
	/*
		Set item rating by clicking on the stars
	*;
	rate: function(){
		
	},
	/*
		Update Model on any change
	*/
	update_info: function(){
		var id = this.model.get('token') ? this.model.get('token') : this.model.get('timestamp');
		this.model.set({name: $('#'+id+' .item_name').val(), description: $('#'+id+' .item_description').val(), price: $('#'+id+' .item_price').val(), changed:true});
		//this.model.set({name: $('#'+this.model.get('token')+' .item_name').val(), description: $('#'+this.model.get('token')+' .item_description').val(), price: $('#'+this.model.get('token')+' .item_price').val(), changed:true});
	}
	
});

/*** 
	ITEMS LIST VIEW. Model:ScreenView, Collection: ItemsCollection
***/		
var ItemsView = Backbone.View.extend({
	tagName : "ul",
	className : "items_view",
	events: {
		"click .item_add":"add_item",
		"click .save_all":"save_items"
	},
	initialize: function(){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'add_item'); 
		
		// re-render when new comment is added
		this.collection.bind('add', this.render);
		this.collection.bind('remove', this.render);
		this.collection.bind('change', this.render);
	},
	
	render : function() {
		$(this.el).html(''); // clear element
		// for each comment, create a view and prepend it to the list.
		this.collection.each(function(Item) {
		  var itemView = new ItemView({ model : Item, collection:this.collection });
		  $(this.el).append(itemView.render().el);
		  // set stars rating
		  var id = Item.get('token') ? Item.get('token') : Item.get('timestamp');
		  setStarsRating('#'+id+' .star', Item.get('rating'));
		}, this);
		
		//also append addOrg button
		$(this.el).prepend('<div class="item_add">Add Item</div>');
		$(this.el).prepend('<h1>'+this.model.get('name')+' Items</h1>');
		$(this.el).append('<div class="save_all">Save all changes</div>');
		
		return this;
	},
	/*
	Add screen - create a blank model. If the user fills out the info, the model will be saved when "save" is clicked
	*/
	add_item: function(){
	  // create new blank Model with screen token
	  var newItem = new Item({'screen_token':this.model.get('token'), 'timestamp': new Date().getTime()});
	  // add this model to collection
	  this.collection.add(newItem);
	  // render blank view
	  var itemView = new ItemView({ model : newItem, collection:this.collection});
	},
	
	/*
		Save the list of items to database
	*/
	save_items: function(){
		console.log('clicked save');
		// loop throught collection
		this.collection.each(function(Item) {
			if(Item.get('changed')){
				console.log('save '+ Item.get('name'));
				// TODO: CHECK THAT ALL FIELDS ARE FILLED OUT!!!!!!!!!!!!
				if(Item.get('token')){
					Item.update();
				}
				else{
					Item.save();
				}
				Item.set({changed: false});
			}
		});
	}
});

/***
	ITEMS COLLECTION
***/
var Items = Backbone.Collection.extend({
  model : Item,
  initialize : function(models, options) {
    this.token = options.token; // item_token
  },
  url : function() {
    return CONF['api-host']+"/items?screen_token="+this.token;
  }
});
