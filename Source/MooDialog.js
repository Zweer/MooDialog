/*
---
name: MooDialog
description: The base class of MooDialog
authors: Arian Stolwijk
license:  MIT-style license
requires: [Core/Class, Core/Element, Core/Element.Styles, Core/Element.Event]
provides: [MooDialog, Element.MooDialog]
...
*/


var MooDialog = new Class({

	Implements: [Options, Events],

	options: {
		'class': 'MooDialog',
		title: null,
		scroll: true, // IE
		forceScroll: false,
		useEscKey: true,
		destroyOnHide: true,
		autoOpen: true,
		closeButton: true,
		onInitialize: function(){
			this.wrapper.setStyle('display', 'none');
		},
		onBeforeOpen: function(){
			this.wrapper.setStyle('display', 'block');
			this.fireEvent('show');
		},
		onBeforeClose: function(){
			this.wrapper.setStyle('display', 'none');
			this.fireEvent('hide');
		}/*,
		onOpen: function(){},
		onClose: function(){},
		onShow: function(){},
		onHide: function(){},
		onInitialize: function(wrapper){},
		onContentChange: function(content){}*/
	},

	initialize: function(options){
		this.setOptions(options);
		this.options.inject = this.options.inject || document.body;

		this.wrapper = new Element('div', { 'class': this.options['class'].replace(' ', '.') }).inject(this.options.inject);
		this.content = new Element('div', { 'class': 'content' }).inject(this.wrapper);

		if (this.options.title){
			this.title = new Element('div', {'class': 'title', text: this.options.title }).inject(this.wrapper);
			this.wrapper.addClass('MooDialogTitle');
		}

		if (this.options.closeButton){
			this.closeButton = new Element('a', {
				'class': 'close',
				events: {click: this.close.bind(this)}
			}).inject(this.wrapper);
		}


		/*<ie6>*/// IE 6 scroll
		if ((this.options.scroll && Browser.ie6) || this.options.forceScroll){
			this.wrapper.setStyle('position', 'absolute');
			var position = this.wrapper.getPosition(this.options.inject);
			window.addEvent('scroll', function(){
				var scroll = document.getScroll();
				this.wrapper.setPosition({
					x: position.x + scroll.x,
					y: position.y + scroll.y
				});
			});
		}
		/*</ie6>*/

		if (this.options.useEscKey){
			// Add event for the esc key
			document.addEvent('keydown', function(e){
				if (e.key == 'esc')
					this.close();
			}.bind(this));
		}

		this.addEvent('hide', function(){
			if (this.options.destroyOnHide)
				this.destroy();
		}.bind(this));

		this.fireEvent('initialize', this.wrapper);
	},

	setContent: function(){
		var content = Array.from(arguments);
		if (content.length == 1)
			content = content[0];

		this.content.empty();

		var type = typeOf(content);
		if (['string', 'number'].contains(type))
			this.content.set('text', content);
		else
			this.content.adopt(content);

		this.fireEvent('contentChange', this.content);

		return this;
	},

	open: function(){
		this.fireEvent('beforeOpen', this.wrapper).fireEvent('open');
		this.opened = true;
		return this;
	},

	close: function(){
		this.fireEvent('beforeClose', this.wrapper).fireEvent('close');
		this.opened = false;
		return this;
	},

	destroy: function(){
		this.wrapper.destroy();
	},

	toElement: function(){
		return this.wrapper;
	}

});


Element.implement({

	MooDialog: function(options){
		this.store('MooDialog',
			new MooDialog(options).setContent(this).open()
		);
		return this;
	}

});
