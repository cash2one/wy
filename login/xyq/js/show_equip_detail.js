/*
 *
 */
function fix_buy_btn()
{
	/*if(!equip["is_pass_fair_show"] || !equip["is_selling"]){
		$("buy_btn").innerHTML = "举报";
		$("buy_btn").setStyle("display", "none");
		$("buy_btn").addEvent("click", function(){
			var arg = {
				"act" : "report",
				"equip_id" : equip["equipid"],
				"server_id" : ServerInfo["server_id"]
			};
			
			var report_url = CgiRootUrl + "/reportequip.py?" + Object.toQueryString(arg);
			window.location.href = report_url;
			return false;
		});
		return;		
	};*/
	if(!equip["is_selling"]){
		$("buy_btn").setStyle("display", "none");
		return;
	}
		
	if (IsLogin){
		if(!equip["is_pass_fair_show"]){
			$("buy_btn").innerHTML = "预订-(加入购物车)";
			$("buy_btn").setProperty("tid", "web_fair_7_2");
			$("fairshow_buy_info").style.display = '';
		}
		$("buy_btn").addEvent("click", function(){
			var buy_hook = $("buy_btn").getAttribute("data_buy_hook");
			if (buy_hook){
				if (!eval(buy_hook + "()")){
					return false;
				}
			}
			if(!equip['is_pass_fair_show'] && !$('agree_fair_show_pay').checked){
				alert('同意公示期预定收费规则后，才能预定');
				return false;
			}
			if(equip['server_id'] != parseInt(ServerInfo["server_id"]) && 
				(test_server_list.contains(equip['server_id']) || test_server_list.contains(parseInt(ServerInfo["server_id"])))){
				var ret = confirm('您的角色所在服务器和该商品所在服务器属于不同的测试服版本，完成购买后商品暂时无法取出（藏宝阁有未取出商品时无法转服），每周二测试服更换后才能尝试取出，您确定要下单购买吗？');
				if(ret !== true){
					return false;
				}
			}
			document.equip_info.submit();
			return false;
		});
	} else {
		if(equip["is_pass_fair_show"]){
			$("buy_btn").innerHTML = "登录购买";
		} else {
			$("buy_btn").innerHTML = "登录预订";
		}
		$("buy_btn").addEvent("click", function(){
			var login_url = get_login_url({
				"equip_id" : $("equipid").value,
				"return_url" : window.location.href 
			});
			window.location.href = login_url;
			$("buy_btn").href = login_url;
			return false;
		});
	}
}

function fix_cannot_buy_info(){
	if(!equip["is_selling"] && equip.status != EQUIP_AUCTION){
		$("cannot_buy_info").setStyle("display", "inline");
	}
}

function detect_price_change()
{
	if (!IsLogin || !equip["is_selling"] || !equip["is_pass_fair_show"]){
		return;
	}
	
	var equipid = equip["equipid"];
	var game_ordersn = equip["game_ordersn"];
	var old_price = Cookie.read("identify_" + equipid);
	if(!old_price){
		old_price = Cookie.read('identify_' + game_ordersn);
	}

	if (old_price && (equip["price"] != old_price)){
		alert("该物品已经重新上架，请留意本页最新价格");
	}
	Cookie.dispose("identify_" + equipid);
	Cookie.dispose("identify_" + game_ordersn);
}

function gen_pet_detail_html()
{
	var pet_desc = JSON.decode($("equip_desc_value").value.trim());
	return render("pet_attr_templ", {"pet":pet_desc});
}

function get_skill_list(skill_str)
{
	skill_str = skill_str.trim();
	if (skill_str.length > 0){
		return skill_str.replace(/^;|;$/g, '').split(";");
	} else {
		return [];
	}
}

function do_evaluate()
{
	var eval_key = ServerInfo["server_id"] + "_" + equip["game_ordersn"];
	var arg = {
		"act" : "evaluate",
		"key" : eval_key,
		"type" : 1,
		"query_tag": CurQueryTag
	};	

	var show_eval_result = function(data, txt){
		if (data["status"] == 2){
			alert("您已经评价过了");
			return;
		} else if (data['status'] == 4){
			alert("请不要太快评价");
			return;
		} else if (data['status'] != 0){
			alert('评价失败！');
			return;
		} else {
			alert("评价成功！");
			$("evaluate_num").innerHTML = data["eval_num"];
			return;
		}
	};
	
	var url = CgiRootUrl + "/evaluate.py";
	var Ajax = new Request.JSON({"url":url,"onSuccess":show_eval_result});
	Ajax.post(arg);
	return false;		
}

function reg_evalute_events()
{
	$("btn_evaluate").addEvent("click", do_evaluate);
}

function add_events_for_collect()
{
	var el = $("btn_add_favorites");
	el.setProperty("tid", "web_share_1");
	if (!IsLogin){
		el.addEvent("click", login_to_collect);
		el.setStyle("display", "");	
		return;
	} else {
		el.addEvent("click", function(){show_collect_panel(); return false});
	}	
}

function get_seller_online_status()
{
	var display_online_status = function(data, txt){
		if (data["status"] ==1 && data["online_status"] == 1){
			$("seller_online_icon").setStyle("display", "");
			$("seller_online_icon").src = ResUrl + "/images/online.png";
		} else {
			$("seller_online_icon").destroy();
		}
	};
	
	var req_url =  CgiRootUrl + "/is_seller_online.py?act=query&token=" + equip["game_ordersn"];
	var Ajax = new Request.JSON({"url":req_url,"onSuccess":display_online_status});
	Ajax.get();
	
}

function display_seller_online_icon()
{
	if (!$("seller_online_icon")){
		return;
	}
	
	if (equip["is_seller_online"] == 1 && equip["is_pass_fair_show"]){
		$("seller_online_icon").setStyle("display", "inline");
		$("seller_online_icon").src = ResUrl + "/images/online.png";
	} else if (equip["is_seller_online"] == -1 && equip["is_pass_fair_show"]){
		$("seller_online_icon").setStyle("display", "none");
		get_seller_online_status();
		return;
	} else {
		$("seller_online_icon").destroy();
	}
}

function show_buy_tips()
{
	var if_display_more_btns = parseInt(equip["if_seller_have_more_equips"]);
	if (if_display_more_btns && $("btn_view_seller_more_equips")){
		$("btn_view_seller_more_equips").setStyle("display", "");
	}
	
	if (!IsLogin){
		return;
	}
	
	if (equip['status'] == EQUIP_AUCTION) {
		$("AuctionBuyTips").setStyle("display", "block");	
	} else if (equip["storage_type"] == StorageStype["money"]){
		$("MoneyBuyTips").setStyle("display", "block");	
	} else {
		$("OtherBuyTips").setStyle("display", "block");		
	}
}

function show_pay_qrcode(orderid_from_epay, buyer_urs)
{
	var pay_url = "https://epay.163.com/ul/orderPay.htm?orderId=" + 
		orderid_from_epay + "&ursId=" + buyer_urs;

	new QRCode($("pay_qrcode"), {
		text: pay_url,
		width: 160,
		height: 160,
		colorDark: "#000000",
		colorLight: "#ffffff",
		correctLevel: QRCode.CorrectLevel.L
	});
	$("pay_qrcode").title = ""; // The default tooltip is annoying
	
	// Fix for IE.
	var children = $('pay_qrcode').childNodes;
	for (var i = 0; i < children.length; ++i) {
		var child = children[i];
		if (child.nodeName.toLowerCase() == "table"){
			child.style.margin = '0px';
		}
	}

}

function reg_download_pay_tools_ev()
{
	$("epay_download_img").addEvent("mouseover", function(){
		$("download_epay_app").setStyle("display", "block");
	});

	$("epay_download_img").addEvent("mouseout", function(){
		$("download_epay_app").setStyle("display", "none");
	});

	$("mkey_download_img").addEvent("mouseover", function(){
		$("download_mkey_app").setStyle("display", "block");
	});

	$("mkey_download_img").addEvent("mouseout", function(){
		$("download_mkey_app").setStyle("display", "none");
	});

}

function init_qr_pay_info()
{
	// 未付款才显示二维码
	if (OrderInfo["status"] != ORDER_NO_PAY || OrderInfo["orderid_from_epay"].length == 0){
		return;
	}
	$("qr_pay_box").setStyle("display", "block");

	show_pay_qrcode(OrderInfo["orderid_from_epay"], OrderInfo["buyer_urs"]);
	reg_download_pay_tools_ev();

	// query order status
	var timer = null;
	function show_pay_result(data, txt){

		if (data["status"] == 1){
			if (timer){
				clearInterval(timer);
			}
			//alert("支付成功，正在返回结果");

			if (OrderInfo["is_cross_buy_order"]){
				var back_url = CgiRootUrl + "/userinfo.py?act=cross_server_orders"
			} else {
				var back_url = CgiRootUrl + "/userinfo.py?act=all_order"
			}
			//window.location.href = back_url;
			show_qr_pay_suc_msg(back_url);
		}
	};

	function check_order_status (){
		var url = CgiRootUrl + "/usertrade.py";
		var Ajax = new Request.JSON({"url":url,"onSuccess":show_pay_result,"noCache":true});
		Ajax.get({
			"act" : "if_order_is_paid",
			"orderid_to_epay" : OrderInfo["orderid_to_epay"]
		});
	}
	timer = setInterval(check_order_status, 1000);
}

function show_qr_pay_suc_msg(back_url)
{
	var popup = new Popup($("qr_pay_suc_msg"));
	popup.show()
	var counter = 3;
	function redirect_counter()
	{
		if (counter > 0){
			$("pay_suc_counter").set("html", counter);
			counter = counter - 1;
		} else {
			clearInterval(timer);
			window.location.href = back_url;	
		}
	}
	timer = setInterval(redirect_counter, 1000);
}
