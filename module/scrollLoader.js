define(['Class'], function(Class) {
	var win = $(window),
		height = win.height(),
		queue = [],
		m = {
			node: function(n, size) { //����ڵ����topֵ
				n = $(n);
				return this.y(n.offset().top, size ? n.outerHeight(true) : undefined);
			},
			y: function(py, ps) { //ֱ�Ӵ���topֵ����2���������size��������ʱ������㣬ֻҪ�ڹ�����֮�ϵĶ�����
				this._y = py;
				this._s = ps || 0;
				return this;
			},
			threshold: function(th) { //����ڵ����topֵ
				this._th = th;
				return this;
			},
			size: function(s) { //����sizeʱ������������������ڿ�������֮�ⶼ������
				this._s = s;
				return this;
			},
			delay: function(d) { //��sizeʱ��Ч���ӳټ��ؿ��������ڣ���ֹ������˲����ק���
				this._d = d;
				return this;
			},
			time: function(t) { //����ʱ���������ض�ִ��
				var self = this;
				self._t = t;
				setTimeout(function() {
					self.start();
				}, t);
				return self;
			},
			load: function() { //���ػص�
				this._cb = this._cb.concat(Array.prototype.slice.call(arguments, 0));
				this._no && queue.push(this);
				this._no = false;
				this._f && this.fire();
				this._f = false;
				return this;
			},
			start: function() { //��ʼ���ز���ռ�����
				this._enable && this._cb.forEach(function(cb) {
					cb();
				});
				return this.cancel();
			},
			cancel: function() { //����ȡ���˴��ӳټ���
				this.disable();
				for(var i = 0, len = queue.length; i < len; i++) {
					if(queue[i] == this) {
						queue.splice(i, 1);
						break;
					}
				}
			},
			enable: function() { //���ü���״̬Ϊ����
				this._enable = true;
				return this;
			},
			disable: function() { //���ü���״̬Ϊ������
				this._enable = false;
				return this;
			},
			fire: function(top, he) { //�ֶ����Դ����жϼ�������
				top = top || win.scrollTop();
				he = he || height;
				var self = this;
				if(self._s) {
					clearTimeout(self._timeout);
					self._timeout = setTimeout(function() {
						if(self._enable
							&& self._y <= (top + he + self._th)
							&& (self._y + self._s) >= (top - self._th)
						)
							cb();
					}, self._d);
				}
				else {
					if(this._enable
						&& this._y <= (top + he + this._th)
					)
						cb();
				}
				function cb() {
					self._cb.forEach(function(cb) {
						cb();
					});
					self.cancel();
				}
				return this;
			}
		},
		Klass = Class(function() {
			this._y = 0; //y����ֵ
			this._th = 0; //ƫ����
			this._d = 0; //�ӳ�
			this._s = 0; //�ߴ磬����0��ʱ�������ߴ磬����������������ֱ�Ӽ��أ������ж��Ƿ�����ʾ��Χ��
			this._cb = []; //�ص�
			this._no = true; //�Ƿ񱻼�������
			this._enable = true; //�Ƿ�����
			this._timeout = null; //�ӳ�������
			this._f = true; //�״ε���״̬����Ϊf5��һ��ʼ���������п������·������Գ��ڲ�onscrollҲҪ����
		}).methods(m),
		instance = {};

	function onScroll() {
		var top = win.scrollTop();
		queue.forEach(function(o) {
			o.fire(top, height);
		});
	}
	win.bind('resize', function() {
		height = win.height();
		onScroll();
	});
	win.bind('scroll', onScroll);

	Object.keys(m).forEach(function(key) {
		instance[key] = function() {
			var obj = new Klass;
			return obj[key].apply(obj, Array.prototype.slice.call(arguments, 0));
		};
	});
	return instance;
});