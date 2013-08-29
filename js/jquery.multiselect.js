/**
 * User: fedo (studio fresh)
 * Date: 23.08.13
 * Time: 18:15
 * Multiselect plugin
 */

$.fn.multiselect = function(options){

	var self = this;

	self.elements = {
		list: {},
		val: {},
		add:{},
		apply: {},
		clear: {}
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
					console.warn('Not all elements of multiselect define');
				}
			}
		}

		self.elements.inputs = self.elements.list.find('input[type=checkbox]');

		self.elements.inputs.on('change', self.actions.inputChange);

		self.elements.apply.on('click', self.actions.apply);

		self.elements.clear.on('click', self.actions.clear);

		self.elements.add.on('click', self.actions.list.toggle);

		//some hooks
		self.actions.list.close();
		self.elements.list.width(self.width());

		return self;
	}

	self.actions ={
		list:{
			open: function(){
				self.elements.list.addClass('active');
			},
			close: function(){
				self.elements.list.removeClass('active');
			},
			toggle: function(){
				self.elements.list.toggleClass('active');
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
		inputChange : function(){
			var el = $(this);
			
			if(el.is(":checked")){
				if(self.elements.val.text() == self.elements.val.attr('data-default')){}
				self.store.values[el.val()] = true;
			}else{
				delete self.store.values[el.val()];
			}

			//Check default value in data-val holder
			if($.isEmptyObject(self.store.values)){
				self.elements.val.text(self.elements.val.attr('data-default'));
			}

			if(self.debug) console.log(self.store.values);
		},

		clear: function(){
			//clear store
			self.store.values = {};

			self.elements.val.text(self.elements.val.attr('data-default'));

			self.elements.inputs.each(function(){
				$(this).prop('checked', false);
			});

			self.actions.list.close();

			self.actions.status.empty();
		},
		apply: function(){
			for(var i=0; i < self.elements.inputs.length; i++){
				var el = $(self.elements.inputs[i]);
				if(el.is(':checked')){
					self.elements.val.text(el.val());
					self.actions.status.active();
					break;
				}
			}
			self.actions.list.close();
		}
	}


	return __construct(options);
}