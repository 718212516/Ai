(function() {
	var panel;
	$$.mix({
		panel: function(s) {
			//�����ɹ�panel������δ����remove�������䳹���Ƴ�������ʾԭ������������panel
			if(panel) {
				panel.open();
				return panel;
			}
			var node,
				p,
tpl = [
	'<div id="gPanel">',
	'<div class="panel">sdf<br/>sod<br/>if</div>',
	'</div>'
].join('');
			node = $($$.render(tpl));
			p = $('div:first', node);
			node.appendTo($(document.body));
			panel = {
				open: function() {
					p.css('top', parseInt(p.height() * -0.5) + 'px');
					node.css('visibility', 'visible');
				},
				close: function() {
				},
				remove: function() {
				},
				node: function() {
					return node;
				}
			};
			panel.open();
			return panel;
		}
	}, 'ui');
})();