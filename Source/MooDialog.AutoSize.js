/*
---
name: MooDialog.AutoSize
description: Adds the ability to auto size the MooDialog window
authors: ju1ius
license: MIT-style license
requires: MooDialog
privides: MooDialog.AutoSize
...
*/

MooDialog.implement({
	options: {
		autosize: true,
		scale: 'min' // 'min', 'max', or a float between 0 and 1
	},

	open: function(){
		this.fireEvent('beforeOpen', this.wrapper).fireEvent('open');
		this.opened = true;

		if(this.options.autosize)
			this.autosize();

		return this;
	},

	autosize: function()
	{
		var size = {};

		if(this.options.scale == 'max' || this.options.scale > 0.85)
		{
			size.x = window.getSize().x * 0.85;
			size.y = window.getSize().y * 0.85;
		}
		else if(0 < this.options.scale  && this.options.scale <= 0.85)
		{
			size.x = window.getSize().x * this.options.scale;
			size.y = window.getSize().y * this.options.scale;
		}
		else if(this.options.scale == 'min' || this.options.scale === 0)
		{
			size.x = 'auto';
			size.y = 'auto';
		}

		this.content.setStyles({
			width: size.x,
			height: size.y
		});

		this.wrapper.setStyles({
			width: size.x,
			height: size.y,
			'margin-left': - size.x / 2,
			'margin-top': - size.y / 2
		});
		return this;
	}
});