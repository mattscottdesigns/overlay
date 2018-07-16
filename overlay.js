;
(function ($, window, document, undefined) {

	"use strict";

	var pluginName = "overlay",
		defaults = {
			"enabled": true,
			"showProgress": true,
			"steps": []
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
			this.stepCount = this.settings.steps.length;
			this.currentStep = 1;

			this.createOverlay()
				.renderSteps()
				.setActive();

			return this
		},


		createOverlay: function () {
			$("head")
				.append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />')

			$("body")
				.addClass("overlay")
				.prepend($("<div class='overlay-container'><div class='overlay-content' /></div>"));

			$(".overlay-content")
				.append(this.$element);

			return this
		},


		renderSteps: function () {
			var _this = this;

			if (this.stepCount > 0) {
				this.settings.steps.forEach(function (step, i) {
					i = i + 1;
					_this.createStep(step.content, i);
				});
			} else {
				var $children = this.$element.children();
				this.createStep($children);
			}

			return this
		},


		createStep: function (content, step) {
			step = typeof (step) == 'number' ? step : 1;
			var $step = $("<div class='overlay-step step-" + step + "' />").append(content);
			this.$element.append($step)
		},


		setActive: function (index) {
			index = typeof (index) == 'number' ? index : 0;
			var nextStep = this.currentStep + index;

			$(".step-" + this.currentStep).hide().removeClass("active");
			$(".step-" + nextStep).fadeIn().addClass("active");

			this.currentStep = nextStep;

			this.createProgress()
				.hideContent()
				.removeContent()
				.positionContent()
				.scrollTop();

			return this
		},


		createProgress: function () {
			var _this = this;

			$(".overlay-actions").remove();

			if (this.settings.showProgress) {
				this.$element.append(
					$("<div class='overlay-actions text-center' />")
					.append("<button type='button' class='btn-back'><i class='fa fa-angle-left fa-2x'></i></button>")
					.append(function () {
						var text = _this.stepCount > 0 ? (_this.currentStep + " / " + _this.stepCount) : "";
						return $("<span class='overlay-progress text-center text-muted'>" + text + "</span>")
					})
					.append("<button type='submit' class='btn-next'><i class='fa fa-angle-right fa-2x'></i></button>")
				);

				this.bindProgressActions();
			}

			return this
		},


		bindProgressActions: function () {
			var _this = this;

			$(".btn-back").each(function () {
				$(this).on("click", function () {
					_this.moveBack();
				});
			});

			$(".btn-next").each(function () {
				$(this).on("click", function (e) {
					e.preventDefault();
					if (_this.isFunction(_this.settings.onValidate)) {
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


		moveBack: function () {
			var previousStep = this.currentStep - 1;

			if (previousStep > 0) {
				this.setActive(-1);
			} else {
				window.history.back();
			}

			return this
		},


		moveNext: function () {
			if (this.currentStep === this.stepCount) {
				if (this.isFunction(this.settings.onSubmit)) {
					this.settings.onSubmit();
				}
			} else {
				this.setActive(1)
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


		hideContent: function () {
			if (this.isValidJquery(this.settings.hide)) {
				$(this.settings.hide).hide();
			}

			return this
		},


		removeContent: function () {
			if (this.isValidJquery(this.settings.remove)) {
				$(this.settings.remove).remove();
			}

			return this
		},


		scrollTop: function () {
			$(".overlay-container").animate({
				scrollTop: 0
			}, "slow");

			return this
		},


		isFunction: function (func) {
			return (typeof (func) === "function")
		},


		isValidJquery: function (obj) {
			return (obj instanceof jQuery)
		}

	});


	$.fn[pluginName] = function (options) {
		return new Plugin(this, options)
	};


})(jQuery, window, document);
