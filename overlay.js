;
(function ($, window, document, undefined) {

	"use strict";

	/**
	 * Set plugin default settings
	 */

	var pluginName = "overlay",
		defaults = {
			"currentStep": 1,
			"hide": undefined,
			"remove": undefined,
			"steps": []
		};


	/**
	 * Plugin constructor
	 */
	function Overlay(element, options) {
		var _this = this;

		_this._defaults = $.extend({}, $.fn[pluginName].defaults, defaults);
		_this.settings = $.extend({}, _this._defaults, options);
		_this.element = element.addClass("overlay-element");

		if (_this.settings.enabled) {
			_this.init();
			return _this;
		}

	}


	
	/**
	 * Extend the Overlay function to add new functionality
	 */
	$.extend(Overlay.prototype, {


		init: function () {
			var _this = this;

			$("head").append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />')

			_this.createOverlay()
				.createProps()
				.createSteps()
				.setActive()

			return _this;
		},


		bindActions(){
			var _this = this;

			$(".btn-back").each(function () {
				$(this).on("click", function () {
					_this.moveBack();
				});
			});

			$(".btn-next,[type='submit']").each(function () {
				$(this).on("click", function (e) {
					e.preventDefault();
					if (_this.settings.onValidate && typeof (_this.settings.onValidate) === "function") {
						if (_this.settings.onValidate()) {
							_this.moveNext();
						}
					} else {
						_this.moveNext();
					}
				})
			});
		},


		createOverlay: function () {
			var _this = this;

			$("body")
				.addClass("overlay")
				.prepend("<div class='overlay-container'><div class='overlay-content' /></div>");

			$(".overlay-content").append(_this.element);

			_this.settings.steps.map(function (step, i) {
				var intStep = i + 1;
				var step = ("<div class='overlay-step step-" + intStep + "' />");

				_this.element.append(step);

				return step
			});

			return _this;
		},


		createProps: function () {
			var _this = this;

			_this.container = $(".overlay-container");
			_this.content = $(".overlay-content");
			_this.currentStep = _this.settings.currentStep;
			_this.numberOfSteps = _this.settings.steps.length;

			return _this;
		},


		createSteps: function () {
			var _this = this;

			for (var x = 0; x < _this.numberOfSteps; x++) {
				$(".step-" + ( x + 1)).append(_this.settings.steps[x].content)
			}

			return _this;
		},


		createProgress: function () {
			var _this = this;

			$(".overlay-actions").remove();

			var progress = $("<div class='overlay-actions text-center' />")
				.append("<button type='button' class='btn-back'><i class='fa fa-angle-left fa-2x'></i></button>")
				.append("<span class='overlay-progress text-center text-muted'>" + _this.currentStep + " / " + _this.numberOfSteps + "</span>")
				.append("<button type='submit' class='btn-next'><i class='fa fa-angle-right fa-2x'></i></button>")

			$(".overlay-element").append(progress)

			_this.bindActions();

			return _this;
		},


		moveBack: function () {
			var _this = this;
			if ((_this.currentStep - 1) > 0) {
				_this.setActive(-1);
			} else {
				window.history.back();
			}
		},


		moveNext: function () {
			var _this = this;

			if (_this.currentStep === _this.numberOfSteps) {
				if (_this.settings.onSubmit && typeof (_this.settings.onSubmit) === "function") {
					_this.settings.onSubmit();
				} else {
					_this.form.submit();
				}
			} else {
				_this.setActive(1)
			}
		},


		setActive: function (intStep) {
			var _this = this;

			var activeStep = intStep ? _this.currentStep + intStep : _this.currentStep;

			$(".step-" + _this.currentStep).hide().removeClass("active")
			$(".step-" + activeStep).fadeIn().addClass("active")

			_this.currentStep = activeStep;

			if( _this.settings.steps ){
				_this.createProgress();
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
