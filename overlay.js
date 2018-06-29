;
(function ($, window, document, undefined) {

	/**
	 * TO DO
	 * - "namespace" option
	 * - convert methods to be public
	 * - investigate jquery "add" method for joining elements
	 * - add "logging" option
	 */

	"use strict";

	var pluginName = "overlay",
		defaults = {
			"enabled": true,
			"showProgress": true
		};


	function Plugin(element, options) {
		this._defaults = $.extend({}, defaults, $.fn[pluginName].defaults);
		this.settings = $.extend({}, this._defaults, options);
		this.element = $(element).addClass("overlay-element");

		if (this.settings.enabled) {
			this.init();
		}

	}


	$.extend(Plugin.prototype, {

		init: function () {
			var _this = this;

			$("head").append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />')

			_this.createOverlay()
				.createProps()
				.createStepContainers()
				.createStepContent()
				.setActive();

			return _this
		},

		createOverlay: function () {
			var _this = this;

			$("body")
				.addClass("overlay")
				.prepend("<div class='overlay-container'><div class='overlay-content' /></div>");

			$(".overlay-content").append(_this.element);

			return _this
		},


		createProps: function () {
			var _this = this;

			_this.container = $(".overlay-container");
			_this.content = $(".overlay-content");
			_this.children = _this.element.children();
			_this.currentStep = 1;
			_this.maxStep = _this.settings.steps ? _this.settings.steps.length : 1;
			_this.stepContainers = [];

			return _this
		},


		createStepContainers: function () {
			var _this = this;

			for (var x = 0; x < _this.maxStep; x++) {
				_this.stepContainers.push($("<div class='overlay-step step-" + (x + 1) + "' />"));
			}

			_this.element.append(_this.stepContainers);

			return _this
		},


		createStepContent: function () {
			var _this = this;

			for (var x = 0; x < _this.maxStep; x++) {

				var step = _this.stepContainers[x];

				if (_this.settings.steps) {
					var title = _this.settings.steps[x].title || "";
					var content = _this.settings.steps[x].content || "";

					if (title) {
						step.append(title)
					}
					step.append(content)
				} else {
					step.append(_this.children)
				}
			}

			return _this
		},


		setActive: function (intStep) {
			var _this = this;

			var activeStep = _this.currentStep + (intStep || 0);

			$(".step-" + _this.currentStep).hide().removeClass("active");
			$(".step-" + activeStep).fadeIn().addClass("active");

			_this.currentStep = activeStep;

			if (_this.settings.steps) {
				_this.createProgress();
			}

			_this.hideContent()
				.removeContent()
				.positionContent()
				.scrollTop();

			return _this
		},



		createProgress: function () {
			var _this = this;

			$(".overlay-actions").remove();

			if (_this.settings.showProgress) {
				var text = _this.maxStep > 1 ? (_this.currentStep + " / " + _this.maxStep) : "";

				_this.element.append(
					$("<div class='overlay-actions text-center' />")
					.append("<button type='button' class='btn-back'><i class='fa fa-angle-left fa-2x'></i></button>")
					.append("<span class='overlay-progress text-center text-muted'>" + text + "</span>")
					.append("<button type='submit' class='btn-next'><i class='fa fa-angle-right fa-2x'></i></button>")
				);

				_this.bindStepActions();
			}

			return _this
		},


		moveBack: function () {
			var _this = this;
			var previousStep = _this.currentStep - 1;

			if (previousStep > 0) {
				_this.setActive(-1);
			} else {
				window.history.back();
			}

			return _this
		},


		moveNext: function () {
			var _this = this;

			if (_this.currentStep === _this.maxStep) {
				if (_this.settings.onSubmit && typeof(_this.settings.onSubmit) === "function") {
					_this.settings.onSubmit();
				}
			} else {
				_this.setActive(1)
			}

			return _this
		},


		positionContent: function () {
			var _this = this;

			if (_this.settings.offsetTop) {
				_this.element.css({
					"marginTop": _this.settings.offsetTop()
				})

				$(window).resize(function () {
					_this.element.css({
						"marginTop": _this.settings.offsetTop()
					})
				})
			}

			if (_this.settings.offsetBottom) {
				_this.element.css({
					"marginBottom": _this.settings.offsetBottom()
				})

				$(window).resize(function () {
					_this.element.css({
						"marginBottom": _this.settings.offsetBottom()
					})
				})
			}

			return _this
		},


		bindStepActions() {
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
						} else {
							_this.scrollTop();
						}
					} else {
						_this.moveNext();
					}
				})
			});

			return _this
		},


		hideContent: function () {
			var _this = this;

			if (_this.settings.hide) {
				$(_this.settings.hide).hide();
			}

			return _this
		},


		removeContent: function () {
			var _this = this;

			if (_this.settings.remove) {
				switch (typeof (_this.settings.remove)) {
					case "string":
						$(_this.settings.remove).remove();
						break;
					case "object":
						_this.settings.remove.remove();
						break;
				}
			}

			return _this
		},

		scrollTop: function () {
			var _this = this;

			_this.container.animate({
				scrollTop: 0
			}, "slow");

			return _this
		}

	});


	$.fn[pluginName] = function (options) {
		return new Plugin(this, options)
	};

})(jQuery, window, document);
