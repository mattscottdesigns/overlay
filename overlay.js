;
(function ($, window, document, undefined) {

	"use strict";

	/**
	 * Set plugin default settings
	 */

	var pluginName = "overlay",
		defaults = {
			"selector": "fieldset",
			"stepSize": 1,
			"currentStep": 1,
			"hide": undefined,
			"remove": undefined,
		};


	/**
	 * Plugin constructor
	 */
	function Overlay(element, options) {
		var _this = this;

		_this._defaults = $.extend({}, $.fn[pluginName].defaults, defaults);
		_this.element = element;
		_this.settings = $.extend({}, _this._defaults, options);
		
		if( _this.settings.enabled ){
			_this.init();
			return _this;
		}else{
			return false;
		}
		
	}


	/**
	 * Extend the Overlay function to add new functionality
	 */
	$.extend(Overlay.prototype, {


		/**
		 * Initialize the plugin
		 */
		init: function () {
			var _this = this;

			_this.createOverlay()
				.createProps()
				.createSteps()
				.bindActions()
				.setStep();

			return _this;
		},


		/**
		 * Bind all actions in the plugin
		 */
		bindActions: function () {
			var _this = this;

			$(".btn-back").each(function () {
				$(this).on("click", function () {
					_this.moveBack();
				});
			});

			$(".btn-next,[type='submit']").each(function () {
				$(this).on("click", function (e) {
					e.preventDefault();

					if (_this.onValidate && typeof (_this.onValidate) === "function") {
						if (_this.onValidate()) {
							_this.moveNext();
						}
					} else {
						_this.moveNext();
					}

				})
			});

			if (_this.settings.hide) {
				$(_this.settings.hide).hide();
			}

			if (_this.settings.remove) {
				$(_this.settings.remove).remove();
			}

			return _this;
		},


		/**
		 * Create the Overlay layout in the DOM
		 */
		createOverlay: function () {
			var _this = this;

			$("head").append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />')

			$("body")
				.addClass("overlay")
				.prepend("<div class='overlay-container'><div class='overlay-content' /></div>");

			return _this;
		},


		/**
		 * Create all properties and functions for the plugin
		 */
		createProps: function () {
			var _this = this;

			_this.form = $(_this.element);
			_this.overlay = $(".overlay-content").append(_this.form);
			_this.fields = $(_this.form).find(_this.settings.selector);
			_this.steps = [];
			_this.numberOfSteps = Math.ceil(_this.fields.length / _this.settings.stepSize);
			_this.currentStep = _this.settings.currentStep;
			_this.onSubmit = _this.settings.onSubmit;
			_this.onValidate = _this.settings.onValidate;

			return _this;
		},


		/**
		 * Create the step progress item - indicates what step in the wizard they are on.
		 */
		createStepProgress: function () {
			var _this = this;

			if ($(".overlay-actions").length > 0) {
				$(".overlay-actions").remove();
			}

			var $progress = $("<div class='overlay-actions text-center' />")
				.append("<button type='button' class='btn-back'><i class='fa fa-angle-left fa-2x'></i></button>")
				.append("<span class='overlay-progress text-center text-muted'>" + _this.currentStep + " / " + _this.numberOfSteps + "</span>")
				.append("<button type='submit' class='btn-next'><i class='fa fa-angle-right fa-2x'></i></button>")

			_this.overlay.append($progress)

			_this.bindActions();

			return _this;
		},


		/**
		 * Create the steps that will be used for the current instance of the plugin
		 */
		createSteps: function () {
			var _this = this;
			_this.steps = [];

			if (_this.settings.render) {

				_this.steps = _this.settings.render.map(function (step, i) {
					return $(step.selector)
				})

				for (var x = 0; x < _this.steps.length; x++) {
					var step = x + 1;
					_this.form.append("<div class='overlay-step step-" + step + "' data-step='" + step + "'/>");

					$(".step-" + step)
						.append(function () {
							if (_this.settings.render[x].title) {
								return "<h1 class='overlay-title'>" + _this.settings.render[x].title + "</h1>"
							}
						})
						.append(_this.steps[x])

				}

			} else {

				for (var x = 0; x < _this.numberOfSteps; x++) {
					var step = x + 1;
					var startSlice = _this.settings.stepSize * x;
					var endSlice = _this.settings.stepSize * x + _this.settings.stepSize;

					_this.steps.push(_this.fields.slice(startSlice, endSlice))
					_this.form.append("<div class='overlay-step step-" + step + "' data-step='" + step + "'/>");

					$(".step-" + step)
						.append(_this.steps[x])
				}
			}

			_this.numberOfSteps = _this.steps.length;
			return _this;
		},


		moveBack: function () {
			var _this = this;

			if ((_this.currentStep - 1) > 0) {
				_this.setStep(-1);
			} else {
				window.history.back();
			}
		},


		moveNext: function () {
			var _this = this;

			if (_this.currentStep === _this.numberOfSteps) {
				if (_this.onSubmit && typeof (_this.onSubmit) === "function") {
					_this.onSubmit();
				} else {
					_this.form.submit();
				}

			} else {
				_this.setStep(1)
			}
		},


		/**
		 * Set the current step of the plugin - the step that needs to be shown on screen
		 */
		setStep: function (intStep) {
			var _this = this;
			var nextStep = intStep ? _this.currentStep + intStep : _this.settings.currentStep;

			$("[data-step='" + _this.currentStep + "']").hide().removeClass("active")
			$("[data-step='" + nextStep + "']").fadeIn().addClass("active")

			_this.currentStep = nextStep;

			_this.createStepProgress()
				.setOffset();

			return _this;
		},


		/**
		 * Set the positioning of the overlay
		 */
		setOffset: function () {
			var _this = this;

			if (_this.settings.offsetTop) {
				$(".overlay-step").css({
					"marginTop": _this.settings.offsetTop()
				})

				$(window).resize(function () {
					$(".overlay-step").css({
						"marginTop": _this.settings.offsetTop()
					})
				})
			}

			if (_this.settings.offsetBottom) {
				$(".overlay-step").css({
					"marginBottom": _this.settings.offsetBottom()
				})

				$(window).resize(function () {
					$(".overlay-step").css({
						"marginBottom": _this.settings.offsetBottom()
					})
				})
			}

			return _this;
		},
	});


	/**
	 * Bind plugin to Jquery so it can be used globally
	 */

	$.fn[pluginName] = function (options) {
		return new Overlay(this, options)
	};





})(jQuery, window, document);

/**
 * Plugin Options
 * 
 * [selector] - string/Jquery selector     
 * 
 * [stepSize] - integer
 * 
 * [hide] - string/Jquery selector
 * 
 * [remove] - string/Jquery selector
 * 
 * [render] - array of objects
 * 
 */
