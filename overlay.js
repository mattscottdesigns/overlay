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
		this.$element = element.addClass("overlay-element");
		this.defaults = $.extend({}, defaults, $.fn[pluginName].defaults);
		this.settings = $.extend({}, this.defaults, options);

		if (this.settings.enabled && this.$element.length > 0) {
			this.init();
		}
	}


	$.extend(Plugin.prototype, {

		init: function () {
			var _this = this;
			$(window).on("load", function (e) {
				_this.stepCount = _this.settings.steps.length;
				_this.currentStep = 1;

				_this.createOverlay()
					.createSteps()
					.setActive()
					.onInit();
			});
		},


		createOverlay: function () {
			$("head")
				.append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />')

			$("body")
				.addClass("overlay")
				.prepend("<div class='overlay-container'><div class='overlay-content' /></div>");

			$(".overlay-content")
				.append(this.$element);

			return this
		},


		createSteps: function () {
			var _this = this;

			if (this.stepCount > 0) {
				for (var x = 0; x < this.stepCount; x++) {
					var index = (x + 1);
					_this.renderStep(this.settings.steps[x].content, index);
				}
			} else {
				this.renderStep(this.$element.children());
			}

			return this
		},


		renderStep: function (content, step) {
			step = typeof (step) == 'number' ? step : 1;

			this.$element.append(function () {
				return $("<div class='overlay-step step-" + step + "' />")
					.append(content)
			});
		},


		setActive: function (index) {
			index = typeof (index) == 'number' ? index : 0;
			var nextStep = this.currentStep + index;

			$(".step-" + this.currentStep)
				.removeClass("active")
				.hide();

			$(".step-" + nextStep)
				.addClass("active")
				.fadeIn();

			this.currentStep = nextStep;

			this.createProgress()
				.handleContent()
				.scrollTop();

			return this
		},


		createProgress: function () {
			var _this = this;

			$(".overlay-actions").remove();

			if (this.settings.showProgress) {
				this.$element.append(
					$("<div class='overlay-actions' />")
					.append(function () {
						if (_this.currentStep > 1) {
							return "<button type='button' class='btn-back'>Previous</button>"
						}
					})
					.append("<button type='submit' class='btn-next'>Next</button>")
				);

				this.bindProgress();
			}

			return this
		},


		bindProgress: function () {
			var _this = this;

			$(".btn-back").each(function () {
				$(this).on("click", function () {
					_this.moveBack();
				});
			});

			$(".btn-next").each(function () {
				$(this).on("click", function (e) {
					e.preventDefault();
					if (typeof (_this.settings.onValidate) == "function") {
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
				this.setActive(-1)
					.onStepChange();
			}

			return this
		},


		moveNext: function () {
			if ((this.currentStep === this.stepCount) || this.stepCount === 0) {
				if (typeof (this.settings.onSubmit) == "function") {
					this.settings.onSubmit();
				}
			} else {
				this.setActive(1)
					.onStepChange();
			}

			return this
		},


		handleContent: function () {

			var _this = this;
			var handler = {

				addContent: function () {
					var header = $("<div class='overlay-header'></div>").append(_this.settings.header);
					var footer = $("<div class='overlay-footer'></div>").append(_this.settings.footer);

					$(".overlay-step.active")
						.prepend(header)
						.append(footer);

					return this
				},

				hideContent: function () {
					if (_this.settings.hide instanceof jQuery) {
						$(_this.settings.hide).hide();
					}

					return this
				},

				positionContent: function () {

					setPosition();

					$(window)
						.off("resize")
						.on("resize", function () {
							setPosition();
						});

					function setPosition() {
						if (_this.settings.offsetTop) {
							_this.$element.css({
								"marginTop": _this.settings.offsetTop()
							});
						}

						if (_this.settings.offsetRight) {
							_this.$element.css({
								"marginRight": _this.settings.offsetRight()
							});
						}

						if (_this.settings.offsetBottom) {
							_this.$element.css({
								"marginBottom": _this.settings.offsetBottom()
							});
						}

						if (_this.settings.offsetLeft) {
							_this.$element.css({
								"marginLeft": _this.settings.offsetLeft()
							});
						}
					}

					return this
				},

				removeContent: function () {
					if (_this.settings.remove instanceof jQuery) {
						$(_this.settings.remove).remove();
					}

					return this
				},
			}

			handler
				.hideContent()
				.removeContent()
				.addContent()
				.positionContent();

			return this
		},


		onInit: function () {
			if (typeof (this.settings.onInit) == 'function') {
				this.settings.onInit()
			}

			return this
		},


		onStepChange: function () {
			if (typeof (this.settings.onStepChange) == 'function') {
				this.settings.onStepChange()
			}

			return this
		},


		scrollTop: function () {
			$(".overlay-container").animate({
				scrollTop: 0
			}, "slow");

			return this
		},

	});


	$.fn[pluginName] = function (options) {
		return new Plugin(this, options)
	};


})(jQuery, window, document);
