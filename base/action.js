(function() {

	var action = {}; //����action�����Զ��ҳ�湲��һ��jsʱִ������Ķ�������

	$$.mix({

		/**
		 * @public ����/ִ��action����do���Ⱥ�˳��
		 * @param {string} key
		 * @param {func} func
		 * @param {boolean} �Ƿ񸲸ǵ����е�action���������������Ĭ��false
		 */
		action: function(key, func, overwrite) {
			//δ����action��ǿ�Ƹ���ʱ����������еȴ�do�ĵ���
			if($.isUndefined(action[key]) || overwrite) {
				action[key] = {
					did: 0, //0��ʶ��δ����do��1��do��
					list: [func]
				};
			}
			else {
				//�Ѷ���������action����
				action[key].list.push(func);
				//�����Ѿ�do����ֱ��ִ��
				if(action[key].did) {
					func();
				}
			}
		},
		
		/**
		 * @public ����/ִ��action����action���Ⱥ�˳��
		 * @param {string/array/hash} ��Ҫdo��key�������array����һ��key��hash����object��key
		 * @param {boolean} ����Ѿ�do�����ٴ�do�Ƿ��ظ���action�б�Ĭ��false
		 */
		does: function(key, repeat) {
			if($.isArray(key)) {
				key.forEach(function(item) {
					$$.does(item, repeat);
				});
			}
			else if($.isPlainObject(key)) {
				this.keys(key).forEach(function(item) {
					//hash���õ�ֵ����Ϊtrueʱ�Ż�ִ��
					if(key[item]) {
						$$.does(item, repeat);
					}
				});
			}
			else {
				var act = action[key];
				//cancel������Ϊnull��ӵ��������ȼ�
				if(act === null) {
				}
				//����ʱ�����ڶ���˵����δ����action������action��ʼ������did��Ϊ1����action�Զ�����
				else if($.isUndefined(act)) {
					action[key] = {
						did: 1,
						list: []
					};
				}
				//�Ѷ���action����ǿ��ִ��ʱ������list
				else if(!act.did || repeat) {
					action[key].did = 1;
					act.list.forEach(function(fn) {
						fn();
					});
				}
			}
		},
		
		/**
		 * @publicȡ��ִ���Ѷ����action�������ڶ���Ķ�������ִ��ǰִ�У�ӵ��������ȼ���ȡ����˶�������ִ��
		 * @param {string/array/hash} ��Ҫcancel��key�������array����һ��key��hash����object��key
		 */
		cancel: function(key) {
			var list = [];
			if($.isArray(key)) {
				list = key;
			}
			else if($.isPlainObject(key)) {
				this.keys(key).forEach(function(item) {
					list.push(key);
				});
			}
			else {
				list.push(key);
			}
			//��Ϊnullʹ�ú���������does����action������ִ��
			list.forEach(function(item) {
				action[item] = null;
			});
		}
	});

})();