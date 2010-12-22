$$.mix({
	/**
	 * @public �����������
	 * @note ��СΪ0
	 * @param {number} min,max��������ķ�Χ����ֻ��һ������ʱ��minĬ��Ϊ0����û�в���ʱ��Ĭ��Math.random()������
	 * @return {int} ���ش��ڻ����0��С�ڷ�Χ������
	 */
	rand: function(min, max) {
		if($.isUndefined(min)) {
			return Math.floor(Math.random() * 100000000000000000);
		}
		else if($.isUndefined(max)) {
			max = min;
			min = 0;
		}
		return min + Math.floor(Math.random() * (max - min));
	},

	/**
	 * @public ȡ���ֵ
	 * @note ��������
	 */
	max: function() {
		var args = arguments,
			i = args.length - 2,
			v = args[i + 1];
		for(; i > -1; i--) {
			if(args[i] > v) v = args[i];
		}
		return v;
	},

	/**
	 * @public ȡ��Сֵ
	 * @note ��������
	 */
	min: function() {
		var args = arguments,
			i = args.length - 2,
			v = args[i + 1];
		for(; i > -1; i--) {
			if(args[i] < v) v = args[i];
		}
		return v;
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
		return str.replace(/[<>''\{\}&@]/g, function($1){
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
	endWith: function(str, sub){
		return str.lastIndexOf(sub) == str.length - sub.length;
	},

	/**
	 * @public ��JSģ��ת�������յ�html
	 * @note ģ���еı�����ʽ��<%=xxx%>
	 * @param {string} tpl��ģ���ı�
	 * @param {object} op��ģ���еı���
	 * @return {string} ���ؿ�ʹ�õ�html
	 */
	render: function(tpl, op){
		op = op || {};
		return tpl.replace(/<%\=(\w+)%>/g, function(e1,e2){
			return op[e2] != null ? op[e2] : '';
		});		
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
	}
});