function create_selling_html()
{
	return render("templ_selling_info", {"equip":equip});
}

function show_bargin_panel()
{
	$("bargin_price").value = equip["price"];
	
	update_bargin_msg();
	
	var cover = $("pageCover");
	var popup = $("popupWin");	
	
	$("bargin_price").value = $("bargin_price").getAttribute("data_price_msg");

	show_layer_center(cover, popup);
}

function show_want_buy_panel()
{
	$("want_buy_price").value = equip["price"];
	
	update_want_buy_msg();

	var cover = $("pageCover");
	var popup = $("popupWin");	

	$("want_buy_price").value = $("want_buy_price").getAttribute("data_price_msg");

	show_layer_center(cover, popup);
	return false;
}

function update_bargin_msg()
{
	var new_price = $("bargin_price").value.trim();
	if (new_price.length > 0){
		new_price = new_price.toInt();
		if (isNaN(new_price) || new_price <= 0){
			alert("您填写的价格有错误");
			return false;
		}
		
		if (new_price > equip["price"]){
			alert("还价价格要低于原价，请重新输入！");
			return false;
		}
	}
	
	if (new_price) {
		price_info = $("bargain_has_price_piece").value.replace("$price", new_price);
	} else {
		price_info = $('bargain_no_price_piece').value;
	}
	
	var from_server_name = ServerInfo.server_name;

	if (window.LoginInfo && LoginInfo.login){
		from_server_name = LoginInfo.server_name;
	}

	var msg = $("bargin_msg_templ").value.replace("$bargain_price_piece", price_info);
	msg = msg.replace("$from_server_name", from_server_name);
	var msg = msg.replace(/\n/g, "<br />\n");
	$("bargin_msg_panel").innerHTML = msg;
	
	$$('#popupWin a').setStyle('display', 'none');
}

function update_want_buy_msg()
{
	var new_price = $("want_buy_price").value.trim();
	if (new_price.length > 0){
		new_price = new_price.toInt();
		if (isNaN(new_price) || new_price <= 0){
			alert("您填写的价格有错误");
			return false;
		}
	}
	
	if (new_price) {
		price_info = $("bargain_has_price_piece").value.replace("$price", new_price);
	} else {
		price_info = $('bargain_no_price_piece').value;
	}
	
	var msg = $("want_buy_msg_templ").value.replace("$want_buy_price_piece", price_info);
	var msg = msg.replace(/\ /g, "&nbsp;");
	var msg = msg.replace(/\n/g, "<br />\n");
	$("want_buy_msg_panel").innerHTML = msg;
}

function check_default_bargin_msg()
{
	var msg = $("bargin_price").getAttribute("data_price_msg");
	if (msg == $("bargin_price").value){
		$("bargin_price").value = "";	
	}
}

function check_default_want_buy_msg()
{
	var msg = $("want_buy_price").getAttribute("data_price_msg");
	if (msg == $("want_buy_price").value){
		$("want_buy_price").value = "";	
	}
}

function reg_bargin_btn_event()
{
	if (!equip["can_bargin"]){
		return;
	}
	
	$("bargain_button").setProperty("tid", "web_share_2");
	if(IsLogin){
		$("bargain_button").addEvent("click", show_bargin_panel);
	} else {
		$("bargain_button").addEvent("click", alert_login);
	}
}

function reg_want_buy_btn_event()
{
	if(!$('want_offsale_btn'))
		return;

	if(IsLogin){
		$("want_offsale_btn").addEvent("click", show_want_buy_panel);
	} else {
		$("want_offsale_btn").addEvent("click", alert_login);
	}
}

function send_bargin_msg()
{
	var new_price = $("bargin_price").value.trim();
	if (new_price.length > 0){
		new_price = new_price.toInt();
		if (isNaN(new_price) || new_price <= 0){
			alert("您填写的价格有错误");
			return false;
		}
		
		if (new_price >= equip["price"]){
			alert("还价价格要低于原价，请重新输入！");
			return false;
		}
	}	
	var query_url = CgiRootUrl + "/message.py";
	var display_result = function(data, txt){
		alert(data["msg"]);
	};
	
	var Ajax = new Request.JSON({"url":query_url,"onSuccess":display_result});
	Ajax.get({
		"act" : "bargain_msg_add",
		"price" : $("bargin_price").value.trim(),
		"equipid" : equip["equipid"],
		"obj_server_id" : equip['server_id']
	});
	hidden_bargin_box();
}

function send_want_buy_msg()
{
	var new_price = $("want_buy_price").value.trim();
	if (new_price.length > 0){
		new_price = new_price.toInt();
		if (isNaN(new_price) || new_price <= 0){
			alert("您填写的价格有错误");
			return false;
		}
	}	
	var query_url = CgiRootUrl + "/message.py";
	var display_result = function(data, txt){
		alert(data["msg"]);
	};
	var add_collect = 0;
	if($('add_to_collect_check') && $('add_to_collect_check').checked)
		add_collect = 1;
	var Ajax = new Request.JSON({"url":query_url,"onSuccess":display_result});
	Ajax.get({
		"act" : "want_buy_msg_add",
		"price" : $("want_buy_price").value.trim(),
		"equipid" : equip["equipid"],
		"add_collect" : add_collect
	});
	hidden_want_buy_box();
}

function hidden_bargin_box()
{
	$("pageCover").setStyle("display", "none");
	$("popupWin").setStyle("display", "none");	
}

function hidden_want_buy_box()
{
	$("pageCover").setStyle("display", "none");
	$("popupWin").setStyle("display", "none");	
}

function fix_roleid(roleid)
{
	if (/^\-/.test(roleid)){
		return roleid.split("-")[1];
	} else {
		return roleid;
	}
}
