(function() {
	
	var	module = {}, //模块库，用以类似YUI.use异步加载模块或模块集
		head = $('head')[0],
		UNLOAD = 0,
		LOADING = 1,
		LOADED = 2;

	//递归遍历模块依赖的模块列表，并返回
	function scanModule(mod, list, history){
		list = list || [];
		history = history || {};
		if($.isArray(mod)) {
			mod.forEach(function(item) {
				scanModule(item, list, history);
			});
		}
		else if(!history[mod]) {
			mod = module[mod];
			//不存在抛异常
			if(!mod) {
				throw new Error('module[' + mod.name + '] is Undefined');
			}
			//将尚未加载的模块的url存入list，并置历史记录防止重复
			if(mod.url && mod.load != LOADED) {
				list.push(mod);
			}
			history[mod.name] = 1;
		}
		return list;
	}
	function loadModule(mod) {
		var url = mod.url;
		if(mod.css) {
			$$.getCss(url, function() {
				loadComplete.call(mod);
			});
		}
		else {
			$$.getScript(url, {
				charset: mod.charset,
				callback: function() {
					loadComplete.call(mod);
				}
			});
		}
	}
	//仅仅是加载完成
	function loadComplete() {
		var mod = this;
		mod.load = LOADED;
		mod.cb.forEach(function(cb) {
			cb();
		});
	}

	$$.mix({
		/**
		 * @public 注册模块文件方法，模块可以是单独文件模块，亦可以是依赖于其它模块的模块集
		 * @param {boolean} 是否是css模块，可选，默认不是。
		 * @param {string} 模块名
		 * @param {string/null} 模块的url，若无则设为null
		 * @param {stirng} 模块charset，可选
		 */
		def: function(isCss, name, url, charset) {
			//不是css模块忽略isCss参数，所有参数前移
			if(isCss !== true) {
				charset = url;
				url = name;
				name = isCss;
			}
			module[name] = {
				name: name,
				url: url && url.length ? url : null,
				charset: charset,
				cb: [],
				load: UNLOAD,
				css: isCss === true
			};
		},

		/**
		 * @public 异步使用模块或模块集的方法
		 * @param {string/array} 模块（集）的名称
		 * @param {func} 加载成功后的调用函数
		 */
		use: function(name, cb) {
			var list = scanModule(name),
				len = list.length,
				one;
			cb = cb || function(){};
			//依赖先前已经加载完了直接执行
			if(len == 0) {
				cb();
			}
			//只使用一个模块，加载callbak
			else if(len == 1) {
				one = list[0];
				//先将callback放入回调列表，目的是当此模块为loading状态时不再进入下面分支判断
				one.cb.push(cb);
				//未读取模块时标识其为loading状态并读取
				if(one.load == UNLOAD) {
					one.load = LOADING;
					loadModule(one);
				}
				//已加载好的直接执行回调
				else if(one.load == LOADED) {
					cb();
				}
			}
			//使用多个模块时，每个里面建立callback，并根据剩余数量标识全部加载成功
			else {
				list.forEach(function(mod) {
					//逻辑类似上面只使用一个的情况
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
				if(--len == 0) {
					cb();
				}
			}
		}
	});

})();