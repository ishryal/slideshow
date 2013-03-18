/*! Copyright (c) 2013 Warren Wilson
 * Licensed under the MIT License.
 *
 * Version: 0.2
 * 
 * Requires: 1.2.2+
 */
(function($) {

    var methods = {

        /**
         * Kind of the constructor, called before any action
         * @param {Map} user options
         */
        init: function(options) {
            var form = this;
            if (form.data('ehshw') === undefined || form.data('ehshw') == null ) {
            		if (options.type == 'slide') {
            			options.fadelength = 10;
            		}
            		
                methods._saveOptions(form, options);
								
								var options = form.data('ehshw');
								
								options.total_slides = $(options.plate, form).length;
								
              	var i = 0;
              	$(options.plate, form).each(function() {
              		$(this).attr('data-item', i); i++;
              	});
								
								// set the container element width and height and overflow
								$(options.container, form).width( options.width ).height( options.height ).css('overflow', 'hidden');
								
                // add some styles if the sldieshow type is slide instead of fade
                if (options.type == 'slide') {
                	$(options.list, form).width( options.width * options.total_slides );
                	$(options.plate, form).show();
                	$(options.plate, form).each(function() {
                		$(this).width( options.width ).css({ 'float' : 'left', 'overflow' : 'hidden' }); i++;
                	});
                }
                if (options.type == 'fade') {
                	// set the current op to 100 opacity
                	options.current_op = 100;
                	// if the slideshow is fader, hide all but the first element
                	var i = 0;
                	$(options.plate, form).each(function() {
                		if (i > 0) $(this).hide(); i++;
                	});
                	// set the opacity of the first item to 100
                	$(options.plate, form).first().css({ 'filter' : 'alpha(opacity=' + options.current_op + ')', 'opacity' : (options.current_op/100) });
              	}
              	if (options.type == 'xfade') {
                	// set the current op to 100 opacity
                	options.current_op = 100;
                	// if the slideshow is fader, hide all but the first element
                	var i = 0;
                	$(options.plate, form).each(function() {
                		if (i > 0) $(this).css({ 'filter' : 'alpha(opacity=' + 0 + ')', 'opacity' : 0 }); i++;
                	});
                	$(options.list, form).css('position' ,'relative');
                	
                	$(options.plate, form).css( { 'position':'absolute', 'top' : 0, 'left' : 0 });
                	
                	// set the opacity of the first item to 100
                	$(options.plate, form).first().css({ 'filter' : 'alpha(opacity=' + options.current_op + ')', 'opacity' : (options.current_op/100) });
                	
                	if (options.total_slides > 1) {
	                	// set the opacity of the next slide to 0
	                	var panel = $(options.plate, form).first();
	                	var nextSlide = panel.next();
                		nextSlide.show().css({ 'filter' : 'alpha(opacity=' + 0 + ')', 'opacity' : 0 });
                	}
              	}
              	
              	// add the active class to first item
              	$(options.plate, form).first().addClass(options.active).show();
              	
              	
              	if (options.total_slides > 1) {
	              	// set some buttons
	              	$('.' + options.iconnext, form).click(function(e) {
	              		e.stopPropagation();
	              		e.preventDefault();
	              		window.setTimeout(function() { form.slideShow('nextSlide', form); }, 1);
	              		
	              	});
	              	
	              	
	              	$('.' + options.iconprev, form).click(function(e) {
	              		e.stopPropagation();
	              		e.preventDefault();
	              		window.setTimeout(function() { form.slideShow('prevSlide', form); }, 1);
	              		
	              	});
              	} else {
              		// remove the next/prev as they don't apply
              		$('.' + options.iconprev, form).remove();
              		$('.' + options.iconnext, form).remove();
              	}
              	
              	if (!options.hideicons) {
              		if ($('.' + options.icons, form).length) {
              			var i = 0;
		              	$('.' + options.icons, form).each(function() {
		              		$(this).attr('data-item', i).click(function(e) {
		              			e.stopPropagation();
	              				e.preventDefault();
	              				var panel = $(this).data('selector');
	              				panel.slideShow('slideJump', $(this).attr('data-item'));
		              		}).mouseover(function(e) {
		              			e.stopPropagation();
	              				e.preventDefault();
	              				var panel = $(this).data('selector');
	              				panel.slideShow('slideHighlight', $(this).attr('data-item'));
		              		}).mouseout(function(e) {
		              			e.stopPropagation();
	              				e.preventDefault();
	              				var panel = $(this).data('selector');
	              				panel.slideShow('slideDeHighlight');
		              		}).data({'selector': form }); i++;
		              	});
		              	// activate the first itme
		              	$('.' + options.icons, form).first().addClass( options.iconactive );
              		} else {
              			options.hideicons = true; // hide them as there are no buttons provided in the DOM
              		}
              	}
              	
              	if (options.onInit)
              		options.onInit(form, options);
            }
        },
        /**
         * Saves the user options and variables in the form.data
         *
         * @param {jqObject}
         *            form - the form where the user option should be saved
         * @param {Map}
         *            options - the user options
         * @return the user options (extended from the defaults)
         */
        _saveOptions: function(form, options) {
        	var userOptions = $.extend({
        				total_slides: 0,
                plate: 'li.slide-item',
                list: 'ul.slide-list',
                container: '.slider',
                active: 'active',
                iconactive: 'active',
                icons: 'iconcount',
                iconnext: 'nextslide',
                iconprev: 'prevslide',
                hideicons: false,
                fadeOut: false,
                type: 'fade',
                direction: 'left',
                width: 780,
                height: 520,
                current_slide: 0,
                slide_to: 'next',
                current_op: 0,
                op_fc: 0,
                pause_slideshow: 0,
                sh_toID: null,
                isstatic: false,
                pauseLength: 4000,
                fadelength: 50,
                fadestep: 5,
                steplength: 10,
                onChange: false,
                onInit: false,
                id: null
            }, options);

            form.data('ehshw', userOptions);
            return userOptions;
        },
        pause: function() {
        	var form = this;
        	var options = form.data('ehshw');
        	options.pause_slideshow = 1;
        },
      	unpause: function() {
        	var form = this;
        	var options = form.data('ehshw');
        	options.pause_slideshow = 0;
        },
        startShow: function() {
        	var form = this;
        	var options = form.data('ehshw');
        	if (options.pause_slideshow == 0 && options.total_slides > 1) {
        		if (options.current_slide == 0) {
        			options.current_slide = 1;
        			if (!options.isstatic)
        				options.sh_toID = window.setTimeout(function() { form.slideShow('startShow', form); }, options.pauseLength);
        			return true;
        		}
        			
      			var todo = (options.type == 'slide') ? 'animMaskSlide' : 'fadeMaskUp';
      			if (!options.isstatic)
	    				options.sh_toID = window.setTimeout(function() { form.slideShow(todo, form); }, options.fadelength);
	    			return true;
        	}
        },
        animMaskSlide: function() {
        	var form = this;
        	var options = form.data('ehshw');
        	if (options.pause_slideshow == 0) {
      			if ($(options.plate + '.' + options.active, form).length) {
      				if (options.direction == 'left') {
      					if (options.slide_to == 'next') {
	      					options.current_op -= options.steplength;
	      					if (options.current_op <= (0 - $(options.plate + '.' + options.active, form).width())) {
	      						options.current_op = 0 - $(options.plate + '.' + options.active, form).width();
	      						$(options.plate + '.' + options.active, form).css('margin-left', options.current_op);
	      						methods.movePlateToEnd.apply(form);
	      						options.current_op = 0;
	      						if (!options.isstatic)
	      							options.sh_toID = window.setTimeout(function() { form.slideShow('startShow', form); }, options.pauseLength);
	      					} else {
	      						$(options.plate + '.' + options.active, form).css('margin-left', options.current_op);
	      						options.sh_toID = window.setTimeout(function() { form.slideShow('animMaskSlide', form); }, options.fadelength);
	      					}
	      				} else {
	      					options.current_op += options.steplength;
	      					if (options.current_op >= 0) {
	      						options.slide_to = 'next';
	      						options.current_op = 0;
	      						$(options.plate + '.' + options.active, form).css('margin-left', options.current_op);
	      						if (!options.isstatic)
	      							options.sh_toID = window.setTimeout(function() { form.slideShow('startShow', form); }, options.pauseLength);
	      					} else {
	      						$(options.plate + '.' + options.active, form).css('margin-left', options.current_op);
	      						options.sh_toID = window.setTimeout(function() { form.slideShow('animMaskSlide', form); }, options.fadelength);
	      					}
	      				}
      				}
      			}
        	}
        },
        movePlateToEnd: function() {
        	var form = this;
        	var options = form.data('ehshw');
      		if ($(options.plate + '.' + options.active, form).length) {
      			options.current_slide++;
      			if (options.current_slide > options.total_slides)
      				options.current_slide = 1;
      			
      			$(options.plate + '.' + options.active, form).removeClass( options.active ).css('margin-left' , 0).hide().appendTo($(options.list, form));
      			
      			$(options.plate, form).first().addClass('active').css('margin-left' , 0);
      			$(options.plate, form).last().show();

      			if (!options.hideicons)
      				methods.swapSlideIcon.apply(form);
      		}
        },
        fadeMaskUp: function() {
        	var form = this;
        	var options = form.data('ehshw');
        	if (options.pause_slideshow == 0) {
        		if ($(options.plate + '.' + options.active, form).length) {
        			options.current_op -= options.fadestep;
        			if (options.current_op < 0) {
        				options.current_op = 0;
        			}
        			$(options.plate + '.' + options.active, form).css({ 'filter' : 'alpha(opacity=' + options.current_op + ')', 'opacity' : (options.current_op/100) });
        			var nextSlide = null;
        			if (options.type == 'xfade') {
        				if (options.slide_to == 'next') {
	        				if ($(options.plate + '.' + options.active, form).is(':last-child')) {
			        			nextSlide = $(options.plate, form).first();
			        		} else {
			        			nextSlide = $(options.plate + '.' + options.active, form).next();
			        		}
			        	} else {
			        		if ($(options.plate + '.' + options.active, form).is(':first-child')) {
			        			nextSlide = $(options.plate, form).last();
			        		} else {
			        			nextSlide = $(options.plate + '.' + options.active, form).prev();
			        		}
			        	}
		        		nextSlide.css({ 'filter' : 'alpha(opacity=' + (100 - options.current_op) + ')', 'opacity' : (1 - (options.current_op/100)) });
		        		
        			}
        			
        			if (options.current_op == 0) {
        				if (options.type == 'fade') {
        					methods.loadNewPlate.apply(form);
        					options.sh_toID = window.setTimeout(function() { form.slideShow('fadeMaskDown', form); }, options.fadelength);
        				} else {
        					if (options.type == 'xfade') {
        						if (options.slide_to == 'next') {
        							options.current_slide++;
        						} else {
        							options.current_slide--;
        							options.slide_to = 'next';
        						}
        						options.current_op = 100;
        						$(options.plate + '.' + options.active, form).removeClass( options.active );
        						nextSlide.addClass( options.active );
        						options.sh_toID = window.setTimeout(function() { form.slideShow('startShow', form); }, options.pauseLength);
        						if (!options.hideicons)
      								methods.swapSlideIcon.apply(form);
        					}
        				}
        			} else {
        				options.sh_toID = window.setTimeout(function() { form.slideShow('fadeMaskUp', form); }, options.fadelength);
        			}
        		}
        	}
        },
        fadeMaskDown: function() {
        	var form = this;
        	var options = form.data('ehshw');
        	if (options.pause_slideshow == 0) {
        		if ($(options.plate + '.' + options.active, form).length) {
        			options.current_op += options.fadestep;
        			if (options.current_op > 100) {
        				options.current_op = 100;
        			}
        			$(options.plate + '.' + options.active, form).css({ 'filter' : 'alpha(opacity=' + options.current_op + ')', 'opacity' : (options.current_op/100) });
        			if (options.current_op == 100) {
        				if (!options.isstatic)
        					options.sh_toID = window.setTimeout(function() { form.slideShow('startShow', form); }, options.pauseLength);
        			} else {
        				options.sh_toID = window.setTimeout(function() { form.slideShow('fadeMaskDown', form); }, options.fadelength);
        			}
        		}
        	}
        },
        loadNewPlate: function() {
        	var form = this;
        	var options = form.data('ehshw');
        	
    			if (options.current_slide > options.total_slides)
    				options.current_slide = 1;
    			
        	
        	if (options.onChange) {
        		options.onChange(form, options);
        	}
        	if ($(options.plate + '.' + options.active, form).length) {
        		var nextSlide = null;
        		if (options.slide_to == 'next') {
		    			options.current_slide++;
		    			if (options.current_slide > options.total_slides)
		    				options.current_slide = 1;
		    			
	        		if ($(options.plate + '.' + options.active, form).is(':last-child')) {
	        			nextSlide = $(options.plate, form).first();
	        		} else {
	        			nextSlide = $(options.plate + '.' + options.active, form).next();
	        		}
	        	} else {
		    			options.current_slide--;
		    			if (options.current_slide < 0)
		    				options.current_slide = options.total_slides;
		    			
	        		options.slide_to = 'next';
	        		if ($(options.plate + '.' + options.active, form).is(':first-child')) {
	        			nextSlide = $(options.plate, form).last();
	        		} else {
	        			nextSlide = $(options.plate + '.' + options.active, form).prev();
	        		}
	        	}
        		$(options.plate + '.' + options.active, form).hide().css({ 'filter' : 'alpha(opacity=100)', 'opacity' : 1 }).removeClass( options.active );
        		nextSlide.addClass( options.active ).css({ 'filter' : 'alpha(opacity=0)', 'opacity' : 0 }).show();
      			if (!options.hideicons)
      				methods.swapSlideIcon.apply(form);
      			
        	}
        },
        nextSlide: function() {
        	var form = this;
        	var options = form.data('ehshw');
        	// clear the current timeout
        	window.clearTimeout(options.sh_toID);
        	if ($(options.plate + '.' + options.active, form).length) {
	        	options.slide_to = 'next';
	        	if (options.type == 'slide') {
		    			options.current_slide++;
		    			if (options.current_slide > options.total_slides)
		    				options.current_slide = 1;
		    			
	        		if (options.direction == 'right') {
	        			// move the last slide in the list to the first
	        			$(options.plate, form).last().hide().css('margin-left' , (0 - $(options.plate + '.' + options.active, form).width()) ).prependTo($(options.list, form));
	        			$(options.plate + '.' + options.active, form).css('margin-left', 0).removeClass( options.active );
	        			$(options.plate, form).first().show().addClass( options.active );
	        		}
	        		options.sh_toID = window.setTimeout(function() { form.slideShow('animMaskSlide', form); }, options.fadelength);
	      			if (!options.hideicons)
	      				methods.swapSlideIcon.apply(form);
	        	} else {
	        		options.sh_toID = window.setTimeout(function() { form.slideShow('fadeMaskUp', form); }, options.fadelength);
	        	}
	        }
        },
        prevSlide: function() {
        	var form = this;
        	var options = form.data('ehshw');
        	// clear the current timeout
        	window.clearTimeout(options.sh_toID);
        	if ($(options.plate + '.' + options.active, form).length) {
	        	options.slide_to = 'prev';
	        	if (options.type == 'slide') {
		    			options.current_slide--;
		    			if (options.current_slide < 0)
		    				options.current_slide = options.total_slides;
		    			
	        		if (options.direction == 'left') {
	        			// move the last slide in the list to the first
	        			$(options.plate, form).last().hide().css('margin-left' , (0 - $(options.plate + '.' + options.active, form).width()) ).prependTo($(options.list, form));
	        			$(options.plate + '.' + options.active, form).css('margin-left', 0).removeClass( options.active );
	        			$(options.plate, form).first().show().addClass( options.active );
	        			options.current_op = (0 - $(options.plate + '.' + options.active, form).width());
	        		}
	        		options.sh_toID = window.setTimeout(function() { form.slideShow('animMaskSlide', form); }, options.fadelength);
	      			if (!options.hideicons)
	      				methods.swapSlideIcon.apply(form);
	        	} else {
        			options.sh_toID = window.setTimeout(function() { form.slideShow('fadeMaskUp', form); }, options.fadelength);
        		}
        	}
        },
        slideJump: function(boxnum) {
        	var form = this;
        	var options = form.data('ehshw');
        	
        	// clear the current timeout
        	window.clearTimeout(options.sh_toID);
        	var nextSlide = null;
        	$(options.plate, form).each(function() {
        		if ($(this).hasAttr('data-item')) {
        			if ($(this).attr('data-item') == boxnum) {
        				if ($(this).hasClass(options.active)) return false;
        				nextSlide = $(this);
        				return true;
        			}
        		}
        	});
        	if ($.isNull(nextSlide)) return false;
        	
        	if ($(options.plate + '.' + options.active, form).length) {
	        	if (options.type == 'slide') {
	        		if (options.direction == 'left') {
		        		if (!nextSlide.is(':last-child')) {
		        			var cIndex = $(options.plate, form).index( nextSlide );
	        				for (var i = cIndex+1; i < $(options.plate, form).length; i++) {
	        					$(options.plate, form).last().css('margin-left', 0).removeClass( options.active ).prependTo($(options.list, form));
	        				}
		        		}
		        		$(options.plate + '.' + options.active, form).css('margin-left', 0).removeClass( options.active );
      					nextSlide.css('margin-left', 0).addClass( options.active ).prependTo($(options.list, form));
	        		} else {
		        		if (!nextSlide.is(':first-child')) {
		        			var cIndex = $(options.plate, form).index( nextSlide );
	        				for (var i = cIndex-1; i > 0; i--) {
	        					$(options.plate, form).first().css('margin-left', 0).removeClass( options.active ).appendTo($(options.list, form));
	        				}
		        		}
		        		$(options.plate + '.' + options.active, form).css('margin-left', 0).removeClass( options.active );
		        		nextSlide.css('margin-left', 0).addClass(options.active).appendTo($(options.list, form));
	        		}
	        		options.current_op = 0;
	        		options.current_slide = boxnum;
	        		if (!options.hideicons)
      					methods.swapSlideIcon.apply(form);
	        		
	        	} else {
	        		options.current_op = 100;
	        		if (options.type == 'xfade') {
	        			$(options.plate, form).css({ 'filter' : 'alpha(opacity=0)', 'opacity' : 0 }).removeClass( options.active );
		        		nextSlide.addClass( options.active ).css({ 'filter' : 'alpha(opacity=100)', 'opacity' : 1 });
	        		} else {
		        		$(options.plate + '.' + options.active, form).hide().css({ 'filter' : 'alpha(opacity=100)', 'opacity' : 1 }).removeClass( options.active );
		        		nextSlide.addClass( options.active ).css({ 'filter' : 'alpha(opacity=100)', 'opacity' : 1 }).show();
		        	}
	        		options.current_slide = boxnum;
	        		if (!options.hideicons)
      					methods.swapSlideIcon.apply(form);
	        	}
        	}
        	options.pause_slideshow = 0;
        	if (!options.isstatic)
        		options.sh_toID = window.setTimeout(function() { form.slideShow('startShow', form); }, options.pauseLength);
        },
        slideHighlight: function(boxnum) {
        	var form = this;
        	var options = form.data('ehshw');
        	options.pause_slideshow = 1;
        	
        	// clear the current timeout
        	window.clearTimeout(options.sh_toID);
        	var nextSlide = null;
        	$(options.plate, form).each(function() {
        		if ($(this).hasAttr('data-item')) {
        			if ($(this).attr('data-item') == boxnum) {
        				if ($(this).hasClass(options.active)) return false;
        				nextSlide = $(this);
        				return true;
        			}
        		}
        	});
        	if ($.isNull(nextSlide)) return false;
        	
        	if ($(options.plate + '.' + options.active, form).length) {
	        	if (options.type == 'slide') {
	        		if (options.direction == 'left') {
		        		if (!nextSlide.is(':last-child')) {
		        			var cIndex = $(options.plate, form).index( nextSlide );
	        				for (var i = cIndex+1; i < $(options.plate, form).length; i++) {
	        					$(options.plate, form).last().css('margin-left', 0).removeClass( options.active ).prependTo($(options.list, form));
	        				}
		        		}
		        		$(options.plate + '.' + options.active, form).css('margin-left', 0).removeClass( options.active );
      					nextSlide.css('margin-left', 0).addClass( options.active ).prependTo($(options.list, form));
	        		} else {
		        		if (!nextSlide.is(':first-child')) {
		        			var cIndex = $(options.plate, form).index( nextSlide );
	        				for (var i = cIndex-1; i > 0; i--) {
	        					$(options.plate, form).first().css('margin-left', 0).removeClass( options.active ).appendTo($(options.list, form));
	        				}
		        		}
		        		$(options.plate + '.' + options.active, form).css('margin-left', 0).removeClass( options.active );
		        		nextSlide.css('margin-left', 0).addClass(options.active).appendTo($(options.list, form));
	        		}
	        		options.current_op = 0;
	        		options.current_slide = boxnum;
	        		if (!options.hideicons)
      					methods.swapSlideIcon.apply(form);
	        		
	        	} else {
	        		options.current_op = 100;
	        		if (options.type == 'xfade') {
	        			$(options.plate, form).css({ 'filter' : 'alpha(opacity=0)', 'opacity' : 0 }).removeClass( options.active );
		        		nextSlide.addClass( options.active ).css({ 'filter' : 'alpha(opacity=100)', 'opacity' : 1 });
	        		} else {
		        		$(options.plate + '.' + options.active, form).hide().css({ 'filter' : 'alpha(opacity=100)', 'opacity' : 1 }).removeClass( options.active );
		        		nextSlide.addClass( options.active ).css({ 'filter' : 'alpha(opacity=100)', 'opacity' : 1 }).show();
		        	}
	        		options.current_slide = boxnum;
	        		if (!options.hideicons)
      					methods.swapSlideIcon.apply(form);
	        	}
        	}
        },
        slideDeHighlight: function(boxnum) {
        	var form = this;
        	var options = form.data('ehshw');
        	options.pause_slideshow = 0;
        	if (!options.isstatic)
        		options.sh_toID = window.setTimeout(function() { form.slideShow('startShow', form); }, options.pauseLength);
        },
        swapSlideIcon: function() {
        	var form = this;
        	var options = form.data('ehshw');
        	if ($(options.plate + '.' + options.active, form).length) {
	        	$('.' + options.icons, form).each(function() {
	        		if ($(this).attr('data-item') == $(options.plate + '.' + options.active, form).attr('data-item')) {
	        			$(this).addClass( options.iconactive );
	        		} else {
	        			$(this).removeClass( options.iconactive );
	        		}
	        	});
	        }
        },
        /**
         * Removes forbidden characters from class name
         * @param {String} className
         */
        _getClassName: function(className) {
        	return className.replace(":","_").replace(".","_");
        },
        reset: function() {
        	var form = this;
        	var options = form.data('ehshw');
        	
        	// clear the current timeout
        	window.clearTimeout(options.sh_toID);
        	options.pause_slideshow = 0;
        	options.current_slide = 1;
        	methods.loadNewPlate.apply(form);
        	
        	options.current_op = 0;
        	options.op_fc = 0;
        	if ($(options.maskID, form).length) {
        		$(options.maskID, form).css('filter', 'alpha(opacity=' + options.current_op + ')');
        		$(options.maskID, form).css('opacity', options.op_fc);
        		$(options.maskID, form).hide();
        	}
        	options.sh_toID = window.setTimeout(function() { $('#' + form.attr('id')).slideShow('startShow', form); }, options.pauseLength);
        }
     };

    /**
     * Plugin entry point.
     * You may pass an action as a parameter or a list of options.
     * if none, the init and attach methods are being called.
     * Remember: if you pass options, the attached method is NOT called automatically
     *
     * @param {String}
     *            method (optional) action
     */
    $.fn.slideShow = function(method) {

        var form = $(this);
				if(!form[0]) { return false;  } // stop here if the form does not exist
		
        if (typeof(method) === 'string' && method.charAt(0) != '_' && methods[method]) {

            // make sure init is called once
            if(method != "loadSlide" && method != "fadeMaskUp" && method != "fadeMaskDown" && method != "startShow" && method != "slideHighlight" && method != "slideDeHighlight" && method != "nextSlide" && method != "prevSlide" && method != "reset") 
            	methods.init.apply(form);
             
            return methods[method].apply(form, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            // default constructor with or without arguments
						methods.init.apply(form, arguments);
						if (!arguments.isstatic)
            	return methods.startShow.apply(form);
        } else {
            $.error('Method ' + method + ' does not exist in jQuery.slideShow');
            return false;
        }
    };
    
    
})(jQuery);