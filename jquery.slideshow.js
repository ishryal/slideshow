/*! Copyright (c) 2013 Warren Wilson
 * Licensed under the MIT License.
 *
 * Version: 0.5
 * 
 * Requires: jQuery 1.2.2+
 */
(function($) {

	var methods = {

		/**
		 * Kind of the constructor, called before any action
		 * 
		 * @param {Map}
		 *            user options
		 */
		init : function(options) {
			var form = this;
			if (form.data('ehshw') === undefined || form.data('ehshw') == null) {
				if (options.type == 'slide') {
					options.fadelength = 10;
				}

				methods._saveOptions(form, options);

				var options = form.data('ehshw');

				options.total_slides = $(options.plate, form).length;

				var i = 0;
				$(options.plate, form).each(function() {
					$(this).attr('data-item', i);
					i++;
				});

				// set the container element width and height and overflow
				$(options.container, form).width(options.width).height(options.height).css('overflow', 'hidden');

				// add some styles if the sldieshow type is slide instead of
				// fade
				if (options.type == 'slide') {
					$(options.list, form).width(options.width * options.total_slides);
					$(options.plate, form).show();
					$(options.plate, form).each(function() {
						$(this).width(options.width).height(options.height).css({
							'float' : 'left',
							'overflow' : 'hidden'
						});
						i++;
					});
					if (options.total_slides > 1) {
						if (options.direction == 'right') {
							var panel = $(options.plate, form).first();
							panel.addClass(options.active).show();
							var nextSlide = panel.next();
							nextSlide.css('margin-left', 0 - options.width).prependTo($(options.list, form));
							options.current_op = 0 - options.width;
						} else if (options.direction == 'up') {
							$(options.list, form).width(options.width).height(options.height * options.total_slides);

						} else if (options.direction == 'down') {
							$(options.list, form).width(options.width).height(options.height * options.total_slides);
							var panel = $(options.plate, form).first();
							panel.addClass(options.active).show();
							var nextSlide = panel.next();
							nextSlide.css('margin-top', 0 - options.height).prependTo($(options.list, form));
							options.current_op = 0 - options.height;
						}

					}
				}
				if (options.type == 'slide-over') {
					$(options.list, form).width(options.width).css('position', 'relative');
					$(options.plate, form).show();
					if (options.total_slides > 1) {
						if (options.direction == 'left') {
							$(options.plate, form).each(function() {
								$(this).width(options.width).css({
									'position' : 'absolute',
									'top' : 0,
									'left' : options.width,
									'overflow' : 'hidden'
								});
								i++;
							});
							options.current_op = options.width;
						} else if (options.direction == 'right') {
							$(options.plate, form).each(function() {
								$(this).width(options.width).css({
									'position' : 'absolute',
									'top' : 0,
									'left' : 0 - options.width,
									'overflow' : 'hidden'
								});
								i++;
							});
							options.current_op = 0 - options.width;
						} else if (options.direction == 'up') {
							$(options.plate, form).each(function() {
								$(this).width(options.width).height(options.height).css({
									'position' : 'absolute',
									'top' : options.height,
									'left' : 0,
									'overflow' : 'hidden'
								});
								i++;
							});
							options.current_op = options.height;
						} else if (options.direction == 'down') {
							$(options.plate, form).each(function() {
								$(this).width(options.width).height(options.height).css({
									'position' : 'absolute',
									'top' : 0 - options.height,
									'left' : 0,
									'overflow' : 'hidden'
								});
								i++;
							});
							options.current_op = 0 - options.height;
						}
						$(options.plate, form).first().css({
							'left' : 0,
							'top' : 0
						});
					}
				}
				if (options.type == 'slide-away') {
					$(options.list, form).width(options.width).css('position', 'relative');
					$(options.plate, form).show();
					if (options.total_slides > 1) {
						ul = $(options.list, form); // your parent ul element
						ul.children().each(function(i, li) {
							ul.prepend(li);
						});
						$(options.plate, form).each(function() {
							$(this).width(options.width).css({
								'position' : 'absolute',
								'top' : 0,
								'left' : 0,
								'overflow' : 'hidden'
							});
						});
						options.current_op = 0;
					}
				}
				if (options.type == 'fade') {
					// set the current op to 100 opacity
					options.current_op = 100;
					// if the slideshow is fader, hide all but the first element
					var i = 0;
					$(options.plate, form).each(function() {
						if (i > 0)
							$(this).hide();
						i++;
					});
					// set the opacity of the first item to 100
					$(options.plate, form).first().css({
						'filter' : 'alpha(opacity=' + options.current_op + ')',
						'opacity' : (options.current_op / 100)
					});
				}
				if (options.type == 'xfade') {
					// set the current op to 100 opacity
					options.current_op = 100;
					// if the slideshow is fader, hide all but the first element
					var i = 0;
					$(options.plate, form).each(function() {
						if (i > 0)
							$(this).css({
								'filter' : 'alpha(opacity=' + 0 + ')',
								'opacity' : 0,
								'display' : 'none'
							});
						i++;
					});
					$(options.list, form).css('position', 'relative');

					$(options.plate, form).css({
						'position' : 'absolute',
						'top' : 0,
						'left' : 0
					});

					// set the opacity of the first item to 100
					$(options.plate, form).first().css({
						'filter' : 'alpha(opacity=' + options.current_op + ')',
						'opacity' : (options.current_op / 100),
						'display' : ''
					});

					if (options.total_slides > 1) {
						// set the opacity of the next slide to 0
						var panel = $(options.plate, form).first();
						var nextSlide = panel.next();
						nextSlide.hide().css({
							'filter' : 'alpha(opacity=' + 0 + ')',
							'opacity' : 0
						});
					}
				}
				if (options.type == 'slide' && (options.direction == 'right' || options.direction == 'down')) {
				} else if (options.type == 'slide-away') {
					$(options.plate, form).last().addClass(options.active);
				} else {
					// add the active class to first item
					$(options.plate, form).first().addClass(options.active).show();
				}

				if (options.total_slides > 1) {
					// set some buttons
					$('.' + options.iconnext, form).click(function(e) {
						e.stopPropagation();
						e.preventDefault();
						if ($(this).hasClass('disabled')) return false;
						window.setTimeout(function() {
							form.slideShow('nextSlide', form);
						}, 1);
					});

					$('.' + options.iconprev, form).click(function(e) {
						e.stopPropagation();
						e.preventDefault();
						if ($(this).hasClass('disabled')) return false;
						window.setTimeout(function() {
							form.slideShow('prevSlide', form);
						}, 1);
					});
					
					if (options.prevnextaction == 'scroll' || options.prevnextaction == 'page') {
						// set the width of the listcontainer
						if (options.iconlistwidth !== null && options.iconwidth !== null && $('.' + options.iconlistcontainter, form).length) {
							$('.' + options.iconlistcontainter, form).width( options.iconlistwidth ).css({'overflow' : 'hidden', 'position' : 'relative'});
							$('.' + options.iconlistcontainter + ' > ul', form).width( options.total_slides * options.iconwidth );
							
							if (options.prevnextaction == 'page' && !options.allowpageloop) {
								$('.' + options.iconprev, form).addClass('disabled');
							}
						} else {
							options.prevnextaction = 'default';
						}
					}
					
				} else {
					// remove the next/prev as they don't apply
					$('.' + options.iconprev, form).remove();
					$('.' + options.iconnext, form).remove();
				}

				if (!options.hideicons) {
					if ($('.' + options.icons, form).length) {
						var i = 0;
						$('.' + options.icons, form).each(function() {
							$(this).attr('data-item', i).data({
								'selector' : form
							}).click(function(e) {
								e.stopPropagation();
								e.preventDefault();
								var panel = $(this).data('selector');
								panel.slideShow('slideJump', $(this).attr('data-item'));
							});
							if (options.iconevent == 'hover') {
								$(this).mouseover(function(e) {
									e.stopPropagation();
									e.preventDefault();
									var panel = $(this).data('selector');
									panel.slideShow('slideHighlight', $(this).attr('data-item'));
								}).mouseout(function(e) {
									e.stopPropagation();
									e.preventDefault();
									var panel = $(this).data('selector');
									panel.slideShow('slideDeHighlight');
								});
							}
							i++;
						});
						// activate the first itme
						$('.' + options.icons, form).first().addClass(options.iconactive);
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
		_saveOptions : function(form, options) {
			var userOptions = $.extend({
				total_slides : 0,
				plate : 'li.slide-item',
				list : 'ul.slide-list',
				container : '.slider',
				active : 'active',
				iconactive : 'active',
				icons : 'iconcount',
				iconnext : 'nextslide',
				iconprev : 'prevslide',
				iconevent : 'hover',
				prevnextaction : 'default',
				iconlistcontainter : 'listcont',
				iconlistwidth : null,
				iconwidth : null,
				iconoffset : 0,
				iconlistscrolldirection : 'h',
				iconlistpage : 1,
				allowpageloop: false,
				hideicons : false,
				fadeOut : false,
				type : 'fade',
				direction : 'left',
				width : 780,
				height : 520,
				current_slide : 0,
				slide_to : 'next',
				slide_jump : null,
				current_op : 0,
				op_fc : 0,
				pause_slideshow : 0,
				sh_toID : null,
				isstatic : false,
				pauseLength : 4000,
				fadelength : 50,
				fadestep : 5,
				steplength : 10,
				onChange : false,
				onPrev : false,
				onNext : false,
				onInit : false,
				id : null
			}, options);

			form.data('ehshw', userOptions);
			return userOptions;
		},
		pause : function() {
			var form = this;
			var options = form.data('ehshw');
			options.pause_slideshow = 1;
		},
		unpause : function() {
			var form = this;
			var options = form.data('ehshw');
			options.pause_slideshow = 0;
		},
		startShow : function() {
			var form = this;
			var options = form.data('ehshw');
			if (options.pause_slideshow == 0 && options.total_slides > 1) {
				if (options.current_slide == 0) {
					options.current_slide = 1;
					if (!options.isstatic)
						options.sh_toID = window.setTimeout(function() {
							form.slideShow('startShow', form);
						}, options.pauseLength);
					return true;
				}

				var todo = 'fadeMaskUp';
				if (options.type == 'slide')
					todo = 'animMaskSlide';
				if (options.type == 'slide-over')
					todo = 'animMaskSlideOver';
				if (options.type == 'slide-away')
					todo = 'animMaskSlideAway';

				if (!options.isstatic)
					options.sh_toID = window.setTimeout(function() {
						form.slideShow(todo, form);
					}, options.fadelength);
				return true;
			}
		},
		animMaskSlideAway : function() {
			var form = this;
			var options = form.data('ehshw');
			if (options.pause_slideshow == 0) {
				if ($(options.plate + '.' + options.active, form).length) {
					var doChange = false;
					if (options.slide_to == 'next') {
						if (options.direction == 'left' || options.direction == 'up') {
							options.current_op -= options.steplength;
							if (options.direction == 'left')
								if (options.current_op <= (0 - options.width))
									doChange = true;
							if (options.direction == 'up')
								if (options.current_op <= (0 - options.height))
									doChange = true;
						} else if (options.direction == 'right' || options.direction == 'down') {
							options.current_op += options.steplength;
							if (options.direction == 'right')
								if (options.current_op >= options.width)
									doChange = true;
							if (options.direction == 'down')
								if (options.current_op >= options.height)
									doChange = true;
						}

						if (doChange) {
							var panel = $(options.plate, form).last();
							panel.prev().addClass(options.active);
							panel.css({
								'left' : 0,
								'top' : 0
							}).removeClass(options.active).prependTo($(options.list, form));
							options.current_op = 0;

							options.current_slide++;
							if (options.current_slide > options.total_slides)
								options.current_slide = 1;

							if (!options.hideicons)
								methods.swapSlideIcon.apply(form);

							if (options.onChange)
								options.onChange(form, options);

							if (!options.isstatic)
								options.sh_toID = window.setTimeout(function() {
									form.slideShow('startShow', form);
								}, options.pauseLength);

						} else {
							if (options.direction == 'left' || options.direction == 'right')
								$(options.plate, form).last().css('left', options.current_op);
							if (options.direction == 'up' || options.direction == 'down')
								$(options.plate, form).last().css('top', options.current_op);
							options.sh_toID = window.setTimeout(function() {
								form.slideShow('animMaskSlideAway', form);
							}, options.fadelength);
						}
					} else {
						if (options.direction == 'left' || options.direction == 'up') {
							options.current_op += options.steplength;
							if (options.current_op >= 0)
								doChange = true;
						} else if (options.direction == 'right' || options.direction == 'down') {
							options.current_op -= options.steplength;
							if (options.current_op <= 0)
								doChange = true;
						}
						if (doChange) {
							options.slide_to = 'next';
							var panel = $(options.plate, form).last().prev();
							panel.removeClass(options.active);
							options.current_op = 0;
							$(options.plate, form).last().css({
								'left' : 0,
								'top' : 0
							}).addClass(options.active);

							if (!options.hideicons)
								methods.swapSlideIcon.apply(form);
							if (options.onChange)
								options.onChange(form, options);
							if (!options.isstatic)
								options.sh_toID = window.setTimeout(function() {
									form.slideShow('startShow', form);
								}, options.pauseLength);

						} else {
							if (options.direction == 'left' || options.direction == 'right')
								$(options.plate, form).last().css('left', options.current_op);
							if (options.direction == 'up' || options.direction == 'down')
								$(options.plate, form).last().css('top', options.current_op);
							options.sh_toID = window.setTimeout(function() {
								form.slideShow('animMaskSlideAway', form);
							}, options.fadelength);
						}
					}
				}
			}
		},
		animMaskSlideOver : function() {
			var form = this;
			var options = form.data('ehshw');
			if (options.pause_slideshow == 0) {
				if ($(options.plate + '.' + options.active, form).length) {
					var doChange = false;
					if (options.slide_to == 'next') {
						if (options.direction == 'left' || options.direction == 'up') {
							options.current_op -= options.steplength;
							if (options.current_op <= 0) {
								doChange = true;
								options.current_op = 0;
							}
						} else if (options.direction == 'right' || options.direction == 'down') {
							options.current_op += options.steplength;
							if (options.current_op >= 0) {
								doChange = true;
								options.current_op = 0;
							}
						}
						if (options.direction == 'left' || options.direction == 'right') {
							$(options.plate + '.' + options.active, form).next().css('left', options.current_op);
						} else if (options.direction == 'up' || options.direction == 'down') {
							$(options.plate + '.' + options.active, form).next().css('top', options.current_op);
						}
						if (doChange) {
							if (options.direction == 'left' || options.direction == 'right') {
								$(options.plate + '.' + options.active, form).removeClass(options.active).appendTo(
										$(options.list, form)).css('left', options.width);
							} else if (options.direction == 'up' || options.direction == 'down') {
								$(options.plate + '.' + options.active, form).removeClass(options.active).appendTo(
										$(options.list, form)).css('top', options.width);
							}
							if (options.direction == 'left') {
								options.current_op = options.width;
							} else if (options.direction == 'up') {
								options.current_op = options.height;
							} else if (options.direction == 'right') {
								options.current_op = 0 - options.width;
							} else if (options.direction == 'down') {
								options.current_op = 0 - options.height;
							}

							$(options.plate, form).first().addClass(options.active);
							if (!options.isstatic)
								options.sh_toID = window.setTimeout(function() {
									form.slideShow('startShow', form);
								}, options.pauseLength);

							options.current_slide++;
							if (options.current_slide > options.total_slides)
								options.current_slide = 1;

							if (!options.hideicons)
								methods.swapSlideIcon.apply(form);
							if (options.onChange)
								options.onChange(form, options);

						} else {
							options.sh_toID = window.setTimeout(function() {
								form.slideShow('animMaskSlideOver', form);
							}, options.fadelength);
						}

					} else {
						if (options.direction == 'left' || options.direction == 'up') {
							options.current_op += options.steplength;
							var operand = (options.direction == 'left') ? options.width : options.height;
							if (options.current_op >= operand) {
								doChange = true;
								options.current_op = operand;
							}
						} else if (options.direction == 'right' || options.direction == 'down') {
							options.current_op -= options.steplength;
							var operand = (options.direction == 'right') ? 0 - options.width : 0 - options.height;
							if (options.current_op <= operand) {
								doChange = true;
								options.current_op = operand;
							}
						}
						if (options.direction == 'left' || options.direction == 'right') {
							$(options.plate, form).first().next().css('left', options.current_op);
						} else if (options.direction == 'up' || options.direction == 'down') {
							$(options.plate, form).first().next().css('top', options.current_op);
						}
						if (doChange) {
							options.slide_to = 'next';
							$(options.plate, form).first().next().removeClass(options.active);
							$(options.plate, form).first().addClass(options.active);
							if (!options.hideicons)
								methods.swapSlideIcon.apply(form);
							if (options.onChange)
								options.onChange(form, options);
							if (!options.isstatic)
								options.sh_toID = window.setTimeout(function() {
									form.slideShow('startShow', form);
								}, options.pauseLength);
						} else {
							options.sh_toID = window.setTimeout(function() {
								form.slideShow('animMaskSlideOver', form);
							}, options.fadelength);
						}
					}
				}
			}
		},
		animMaskSlide : function() {
			var form = this;
			var options = form.data('ehshw');
			if (options.pause_slideshow == 0) {
				if ($(options.plate + '.' + options.active, form).length) {
					var doChange = false;
					if (options.slide_to == 'next') {
						if (options.direction == 'left' || options.direction == 'up') {
							options.current_op -= options.steplength;
							if (options.direction == 'left') {
								if (options.current_op <= (0 - options.width)) {
									options.current_op = 0 - options.width;
									doChange = true;
								}
							}
							if (options.direction == 'up') {
								if (options.current_op <= (0 - options.height)) {
									options.current_op = 0 - options.height;
									doChange = true;
								}
							}
						} else if (options.direction == 'right' || options.direction == 'down') {
							options.current_op += options.steplength;
							if (options.current_op >= 0) {
								options.current_op = 0;
								doChange = true;
							}
						}
						if (options.direction == 'left' || options.direction == 'right')
							$(options.plate, form).first().css('margin-left', options.current_op);
						if (options.direction == 'up' || options.direction == 'down')
							$(options.plate, form).first().css('margin-top', options.current_op);
						if (doChange) {
							if (options.direction == 'left' || options.direction == 'up') {
								methods.movePlateToEnd.apply(form);
								options.current_op = 0;
							}
							if (options.direction == 'right' || options.direction == 'down') {
								methods.movePlateToStart.apply(form);
								if (options.direction == 'right')
									options.current_op = (0 - options.width);
								if (options.direction == 'down')
									options.current_op = (0 - options.height);
							}
							if (!options.isstatic)
								options.sh_toID = window.setTimeout(function() {
									form.slideShow('startShow', form);
								}, options.pauseLength);
						} else {
							options.sh_toID = window.setTimeout(function() {
								form.slideShow('animMaskSlide', form);
							}, options.fadelength);
						}
					} else {
						if (options.direction == 'left' || options.direction == 'up') {
							options.current_op += options.steplength;
							if (options.current_op >= 0) {
								options.current_op = 0;
								doChange = true;
							}
						} else if (options.direction == 'right' || options.direction == 'down') {
							options.current_op -= options.steplength;
							if (options.direction == 'right') {
								if (options.current_op <= (0 - options.width)) {
									options.current_op = 0 - options.width;
									doChange = true;
								}
							}
							if (options.direction == 'down') {
								if (options.current_op <= (0 - options.height)) {
									options.current_op = 0 - options.height;
									doChange = true;
								}
							}
						}

						if (options.direction == 'left' || options.direction == 'right')
							$(options.plate, form).first().css('margin-left', options.current_op);
						if (options.direction == 'up' || options.direction == 'down')
							$(options.plate, form).first().css('margin-top', options.current_op);

						if (doChange) {
							options.slide_to = 'next';
							options.current_op = 0;
							if (!options.isstatic)
								options.sh_toID = window.setTimeout(function() {
									form.slideShow('startShow', form);
								}, options.pauseLength);

							if (!options.hideicons)
								methods.swapSlideIcon.apply(form);

							if (options.onChange)
								options.onChange(form, options);

						} else {
							options.sh_toID = window.setTimeout(function() {
								form.slideShow('animMaskSlide', form);
							}, options.fadelength);
						}
					}
				}
			}
		},
		movePlateToEnd : function() {
			var form = this;
			var options = form.data('ehshw');
			if ($(options.plate + '.' + options.active, form).length) {
				options.current_slide++;
				if (options.current_slide > options.total_slides)
					options.current_slide = 1;

				var panel = $(options.plate, form).first();
				panel.removeClass(options.active).css({
					'margin-left' : 0,
					'margin-top' : 0
				}).hide().appendTo($(options.list, form));

				$(options.plate, form).first().addClass(options.active).css({
					'margin-left' : 0,
					'margin-top' : 0
				});
				$(options.plate, form).last().show();

				if (!options.hideicons)
					methods.swapSlideIcon.apply(form);
				if (options.onChange) {
					options.onChange(form, options);
				}
			}
		},
		movePlateToStart : function() {
			var form = this;
			var options = form.data('ehshw');
			if ($(options.plate + '.' + options.active, form).length) {
				options.current_slide++;
				if (options.current_slide > options.total_slides)
					options.current_slide = 1;

				var panel = $(options.plate + '.' + options.active, form);
				panel.css({
					'margin-left' : 0,
					'margin-top' : 0
				}).removeClass(options.active);
				$(options.plate, form).first().addClass(options.active);

				if (options.direction == 'right')
					$(options.plate, form).last().css('margin-left', (0 - options.width)).prependTo(
							$(options.list, form));
				if (options.direction == 'down')
					$(options.plate, form).last().css('margin-top', (0 - options.height)).prependTo(
							$(options.list, form));

				if (!options.hideicons)
					methods.swapSlideIcon.apply(form);
				if (options.onChange) {
					options.onChange(form, options);
				}
			}
		},
		fadeMaskUp : function() {
			var form = this;
			var options = form.data('ehshw');
			if (options.pause_slideshow == 0) {
				if ($(options.plate + '.' + options.active, form).length) {
					var begin_at = options.current_op;
					options.current_op -= options.fadestep;
					if (options.current_op < 0) {
						options.current_op = 0;
					}
					$(options.plate + '.' + options.active, form).css({
						'filter' : 'alpha(opacity=' + options.current_op + ')',
						'opacity' : (options.current_op / 100),
						'display' : ''
					});
					var nextSlide = null;
					if (options.type == 'xfade') {
						if (options.slide_jump !== null && options.slide_jump != '') {
							
							if (begin_at == 100) {
								if (!options.hideicons)
									methods.swapSlideIcon.apply(form);
							}
							
							$(options.plate, form).each(function() {
								if ($(this).hasAttr('data-item')) {
									if ($(this).attr('data-item') == options.slide_jump) {
										if ($(this).hasClass(options.active))
											return false;
										nextSlide = $(this);
										return true;
									}
								}
							});
							if (nextSlide === null)
								return false;
						} else {
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
						}
						nextSlide.css({
							'filter' : 'alpha(opacity=' + (100 - options.current_op) + ')',
							'opacity' : (1 - (options.current_op / 100)),
							'display' : ''
						});
					}

					if (options.current_op == 0) {
						if (options.type == 'fade') {
							methods.loadNewPlate.apply(form);
							options.sh_toID = window.setTimeout(function() {
								form.slideShow('fadeMaskDown', form);
							}, options.fadelength);
						} else {
							if (options.type == 'xfade') {
								if (options.slide_to == 'next') {
									options.current_slide++;
								} else {
									options.current_slide--;
									options.slide_to = 'next';
								}
								options.current_op = 100;
								$(options.plate + '.' + options.active, form).hide().removeClass(options.active);
								nextSlide.addClass(options.active);
								
								if (!options.isstatic)
									options.sh_toID = window.setTimeout(function() {
										form.slideShow('startShow', form);
									}, options.pauseLength);
								
								if (options.slide_jump !== null && options.slide_jump != '') {
									
								} else {
									if (!options.hideicons)
										methods.swapSlideIcon.apply(form);

									if (options.onChange) {
										options.onChange(form, options);
									}
								}
								options.slide_jump = null;
							}
						}
					} else {
						options.sh_toID = window.setTimeout(function() {
							form.slideShow('fadeMaskUp', form);
						}, options.fadelength);
					}
				}
			}
		},
		fadeMaskDown : function() {
			var form = this;
			var options = form.data('ehshw');
			if (options.pause_slideshow == 0) {
				if ($(options.plate + '.' + options.active, form).length) {
					options.current_op += options.fadestep;
					if (options.current_op > 100) {
						options.current_op = 100;
					}
					$(options.plate + '.' + options.active, form).css({
						'filter' : 'alpha(opacity=' + options.current_op + ')',
						'opacity' : (options.current_op / 100)
					});
					if (options.current_op == 100) {
						if (!options.isstatic)
							options.sh_toID = window.setTimeout(function() {
								form.slideShow('startShow', form);
							}, options.pauseLength);
					} else {
						options.sh_toID = window.setTimeout(function() {
							form.slideShow('fadeMaskDown', form);
						}, options.fadelength);
					}
				}
			}
		},
		loadNewPlate : function() {
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
				$(options.plate + '.' + options.active, form).hide().css({
					'filter' : 'alpha(opacity=100)',
					'opacity' : 1
				}).removeClass(options.active);
				nextSlide.addClass(options.active).css({
					'filter' : 'alpha(opacity=0)',
					'opacity' : 0
				}).show();
				if (!options.hideicons)
					methods.swapSlideIcon.apply(form);

			}
		},
		scrollIconsList: function() {
			var form = this;
			var options = form.data('ehshw');
			var currentIndex = -1;
			$('.' + options.icons, form).each(function() {
				if ($(this).attr('data-item') == $(options.plate + '.' + options.active, form).attr('data-item')) {
					currentIndex = $(this).attr('data-item');
				}
			});
			if (currentIndex == -1) return false;
			
			if (options.slide_to == 'next') {
				currentIndex++;
				if (currentIndex > (options.total_slides - 1))
					currentIndex = 0;
			} else if (options.slide_to == 'prev') {
				currentIndex--;
				if (currentIndex < 0)
					currentIndex = (options.total_slides - 1);
			}
			
			//get the items position
			var leftPos = $('.' + options.icons + '[data-item="' + currentIndex + '"]', form).position().left;
			if (leftPos < 0) 
				$('.' + options.iconlistcontainter, form).animate({
					scrollLeft: currentIndex * 152
				});
			if (leftPos > options.iconlistwidth) {
				var scrollto = (currentIndex * options.iconwidth) - (( options.iconlistwidth + options.iconoffset) - options.iconwidth);
				$('.' + options.iconlistcontainter, form).animate({
		         	scrollLeft: scrollto
		    	});
			}
		},
		prevPage : function() {
			var form = this;
			var options = form.data('ehshw');
			
			var total_pages = Math.ceil((options.iconwidth * options.total_slides) / (options.iconlistwidth + options.iconoffset));
			options.iconlistpage++;
			if (options.iconlistpage > total_pages)
				options.iconlistpage = 1;

			$('.' + options.iconnext, form).removeClass('disabled');
			$('.' + options.iconprev, form).removeClass('disabled');
			
			if (options.iconlistpage == total_pages && !options.allowpageloop)
				$('.' + options.iconnext, form).addClass('disabled');
				
			var pageSize = ( options.iconlistwidth + options.iconoffset) * (options.iconlistpage - 1);
			$('.' + options.iconlistcontainter + ' > ul', form).animate({
	         	'margin-left': 0 - pageSize
	    	});
			
		},
		nextPage : function() {
			var form = this;
			var options = form.data('ehshw');
			
			var total_pages = Math.ceil((options.iconwidth * options.total_slides) / (options.iconlistwidth + options.iconoffset));
			options.iconlistpage--;
			if (options.iconlistpage < 1)
				options.iconlistpage = total_pages;
			
			$('.' + options.iconnext, form).removeClass('disabled');
			$('.' + options.iconprev, form).removeClass('disabled');
			
			if (options.iconlistpage == 1 && !options.allowpageloop)
				$('.' + options.iconprev, form).addClass('disabled');
				
			var pageSize = ( options.iconlistwidth + options.iconoffset) * (options.iconlistpage - 1);
			$('.' + options.iconlistcontainter + ' > ul', form).animate({
	         	'margin-left': 0 - pageSize
	    	});
			
		},
		nextSlide : function() {
			var form = this;
			var options = form.data('ehshw');
			// clear the current timeout
			window.clearTimeout(options.sh_toID);
			if ($(options.plate + '.' + options.active, form).length) {
				
				if (options.prevnextaction == 'page') {
					methods.prevPage.apply(form);
				} else {
					options.slide_to = 'next';
					
					if (options.onNext) {
						options.onNext(form, options);
					}
					
					if (options.type == 'slide') {
						options.sh_toID = window.setTimeout(function() {
							form.slideShow('animMaskSlide', form);
						}, options.fadelength);
					} else if (options.type == 'slide-over') {
						options.sh_toID = window.setTimeout(function() {
							form.slideShow('animMaskSlideOver', form);
						}, options.fadelength);
					} else if (options.type == 'slide-away') {
						options.sh_toID = window.setTimeout(function() {
							form.slideShow('animMaskSlideAway', form);
						}, options.fadelength);
					} else {
						options.sh_toID = window.setTimeout(function() {
							form.slideShow('fadeMaskUp', form);
						}, options.fadelength);
					}
					if (options.prevnextaction == 'scroll') {
						methods.scrollIconsList.apply(form);
					}
				}
			}
		},
		prevSlide : function() {
			var form = this;
			var options = form.data('ehshw');
			// clear the current timeout
			window.clearTimeout(options.sh_toID);
			if ($(options.plate + '.' + options.active, form).length) {

				if (options.prevnextaction == 'page') {
					methods.nextPage.apply(form);
				} else {
					options.slide_to = 'prev';
					if (options.onPrev) {
						options.onPrev(form, options);
					}
					if (options.type == 'slide-away') {
						if (options.direction == 'left') {
							options.current_op = 0 - options.width;
						} else if (options.direction == 'right') {
							options.current_op = options.width;
						} else if (options.direction == 'up') {
							options.current_op = 0 - options.height;
						} else if (options.direction == 'down') {
							options.current_op = options.height;
						}
						if (options.direction == 'left' || options.direction == 'right')
							$(options.plate, form).first().css('left', options.current_op).appendTo($(options.list, form));
						if (options.direction == 'up' || options.direction == 'down')
							$(options.plate, form).first().css('top', options.current_op).appendTo($(options.list, form));
	
						options.sh_toID = window.setTimeout(function() {
							form.slideShow('animMaskSlideAway', form);
						}, options.fadelength);
	
					} else if (options.type == 'slide-over') {
	
						// grab the last item and put it at the start of the list so
						// it's under the current slide
						$(options.plate, form).last().css({
							'left' : 0,
							'top' : 0
						}).prependTo($(options.list, form));
						options.current_op = 0;
						options.sh_toID = window.setTimeout(function() {
							form.slideShow('animMaskSlideOver', form);
						}, options.fadelength);
	
					} else if (options.type == 'slide') {
						options.current_slide--;
						if (options.current_slide < 0)
							options.current_slide = options.total_slides;
	
						if (options.direction == 'left') {
							// move the last slide in the list to the first
							$(options.plate, form).last().hide().css('margin-left', (0 - options.width)).prependTo(
									$(options.list, form));
							$(options.plate + '.' + options.active, form).css('margin-left', 0).removeClass(options.active);
							$(options.plate, form).first().show().addClass(options.active);
							options.current_op = (0 - options.width);
						} else if (options.direction == 'up') {
							// move the last slide in the list to the first
							$(options.plate, form).last().hide().css('margin-top', (0 - options.height)).prependTo(
									$(options.list, form));
							$(options.plate + '.' + options.active, form).css('margin-top', 0).removeClass(options.active);
							$(options.plate, form).first().show().addClass(options.active);
							options.current_op = (0 - options.height);
						} else if (options.direction == 'right') {
							var panel = $(options.plate + '.' + options.active, form);
							panel.removeClass(options.active).css('margin-left', '');
							$(options.plate, form).first().css('margin-left', '').appendTo($(options.list, form));
							panel.next().addClass(options.active).css('margin-left', '');
							options.current_op = 0;
						} else if (options.direction == 'down') {
							var panel = $(options.plate + '.' + options.active, form);
							panel.removeClass(options.active).css('margin-top', 0);
							$(options.plate, form).first().css('margin-top', 0).appendTo($(options.list, form));
							panel.next().addClass(options.active).css('margin-top', 0);
							options.current_op = 0;
						}
						options.sh_toID = window.setTimeout(function() {
							form.slideShow('animMaskSlide', form);
						}, options.fadelength);
					} else {
						options.sh_toID = window.setTimeout(function() {
							form.slideShow('fadeMaskUp', form);
						}, options.fadelength);
					}
					if (options.prevnextaction == 'scroll') {
						methods.scrollIconsList.apply(form);
					}
				}
			}
		},
		slideJump : function(boxnum) {
			var form = this;
			var options = form.data('ehshw');
			
			options.slide_jump = null;
			
			// clear the current timeout
			window.clearTimeout(options.sh_toID);
			var nextSlide = null;
			$(options.plate, form).each(function() {
				if ($(this).hasAttr('data-item')) {
					if ($(this).attr('data-item') == boxnum) {
						if ($(this).hasClass(options.active))
							return false;
						nextSlide = $(this);
						return true;
					}
				}
			});
			if (nextSlide === null)
				return false;

			if ($(options.plate + '.' + options.active, form).length) {
				if (options.type == 'slide') {
					if (options.direction == 'left') {
						options.current_op = 0;
						if (!nextSlide.is(':last-child')) {
							var cIndex = $(options.plate, form).index(nextSlide);
							for ( var i = cIndex + 1; i < $(options.plate, form).length; i++) {
								$(options.plate, form).last().css('margin-left', 0).removeClass(options.active)
										.prependTo($(options.list, form));
							}
						}
						$(options.plate + '.' + options.active, form).css('margin-left', 0).removeClass(options.active);
						nextSlide.css('margin-left', 0).addClass(options.active).prependTo($(options.list, form));
					} else if (options.direction == 'right') {
						options.current_op = 0 - options.width;
						$(options.plate, form).css('margin-left', '').removeClass(options.active);

						if (nextSlide.is(':first-child')) {
							nextSlide.addClass(options.active);
							$(options.plate, form).last().css('margin-left', options.current_op).prependTo(
									$(options.list, form));
						} else {
							if (!nextSlide.is(':last-child')) {
								var cIndex = $(options.plate, form).index(nextSlide);
								for ( var i = $(options.plate, form).length; i > cIndex; i--) {
									$(options.plate, form).last().prependTo($(options.list, form));
								}
							}
							$(options.plate, form).last().addClass(options.active).prependTo($(options.list, form)); // the new slide
							// should now be the
							// last item
							$(options.plate, form).last().css('margin-left', options.current_op).prependTo(
									$(options.list, form));
						}
					}
					options.current_slide = boxnum;
					if (!options.hideicons)
						methods.swapSlideIcon.apply(form);

				} else if (options.type == 'xfade' || options.type == 'fade') {
					options.current_op = 100;
					if (options.type == 'xfade') {
						options.current_op = 100;
						options.slide_jump = boxnum;
						
						nextSlide.css({
							'filter' : 'alpha(opacity=0)',
							'opacity' : 0,
							'display' : ''
						});
						
						options.pause_slideshow = 0;
						
						if (options.isstatic)
							form.slideShow('fadeMaskUp', form);
						
					} else {
						$(options.plate + '.' + options.active, form).hide().css({
							'filter' : 'alpha(opacity=100)',
							'opacity' : 1
						}).removeClass(options.active);
						nextSlide.addClass(options.active).css({
							'filter' : 'alpha(opacity=100)',
							'opacity' : 1
						}).show();
						
						options.current_slide = boxnum;
						if (!options.hideicons)
							methods.swapSlideIcon.apply(form);
					}
				} else if (options.type == 'slide-over') {
					if (options.direction == 'left') {
						options.current_op = options.width;
					} else if (options.direction == 'right') {
						options.current_op = 0 - options.width;
					}
					$(options.plate, form).css('left', options.current_op).removeClass(options.active);
					if (!nextSlide.is(':first-child')) {
						var cIndex = $(options.plate, form).index(nextSlide);
						for ( var i = cIndex - 1; i >= 0; i--) {
							$(options.plate, form).first().appendTo($(options.list, form));
						}
					}

					nextSlide.css('left', 0).addClass(options.active);

					options.current_slide = boxnum;
					if (!options.hideicons)
						methods.swapSlideIcon.apply(form);
				} else if (options.type == 'slide-away') {
					options.current_op = 0;
					$(options.plate, form).css({
						'left' : options.current_op,
						'top' : options.current_op
					}).removeClass(options.active);
					if (!nextSlide.is(':last-child')) {
						var cIndex = $(options.plate, form).index(nextSlide);
						for ( var i = cIndex + 1; i < $(options.plate, form).length; i++) {
							$(options.plate, form).last().prependTo($(options.list, form));
						}
					}
					if (options.direction == 'left' || options.direction == 'right')
						nextSlide.css('left', 0).addClass(options.active);
					if (options.direction == 'up' || options.direction == 'down')
						nextSlide.css('top', 0).addClass(options.active);

					options.current_slide = boxnum;
					if (!options.hideicons)
						methods.swapSlideIcon.apply(form);
				}
				options.pause_slideshow = 0;
				if (!options.isstatic)
					options.sh_toID = window.setTimeout(function() {
						form.slideShow('startShow', form);
					}, options.pauseLength);

				if (options.onChange) {
					options.onChange(form, options);
				}
			}
		},
		slideHighlight : function(boxnum) {
			var form = this;
			var options = form.data('ehshw');
			options.pause_slideshow = 1;

			// clear the current timeout
			window.clearTimeout(options.sh_toID);
			var nextSlide = null;
			$(options.plate, form).each(function() {
				if ($(this).hasAttr('data-item')) {
					if ($(this).attr('data-item') == boxnum) {
						if ($(this).hasClass(options.active))
							return false;
						nextSlide = $(this);
						return true;
					}
				}
			});
			if (nextSlide === null)
				return false;

			if ($(options.plate + '.' + options.active, form).length) {
				if (options.type == 'slide') {
					if (options.direction == 'left') {
						if (!nextSlide.is(':last-child')) {
							var cIndex = $(options.plate, form).index(nextSlide);
							for ( var i = cIndex + 1; i < $(options.plate, form).length; i++) {
								$(options.plate, form).last().css('margin-left', 0).removeClass(options.active)
										.prependTo($(options.list, form));
							}
						}
						$(options.plate + '.' + options.active, form).css('margin-left', 0).removeClass(options.active);
						nextSlide.css('margin-left', 0).addClass(options.active).prependTo($(options.list, form));
						options.current_op = 0;
					} else if (options.direction == 'up') {
						if (!nextSlide.is(':last-child')) {
							var cIndex = $(options.plate, form).index(nextSlide);
							for ( var i = cIndex + 1; i < $(options.plate, form).length; i++) {
								$(options.plate, form).last().css('margin-top', 0).removeClass(options.active)
										.prependTo($(options.list, form));
							}
						}
						$(options.plate + '.' + options.active, form).css('margin-top', 0).removeClass(options.active);
						nextSlide.css('margin-top', 0).addClass(options.active).prependTo($(options.list, form));
						options.current_op = 0;
					} else if (options.direction == 'right') {
						options.current_op = 0 - options.width;
						$(options.plate, form).css('margin-left', '').removeClass(options.active);

						if (nextSlide.is(':first-child')) {
							nextSlide.addClass(options.active);
							$(options.plate, form).last().css('margin-left', options.current_op).prependTo(
									$(options.list, form));
						} else {
							if (!nextSlide.is(':last-child')) {
								var cIndex = $(options.plate, form).index(nextSlide);
								for ( var i = $(options.plate, form).length; i > cIndex; i--) {
									$(options.plate, form).last().prependTo($(options.list, form));
								}
							}
							$(options.plate, form).last().addClass(options.active).prependTo($(options.list, form)); // the new slide
							// should now be the
							// last item
							$(options.plate, form).last().css('margin-left', options.current_op).prependTo(
									$(options.list, form));
						}
					} else if (options.direction == 'down') {
						options.current_op = 0 - options.height;
						$(options.plate, form).css('margin-top', '').removeClass(options.active);

						if (nextSlide.is(':first-child')) {
							nextSlide.addClass(options.active);
							$(options.plate, form).last().css('margin-top', options.current_op).prependTo(
									$(options.list, form));
						} else {
							if (!nextSlide.is(':last-child')) {
								var cIndex = $(options.plate, form).index(nextSlide);
								for ( var i = $(options.plate, form).length; i > cIndex; i--) {
									$(options.plate, form).last().prependTo($(options.list, form));
								}
							}
							$(options.plate, form).last().addClass(options.active).prependTo($(options.list, form)); // the new slide
							// should now be the
							// last item
							$(options.plate, form).last().css('margin-top', options.current_op).prependTo(
									$(options.list, form));
						}
					}

					options.current_slide = boxnum;
					if (!options.hideicons)
						methods.swapSlideIcon.apply(form);

				} else if (options.type == 'xfade' || options.type == 'fade') {
					options.current_op = 100;
					if (options.type == 'xfade') {
						$(options.plate, form).css({
							'filter' : 'alpha(opacity=0)',
							'opacity' : 0
						}).hide().removeClass(options.active);
						nextSlide.addClass(options.active).css({
							'filter' : 'alpha(opacity=100)',
							'opacity' : 1,
							'display' : ''
						});
					} else {
						$(options.plate + '.' + options.active, form).hide().css({
							'filter' : 'alpha(opacity=100)',
							'opacity' : 1
						}).removeClass(options.active);
						nextSlide.addClass(options.active).css({
							'filter' : 'alpha(opacity=100)',
							'opacity' : 1
						}).show();
					}
					options.current_slide = boxnum;
					if (!options.hideicons)
						methods.swapSlideIcon.apply(form);
				} else if (options.type == 'slide-over') {
					if (options.direction == 'left') {
						options.current_op = options.width;
						$(options.plate, form).css('left', options.current_op).removeClass(options.active);
					} else if (options.direction == 'right') {
						options.current_op = 0 - options.width;
						$(options.plate, form).css('left', options.current_op).removeClass(options.active);
					} else if (options.direction == 'up') {
						options.current_op = options.height;
						$(options.plate, form).css('top', options.current_op).removeClass(options.active);
					} else if (options.direction == 'down') {
						options.current_op = 0 - options.height;
						$(options.plate, form).css('top', options.current_op).removeClass(options.active);
					}

					if (!nextSlide.is(':first-child')) {
						var cIndex = $(options.plate, form).index(nextSlide);
						for ( var i = cIndex - 1; i >= 0; i--) {
							$(options.plate, form).first().appendTo($(options.list, form));
						}
					}

					nextSlide.css({
						'left' : 0,
						'top' : 0
					}).addClass(options.active);

					options.current_slide = boxnum;
					if (!options.hideicons)
						methods.swapSlideIcon.apply(form);
				} else if (options.type == 'slide-away') {
					options.current_op = 0;
					$(options.plate, form).css({
						'left' : options.current_op,
						'top' : options.current_op
					}).removeClass(options.active);
					if (!nextSlide.is(':last-child')) {
						var cIndex = $(options.plate, form).index(nextSlide);
						for ( var i = cIndex + 1; i < $(options.plate, form).length; i++) {
							$(options.plate, form).last().prependTo($(options.list, form));
						}
					}
					if (options.direction == 'left' || options.direction == 'right')
						nextSlide.css('left', 0).addClass(options.active);
					if (options.direction == 'up' || options.direction == 'down')
						nextSlide.css('top', 0).addClass(options.active);

					options.current_slide = boxnum;
					if (!options.hideicons)
						methods.swapSlideIcon.apply(form);
				}
				if (options.onChange) {
					options.onChange(form, options);
				}
			}
		},
		slideDeHighlight : function(boxnum) {
			var form = this;
			var options = form.data('ehshw');
			options.pause_slideshow = 0;
			if (!options.isstatic)
				options.sh_toID = window.setTimeout(function() {
					form.slideShow('startShow', form);
				}, options.pauseLength);
		},
		swapSlideIcon : function() {
			var form = this;
			var options = form.data('ehshw');
			if ($(options.plate + '.' + options.active, form).length) {
				$('.' + options.icons, form).each(function() {
					
					var dataItem = $(options.plate + '.' + options.active, form).attr('data-item');
					
					if (options.slide_jump !== null) dataItem = options.slide_jump;
					
					if ($(this).attr('data-item') == dataItem) {
						$(this).addClass(options.iconactive);
					} else {
						$(this).removeClass(options.iconactive);
					}
				});
			}
		},
		/**
		 * Removes forbidden characters from class name
		 * 
		 * @param {String}
		 *            className
		 */
		_getClassName : function(className) {
			return className.replace(":", "_").replace(".", "_");
		},
		reset : function() {
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
			options.sh_toID = window.setTimeout(function() {
				$('#' + form.attr('id')).slideShow('startShow', form);
			}, options.pauseLength);
		}
		/**
		 * @memberOf methods
		 */
	};

	/**
	 * Plugin entry point. You may pass an action as a parameter or a list of
	 * options. if none, the init and attach methods are being called. Remember:
	 * if you pass options, the attached method is NOT called automatically
	 * 
	 * @param {String}
	 *            method (optional) action
	 */
	$.fn.slideShow = function(method) {

		var form = $(this);
		if (!form[0]) {
			return false;
		} // stop here if the form does not exist

		if (typeof (method) === 'string' && method.charAt(0) != '_' && methods[method]) {

			// make sure init is called once
			if (method != "loadSlide" && method != "fadeMaskUp" && method != "fadeMaskDown" && method != "startShow" && method != "slideHighlight" && method != "slideDeHighlight" && method != "nextSlide" && method != "prevSlide" && method != "reset")
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