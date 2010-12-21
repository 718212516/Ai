(function() {
	
	var SHOCKWAVE_FLASH = 'Shockwave Flash',
		FLASH_MIME_TYPE = 'application/x-shockwave-flash',
		SHOCKWAVE_FLASH_AX = 'ShockwaveFlash.ShockwaveFlash';

	function getVersion() {
		var d,
			ver = [0, 0, 0];
		if(!$.isUndefined(navigator.plugins) && $.isObject(navigator.plugins[SHOCKWAVE_FLASH])) {
			d = navigator.plugins[SHOCKWAVE_FLASH].description;
			if (d && !(!$.isUndefined(navigator.mimeTypes) && navigator.mimeTypes[FLASH_MIME_TYPE] && !navigator.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
				d = d.replace(/^.*\s+(\S+\s+\S+$)/, '$1');
				ver[0] = parseInt(d.replace(/^(.*)\..*$/, '$1'), 10);
				ver[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, '$1'), 10);
				ver[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, '$1'), 10) : 0;
			}
		}
		else if(!$.isUndefined(window.ActiveXObject)) {
			try {
				var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
				if(a) { // a will return null when ActiveX is disabled
					d = a.GetVariable('$version');
					if (d) {
						d = d.split(' ')[1].split(',');
						ver = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
					}
				}
			}
			catch(e) {}
		}
		return ver;
	}
	function createSwf(attrs, params, node) {
		//ie���迼��ԭ�нڵ���Ǹ�object��flash���������ǿ�и��ǻ���ʹflash�޷��������š��Ƴ�ԭobject�ٲ�����div�ڵ㣬�ٶ�̬����flash����div�ڵ��С�Ҳ�ɷ�ֹ�ڴ�й©
		if(node.nodeName == 'OBJECT') {
			var newDiv = document.createElement('div');
			node.parentNode.insertBefore(newDiv, node);
			removeObject(node);
			createHtml(attrs, params, newDiv);
		}
		createHtml(attrs, params, node);
	}
	function createHtml(attrs, params, node) {
		if($.browser.msie) {
			createHtml = createInIe;
		}
		else {
			createHtml = createInNormal;
		}
		createHtml(attrs, params, node);
	}
	function createInIe(attrs, params, node) {
		var att = '',
			par = '';
		for(var i in attrs) {
			if(attrs[i] != Object.prototype[i]) { //����˵�һЩǱ������Ϊprototype�������
				if(i.toLowerCase() == 'data') {
					params.movie = attrs[i];
				}
				else if(i.toLowerCase() == 'class') {
					att += ' class="' + attrs[i] + '"';
				}
				else if(i.toLowerCase() != 'classid') {
					att += ' ' + i + '="' + attrs[i] + '"';
				}
			}
		}
		for(var j in params) {
			if(params[j] != Object.prototype[j]) { //ͬ��
				par += '<param name="' + j + '" value="' + params[j] + '"/>';
			}
		}
		node.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + att + '>' + par + '</object>';
	}
	function createInNormal(attrs, params, node) {
		var o = document.createElement('object');
		o.setAttribute('type', FLASH_MIME_TYPE);
		for(var m in attrs) {
			if(attrs[m] != Object.prototype[m]) { //ͬ��
				if(m.toLowerCase() == 'class') {
					o.setAttribute('class', attrs[m]);
				}
				else if(m.toLowerCase() != "classid") { //���˵�IE��������
					o.setAttribute(m, attrs[m]);
				}
			}
		}
		for(var n in params) {
			if(params[n] != Object.prototype[n] && n.toLowerCase() != 'movie') { //ͬ��
				createObjParam(o, n, params[n]);
			}
		}
		node.parentNode.replaceChild(o, node);
	}
	function createObjParam(el, pName, pValue) {
		var p = document.createElement('param');
		p.setAttribute('name', pName);	
		p.setAttribute('value', pValue);
		el.appendChild(p);
	}

	function removeObject(obj, cb) {
		//ie�����Ƴ�object�ϵ�function�������ڴ�й©���Ƴ���Ҫ��readyStateΪ4����У��޷�������ֻ���ö�ʱ��
		if($.browser.msie) {
			removeObject = removeObjectInIe;
		}
		else {
			removeObject = removeObjectInNormal;
		}
		removeObject(obj, cb);
	}
	function removeObjectInIe(obj, cb) {
		obj.style.display = 'none';
		(function(){
			if(obj.readyState == 4) {
				for(var i in obj) {
					if($.isFunction(obj[i])) {
						obj[i] = null;
					}
				}
				if($.isFunction(cb)) {
					cb();
				}
				return;
			}
			setTimeout(arguments.callee, 100);
		})();
	}
	function removeObjectInNormal(obj, cb) {
		obj.parentNode.removeChild(obj);
		if($.isFunction(cb)) {
			cb();
		}
	}

	$$.mix({
		/**
		 * @public ��ȡflash����
		 * @param {string} ����id
		 */
		getItem: function(id){
			return $.browser.msie ? window[id] : document[id];
		},
		
		/**
		 * @public ��дswfobject����flash����
		 * @param {string} swf�����url
		 * @param {string} ��̬д���node��id
		 * @param {int} width
		 * @param {int} height
		 * @param {object} flashvars
		 * @param {object} param��ǩ����
		 * @param {object} object��ǩ����
		 */
		setItem: function(url, id, width, height, flashvars, params, attrs) {
			var node = document.getElementById(id),
				p = {},
				a = {};
			if(node) {
				//��url��width��height����attrs�У���ֹԭ���ò������޸ģ����Ǹ������ε������޸�bug
				$.extend(true, a, attrs, {
					data: url,
					width: width + '',
					height: height + ''
				});
				//û������id��̳�ԭ��domԪ�ص�id
				if(!a.id) {
					a.id = id;
				}
				$.extend(true, p, params);
				p.flashvars = $.param(flashvars);
				createSwf(a, p, node);
				return this.getItem(a.id);
			}
		},
		
		/**
		 * @public �Ƴ�flash����
		 * @param {string/object} ����id�������
		 * @param {func} �Ƴ���Ļص�����
		 */
		removeItem: function(id, cb) {
			var obj = $.isString(id) ? document.getElementById(id) : id;
			if (obj && obj.nodeName == 'OBJECT') {
				removeObject(obj, cb);
			}
		},

		/**
		 * @public ��ȡflash�汾�������հ�
		 * @return {array} 3λ���ȵİ汾��
		 */
		version: function() {
			var version = getVersion();
			this.version = function() {
				return version;
			}
			return version;
		}
	}, 'swf');

})();