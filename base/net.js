(function() {

	var head = document.getElementsByTagName('head')[0];
	
	$$.mix({
		/**
		 * @public �첽����js�ļ�����
		 * @param {string} js��url
		 * @param {object} ѡ���charset��callback
		 */
		getScript: function(url, op) {
			var s = document.createElement('script'),
				done = false;
			s.type = 'text/javascript';
			s.async = true; //for firefox3.6
			if($.isFunction(op)) {
				op = { callback: op };
			}
			op = op || {};
			if(op.charset) {
				s.charset = op.charset;
			}
			if(op.async) {
				s.async = op.async;
			}
			if(op.type) {
				s.type = op.type;
			}
			s.src = url;
			s.onload = s.onreadystatechange = function(){
				if (!done && (!this.readyState || ['loaded', 'complete'].indexOf(this.readyState) > -1)) {
					done = true;
					//��ֹie�ڴ�й©
					s.onload = s.onreadystatechange = null;
					head.removeChild(s);
					if(op.callback) {
						op.callback();
					}
				}
			};
			head.appendChild(s);
		},

		/**
		 * @public �첽����css�ļ�����
		 * @param {string} css��url
		 * @param {func} callback
		 */
		getCss: function(url, cb) {
			var that = this;
			$.ajax({
				url: url,
				success: function(data) {
					var s = document.createElement('style');
					s.type = 'text/css';
					//ie������Ҫ�ֿ��Դ�
					if(s.styleSheet) {
						s.styleSheet.cssText = data;
					}
					else {
						s.appendChild(document.createTextNode(data));
					}
					head.appendChild(s);
					if(cb) {
						cb();
					}
				}
			});
		},
		
		/**
		 * @public ������һ��url����GET���󣬺��Է��ص�����
		 * @note ��Ҫ���ڷ���ͳ������
		 * @param {string} url������ĵ�ַ
		 * @param {string} ��ѡparam��url���query����������д�ɶ������ʽ��Ҳ������&�����ַ���
		 */
		getRequest: function(url, params){
			var img = new Image();
			//��ֹIE�µ��Զ������������������δ����״��
			img.onload = function(){};
			img.src = !params ? url : [url, /\?/.test(url) ? '&' : '?', $.isString(params) ? params : $.param(params)].join('');
		},
		
		/**
		 * @public ��url
		 * @param {string} �򿪵ĵ�ַ
		 * @param {string} �¿�����ָ�����ڶ�������
		 */
		openURL: function(url, target) {
			//�Զ�����http://��ͷ
			if(url.indexOf('http') != 0) {
				url = 'http://' + url
			}
			//ie�����������������
			if (!$.browser.msie) {
				if ('_blank' == target)
					window.open(url);
				else if (target)
					window[target.replace(/^_/, '')].location.href = url;
				else
					location.href = url;
			}
			else {
				var s = this.render('<a href="<%=url%>" target="<%=target%>"></a>', {
					url: url,
					target: target || '_self'
				});
				$(s).appendTo($(document.body)).click();
			}
		}
	});

})();