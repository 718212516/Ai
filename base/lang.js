(function() {

	//����jquery��һЩ��©�ķ���
	var toString = Object.prototype.toString;
	$.isUndefined = function(o) {
		return o === undefined;
	}
	$.isString = function(o) {
		return toString.call(o) === '[object String]';
	}
	$.isBoolean = function(o) {
		return toString.call(o) === '[object Boolean]';
	}
	$.isNumber = function(o) {
		return toString.call(o) === '[object Number]' && isFinite(o);
	}
	$.isObject = function(o) {
		return typeof o === 'object';
	}

	function eventProxy(node, event, op) {
		if($.isUndefined(op)) {
			$(node).unbind(event);
		}
		else {
			//op�ļ�תΪarray�ӿ��ٶ�
			var match = $$.keys(op),
				length = match.length;
			$(node).bind(event, function(e) {
				var target = e.target,
					proxyResult = false;
				for(var i = 0; i < length; i++) {
					//���������жϣ���֧�ֶ����У�����������
					if(handler(match[i], function() { proxyResult = !!op[match[i]](); }, target, node)) {
						break;
					}
				}
				return proxyResult;
			});
		}
	}
	function handler(selector, cb, target, top) {
		//��id�������¼�����ֱ���ж�id����
		if(selector.charAt(0) == '#') {
			if(selector == target.id) {
				cb();
				return true;
			}
		}
		//���Ա�ǩ���������¼�����ֱ���ж�tagName����
		else if(/^[a-z]+$/i.test(selector)) {
			if(selector.toUpperCase() == target.nodeName) {
				cb();
				return true;
			}
		}
		//������ʽ���������¼�������ͷ��ΪtagName����ֱ���ж�className����
		else if(/^[a-z.]{2,}$/i.test(selector)) {
			var cn = selector.split('.'),
				fit = true;
			if(selector.charAt(0) != '.') {
				var tag = cn.shift();
				if(tag.toUpperCase() != target.nodeName) {
					return false;
				}
			}
			target = $(target);
			//���е�classNameȫ�����ϲſ�
			cn.forEach(function(item) {
				if(!target.hasClass(item)) {
					fit = false;
					return fit;
				}
			});
			if(fit) {
				cb();
				return true;
			}
		}
		//�����ӵ����ʹ��ѡ�����������㼶��ϵȫ��֧�֣�ʹ����Ҫ������������״��
		else {
			var container,
				res = false;
			if(selector.indexOf(' ') > -1 || selector.indexOf('>') > -1) {
				container = $(top);
			}
			else {
				container = $(target.parentNode);
			}
			container.find(selector).each(function(index, item) {
				if(item == target) {
					cb();
					res = true;
					return false;
				}
			});
			return res;
		}
		return false;
	}

	$.fn.extend({
		/**
		 * @public �¼�����
		 * @param {string/array} ��Ҫ������¼����ͣ��������Ƕ��
		 * @param {object} ��key/value��ʽ���ô����������callback
		 */
		'eventProxy': function(event, op) {
			var self = this;
			if($.isArray(event)) {
				event.forEach(function(item) {
					self.eventProxy(item, op);
				});
			}
			else if($.isString(event)) {
				self.each(function() {
					eventProxy(this, event, op);
				});
			}
		},
		
		/**
		 * @public ��ϼ�
		 * @param {array} ����������ϼ�code
		 * @param {func} callback
		 */
		'comboKey': function(keyCodes, cb) {
			var length = keyCodes.length,
				count = 0,
				keyHash = {};
			//ת��hash�ж������ٶ�
			keyCodes.forEach(function(item) {
				keyHash[item] = 1;
			});
			//��callbackΪ����������Ϊ�Ƴ�
			if(cb) {
				this.bind('keydown', keyDown);
				this.bind('keyUp', keyUp);
			}
			else {
				this.unbind('keydown', keyDown);
				this.unbind('keyUp', keyUp);
			}
			//handler
			function keyDown(e) {
				if(keyHash[e.keyCode]) {
					if(++count == length) {
						cb();
					}
				}
			}
			function keyUp(e) {
				if(keyHash[e.keyCode]) {
					--count;
				}
			}
		}
	});

	$.cookie = function(name, value, options) {
		if(!$.isUndefined(value)) { // name and value given, set cookie
			options = options || {};
			if (value === null) {
				value = '';
				options.expires = -1;
			}
			var expires = '';
			if (options.expires && ($.isNumber(options.expires) || options.expires.toUTCString)) {
				var date;
				if ($.isNumber(options.expires)) {
					date = new Date();
					date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
				} else {
					date = options.expires;
				}
				expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
			}
			// CAUTION: Needed to parenthesize options.path and options.domain
			// in the following expressions, otherwise they evaluate to undefined
			// in the packed version for some reason...
			var path = options.path ? '; path=' + (options.path) : '';
			var domain = options.domain ? '; domain=' + (options.domain) : '';
			var secure = options.secure ? '; secure' : '';
			document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
		}
		else { // only name given, get cookie
			var cookieValue = null;
			if (document.cookie && document.cookie != '') {
				var cookies = document.cookie.split(';');
				for (var i = 0; i < cookies.length; i++) {
					var cookie = $.trim(cookies[i]);
					// Does this cookie string begin with the name we want?
					if (cookie.substring(0, name.length + 1) == (name + '=')) {
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						break;
					}
				}
			}
			return cookieValue;
		}
	}

})();

var $$ = {
	/**
	 * @public Ϊparentָ���������ռ�
	 * @param {string} �����ռ䣬��com.x.y.z
	 * @param {object} ָ���ı���չ�����ռ丸��
	 * @return {object} ���ر���չ�������ռ����ʧ��Ϊfalse
	 */
	ns: function(namespace, parent){
		var i,
			p = parent || window,
			n = namespace.split('.').reverse();
		while(n.length && (i = n.pop())) {
			if($.isUndefined(p[i])) {
				p[i] = {};
			}
			else if(!$.isPlainObject(p[i])) {
				return false; //nsʧ��ʱ����false��ʹ��ʱ���if�ж��������м��
			}
			p = p[i];
		}
		return p;
	},

	/**
	 * @public �������еĶ�����չ�������ϣ�$.extend�ļ�д��װ
	 * @param {object} ����չ�Ķ���
	 * @param {string} ��Ҫ��չ������������ռ䣬����Ϊ����
	 */
	mix: function(object, ns) {
		var p = (ns ? this.ns(ns, this) : this);
		$.extend(p, object);
	},

	/**
	 * @public ȡ��һ�������е�����key
	 */
	keys: function(obj) {
		var keys = [];
		obj = obj || {};
		for (var prop in obj) {
			if(obj.hasOwnProperty(prop)) {
				keys.push(prop);
			}
		}
		return keys;
	},

	/**
	 * @public ȥ���������ظ���Ա
	 * @note ֧�����г�Ա���ͣ�����dom���������飬������null�ȣ��������ͱȽ�����
	 */
	unique: function(array) {
		var res = [], complex = [], record = {}, it, tmp, id = 0,
			type = {
				'number': function(n) { return '_num' + n; },
				'string': function(n) { return n; },
				'boolean': function(n) { return '_boolean' + n; },
				'object': function(n) { if(n !== null) complex.push(n); return n === null ? '_null' : false; },
				'undefined': function(n) { return '_undefined'; }
			};
		array.forEach(function(item) {
			it = tmp = item;
			tmp = type[typeof it](it);
			if(!record[tmp] && tmp) {
				res.push(it);
				record[tmp] = true;
			}
		});
		//���ڸ��϶���ʹ��indexOf�Ƚ�����
		if(complex.length) {
			var i = 0;
			while(i < complex.length) {
				it = complex[i];
				while((tmp = complex.lastIndexOf(it)) !== i) {
					complex.splice(tmp, 1);
				}
				i++;
			}
		}
		return res.concat(complex);
	}
};