/*
---
description:     MooDialog

authors:
  - Arian Stolwijk

license:
  - MIT-style license

requires:
  core/1.2.4:   '*'

provides:
  - [MooDialog.Prompt]
...
*/

MooDialog.Prompt = new Class({	
	
	Extends: MooDialog,	
  
	initialize: function(msg,fn,options){
		this.parent(options);

		fn = fn ? fn : $empty;

		var textInput = new Element('input',{
			type: 'text',
			size: 30
		});

		this.setContent(
			new Element('div')
				.adopt(
					new Element('p',{
						'class': 'MooDialogPromt',
						text: msg
					})
				).adopt(
					new Element('form',{
						'class': 'buttons',
						events: {
							submit: function(e){
								e.stop();
								fn(textInput.get('value'));
								this.close();
							}.bind(this)
						}
					}).adopt(textInput).adopt(
						new Element('input',{
							type: 'submit',
							value: 'Ok'
						})						
					)
				)
		).open();
	}
});

