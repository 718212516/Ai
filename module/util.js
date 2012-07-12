define(function() {
	var tplCache = {};

	return {
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
		},
		
		/**
		 * @public ���ı����Ƶ�������
		 * @note Ŀǰֻ֧��ie
		 * @param {string} url���ı�����
		 * @param {func} succ�ǻص��������������Ƿ�ɹ�
		 */
		copyToClip : function(url, cb){
			cb = cb || function(){};
			if(window.clipboardData) {
				if(window.clipboardData.setData('text', url)) {
					cb(true);
				}
				else {
					cb(false);
				}
			}
			else {
				cb(false);
			}
		},
		
		/**
		 * @public ��ʽ������
		 * @param {pattern} ��ʽ������
		 * @param {date} ���ʽ�������ڶ���
		 */
		formatDate: function(pattern, date) {
			function formatNumber(data, format) {
				format = format.length;
				data = data || 0;
				return format == 1 ? data : (data = String(Math.pow(10, format) + data)).substr(data.length - format);
			}
			if(!date) {
				date = new Date();
			}
			else if($.isNumber(date)) {
				date = new Date();
				date.setTime(date);
			}
			return pattern.replace(/([YMDhsm])\1*/g, function(format) {
				switch(format.charAt()) {
					case 'Y':
						return formatNumber(date.getFullYear(), format);
					case 'M':
						return formatNumber(date.getMonth() + 1, format);
					case 'D':
						return formatNumber(date.getDate(), format);
					case 'w':
						return date.getDay() + 1;
					case 'h':
						return formatNumber(date.getHours(), format);
					case 'm':
						return formatNumber(date.getMinutes(), format);
					case 's':
						return formatNumber(date.getSeconds(), format);
				}
			});
		},

		/**
		 * @public ��Ⱦģ�巽��
		 * @note ����ֱ��֧��<elements id="id">tpl</elements>
		 * @note ģ���еı�����ʽ��<%=variable%>
		 * @note <%%>��֧��ԭ��js���룬thisΪ��2����������
		 * @url http://ejohn.org/blog/javascript-micro-templating/
		 * @param {string/object} ģ�����Ҫ��Ⱦ�Ľڵ�����
		 * @param {Object} ��Ҫ��Ⱦ������
		 * @return {string} ��Ⱦ�õ�html�ַ���
		 */
		render: function tmpl(tpl, data){
			// Figure out if we're getting a template, or if we need to
			// load the template - and be sure to cache the result.
			var fn = !/\W/.test(tpl) ? tplCache[tpl] = tplCache[tpl] ||
				tmpl(document.getElementById(tpl).innerHTML) :
			  
				// Generate a reusable function that will serve as a template
				// generator (and which will be cached).
				new Function("obj",
					"var p=[],print=function(){p.push.apply(p,arguments);};" +

					// Introduce the data as local variables using with(){}
					"with(obj){p.push('" +

					// Convert the template into pure JavaScript
					tpl
					  .replace(/[\r\t\n]/g, " ")
					  .split("<%").join("\t")
					  .replace(/((^|%>)[^\t]*)'/g, "$1\r")
					  .replace(/\t=(.*?)%>/g, "',$1,'")
					  .split("\t").join("');")
					  .split("%>").join("p.push('")
					  .split("\r").join("\\'")
					+ "');}return p.join('');");
			
			// Provide some basic currying to the user
			return data ? fn(data) : fn;
		},

		/**
		 * @public ����url��get��������hashģʽ
		 * @return {object} hash�ı���
		 */
		params: function(url) {
			url = url || location.href;
			var params = {},
				result = url.match(/[^\s&?#=\/]+=[^\s&?#=]+/g);
			if(result){
				for(var i = 0, l = result.length; i < l; i++){
					var n = result[i].split("=");
					params[n[0]] = decodeURIComponent(n[1]);
				}
			}
			return params;
		},

		/**
		 * @public htmlת��
		 * @param {string} ��Ҫת����ַ���
		 */
		escape: function(str){
			var xmlchar = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				"'": '&#39;',
				'"': '&quot;',
				'{': '&#123;',
				'}': '&#125;',
				'@': '&#64;'
			};
			return str.replace(/[<>'"\{\}&@]/g, function($1){
				return xmlchar[$1];
			});
		},

		/**
		 * @public ȡ�ַ������ֽڳ���
		 * @param {string} �ַ���
		 */
		byteLen: function(str) {
			return str.replace(/([^\x00-\xff])/g, '$1 ').length;
		},

		/**
		 * @public ���ֽڳ��Ƚ�ȡ�ַ���
		 * @param {string} str�ǰ�����Ӣ�ĵ��ַ���
		 * @param {int} limit�ǳ������ƣ���Ӣ���ַ��ĳ��ȼ��㣩
		 * @return {string} ���ؽ�ȡ����ַ���,Ĭ��ĩβ����'...'
		 */
		substr: function(str, limit){
			var sub = str.substr(0, limit).replace(/([^\x00-\xff])/g, '$1 ').substr(0, limit).replace(/([^\x00-\xff])\s/g, '$1');
			return sub + '...';
		},

		/**
		 * @public �ַ����Ƿ���ָ��sub��β
		 * @param {string} str��Ҫȷ�����ַ���
		 * @return {string} ��β
		 */
		endsWith: function(str, sub){
			return str.lastIndexOf(sub) == str.length - sub.length;
		}
	};
});