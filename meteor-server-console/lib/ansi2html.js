//Converts ANSI color sequences to HTML.
//
//The ansi_to_html module is based on code from
//https://github.com/rtomayko/bcat/blob/master/lib/bcat/ansi.rb

AnsiToHtml = (function() {

	var defaults, _results;

	var STYLES = {
		'ef0': 'color:#000',
		'ef1': 'color:#A00',
		'ef2': 'color:#0A0',
		'ef3': 'color:#A50',
		'ef4': 'color:#00A',
		'ef5': 'color:#A0A',
		'ef6': 'color:#0AA',
		'ef7': 'color:#AAA',
		'ef8': 'color:#555',
		'ef9': 'color:#F55',
		'ef10': 'color:#5F5',
		'ef11': 'color:#FF5',
		'ef12': 'color:#55F',
		'ef13': 'color:#F5F',
		'ef14': 'color:#5FF',
		'ef15': 'color:#FFF',
		'eb0': 'background-color:#000',
		'eb1': 'background-color:#A00',
		'eb2': 'background-color:#0A0',
		'eb3': 'background-color:#A50',
		'eb4': 'background-color:#00A',
		'eb5': 'background-color:#A0A',
		'eb6': 'background-color:#0AA',
		'eb7': 'background-color:#AAA',
		'eb8': 'background-color:#555',
		'eb9': 'background-color:#F55',
		'eb10': 'background-color:#5F5',
		'eb11': 'background-color:#FF5',
		'eb12': 'background-color:#55F',
		'eb13': 'background-color:#F5F',
		'eb14': 'background-color:#5FF',
		'eb15': 'background-color:#FFF'
	};

	defaults = {
		fg: '#FFF',
		bg: '#000'
	};

	function Filter(options) {
		if (options === null) {
			options = {};
		}
		this.opts = _.extend({}, defaults, options);
		this.input = [];
		this.stack = [];
	}

	Filter.prototype.toHtml = function(input) {
		var buf;
		this.input = typeof input === 'string' ? [input] : input;
		buf = [];
		this.forEach(function(chunk) {
			return buf.push(chunk);
		});
		this.input = [];
		return buf.join('');
	};

	Filter.prototype.forEach = function(callback) {
		var buf, handleDisplay,
			_this = this;
		buf = '';
		handleDisplay = function(code) {
			code = parseInt(code, 10);
			if (code === -1) {
				callback('<br/>');
			}
			if (code === 0) {
				if (_this.stack.length) {
					callback(_this.resetStyles());
				}
			}
			if (code === 1) {
				callback(_this.pushTag('b'));
			}
			if (code === 2) {

			}
			if ((2 < code && code < 5)) {
				callback(_this.pushTag('u'));
			}
			if ((4 < code && code < 7)) {
				callback(_this.pushTag('blink'));
			}
			if (code === 7) {

			}
			if (code === 8) {
				callback(_this.pushStyle('display:none'));
			}
			if (code === 9) {
				callback(_this.pushTag('strike'));
			}
			if (code === 24) {
				callback(_this.closeTag('u'));
			}
			if ((29 < code && code < 38)) {
				callback(_this.pushStyle("ef" + (code - 30)));
			}
			if (code === 39) {
				callback(_this.pushStyle("color:" + _this.opts.fg));
			}
			if ((39 < code && code < 48)) {
				callback(_this.pushStyle("eb" + (code - 40)));
			}
			if (code === 49) {
				callback(_this.pushStyle("background-color:" + _this.opts.bg));
			}
			if ((89 < code && code < 98)) {
				callback(_this.pushStyle("ef" + (8 + (code - 90))));
			}
			if ((99 < code && code < 108)) {
				return callback(_this.pushStyle("eb" + (8 + (code - 100))));
			}
		};
		this.input.forEach(function(chunk) {
			buf += chunk;
			return _this.tokenize(buf, function(tok, data) {
				switch (tok) {
					case 'text':
						return callback(data);
					case 'display':
						return handleDisplay(data);
					case 'xterm256':
						return callback(_this.pushStyle("ef" + data));
				}
			});
		});
		if (this.stack.length) {
			return callback(this.resetStyles());
		}
	};

	Filter.prototype.pushTag = function(tag, style) {
		if (!style) {
			style = '';
		}
		if (style.length && style.indexOf(':') === -1) {
			style = STYLES[style];
		}
		this.stack.push(tag);
		return ["<" + tag, (style ? " style=\"" + style + "\"" : void 0), ">"].join('');
	};

	Filter.prototype.pushStyle = function(style) {
		return this.pushTag("span", style);
	};

	Filter.prototype.closeTag = function(style) {
		var last;
		if (this.stack.slice(-1)[0] === style) {
			last = this.stack.pop();
		}
		if (last !== null) {
			return "</" + style + ">";
		}
	};

	Filter.prototype.resetStyles = function() {
		var _ref = [this.stack, []];
		var stack = _ref[0];
		this.stack = _ref[1];

		return stack.reverse().map(function(tag) {
			return "</" + tag + ">";
		}).join('');
	};

	Filter.prototype.tokenize = function(text, callback) {
		var ansiHandler, ansiMatch, ansiMess, handler, i, length, newline, process, realText, remove, removeXterm256, tokens, _j, _len, _results1,
			_this = this;
		ansiMatch = false;
		ansiHandler = 3;
		remove = function(m) {
			return '';
		};
		removeXterm256 = function(m, g1) {
			callback('xterm256', g1);
			return '';
		};
		newline = function(m) {
			if (_this.opts.newline) {
				callback('display', -1);
			} else {
				callback('text', m);
			}
			return '';
		};
		ansiMess = function(m, g1) {
			var code, _j, _len;
			ansiMatch = true;
			if (g1.trim().length === 0) {
				g1 = '0';
			}
			g1 = g1.trimRight(';').split(';');
			for (_j = 0, _len = g1.length; _j < _len; _j++) {
				code = g1[_j];
				callback('display', code);
			}
			return '';
		};
		realText = function(m) {
			callback('text', m);
			return '';
		};
		tokens = [{
			pattern: /^\x08+/,
			sub: remove
		}, {
			pattern: /^\x1b\[38;5;(\d+)m/,
			sub: removeXterm256
		}, {
			pattern: /^\n+/,
			sub: newline
		}, {
			pattern: /^\x1b\[((?:\d{1,3};?)+|)m/,
			sub: ansiMess
		}, {
			pattern: /^\x1b\[?[\d;]{0,3}/,
			sub: remove
		}, {
			pattern: /^([^\x1b\x08\n]+)/,
			sub: realText
		}];
		process = function(handler, i) {
			var matches;
			if (i > ansiHandler && ansiMatch) {
				return;
			} else {
				ansiMatch = false;
			}
			matches = text.match(handler.pattern);
			text = text.replace(handler.pattern, handler.sub);
		};
		_results1 = [];
		while ((length = text.length) > 0) {
			for (i = _j = 0, _len = tokens.length; _j < _len; i = ++_j) {
				handler = tokens[i];
				process(handler, i);
			}
			if (text.length === length) {
				break;
			} else {
				_results1.push(void 0);
			}
		}
		return _results1;
	};

	return Filter;

})();