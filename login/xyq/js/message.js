var MSG_TYPE_NORMAL = 0;
var MSG_TYPE_BARGAIN = 1;
var MSG_TYPE_PRICE_DOWN = 2;

function msg_detail_page_init(){
	if(msg_type == MSG_TYPE_BARGAIN){
		var oper_btn = $('operator_btn');
		if(!oper_btn){
			return;
		}

		if(msg_bargain_status){
			oper_btn.innerHTML = '<a href="#">'+msg_bargain_status+'</a>';
		}else{
			oper_btn.innerHTML = '<a href="#" onclick="show_accept_bargain_box()">接受</a> <a href="#" onclick="show_refuse_bargain_box()">拒绝</a> <a href="#" onclick="show_malicious_bargain_box()">恶意还价</a>';
		}
		oper_btn.setStyle('display', 'block');
	}
}
	
function show_accept_bargain_box(){
	var cover = $("pageCover");
	var popup = $("acceptBargainPopupWin");	

	show_layer_center(cover, popup);
}

function show_refuse_bargain_box(){
	var cover = $("pageCover");
	var popup = $("refuseBargainPopupWin");	

	show_layer_center(cover, popup);
}

function show_malicious_bargain_box(){
	var cover = $("pageCover");
	var popup = $("maliciousBargainPopupWin");	

	show_layer_center(cover, popup);
}

function change_bargain_status(act){
	url = CgiRootUrl + '/message.py';
	
	params = {
		'act': act,
		'msgid': msg_id,
		'safe_code': safe_code
	}

	var ajax = new Request.JSON({
		"url": url,
		"onSuccess": function(data, txt) {
			if(data["status"] == 1){
				alert("操作成功");
				window.location.reload();
			}else{
				alert("操作失败："+data["msg"]);
			}
		},
		"onError": function(text, error) {
			alert("登录超时或者操作失败");
		}
	});

	ajax.post(params);
}

function accept_bargain(){
	change_bargain_status('accept_bargain');
}

function refuse_bargain(){
	change_bargain_status('refuse_bargain');
}

function malicious_bargain(){
	var radios = $$('input[name=maliciousBargainRadio]:checked');
	if(!(radios && radios.length > 0)){
		alert('请选择期望的处理方式');
	}

	var opt = radios[0].get('value');
	if(opt == 'ignore'){
		refuse_bargain();
	}else if(opt == 'forbidden'){
		change_bargain_status('forbid_bargain');
	}
}

function hidden_accept_bargain_box()
{
	$("pageCover").setStyle("display", "none");
	$("acceptBargainPopupWin").setStyle("display", "none");	
}

function hidden_refuse_bargain_box()
{
	$("pageCover").setStyle("display", "none");
	$("refuseBargainPopupWin").setStyle("display", "none");	
}

function hidden_malicious_bargain_box()
{
	$("pageCover").setStyle("display", "none");
	$("maliciousBargainPopupWin").setStyle("display", "none");	
}
