(function() {

	var match = {
		'int': /^\d+$/,
		'float': /^\d*\.\d+$/,
		'number': /^[\d.]+$/,
		'phone': /^(13|15|18)\d{9}$/,
		'id': /^[a-z_\d]+$/i,
		'byte': /.+/,
		'require': /.+/,
		'chinese': /^[\u4e00-\u9fa5]+$/,
		'postal': /^[1-9]\d{5}$/,
		'qq': /^[1-9]\d{4,}$/,
		'url': /([a-z]+\:\/\/)?[^\s]+/,
		'email': /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
	};

	function valid(node, mes, res) {
		var rules = node.attr('valid'),
			value = node.val(),
			errMes;
		//�����ж�����trim˵��У��ʱ���value��trim
		if(rules.indexOf('trim') > -1) {
			value = $.trim(value);
		}
		//�Կո�ָ����򣬱���У��ÿ������
		rules.split(' ').forEach(function(item) {
			//һ������ͨ����������ʡ��
			if(!errMes) {
				item = item.split(':'); //:�����Ǵ�����ʾ��Ϣhash��key
				var rule = item[0].toLowerCase(),
					info = mes[item[1]] || 'error';
				//����������Զ���������/��ͷ
				if(rule.charAt(0) == '/') {
					if(!rule.test(value)) {
						errMes = info;
					}
				}
				//������������õ�У��
				else if(rule != 'trim') {
					var r = /^(.+?)(\{(.+)\})?$/.exec(rule),
						k = match[r[1]] || /.*/,
						len = r[3];
					//ûͨ����������ֱ�Ӵ���
					if(!k.test(value)) {
						errMes = info;
					}
					//ͨ�������Ƿ��г��ȶ��壨�������﷨��ͬ{min,max}��
					else if(len) {
						len = len.split(',');
						var length = value == 'byte' ? $$.byteLen(value) : value.length;
						if(len.length == 1) {
							if(length != len[0]) {
								errMes = info;
							}
						}
						else {
							var min = parseInt(len[0]) || 0,
								max = parseInt(len[1]) || value.length + 1;
							if(length < min || length > max) {
								errMes = info;
							}
						}
					}
				}
			}
		});
		if(errMes) {
			res.push({
				node: node,
				mes: errMes
			});
		}
	}

	$$.mix({
		/**
		 * @public ��У�飬����һ������valid()�����Ķ����ṩУ�鹦��
		 * @param {string/node} ����id���߱�����
		 * @param {object} ������ʾ��Ϣhash
		 * @return {array/false} ����false˵��У��ɹ���array����δͨ��У���Ԫ���б�
		 */
		formValid: function(form, mes) {
			form = ($.isString(form) && form.charAt(0) != '#') ? $('#' + form) : $(form);
			mes = mes || {};
			var list = form.find(':input[valid]');
			return {
				valid: function() {
					var res = [];
					list.each(function() {
						var item = $(this);
						//���ڴ�Ԫ�ؿ���ʱ�Ž���У��
						if(!item.attr('disabled')) {
							valid(item, mes, res);
						}
					});
					return res.length ? res : false;
				}
			};
		}
	}, 'valid');

})();