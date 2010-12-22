(function() {
	
	var	module = {}, //ģ��⣬��������YUI.use�첽����ģ���ģ�鼯
		head = document.getElementsByTagName('head')[0],
		LOADING = 1,
		LOADED = 2,
		ORDER = !($.browser.opera || $.browser.mozilla); //��֧��script/cache�����Զ���script��ǩ����˳�����첽ִ�д�����������opera��firefox

	//�ݹ����ģ��������ģ���б�������
	function scanModule(mod, list){
		list = list || [];
		//��ʷ��¼ȷ��list�г��ֵ�����ģ��ֻ����һ��
		var history = list.history;
		if(!history) {
			history = list.history = {};
		}
		var deps;
		//ֱ�Ӵ���array˵����ģ�鼯�б�
		if($.isArray(mod)) {
			deps = mod;
		}
		//����string˵����ģ����
		else if($.isString(mod)) {
			mod = module[mod];
			//���������쳣
			if(!mod) {
				throw new Error(mod.name + ' is Undefined');
			}
			deps = mod.deps;
		}
		//object����ģ�����
		else if($.isObject(mod)) {
			deps = mod.deps;
		}
		//�������ݹ�����������¼��Ψһ��list�����ϡ�css��֧������
		if(!mod.css && deps) {
			deps.forEach(function(dep) {
				dep = module[dep];
				if(dep && !history[dep.name]) {
					history[dep.name] = 1;
					scanModule(dep, list);
				}
			});
		}
		//����δ���ص�ģ���url����list��������ʷ��¼��ֹ�ظ�
		if(mod.url && mod.load != LOADED) {
			list.push(mod);
		}
		history[mod.name] = 1;
		return list;
	}
	function loadModule(mod, cb) {
		var url = mod.url;
		if(mod.css) {
			$$.getCss(url, function() {
				loadComplete.call(mod);
			});
		}
		else {
			if(ORDER && mod.deps) {
				mod.cache = 1;
			}
			$$.getScript(url, {
				charset: mod.charset,
				type: mod.cache ? 'script/cache' : null,
				callback: function() {
					loadComplete.call(mod);
				}
			});
		}
	}
	//�����Ǽ������
	function loadComplete() {
		var self = this;
			remote = 0;
		//����Լ�������ģ���Ƿ��Ѿ�װ����ɣ�û�еĻ��в���ִ�У�����callback��ûװ����ɵ�ģ����ȥ��ģ������
		if(self.deps) {
			self.deps.forEach(function(dep) {
				dep = module[dep];
				if(dep.load != LOADED) {
					remote++;
					dep.cb.push(function() {
						if(--remote == 0) {
							loadFinish.call(self);
						}
					});
				}
			});
		}
		//��������ȫ������ִ�гɹ������ֱ�ӵ���
		if(!remote) {
			loadFinish.call(self);
		}
	}
	//������ɲ�������Ҳ����ִ�����
	function loadFinish() {
		var mod = this;
		//���֧��typeΪscript/cache������������²��뻺���script��ǩʹ����Ч
		if(mod.cache) {
			mod.cache = 0;
			$$.getScript(mod.url, {
				charset: mod.charset,
				callback: function() {
					loadFinish.call(mod);
				}
			});
		}
		else {
			mod.load = LOADED;
			mod.cb.forEach(function(cb) {
				cb();
			});
		}
	}
	//����Ƿ���ѭ������
	function checkRecursion(list) {
		var history = {},
			stack;
		//������Ҫ�첽���ص�ģ���б�ÿ��ģ����ȱ�������Լ������������ֹ���˵���˻�·�Ѽ��������ظ�����¼��history��
		list.forEach(function(mod) {
			if(!history[mod.name]) {
				stack = [];
				history[mod.name] = 1;
				scanRecursion(mod, {});
			}
		});
		//ÿ��ģ����ȱ��������У��߼�¼�߱����������ظ���˵������ѭ����·�����쳣
		function scanRecursion(mod, has) {
			if(mod && mod.deps) {
				stack.push(mod.name);
				mod.deps.forEach(function(dep) {
					if(has[dep]) {
						throw new Error('InfiniteLoop of dependence: ' + stack.join('->'));
					}
					has[dep] = 1;
					history[dep] = 1;
					scanRecursion(module[dep], has);
				});
				//������ɺ������
				has[mod.name] = 0;
				stack.pop();
			}
		}
	}

	$$.mix({
		/**
		 * @public ע��ģ���ļ�������ģ������ǵ����ļ�ģ�飬�����������������ģ���ģ�鼯
		 * @param {string/object} ģ��������Ϊobject������hash��ʽ���壬keyΪģ����������3��������Ϊһ������
		 * @param {string/null} ģ���url����������Ϊnull
		 * @param {array/string/boolean} ������ģ���������������������Ϊtrue��Ϊ����cssģ��
		 * @param {stirng} ģ��charset����ѡ
		 */
		def: function(name, url, deps, charset) {
			if($.isPlainObject(name)) {
				for(var i in name) {
					var args = name[i];
					this.def(i, args[0], args[1], args[2]);
				}
				return;
			}
			//���ܸ�������ģ��
			if(module[name]) {
				throw new Error(name + ' has been defined');
			}
			var css;
			//������ת������
			if($.isString(deps) && deps.length) {
				deps = [deps];
			}
			else if(!$.isArray(deps) && !$.isUndefined(deps)) {
				css = true;
			}
			module[name] = {
				name: name,
				url: url && url.length ? url : null,
				deps: deps && deps.length ? deps : null,
				charset: charset,
				cb: [],
				css: css
			};
		},

		/**
		 * @public �첽ʹ��ģ���ģ�鼯�ķ���
		 * @param {string/array} ģ�飨����������
		 * @param {func} ���سɹ���ĵ��ú���
		 */
		use: function(name, cb) {
			var list = scanModule(name),
				len = list.length,
				remote;
			//��ֹѭ�������������·
			checkRecursion(list);
			cb = cb || function(){};
			//������ǰ�Ѿ���������ֱ��ִ��
			if(len == 0) {
				cb();
			}
			//ֻ����һ��ģ�飬����callbak
			else if(len == 1) {
				remote = list[0];
				remote.cb.push(cb);
				if(!remote.load) {
					remote.load = LOADING;
					loadModule(remote);
				}
				else if(remote.load == LOADED) {
					cb();
				}
			}
			//�������ģ��ʱ��ÿ�����潨��callback��������remote������ʶȫ�����سɹ�
			else {
				remote = list.length;
				list.forEach(function(mod) {
					mod.cb.push(function() {
						complete.call(mod);
					});
					if(!mod.load) {
						mod.load = LOADING;
						loadModule(mod);
					}
					else if(mod.load == LOADED) {
						complete.call(mod);
					}
				});
			}
			function complete() {
				this.load = LOADED;
				if(--remote == 0) {
					cb();
				}
			}
		}
	});

})();