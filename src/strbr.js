(function(){
	if(!window.FJBO) window.FJBO = {};

	/**
	 * Animation Controller. Contains the API methods for strbr.
	 *
	 * @constructor
	 */
	let StrbrJs = function() {
		if(!StrbrJs.prototype.instance) StrbrJs.prototype.instance = this;
		else return StrbrJs.prototype.instance;

		let _this = this;

		this.resize = {
			active: true,
			prevWidth: 0,
			prevHeight: 0,
			registered: [],
			container: {}
		};

		this.scroll = {
			active: true,
			prevX: 0,
			prevY: 0,
			registered: [],
			container: {}
		};

		this.default = {
			active: true,
			prevX: 0,
			prevY: 0,
			registered: [],
			container: {}
		};

		let
		framesProcessed = 0,
		framesPerSecond = 0,
		lastTimeChecked = Date.now(),

		paused = false,
		pausedBlur = false,
		pauseOnBlur = true,

		shouldPlay = () => !paused && !pausedBlur,
		calculateFPS = () => {
			let
			currentTime = Date.now(),
			difference = currentTime - lastTimeChecked;
			if(difference < 1000) return;

			framesPerSecond = Math.floor(framesProcessed / (difference / 1000));
			framesProcessed = 0;
			lastTimeChecked = Date.now();
		};

		/**
		 * Adds a function from the execution queue (loop).
		 *
		 * @param {string} i - (required) The function identifier. This is the id
		 * used for registering and removing the function from the controller's
		 * queue.
		 * @param {function} f - (required) The function (or callback), to be
		 * called during the execution queue (loop).
		 * @param {string} e - (optional) The event queue identifier. This string
		 * tells the controller which queue the function is intended for.
		 * Supported Values:
		 *  'default':
		 *  Default value if no event is provided. Executes on every frame.
		 *  'scroll':
		 *  Defines a function to be added to scroll loop. Executes only when scroll
		 *  X or scroll Y values differ from previous value.
		 *  'resize':
		 *  Defines a function to be added to resize loop. Executes only when window
		 *  innerHeight or innerWidth values differ from previous values.
		 */
		StrbrJs.prototype.add = function(i, f, e) {
			let eventName = typeof e === 'string' ? e : 'default';

			switch(eventName.toLowerCase()) {
				case 'resize':
					if(!_this.resize.container.hasOwnProperty(i)) _this.resize.container[i] = f;
					break;
				case 'scroll':
					if(!_this.scroll.container.hasOwnProperty(i)) _this.scroll.container[i] = f;
					break;
				default:
					if(!_this.default.container.hasOwnProperty(i)) _this.default.container[i] = f;
					break;
			}
			f();
			return i;
		};

		/**
		 * Removes a function from the execution queue (loop).
		 */
		StrbrJs.prototype.remove = function (i, e) {
			if(typeof(e) == 'undefined') {
				var e = 'default';
			}
			switch(e.toLowerCase()) {
				case 'resize':
				if(_this.resize.container.hasOwnProperty(i)) delete _this.resize.container[i];
				break;
				case 'scroll':
				if(_this.scroll.container.hasOwnProperty(i)) delete _this.scroll.container[i];
				break;
				default:
				if(_this.default.container.hasOwnProperty(i)) delete _this.default.container[i];
				break;
			}
		};

		/**
		 * Enables strbr pause state.
		 */
		StrbrJs.prototype.pause = () => {
			if(!paused) paused = true;
		};

		/*
		 * Disables strbr pause state.
		 */
		 StrbrJs.prototype.play = () => {
			 if(paused) paused = false;
		 };

		/*
		 * Toggles strbr pause state
		 */
		StrbrJs.prototype.toggle = () => paused = !paused;

		/**
		 * This method is the execution queue that contains all the event queues.
		 */
		StrbrJs.prototype.run = () => {
			let executeQueue = queueName => {
				if(!_this[queueName]) return;

				for(let key in _this[queueName].container) {
					if(_this[queueName].container.hasOwnProperty(key))
						_this[queueName].container[key]();
				}
			};

			if(shouldPlay()) {
				if(_this.default.active == true)
					executeQueue('default');

				if(_this.scroll.active == true) {
					let
					scrollX = window.scrollX || window.pageXOffset,
					scrollY = window.scrollY || window.pageYOffset;

					if(scrollX != _this.scroll.prevX || scrollY != _this.scroll.prevY) {
						_this.scroll.prevX = scrollX;
						_this.scroll.prevY = scrollY;

						executeQueue('scroll');
					}
				}

				if(_this.resize.active == true) {
					let
					width = window.innerWidth,
					height = window.innerHeight;

					if(width != _this.resize.prevWidth || height != _this.resize.prevHeight) {
						_this.resize.prevWidth = width;
						_this.resize.prevHeight = height;

						executeQueue('resize');
					}
				}

				framesProcessed++;
				calculateFPS();
			}

			_this.frame = requestAnimationFrame(_this.run.bind(_this));
		};

		/**
		 * This function stops the execution queue. To reactivate strbr, run strbr.run();
		 */
		this.stop = () => cancelAnimationFrame(_this.frame);

		/**
		 * This function will set whether strbr should pause while the window isn't focused.
		 *
		 * @param {bool} v - (required) true for pausing when loosing focus and false
		 * for never pausing.
		 */
		this.pauseOnBlur = v => pauseOnBlur = v;

		/**
		 * Returns the calculated FPS rate.
		 */
		this.getFPS = () => shouldPlay() ? framesPerSecond : 0;


		this.frame = requestAnimationFrame(_this.run.bind(_this));

		window.addEventListener('blur', e => pausedBlur = pauseOnBlur ? true : false );
		window.addEventListener('focus', e => pausedBlur = false );
	},

	init = () => {
		window.FJBO.StrbrJs = new StrbrJs();

		FJBO.EventJs.dispatch('FJBO.StrbrJs.ready');
	};


	if(FJBO.EventJs) init();
	else window.addEventListener( 'FJBO.EventJs.ready', init );
})();
