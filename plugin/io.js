(function() {

	function initStorage(url) {
		//���������iframe��ͬʱ����iframe�������ǰ��ε��õ����û�������
		if($.isString(url)) {
			//��һ�γ�ʼ���Ȼ����������в�������iframe���سɹ��ټ�黺��ִ��
			var sets = [],
				gets = [],
				removes = [],
				cache = {
					setItem: function(k, v) {
						sets.push({
							k: k,
							v: v
						});
					},
					getItem: function(k, cb) {
						gets.push({
							k: k,
							cb: cb
						});
					},
					removeItem: function(k) {
						removes.push(k);
					}
				},
				iframe = '<iframe src="' + url + '" style="position:absolute;left:-9999px;visibility:hidden;"></iframe>';
			iframe = $(iframe).load(function() {
				//���سɹ���ִ�л���������ٶ��Ը���ԭ�ӿ�
				cache = init(this.contentWindow);
				sets.forEach(function(item) {
					cache.setItem(item.k, item.v);
				});
				gets.forEach(function(item) {
					cache.getItem(item.k, item.cb);
				});
				removes.forEach(function(item) {
					cache.removeItem(item);
				});
			});
			$(function() {
				iframe.appendTo($(document.body));
			});
			return cache;
		}
		//����洢��ֱ�Ӵ���window����
		else {
			return init(url);
		}
	}
	function init(win) {
		//html5�洢֧�֣�ff3.5+��chrome��safari4+��ie8+֧��
		if(win.localStorage) {
			init = initInHtml5;
		}
		//ff2�Լ�ʵ�ֵ�һ�׷���
		else if(win.globalStorage) {
			init = initInFF2;
		}
		//ie5+֧�ֵ�˽�з������洢�ռ�ֻ��1M
		else if(win.ActiveXObject) {
			init = initInLowIe;
		}
		return init(win);
	}
	function initInHtml5(win) {
		var storage = {};
		storage.setItem = function(k, v){
			win.localStorage.setItem(k, v);
		};
		storage.getItem = function(k, cb){
			cb(win.localStorage.getItem(k));
		};
		storage.removeItem = function(k){
			win.localStorage.removeItem(k);
		};
		return storage;
	}
	function initInFF2(win) {
		var storage = {};
		storage.setItem = function(k, v){
			win.globalStorage[win.document.domain].setItem(k, v);
		};
		storage.getItem = function(k, cb){
			cb((win.globalStorage[win.document.domain].getItem(k) || {}).value);
		};
		storage.removeItem = function(k){
			win.globalStorage[win.document.domain].removeItem(k);
		};
		return storage;
	}
	function initInLowIe(win) {
		var storage = {},
			doc = win.document.documentElement;
		doc.addBehavior('#default#userdata');
		storage.setItem = function(n, v){
			doc.setAttribute('_', v);
			doc.save(n);
		};
		storage.getItem = function(n, cb){
			try {
				doc.load(n);
				cb(doc.getAttribute('_'));
			} catch (ex) {};
		};
		storage.removeItem = function(n){
			try {
				doc.load(n);
				doc.expires = (new Date(315532799000)).toUTCString();
				doc.save(n);
			} catch(e) {};
		};
		return storage;
	}

	$$.mix({
		/**
		 * @public ���ߴ洢
		 * @param {string} �洢��key��֧�ֿ���洢��key������@��url���������������iframe����ָ��document.domainΪҳ�����
		 * @param {null/string/func} �洢��ֵ�����أ���ΪnullΪɾ����stringΪ�趨������Ϊ��ȡ��������Ϊ�ص�������Ŀ����Ϊ�˼��ݿ���ʱ�Ļص�������iframe����ʱ���ڣ���Ψһ����Ϊֵ�����ֿ������ӿ�Ҳһ��
		 */
		storage: (function() {
			//Ϊ��ͬ���ʼ����ͬ��Ψһ�洢ʵ����Ĭ�Ϸǿ���Ϊdefault
			var hash = {};
			return function(k, v) {
				var stg,
					key = k.split('@'),
					url = key[1];
				k = key[0];
				//������url��Ϊ������洢
				if(url) {
					url = url.indexOf('http') == 0 ? url : 'http://' + url;
					if(!hash[url]) {
						hash[url] = initStorage(url);
					}
					stg = hash[url];
				}
				else {
					if(!hash['default']) {
						hash['default'] = initStorage(window);
					}
					stg = hash['default'];
				}
				//overload
				if($.isFunction(v)) {
					stg.getItem(k, v);
				}
				else if(v === null) {
					stg.removeItem(k);
				}
				else if(!$.isUndefined(v)) {
					stg.setItem(k, v);
				}
			};
		})()
	}, 'io');

})();