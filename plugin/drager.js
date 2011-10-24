define(['Event'], function(Event) {
	var doc = $(document);
	function setCoord(node, left, top) {
		node.css({
			left: left,
			top: top
		});
	}
	function Klass(options) {
		Event.call(this);
		this.options = options;
		this.left = this.top = 0;
		this.containers = [];
		this.splitX = [];
		this.splitY = [];
		this.lastContainer = null;
		this.tempContainer = null;
		this.lastIndex = 0;
		this.tempIndex = 0;
		this._init();
		this._event = $('<p>');
	}
	$$.inheritPrototype(Klass, Event);
	Klass.prototype._reset = function() {
		var self = this,
			op = self.options,
			container = $(op.container);
		self.containers = [];
		self.splitX = [];
		self.splitY = [];
		container.each(function(i, o) {
			o = $(o);
			//���Ա����ص�����
			if(o.is(':hidden'))
				return;
			var drags = o.children(op.drag),
				split = [];
			drags.each(function(i2, o2) {
				o2 = $(o2);
				if(i2 > 0)
					split.push(o2.offset().top);
				if(i2 == drags.length - 1)
					split.push(o2.offset().top + o2.outerHeight());
			});
			self.containers.push(o);
			self.splitX.push(o.offset().left);
			self.splitY.push(split);
		});
	}
	Klass.prototype._init = function() {
		var self = this,
			op = self.options,
			container = $(op.container);
		container.delegate(op.handler, 'mousedown', function(e) {
			self._reset();
			var node = $(this).parent(op.drag),
				position = node.css('position'),
				left = node.css('left'),
				right = node.css('right'),
				con = node.parent();
			//ȡ�������µ�����
			self.left = node.offset().left - node.parent().offset().left;
			self.top = node.offset().top - node.parent().offset().top;
			//����lastContainer��tempContainerΪ�˽ڵ�ĸ�����
			self.lastContainer = self.tempContainer = con[0];
			//����lastIndexΪ�˽ڵ��ڸ������еĴ���
			con.children(op.drag).each(function(i, o) {
				if(node[0] == o) {
					self.lastIndex = self.tempIndex = i;
				}
			});
			//���þ��Զ�λ������
			node.css('position', 'absolute');
			setCoord(node, self.left, self.top);

			doc.mousemove(move);
			doc.mouseup(function(e) {
				//��ԭ�ڵ������css����
				node.css('position', position);
				setCoord(node, left, right);
				//���switch������Ϊtrue��˵������ʵʱ�ı��϶����λ�ã�������drag:end�ٸı䣬������
				if(!op.switch) {
					self._switch(node, $(self.tempContainer), self.tempIndex, true);
				}
				//����¼�����
				doc.unbind('mousemove', move);
				doc.unbind('mouseup', arguments.callee);
				self._event.trigger('drag:end', [node]);
			});
			function move(evt) {
				self._onMoveHandler(node, e, evt);
				return false;
			}
			self._event.trigger('drag:start', [node]);
			return false;
		});
	}
	Klass.prototype._onMoveHandler = function(node, se, ne) {
		var left = this.left + ne.pageX - se.pageX,
			top = this.top + ne.pageY - se.pageY;
		setCoord(node, left, top);
		this._event.trigger('drag:move', [node]);
		//����Ƿ�����ģ���ƶ����ȴ�������Ѱ������
		for(var i = 0, len = this.splitX.length; i < len; i++) {
			if(this.splitX[i] >= ne.pageX) {
				i--;
				break;
			}
		}
		//û����������ֵ��������x����Ϊ���һ�������������ڵĻ�����Ϊ��һ��
		i = Math.max(0, i);
		i = Math.min(i, len - 1);
		var j = 0,
			split = this.splitY[i];
		len = split.length;
		//��������Ѱ�ҳ������y�ķָ��ߵ�����
		for(; j < len; j++) {
			if(split[j] >= ne.pageY) {
				break;
			}
		}
		var sameContainer = this.lastContainer == this.containers[i][0];
		//����������
		j = Math.max(0, j);
		j = Math.min(j, sameContainer ? len - 1 : len);
		if(sameContainer) {
			//�ı�λ�ú�Żᴥ��
			if(this.tempContainer != this.containers[i][0] || this.lastIndex != j) {
				cb.call(this);
			}
		}
		else {
			if((this.tempContainer == this.containers[i][0] && this.lastIndex != j) || this.tempContainer != this.containers[i][0]) {
				cb.call(this);
			}
		}
		function cb() {
			this.tempContainer = this.containers[i][0];
			this.lastIndex = this.tempIndex = j;
			if(this.options.switch) {
				this._switch(node, this.containers[i], j);
			};
			this._event.trigger('drag:switch', [node, this.containers[i], j]);
		}
	}
	Klass.prototype._switch = function(node, container, i, last) {
		//switchΪtrueʱ��drag:endʱ��ִ�еĸı�λ�ã��Ż�У���Ƿ�ı���λ�ã�δ�ı�Ļ������в������
		if(last && container.children(this.options.drag).eq(i)[0] == node[0]) 
			return;
		//Ϊ0ʱ��ͷ������
		if(i == 0)
			container.prepend(node);
		//��������������
		else {
			var siblings = [];
			container.children(this.options.drag).each(function(index, o) {
				if(o != node[0]) {
					siblings.push(o);
				}
			});
			var before = $(siblings[i - 1]);
			before.after(node);
		}
	}/*
	Klass.prototype.bind = function() {
		this._event.bind.apply(this._event, Array.prototype.slice.call(arguments, 0));
	}
	Klass.prototype.unbind = function() {
		this._event.unbind.apply(this._event, Array.prototype.slice.call(arguments, 0));
	}*/
	return Klass;
});