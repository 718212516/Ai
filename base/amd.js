(function() {

	var module = {},
		script = {},
		lastMod;

	/**
	 * @public amd定义接口
	 * @param {string} 模块id，可选，省略为script文件url
	 * @param {array} 依赖模块id，可选
	 * @param {Function/object} 初始化工厂
	*/
	function define(id, dependencies, factory) {
		if(!$.isString(id)) {
			factory = dependencies;
			dependencies = id;
			id = null;
		}
		if(!$.isArray(dependencies)) {
			factory = dependencies;
			dependencies = null;
		}
		var cb = $.isFunction(factory) ? factory : function() {
			return factory;
		};
		lastMod = {
			id: id,
			dependencies: dependencies,
			factory: factory,
			uri: null
		};
	}
	define.amd = {};
	/**
	 * @public 加载使用模块方法
	 * @param {string/array} 模块id
	 * @param {Function} 加载成功后回调
	*/
	function use(ids, cb) {
		if($.isString(ids)) {
			ids = [ids];
		}
		cb = cb || function() {};
		var wrap = function() {
				var mods = [];
				ids.forEach(function(id) {
					var mod = getMod(id);
					if($.isFunction(mod.factory)) {
						var deps = [];
						if(mod.dependencies) {
							mod.dependencies.forEach(function(d) {
								deps.push(getMod(d).factory);
							});
						}
						mod.factory = mod.factory.apply(null, deps);
					}
					mods.push(mod.factory);
				});
				cb.apply(null, mods);
			},
			recursion = function() {
				var deps = [];
				ids.forEach(function(id) {
					var mod = getMod(id),
						d = mod.dependencies;
					if(d && d.length) {
						deps = deps.concat(d);
					}
				});
				//如果有依赖，先加载依赖，否则直接回调
				if(deps.length) {
					use(deps, wrap);
				}
				else {
					wrap();
				}
			};
		//将id转换为url
		var urls = [];
		ids.forEach(function(o) {
			urls.push(id2Url(o));
		});
		loadScripts(urls, recursion);
	}

	function id2Url(id) {
		if(module[id]) {
			return module[id].url;
		}
		return id;
	}
	function url2Id(url) {
		if(script[url]) {
			return script[url];
		}
		return url;
	}
	function getMod(s) {
		var mod = module[s];
		//可能传入的是url而非id，转换下
		if(!mod && script[s]) {
			mod = module[script[s]];
		}
		if(!mod) {
			throw new Error('module error: ' + s + ' is undefined');
		}
		return mod;
	}
	function loadScripts(urls, cb) {
		if($.isString(urls)) {
			urls = [urls];
		}
		var remote = urls.length;
		if(remote) {
			urls.forEach(function(url) {
				getScript(url, function() {
					if(--remote == 0) {
						cb();
					}
				});
			});
		}
		else {
			cb();
		}
	}
	var getScript = (function() {
		var state = {},
			list = {},
			UNLOAD = 0,
			LOADING = 1,
			LOADED = 2;
		return function(url, cb) {
			if(!state[url]) {
				state[url] = UNLOAD;
				list[url] = [cb];
				$.ajax({
					url: url,
					dataType: 'script',
					cache: true,
					success: function() {
						lastMod.uri = url;
						lastMod.id = lastMod.id || url; //匿名module的id为本身script的url
						if(module[lastMod.id]) {
							throw new Error('module conflict: ' + lastMod.id + ' has already existed');
						}
						module[lastMod.id] = lastMod;
						script[url] = lastMod.id;
						//缓存记录
						state[url] = LOADED;
						list[url].forEach(function(cb) {
							cb();
						});
						list[url] = [];
					}
				});
			}
			else if(state[url] == 1) {
				list[url].push(cb);
			}
			else {
				cb();
			}
		}
	})();

	window.define = define;
	$$.use = use;

})();