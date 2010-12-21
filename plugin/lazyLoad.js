(function() {
	
	var win = $(window),
		height = win.height();

	$$.mix({
		/**
		 * @public ���������϶�����Ӧ�ڵ�����ʱ�Ž��м���
		 * @param {string/node} �ӳټ��صĽڵ��id
		 * @param {function} cb���صĻص�����
		 * @param {int} �ٽ�ֵ�����ٽ�����ж�Զʱ��ǰִ�лص�����ѡĬ��Ϊ0
		 */
		scrollLoad: function(node, cb, threshold) {
			if($.isString(node)) {
				node = $(node.charAt(0) == '#' ? node : '#' + node);
			}
			else {
				node = $(node);
			}
			if(!node[0]) {
				return;
			}
			threshold = threshold || 0;
			win.bind('scroll', onScroll);
			win.bind('resize', onResize);
			onScroll();
			function onScroll() {
				if(node.offset().top <= (win.scrollTop() + height + threshold)) {
					cb();
					win.unbind('scroll', onScroll);
					win.unbind('resize', onResize);
				}
			}
			function onResize() {
				height = win.height();
				onScroll();
			}
		},

		/**
		 * @public ���������϶������ʱ�Ž��е�ͼƬ�ӳټ���
		 * @param {jq} ��Ҫ�ӳټ��ص�ͼƬ��jq����
		 * @param {string} ͼƬ����ʵsrc·��д�ڱ����ʲô��������
		 * @param {int} �ٽ�ֵ�����ٽ�����ж�Զʱ��ǰִ�лص�����ѡĬ��Ϊ0
		 * @param {dom} �����ӳ�ͼƬ������,jq����Ĭ��Ϊdocument.body
		 */
		imgLoad: function(img, attr, threshold, container) {
			threshold = threshold || 0;
			container = container || $(document.body);
			//ȡ�����з���class���������img
			var imgLib = {},
				imgList = [],
				key,
				top;
			//�������ǣ���������ͬscrollTopֵ��ͼƬ����һ����Ϊvalue��keyΪscrollTopֵ���ٷ���lib
			//�ٽ����г��ֵ�scrollTopֵ����һ��list���Կռ任ʱ��
			img.each(function(index, item) {
				item = $(item);
				key = item.attr(attr);
				if(key) {
					top = Math.floor(item.offset().top);
					if(imgLib[top]) {
						imgLib[top].push(item);
					}
					else {
						imgLib[top] = [item];
						imgList.push(top);
					}
				}
			});
			//��list��С��������
			imgList.sort(function(a, b) {
				return a - b;
			});
			win.bind('scroll', onScroll);
			win.bind('resize', onResize);
			onScroll();
			function onScroll() {
				if(imgList.length) {
					top = win.scrollTop() + height + threshold;
					for(var i = 0, len = imgList.length; i < len; i++) {
						if(imgList[i] <= top) {
							imgLib[imgList[i]].forEach(function(item) {
								item = $(item);
								item.attr('src', item.attr(attr));
							});
							//����������lib
							delete imgLib[imgList[i]];
						}
						else {
							break;
						}
					}
					//��ɺ������Ӧ��¼��list
					imgList.splice(0, i);
				}
				else {
					win.unbind('scroll', onScroll);
					win.unbind('resize', onResize);
				}
			}
			function onResize() {
				height = win.height();
				onScroll();
			}
		}
	}, 'lazy');

})();