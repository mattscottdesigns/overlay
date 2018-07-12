;
(function ($, window, document, undefined) {

	/**
	 * TO DO
	 * - "namespace" option
	 * - "logging" option
	 */

	"use strict";

	var pluginName = "overlay",
		defaults = {
			"enabled": true,
			"showProgress": true
		};


	function Plugin(element, options) {

		this.$element = $(element).addClass("overlay-element");
		this.defaults = $.extend({}, defaults, $.fn[pluginName].defaults);
		this.settings = $.extend({}, this.defaults, options);

		if (this.settings.enabled && this.$element.length > 0) {
			this.init();
		}

	}


	$.extend(Plugin.prototype, {

		init: function () {
			var _this = this;

			_this.createOverlay()
				.createProps()
				.createStepContainers()
				.createStepContent()
				.setActive();

			return this
		},


		createOverlay: function () {
			var _this = this;

			$("head").append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />')

			$("body")
				.addClass("overlay")
				.prepend("<div class='overlay-container'><div class='overlay-content' /></div>");

			$(".overlay-content").append(_this.$element);

			return this
		},


		createProps: function () {
			var _this = this;

			_this.$container = $(".overlay-container");
			_this.$content = $(".overlay-content");
			_this.$stepContainers = [];
			_this.stepCount = _this.settings.steps ? _this.settings.steps.length : 1;
			_this.currentStep = 1;

			return this
		},


		createStepContainers: function () {
			var _this = this;

			for (var x = 0; x < _this.stepCount; x++) {
				_this.$stepContainers.push($("<div class='overlay-step step-" + (x + 1) + "' />"));
			}

			_this.$element.append(_this.$stepContainers);

			return this
		},


		createStepContent: function () {
			var _this = this;

			for (var x = 0; x < _this.stepCount; x++) {

				var step = _this.$stepContainers[x];

				if (_this.settings.steps) {
					var title = _this.settings.steps[x].title;
					var content = _this.settings.steps[x].content;

					if (title) {
						step.append(title)
					}

					if (content) {
						step.append(content)
					}
				} else {
					step.append(_this.$element.children())
				}
			}

			return this
		},


		setActive: function (next) {
			var _this = this,
				next = typeof (next) !== 'undefined' ? next : 0;

			var activeStep = _this.currentStep + next;

			$(".step-" + _this.currentStep).hide().removeClass("active");
			$(".step-" + activeStep).fadeIn().addClass("active");

			_this.currentStep = activeStep;

			_this.createProgress()
				.hideContent()
				.removeContent()
				.positionContent()
				.scrollTop();

			return this
		},


		createProgress: function () {
			var _this = this;

			if (_this.settings.steps) {

				$(".overlay-actions").remove();

				if (_this.settings.showProgress) {
					var text = _this.stepCount > 1 ? (_this.currentStep + " / " + _this.stepCount) : "";

					_this.$element.append(
						$("<div class='overlay-actions text-center' />")
						.append("<button type='button' class='btn-back'><i class='fa fa-angle-left fa-2x'></i></button>")
						.append("<span class='overlay-progress text-center text-muted'>" + text + "</span>")
						.append("<button type='submit' class='btn-next'><i class='fa fa-angle-right fa-2x'></i></button>")
					);

					_this.bindStepActions();
				}
			}

			return this
		},


		moveBack: function () {
			var _this = this;
			var previousStep = _this.currentStep - 1;

			if (previousStep > 0) {
				_this.setActive(-1);
			} else {
				window.history.back();
			}

			return this
		},


		moveNext: function () {
			var _this = this;

			if (_this.currentStep === _this.stepCount) {
				if (_this.settings.onSubmit && _this.isFunction(_this.settings.onSubmit)) {
					_this.settings.onSubmit();
				}
			} else {
				_this.setActive(1)
			}

			return this
		},


		positionContent: function () {
			var _this = this;


			function setPosition() {
				if (_this.settings.offsetTop) {
					_this.$element.css({
						"marginTop": _this.settings.offsetTop()
					})
				}

				if (_this.settings.offsetBottom) {
					_this.$element.css({
						"marginBottom": _this.settings.offsetBottom()
					})
				}
			}


			$(document).ready(function () {
				setPosition();
			});

			$(window).resize(function () {
				setPosition();
			});

			return this
		},


		bindStepActions: function () {
			var _this = this;

			$(".btn-back").each(function () {
				$(this).on("click", function () {
					_this.moveBack();
				});
			});

			$(".btn-next").each(function () {
				$(this).on("click", function (e) {
					e.preventDefault();
					if (_this.settings.onValidate && _this.isFunction(_this.settings.onValidate)) {
						if (_this.settings.onValidate()) {
							_this.moveNext();
						} else {
							_this.scrollTop();
						}
					} else {
						_this.moveNext();
					}
				})
			});

			return this
		},


		hideContent: function () {
			var _this = this;

			if( _this.isValidObject(_this.settings.hide) ){
				$(_this.settings.hide).hide();
			} 

			return this
		},


		removeContent: function () {
			var _this = this;

			if( _this.isValidObject(_this.settings.remove) ){
				$(_this.settings.remove).remove();
			} 

			return this
		},


		scrollTop: function () {
			var _this = this;

			_this.$container.animate({
				scrollTop: 0
			}, "slow");

			return this
		},


		isFunction: function (func) {
			return (typeof (func) === "function")
		},


		isValidObject: function(obj){
			return (obj instanceof jQuery)
		}


	});


	$.fn[pluginName] = function (options) {
		return new Plugin(this, options)
	};

})(jQuery, window, document);
