//flash��ie�»����title��bug
if($.browser.msie) {
	var title = document.title;
	$(document).bind('mouseup', function(e) {
		var n = e.target.nodeName;
		if(({'EMBED': 1, 'OBJECT': 1})[n]) {
			document.title = title;
		}
	});
	//ie6���汳��ͼ
	if($.browser.version == '6.0') {
		document.execCommand('BackgroundImageCache', false, true);
	}
}