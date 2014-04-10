/**
 * BACON
 * Hmmm ! Yummy Pork ? Nooo ! Background Automatic CalibratiON !
 * @author Martin DEQUATREMARE
 * @link https://github.com/MD4
 */
(function (global) {
	
	/**
	 * Constructor
	 * @param {string[]} backgrounds Backgrounds URLs list.
	 * @param {*} container Place where the bacon will be created.
	 * @param {number} delay (Optional) Transition delay (between two backgrounds).
	 * @param {function} completeCallback (Optional) Callback triggered when all the backgrounds loading is complete.
	 * @param {function} progressCallback (Optional) Callback triggered each times that a background loading is complete.
	 * @param {string} easingFunction (Optional) Transition easing function name.
	 * @returns {undefined}
	 */
	var Bacon = function (backgrounds, container, delay, completeCallback, progressCallback, easingFunction) {
		this.container = container || document.body;
		this.backgrounds = backgrounds.map(function (url) {
			return {
				url: url
			};
		});
		this.delay = delay || 5000;
		this.easingFunction = easingFunction || 'swing';
		this.completeCallback = completeCallback || function(){};
		this.progressCallback = progressCallback || function(){};
		
		this.currentBackgroundIndex = 0;
		this.create();
	};
	/**
	 * Creates the whole html stuff
	 * @returns {undefined}
	 */
	Bacon.prototype.create = function () {
		var wc = new Wc(this.backgrounds.length, Cuss.relegate(this, this.show), this.progressCallback);
		
		$(this.container)
				.css('margin', 0)
				.css('padding', 0)
				.css('overflow', 'hidden');
		
		this.$element = $('<div/>');
		this.$element
				.css('position', 'absolute')
				.css('z-index', -999999);
		this.$element
				.addClass('baconContainer');
		for (var i = 0; i < this.backgrounds.length; i++) {
			var background = this.backgrounds[i];
			background.$element = $('<img />');
			background.$element
					.css('position', 'absolute')
					.css('display', 'none');
			background.$element
					.attr('src', background.url);
			background.$element
					.one('load', wc.trigger());
			$(this.$element).append(background.$element);
		}

		$(this.container).append(this.$element);
	};
	/**
	 * Shows the bacon
	 * @returns {undefined}
	 */
	Bacon.prototype.show = function () {
		$(global).resize(Cuss.relegate(this, this.resize));
		this.resize();
		this.backgrounds[0].$element.fadeIn(1000, this.easingFunction, null);
		this.completeCallback();
	};
	/**
	 * Resizes and center the bacon
	 * @returns {undefined}
	 */
	Bacon.prototype.resize = function () {
		var wSize = {
			width: $(global).width(),
			height: $(global).height()
		};
		for (var i = 0; i < this.backgrounds.length; i++) {
			var background = this.backgrounds[i];
			var width = background.$element.width();
			var height = background.$element.height();
			var ratio = width / height;
			width = wSize.width;
			height = width / ratio;
			height = Math.max(wSize.height, height);
			width = height * ratio;
			background.$element
					.css('width', width)
					.css('height', height)
					.css('left', -(width - wSize.width) / 2)
					.css('top', -(height - wSize.height) / 2);
		}
	};
	/**
	 * Triggers the transition to the background
	 * @returns {undefined}
	 */
	Bacon.prototype.shift = function () {
		var $currentElement = this.backgrounds[this.currentBackgroundIndex].$element;
		var $nextElement = this.backgrounds[(this.currentBackgroundIndex + 1) % this.backgrounds.length].$element;
		$currentElement.css('z-index', 1);
		$nextElement
				.css('z-index', 0)
				.fadeIn(50);
		$currentElement.fadeOut(this.delay / 3);
		this.currentBackgroundIndex++;
		this.currentBackgroundIndex %= this.backgrounds.length;
		this.start();
	};
	/**
	 * Start the auto transition of backgrounds
	 * @returns {undefined}
	 */
	Bacon.prototype.start = function () {
		if (this.delay) {
			setTimeout(Cuss.relegate(this, this.shift), this.delay);
		}
	};

	global.Bacon = Bacon;
}(window));