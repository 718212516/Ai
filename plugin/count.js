(function() {

	var _cache, //���е�����󶼻������˶���
		_url, //�����url
		_interval = 0, //ͬһ�ڵ������������ms�ں���
		_delay = 0, //���󻺴����ٷ��ͣ��Ա�ϲ����ڵ���������
		_max = 0, //�ϲ�����s
		_lastNode, //�ϴε���Ľڵ�
		_lastDate, //�ϴε����ʱ��
		_timeout, //���淢�ͼ�ʱ��
		COOKIE = 'g_click_count';
	function init(url, interval, delay, max) {
		_cache = [];
		reset(url, interval, delay, max, false);
		//ֻΪҳ��ɵ��Ԫ��a��input��ͳ��
		$(document.body).bind('click', function(event) {
			var p = event.target,
				res = [],
				cookie = false;
			//��ֹ�������ٵ��ͬһԪ��
			if(check(p)) {
				return;
			}
			//��¼���νڵ���ʱ��
			_lastNode = p;
			_lastDate = +new Date();
			//ͼƬ����鿴��Ԫ���Ƿ���a��ǩ���ż���ͳ��
			if(p.nodeName == 'IMG') {
				p = p.parentNode;
			}
			if(p.nodeName == 'A') {
				var href = $(p).attr('href'),
					target = $(p).attr('target');
				//������url���Ӳ����Ǳ����ڴ�ʱ��������󱣴���Ϣ��cookie�У���ҳ���ȡcookie��������
				if(href.charAt(0) != '#' && (target == '' || target == '_self')) {
					cookie = true;
				}
			}
			//ֻ��a��input��ǩ��ͳ��
			if(['A', 'INPUT'].indexOf(p.nodeName) > -1) {
				var temp;
				while(p && p != this) {
					//����id����ʱ��ֱ�ӷ���
					temp = p.id;
					if(temp) {
						res.push('#' + temp);
						break;
					}
					temp = getIndex(p);
					//������������λ�����������ᳬ��32����˼�¼32����1λ���㹻�������Ļ����߲�_
					if(temp.length > 1) {
						res.push('_' + temp + '_');
					}
					else {
						res.push(temp);
					}
					p = p.parentNode;
				}
				if(res.length) {
					_cache.push(res.reverse().join(''));
					if(cookie) {
						$.cookie(COOKIE, _cache.join('|'));
					}
					else {
						//���������ʱ���̷���
						if(_cache.length > _max) {
							request();
						}
						//����ʼ��ʱ
						else {
							start();
						}
					}
				}
			}
		});
		//��ȡҳ��cookie�������������ת��cookie��ʼ��ʱ����
		var c = $.cookie(COOKIE);
		if(c) {
			_cache.push(c);
			$.cookie(COOKIE, null);
			start();
		}
	};
	function check(node) {
		if(_lastNode && _lastNode == node && (+new Date() - _lastDate < _interval)) {
			return true;
		}
		return false;
	}
	function getIndex(node) {
		var index = -1;
		while(node) {
			//ֻ����node_element�ڵ㣬���Һ��Ե�һЩ��������
			if(node.nodeType == 1 && ['SCRIPT', 'STYLE', 'OBJECT', 'EMBED'].indexOf(node.nodeName) == -1) {
				index++;
			}
			node = node.previousSibling;
		}
		return parseInt(index).toString(32);
	};
	function reset(url, interval, delay, max, request) {
		_url = url;
		_interval = interval;
		_delay = delay;
		_max = max;
		//�������Ҫ���¼�ʱ
		if(request) {
			start();
		}
	};
	function start() {
		//�����ԭ�ȵļ�ʱ
		if(_timeout) {
			clearTimeout(_timeout);
		}
		_timeout = setTimeout(request, _delay);
	};
	function request() {
		//������ʱ�Żᷢ��
		if(_cache.length) {
			$$.getRequest(_url, 'c=' + _cache.join('|'));
			_cache = [];
		}
	};
	$$.mix({
		/**
		 * @public ҳ��������ͳ��
		 * @{string} ͳ������url
		 * @{int} ͬһ�������ms�ڽ�����
		 * @{int} ͳ�ƽ��ӳٶ�÷��ͣ��Ա�������ͳ�ƺϲ�
		 * @{int} �ϲ����ޣ������ֱ�ӷ���
		 */
		nodeClick: function(url, interval, delay, max) {
			if(_cache) {
				reset(url, interval, delay, max, true);
			}
			else {
				init(url, interval, delay, max);
			}
		}
	}, 'count');

})();