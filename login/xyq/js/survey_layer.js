/* survey layer in order list page*/
function formOpen(url, data){
	var formobj = $('open_form');
	if(!formobj){
		formobj = document.createElement('form');
		formobj.method = 'get';
		formobj.target = '_blank';
		formobj.id = 'open_form';
		document.body.appendChild(formobj);
	}
	else{
		for(var i=0; i<formobj.childNodes.length; i++){
			formobj.removeChild(formObj.childNodes[i]);
		}
	}
	formobj.action = url;
	for (var p in data){
		var input_item = document.createElement('input');	
		input_item.type = 'hidden';
		input_item.name = p;
		input_item.value = data[p];
		formobj.appendChild(input_item);
	}
	formobj.submit();
}

function setSurvey(){
	if(LatestOrderInfo==null){return;}
	if(Cookie.read('has_surveyed')){return;}
	if(Cookie.read('has_survey_poped')){return;}
	var limitDate = new Date();
	limitDate.setDate(limitDate.getDate() - 7);
	if(new Date(LatestOrderInfo['pay_time']) < limitDate){return;}
	show_survey_layer();
}

function show_over_layer(){
	var overLayer = $('pop_over');
	if(overLayer == null){
		var overLayer = document.createElement('div');
		overLayer.id = 'pop_over';
		overLayer.className = 'pageCover';
		document.body.appendChild(overLayer);
	}
	document_size = get_documentsize();
	overLayer.style.height = document_size.height + 'px';
	overLayer.style.width = document_size.width + 'px';
	overLayer.style.display = 'block';
}

function show_survey_layer(){
	$('btn_to_survey').addEvent('click', function(){
		hide_survey_layer();
		var url = CgiRootUrl + '/survey.py';
		var paramData = {"serverid": ServerInfo['server_id'],
			"roleid": "<!--roleid-->",
			"orderid": LatestOrderInfo["orderid"]
		}
		formOpen(url, paramData);
	});
	$('btn_close_survey').addEvent('click', function(){
		hide_survey_layer();
	});
	show_over_layer();
	$('survey_pop_panel').setStyle('display', 'block');
	set_position_center($('survey_pop_panel'));
	window.onresize = function(){
		show_over_layer();
		set_position_center($('survey_pop_panel'));
	}
}

function hide_survey_layer(){
	window.onresize = null;
	$('pop_over').setStyle('display', 'none');
	$('survey_pop_panel').setStyle('display', 'none');
	Cookie.write('has_survey_poped', '1',  {'duration': 6/24, 'path': '/'});
}

