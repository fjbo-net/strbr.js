/**
 * http://strbr.fjbo.net/
 * JavaScript Animation Frame Manager
 * @version v1.2.0
 * @author Francisco Javier Becerra-Ortiz (FJBO)
 * @copyright © 2017-Present FJBO.
**/

(function(){
	/**
	 * Animation Controller. Contains the API methods for strbr.
	 *
	 * @constructor
	 */
	let strbr = function strbr() {
		this.resize = {
			active: true,
			prevX: 0,
			prevY: 0,
			registered: [],
			container: {}
		}
		this.scroll = {
			active: true,
			prevX: 0,
			prevY: 0,
			registered: [],
			container: {}
		}
		this.default = {
			active: true,
			prevX: 0,
			prevY: 0,
			registered: [],
			container: {}
		}

		this.paused = false;

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
		strbr.prototype.add = function(i, f, e) {
			if(typeof(e) == 'undefined') {
				var e = 'default';
			}
			switch(e.toLowerCase()) {
				case 'resize':
				if(!this.resize.container.hasOwnProperty(i)) this.resize.container[i] = f;
				break;
				case 'scroll':
				if(!this.scroll.container.hasOwnProperty(i)) this.scroll.container[i] = f;
				break;
				default:
				if(!this.default.container.hasOwnProperty(i)) this.default.container[i] = f;
				break;
			}
			f();
			return i;
		}

		/**
		 * Removes a function from the execution queue (loop).
		 */
		strbr.prototype.remove = function (i, e) {
			if(typeof(e) == 'undefined') {
				var e = 'default';
			}
			switch(e.toLowerCase()) {
				case 'resize':
				if(this.resize.container.hasOwnProperty(i)) delete this.resize.container[i];
				break;
				case 'scroll':
				if(this.scroll.container.hasOwnProperty(i)) delete this.scroll.container[i];
				break;
				default:
				if(this.default.container.hasOwnProperty(i)) delete this.default.container[i];
				break;
			}
		}

		/**
		 * Enables strbr pause state.
		 */
		strbr.prototype.pause = function () {
			if(!this.paused) this.paused = true;
		}

		/*
		 * Disables strbr pause state.
		 */
		 strbr.prototype.play = function() {
			 if(this.paused) this.paused = false;
		 }

		/*
		 * Toggles strbr pause state
		 */
		strbr.prototype.toggle = function() {
			this.paused = !this.paused;
		}

		/**
		 * This method is the execution queue that contains all the event queues.
		 */
		strbr.prototype.run = function() {
			if(this.paused != true) {
				if(this.default.active == true) {
					for(var key in this.default.container) {
						if(this.default.container.hasOwnProperty(key)) {
							this.default.container[key]();
						}
					}
				}
				if(this.scroll.active == true) {
					if(window.scrollY != this.scroll.prevY || window.scrollX != this.scroll.prevX) {
						this.scroll.prevX = window.scrollX;
						this.scroll.prevY = window.scrllY;

						for(var key in this.scroll.container) {
							if(this.scroll.container.hasOwnProperty(key)) {
								this.scroll.container[key]();
							}
						}
					}
				}
				if(this.resize.active == true) {
					if(window.scrollY != this.resize.prevY || window.scrollX != this.resize.prevX) {
						this.resize.prevX = window.innerWidth;
						this.resize.prevY = window.innerHeight;

						for(var key in this.resize.container) {
							if(this.resize.container.hasOwnProperty(key)) {
								this.resize.container[key]();
							}
						}
					}
				}
			}
			this.frame = requestAnimationFrame(this.run.bind(this));
		}

		/**
		 * This function stops the execution queue. To reactivate strbr, run strbr.run();
		 */
		this.stop = function() {
			cancelAnimationFrame(this.frame);
			return;
		}
		this.frame = requestAnimationFrame(this.run.bind(this));

		window.addEventListener('blur', this.pause.bind(this));
		window.addEventListener('focus', this.play.bind(this));
	};

	/*
	 * Auto-initialize strbr. Creates an instance at the window object.
	 */
	window.strbr = new strbr();
})();
