(function() {
	var id = '-ai';

	/**
	 * @public ����һ���µ��¼���������
	 * @return new $$.Action();
	 */
	$$.Action = function() {
		this.__action = $('<p>');
	};
	$$.Action.prototype = {
		constructor: $$.Action,
		/**
		 * @public ���¼�����
		 * @param {string} �󶨵��¼���
		 * @param {object} ��ʱ�����ݣ���ʡ��
		 * @param {func} ������ִ�з���
		 */
		bind: function(type, data, cb) {
			if($.isUndefinde(cb)) {
				cb = data;
				data = {};
			}
			this.__action.bind(id + type, data, cb);
		},
		/**
		 * @public �Ӵ����¼�����
		 * @param {string} �󶨵��¼���
		 * @param {func} ������ִ�з�������ʡ�ԣ�ʡ��Ϊȡ������
		 */
		unbind: function(type, cb) {
			this.__action.unbind(id + type, cb);
		},
		/**
		 * @public �����¼�����һ��
		 * @param {string} �������¼���
		 * @param {object} ����ʱ�����ݣ���ʡ��
		 */
		one: function(type, data) {
			this.__action.one(id + type, data || {});
		},
		/**
		 * @public �����¼����ɶ��
		 * @param {string} �������¼���
		 * @param {object} ����ʱ�����ݣ���ʡ��
		 */
		trigger: function(type, data) {
			this.__action.trigger(id + type, data || {});
		}
	};

	//Ĭ�ϵ�ȫ���¼���������
	$$.action = new $$.Action();

})();