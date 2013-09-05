/**
 * User: fedo (studio fresh)
 * Date: 28.08.13
 * Time: 18:15
 * Multiselect plugin
 */

$.fn.groupmultiselect = function(options){

	var self = this;

	self.elements = {
		list: {},
		val: {},
		add:{},
		apply: {},
		clear: {},
		group: {},
		scroll:{}
	};

	self.store = {
		values: {}
	};

	self.debug = false;

	var __construct = function(options){
		$.extend(self, options, true);

		for(var _item in self.elements){
			if($.isEmptyObject(self.elements[_item])){
				var el = self.find('[data-'+_item+']');
				if(el.length >=1){
					self.elements[_item] = el;
				}else{
					console.warn('Not all elements of groupmultiselect define');
				}
			}
		}

		self.elements.inputs = self.elements.list.find('input[type=checkbox]');

		//actions
		self.elements.inputs.on('change', self.actions.inputChange);

		self.elements.apply.on('click', self.actions.apply);

		self.elements.clear.on('click', self.actions.clear);

		self.elements.add.on('click', self.actions.list.toggle);

		//Collapse multiselect if click detected elsewhere
		$(document).on('click', self.actions.documentClick);
		self.on('click', self.actions.selfClick);

		//Don't scroll window if scrollPane on the bottom position
		self.hover(
			self.actions.selfHover,
			self.actions.selfUnHover
		);
 
		//some hooks
		var i_width=self.width();
		self.elements.inputs.each(function(){
			var cur_width = $(this).next('span').width() + 64;
			if(cur_width > i_width){
				i_width=cur_width;
			}
		});
		self.elements.list.width(i_width);

		//run scrollPane plugin
		self.elements.scroll.jScrollPane();

		self.actions.list.close();

		return self;
	}

	self.actions ={
		list:{
			open: function(){
				//close other opened multiselect list
				var o_lists = $('[data-list]');
				o_lists.each(function(){
					var el = $(this);
					if(el.hasClass('active')){
						el.find('[data-apply]').click();
					}
				});

				self.elements.list.addClass('active');
			},
			close: function(){
				self.elements.list.removeClass('active');
			},
			toggle: function(){
				if(self.elements.list.hasClass('active')){
					self.actions.list.close();
				}else{
					self.actions.list.open();
				}
			}
		},

		status:{
			empty: function(){
				self.addClass('empty').removeClass('activated');
			},
			active: function(){
				self.addClass('activated').removeClass('empty');
			}
		},

		//Collapse multiselect if click detected elsewhere
		documentClick: function(){
			var el = $(this);
			//self.actions.list.close();
			self.actions.apply();
		},
		selfClick: function(e){
			e.stopPropagation();
		},

		//Don't scroll window if scrollPane on the bottom position
		selfHover: function(){
			if(self.debug) console.log('Hover');
			$(window).on('mousewheel', function(e){
				e.preventDefault();
			});
		},
		selfUnHover: function(){
			if(self.debug) console.log('UnHover');
			$(window).off('mousewheel');
		},

		//Checkbox change
		inputChange : function(){
			var el = $(this);

			if(el.is(":checked")){

				//if el is group title
				if(typeof el.attr('data-parent') !== 'undefined'){
					el.parents('[data-group]').find('input').each(function(){$(this).prop('checked', true);});
				}else{
					var b_all_checked = true;
					el.parents('[data-group]').find('input:not([data-parent])')
					.each(function(){
						if(!$(this).is(':checked')){
							b_all_checked = false;
							return true;
						}
					});

					if(b_all_checked){
						el.parents('[data-group]').find('[data-parent]').prop('checked', true);
					}
				}

				if(self.elements.val.text() == self.elements.val.attr('data-default')){}
				self.store.values[el.val()] = true;
			}else{
				if(typeof el.attr('data-parent') !== 'undefined'){
					el.parents('[data-group]').find('input').each(function(){$(this).prop('checked', false);});
				}else{
					el.parents('[data-group]').find('[data-parent]').prop('checked', false);
				}

				delete self.store.values[el.val()];
			}

			//Check default value in data-val holder
			if($.isEmptyObject(self.store.values)){
				self.elements.val.text(self.elements.val.attr('data-default'));
				self.actions.status.empty();
			}

			if(self.debug) console.log(self.store.values);
		},

		//Clear button of toolbar
		clear: function(){
			//clear store
			self.store.values = {};

			self.elements.val.text(self.elements.val.attr('data-default'));

			self.elements.inputs.each(function(){
				$(this).prop('checked', false);
			});

			self.actions.status.empty();
		},

		//Apply button of toolbar
		apply: function(){
			var count=0;
			for(var i=0; i < self.elements.inputs.length; i++){
				var el = $(self.elements.inputs[i]);
				if(el.is(':checked')){
					if (el.parent().attr("class")!='parent') count++;
					self.elements.val.text(el.val());
					self.actions.status.active();
				}
			}
			if (count>1) self.elements.val.text('Выбрано '+count+' эл.');
			self.actions.list.close();
		}
	}


	return __construct(options);
}