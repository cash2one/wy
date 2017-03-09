var MaxTradeYuan = 500000;

function getPara(paraName)
{
	var urlPara = location.search.slice(1);
	var result = new RegExp( '(?:^|&)(' + encodeURIComponent(paraName) + ')=([^&]*)', 'g').exec(urlPara);
	
	return result ? decodeURIComponent(result[2]) : "";
}

function getAbsolutePos(el)
{
		var SL = 0, ST = 0;
		var is_div = /^div$/i.test(el.tagName);
		if (is_div && el.scrollLeft)
				SL = el.scrollLeft;
		if (is_div && el.scrollTop)
				ST = el.scrollTop;

		var r = { x: el.offsetLeft - SL, y: el.offsetTop - ST };
		if (el.offsetParent) 
		{
				var tmp = getAbsolutePos(el.offsetParent);
				r.x += tmp.x;
				r.y += tmp.y;
		}
		return r;
};

function isEmptyObject(obj){
	for(var name in obj)
		return false;
	return true;
}

function setSelect(selobj, value)
{
	for (var i=0; i<selobj.length; i++)
	{
		if (selobj.options[i].value == value || selobj.options[i].value + "省" == value || selobj.options[i].value + "区" == value || selobj.options[i].value + "市" == value)
			selobj.options[i].selected = true;
		else
			selobj.options[i].selected = false;
	}
}
function set_select_by_text(sel_obj, target_text, sublength)
{
	target_text = target_text.substr(0, sublength);
	var hit = false;
	for (var i=0; i < sel_obj.length; i++)
	{
		var option_text = sel_obj.options[i].text;
		option_text = option_text.substr(0, sublength)
		if (target_text == option_text)
		{
			sel_obj.options[i].selected = true;
			hit = true;
		}
		else
		{
			sel_obj.options[i].selected = false;
		}
	}

	return hit;
}

function htmlEncode(s) {
		var str = new String(s);
		str = str.replace(/&/g, "&amp;");
		str = str.replace(/</g, "&lt;");
		str = str.replace(/>/g, "&gt;");
		str = str.replace(/"/g, "&quot;");
		return str;
}

function load_user_menu(url)
{
	window.location = url;
}

function clear_old_cookie_var()
{
	Cookie.dispose("main_menu_id");
	Cookie.dispose("left_menu_id");
	Cookie.dispose("msg_box_flag");
	if (Cookie.read("wallet_tips") == 2){
		Cookie.dispose("wallet_tips");
	}
}


function transform_newline(content)
{
	return content.replace(/#r/g, "<br>");
}

//密保卡随机密码
function checkppc(ppc) {
	return /^\d{3,9}$/.test(ppc); 
}

//将军令随机密码
function checkotp(otp) {
	return /^\d{6}$/.test(otp); 
}


function get_select_value(select_id)
{
	var s = $(select_id);
	var index = s.selectedIndex;
	var val = s.options[index].value;
	return val;
}
function get_select_text(select_id)
{
	var s = $(select_id);
	var index = s.selectedIndex;
	var val = s.options[index].text;
	return val;
}

var Template = new Class({
	initialize: function(template_id, isStrMode){		
		this.options = {
			"tag_re": /<%=?(.*?)%>/g
		};
		this.template = isStrMode ? template_id : this.get_template_source(template_id);		
		this.function_body = null;
	},
	
	get_template_source : function(el_id){
		return $(el_id).innerHTML.trim().replace(/^<!--|-->$|\n|\r/g, "");	
	},

	render_to_replace : function(panel_id, data_obj){
		$(panel_id).innerHTML = this.render(data_obj);
	},

	render : function(data_obj){
		var context   = new Object();
		context = Object.merge(context, data_obj);
		context.__run = this.compile();
		return context.__run();
	},
	
	get_js_src : function(){
		if (!this.function_body){
			this.compile();
		}
		return this.function_body;	
	},
	
	compile: function(){
		var start = 0;  
		var delimeter = '_%_';  
                     
		var body = this.template.replace(
				this.options.tag_re, 
				function (matchedString, group, offset, fullString){
					var replace = delimeter + ";\n";
					if (matchedString.charAt(2) == "="){
						replace += "  __out += " + group + ";\n";
					}else{
						replace += "  " + group + "\n";
					}
					replace += "  __out += " + delimeter;
					return replace;
				}
		)
                  
		var functionBody = "__out += " + delimeter 
				+ body + delimeter + ";\n" + "return __out.join(" + delimeter  + "" + delimeter + ");\n";

		// Convert ' to \' and then change the delimeter to '
		functionBody = functionBody.replace(/'/g, "\\'");
		var regex = new RegExp(delimeter, 'g');
		functionBody = functionBody.replace(regex, "'");

		var re_replace = function foo($1){return "__out.push(" + $1.match(/^__out\s\+\=\s(.*);$/)[1] + ");";};
		this.function_body = "var __out = new Array();" + functionBody.replace(/__out\s\+\=\s(.*);/g, re_replace); 
		// Compile our function and return it
		return new Function(this.function_body);
	}
	
});

function render(template_id, data)
{
	var obj = new Template(template_id);
	return obj.render(data);
}

function render_to_replace(panel_id, template_id, data)
{
	$(panel_id).innerHTML = render(template_id, data);
}

function lpc_2_js(lpc_str){
	var convert_dict = {
		"(["  : "{",
		"])"  : "}",
		",])" : "}",
		
		"({"  : "[",
		"})"  : "]",
		",})" : "]"
	};
	function convert($1){
		var match_str = $1.replace(/\s+/g, '');
		return convert_dict[match_str];
	}
	var parser = new RegExp("\\(\\[|,?\s*\\]\\)|\\({|,?\\s*}\\)", 'g');
	return lpc_str.replace(parser, convert);
}

function js_eval(js_str){
	return eval("(" + js_str + ")");
}

function safe_attr(attr){
	if(attr == null || attr==undefined){
		return "";
	} else {
		return attr;
	}
}

function set_position_center(obj)
{
	obj_width = obj.offsetWidth;
	obj_height = obj.offsetHeight;
	with(obj.style)
	{
		left = document.getScroll().x + (document.documentElement.clientWidth - obj_width)/2 + "px";
		top = document.getScroll().y + (document.documentElement.clientHeight - obj_height)/2 + "px";
	}
}

function show_layer_center(cover_el, popup_el)
{
		cover_el.setStyle("height", Document.getScrollHeight());
    cover_el.setStyle("display", "block"); //设置页面遮罩层显示
    popup_el.setStyle("display", "block");
    popup_el.setStyles({
        "left" : ((Window.getWidth() - popup_el.getWidth())/2) + "px",
        "top"  : (Window.getHeight() - popup_el.getHeight())/2 + Window.getScrollTop() + "px"
    });	
}

function get_documentsize()
{
	var size = Object();
	with(document.documentElement)
	{
		size.width = (scrollWidth>clientWidth)?scrollWidth:clientWidth;
		size.height = (scrollHeight>clientHeight)?scrollHeight:clientHeight;
	}
	return size;
}


//maybe need to consider that onunload,onbeforeunload has already been used
function effect_back_js(func) 
{
	if(navigator.userAgent.indexOf("Firefox")>0)
	{
		window.onunload = func;
		window.onbeforeunload=function(){window.onunload = '';}
	}
}

function dateDiff(interval, date1, date2)
{
	var objInterval = {'D' : 1000 * 60 * 60 * 24, 'H' : 1000 * 60 * 60, 'M' : 1000 * 60, 'S' : 1000, 'T' : 1};
	interval = interval.toUpperCase();
	var dt1 = Date.parse(date1.replace(/-/g, '/'));
	var dt2 = Date.parse(date2.replace(/-/g, '/'));
	return Math.round((dt2 - dt1) / objInterval[interval]);
} 

function get_radio_value(radio_name)
{   
	var radio_box = document.getElementsByName(radio_name);
	if(radio_box!=null){
		for(var i=0;i<radio_box.length;i++){
			if(radio_box[i].checked){
					return radio_box[i].value;
			}
		}
	} else {
		return null;
	}
}

function get_color_price(price, if_add_unit) /* yuan */
{
	if (!+price) {
		return '---';
	}
	var cls = "p100"; 
	var unit = if_add_unit ? "（元）" : "";
	if(price < 100){
		cls = "p100"
	}
	else if(price >= 100 && price < 1000){
		cls = "p1000";
	}
	else if(price >= 1000 && price < 10000){
		cls = "p10000";
	}
	else if(price >= 10000 && price < 100000){
		cls = "p100000";
	}
	else if(price >= 100000){
		cls = "p1000000";
	}
	return "<span class='" + cls + "'>￥" + price.toFixed(2) + unit + "</span>"
}

var StorageStype = {"equip":1,"pet":2,"money":3,"role" :4};

function get_login_url(other_arg)
{
	var server_name = ServerInfo["server_name"];
	var servername_in_ck = decodeURIComponent(Cookie.read("cur_servername") || "");
	if (servername_in_ck){
		server_name = servername_in_ck;
	}

	var arg = {
		"act" : "show_login",
		"area_name" : ServerInfo["area_name"],
		"area_id" : ServerInfo["area_id"],
		"server_id" : ServerInfo["server_id"],
		"server_name" : server_name
	};
	
	if (other_arg){
		for (var name in other_arg){
			arg[name] = other_arg[name];
		}
	}
	
	return CgiRootUrl + "/show_login.py?" + Object.toQueryString(arg);
}

//		"return_url" : window.location.href

function logout(url)
{
	clear_old_cookie_var();
	window.location = url;
}

function check_offsale_equips(){
	if(!is_user_login())
		return;

	var alert_flag = Cookie.read("remind_offsale");
	if (alert_flag)
		return;

	Cookie.write("remind_offsale", 1, {'duration':1});
	
	alert_flag = Cookie.read("alert_msg_flag");
	if (alert_flag)
		return;

	var offsale_equips_num = Cookie.read('offsale_num');
	if(!offsale_equips_num)
		return;
	offsale_equips_num = offsale_equips_num.toInt();
	if (offsale_equips_num <= 0 )
		return;

	Cookie.write("remind_offsale", 1, {'duration':4});
	Cookie.write("alert_msg_flag", 1);

	if (window.confirm("藏宝阁提醒您：您有"+offsale_equips_num+"件商品长时间未上架，准备将其重新上架？")){
		window.location.href = CgiRootUrl + '/userinfo.py?act=my_equips';
		return;
	}
}

function check_user_msg()
{
	if (!is_user_login()){
		return;
	}
	var new_msg_num = Cookie.read("new_msg_num");
	if (!new_msg_num){
		return;
	}
	
	new_msg_num = new_msg_num.toInt();
	if (new_msg_num <=0 ){
		return;
	}

	var alert_flag = Cookie.read("alert_msg_flag");
	if (alert_flag){
		return;
	}
	Cookie.write("alert_msg_flag", 1);

		
	if (window.confirm("藏宝阁提醒您：您有新的消息，请注意查收。")){
		window.location.href = CgiRootUrl + '/message.py?act=msg_list';
		return;
	}
}

function alert_login()
{
	if (confirm("登录后才能进行该项操作!\n您要登录吗？") == true){
		window.location.href = get_login_url();
		return false;	
	}	
	return false;
}

function fix_anonymous_menu_link()
{
	// IE7 下 is_user_login 判断不准确，待优化
	if (is_user_login()){
		return;
	}
  
	$$("#top_sell_menu_a").addEvent("click", alert_login);
	$$("#top_mycbg_menu_a").addEvent("click", alert_login);
	$$("#to_login_link").set('href', get_login_url({}));
	$$("#top_fairshow_menu_a").set('href', $("top_fairshow_menu_a").href +'&server_id='+ServerInfo["server_id"]);
	if($('sub_offsale_query_a'))
		$("sub_offsale_query_a").href = $("sub_offsale_query_a").href +'&server_id='+ServerInfo["server_id"];
	if($('menu_my_order'))
		$('menu_my_order').addEvent('click', alert_login);
	
	if ($("sub_menu_appointed_to_me")){
		$("sub_menu_appointed_to_me").addEvent("click", alert_login);
	}
}

var EQUIP_TAKE_BACK = 0;
var EQUIP_STORE = 1;
var EQUIP_SELLING = 2;
var EQUIP_BOOKING = 3;
var EQUIP_PAID = 4;
var EQUIP_TRADE_FINISH = 5;
var EQUIP_TAKE_AWAY = 6;
var EQUIP_PROBLEM_TRADE = 7;
var EQUIP_AUCTION = 8;

var EquipStatus = {};
EquipStatus[EQUIP_TAKE_BACK] =  "已取回";
EquipStatus[EQUIP_STORE] =  "未上架";
EquipStatus[EQUIP_SELLING] =  "上架中";
EquipStatus[EQUIP_BOOKING] =  "被下单";
EquipStatus[EQUIP_PAID] =  "已卖出";
EquipStatus[EQUIP_TRADE_FINISH] =  "已卖出";
EquipStatus[EQUIP_TAKE_AWAY] =  "已卖出";
EquipStatus[EQUIP_PROBLEM_TRADE] =  "问题物品";
EquipStatus[EQUIP_AUCTION] = "拍卖中";


var ORDER_NO_PAY = 1;
var ORDER_PAIED = 2;
var ORDER_CANCEL = 3;
var ORDER_EXPIRED = 4;
var ORDER_REFUNDMENT = 5;
var ORDER_SUCCESS = 6;
var ORDER_REFUNDMENT_FINISH = 7;

var OrderStatus = {};
OrderStatus[ORDER_NO_PAY] = "待付款";
OrderStatus[ORDER_PAIED] = "已付款";
OrderStatus[ORDER_CANCEL] = "已废除";
OrderStatus[ORDER_EXPIRED] = "过期";
OrderStatus[ORDER_REFUNDMENT] = "退款中";
OrderStatus[ORDER_SUCCESS] = "交易成功";
OrderStatus[ORDER_REFUNDMENT_FINISH] = "已退款";

var AUCTION_BIDDING = 1;
var AUCTION_BOOKED = 2;
var AUCTION_PAID = 3;
var AUCTION_OPEN_BUY = 4;
var AUCTION_OPEN_BUY_PAID = 6;
var AUCTION_ABORT = 7;
var AUCTION_CANCEL = 8;

var AuctionStatus = {};
AuctionStatus[AUCTION_BIDDING] = '拍卖中';
AuctionStatus[AUCTION_BOOKED] = '拍卖结束，等待付款';
AuctionStatus[AUCTION_PAID] = '已拍卖售出';
AuctionStatus[AUCTION_OPEN_BUY] = '拍卖结束，买家未付款\n抢付中';
AuctionStatus[AUCTION_OPEN_BUY_PAID] = '抢付成功';
AuctionStatus[AUCTION_ABORT] = '流拍';
AuctionStatus[AUCTION_CANCEL] = '取消';


function get_window_height()
{
	return Window.getHeight() + Document.getScrollTop();
}

function adjust_tips_position(el, tips_box, fixes)
{
	if (tips_box){
		var TipsBox = tips_box;
	} else {
		var TipsBox = $("TipsBox");
	}
	
	TipsBox.setStyle("display", "block");
	
	var styles = {"left" : el.getOffsets()["x"] + el.getWidth() + 8};
	
	var position = el.getCoordinates();
	
	var left_pos_check = Window.getWidth() + Document.getScrollLeft();
	if ((styles["left"] + TipsBox.getWidth()) > left_pos_check){
		styles["left"] = position["left"] - TipsBox.getWidth() - 8;
	}
	
	if (position["top"] + TipsBox.getHeight() > get_window_height()){
		
		var check_pos = position["top"] - TipsBox.getHeight() + el.getHeight();		
		if (check_pos > Document.getScrollTop()){
			styles["top"] = check_pos;
		} else {
			styles["top"] = Document.getScrollTop() + 10;
		}
		
	} else {
		styles["top"] = position["top"];	
	}

	if(fixes){
		if(fixes['top'])
			styles['top'] += fixes['top'];
		if(fixes['left'])
			styles['left'] += fixes['left'];
	}

	TipsBox.setStyles(styles);
}

function get_window_width(){
	return Window.getWidth() + Document.getScrollLeft();
}

function adjust_tips_position_width(el, tips_box)
{
	if (tips_box){
		var TipsBox = tips_box;
	} else {
		var TipsBox = $("TipsBox");
	}
	TipsBox.setStyle("display", "block");
	var styles = {};
	var position = el.getCoordinates();
	if(position["left"] + TipsBox.getWidth() > get_window_width()){
		var check_pos = position["left"] - TipsBox.getWidth() + el.getWidth();
		if(check_pos > Document.getScrollLeft()){
			styles["left"] = check_pos;
		} else {
			styles["left"] = Document.getScrollLeft() + 10;
		}
	} else {
		styles["left"] = position["left"];
	}
	styles["top"] = position["top"] +  el.getHeight() + 8;
	TipsBox.setStyles(styles);
}

function trim(str)
{
	return str.replace(/(^\s*)|(\s*$)/g, "");
}


var OtpRexp = /^\d{6}$/;
var PpcRexp = /^\d{3,9}$/;
var MobileRexp = /^1\d{10}$/;
var MobileValidCodeRexp = /^\d{6}$/;

function checkMobileMb(mb_type){
	if(mb_type == 'otp'){
		if(!$('otp_input').value){
			alert('请输入将军令');
			return false;
		}
		if(!OtpRexp.test($('otp_input').value)){
			alert('将军令格式错误');
			return false;
		}
	}
	else if(mb_type == 'ppc'){
		if(!$('ppc_input').value){
			alert('请输入密保卡密码');
			return false;
		}
		if(!PpcRexp.test($('ppc_input').value)){
			alert('密保卡密码格式错误');
			return false;
		}

	}
	return true;
}


function is_user_login()
{
	// IE7 经常读不了某些 Cookie，这里优化根据 head 输出的 IsLogin 变量来判断是否登录
	if (window.IsLogin === 1){
		return true;
	}
	var is_login = parseInt(Cookie.read("is_user_login"));
	//var user_nickname = Cookie.read("login_user_nickname");
	var login_user_roleid = Cookie.read("login_user_roleid");
	if (is_login == 1 && login_user_roleid){
		return true;	
	} else {
		return false;	
	}
}

function gen_login_info()
{
	var ctx = {};
	if (is_user_login()){
		ctx["is_user_login"] = true;
		ctx["login_user_nickname"] = decodeURIComponent(Cookie.read("login_user_nickname"));
		ctx["login_user_icon"] = Cookie.read("login_user_icon"); 
		ctx["new_msg_num"] = parseInt(Cookie.read("new_msg_num")); 
		ctx["login_user_roleid"] = Cookie.read("login_user_roleid"); 	
	} else {
		ctx["is_user_login"] = false;
	}
	var servername_in_ck = decodeURIComponent(Cookie.read("cur_servername"));
	var cur_servername = null;
	var name_list = cur_server_info["servername"];
	for (var i=0; i < name_list.length; i++){
		if (servername_in_ck == name_list[i]){
			cur_servername = name_list[i];	
		}	
	}
	
	if (!cur_servername){
		cur_servername = name_list[0];
	}
	ctx["cur_servername"] = cur_servername;
	ctx["cur_areaname"] = cur_area_info["areaname"];
	
	return render("login_info_templ", ctx);		
}

function gen_msg_num_html(msg_num)
{
	var msg = "站内信";
	if (msg_num > 0){
		msg += "(<span class='cYellow'>" + msg_num + "</span>)"; 
	}
	return msg;
}

function fix_buy_menu_url()
{
	if (!$("top_buy_menu_a")){
		return false;
	}

	// 登录用户有推荐内容时，优先显示推荐
	var recommend_url = Cookie.read('recommend_url');
	var go_recommend_page = function(){
		window.location = recommend_url;
		return false;
	};
	if (recommend_url){
		if ($("top_buy_menu_a")){
			$("top_buy_menu_a").addEvent("click", go_recommend_page);
		}

		if ($("common_query_a")){
			$("common_query_a").addEvent("click", go_recommend_page);
		}
		return false
	}

	//其它情况，如果首页静态页面启用，则跳转首页静态页面
	if (!StaticFileConfig["is_using"]){
		return false;
	}
	var goto_query_page = function(){
		window.location = StaticFileConfig["res_root"] + "/" + ServerInfo["server_id"] + "/buy_equip_list/equip_list1.html";
		return false;
	};
	$("top_buy_menu_a").addEvent("click", goto_query_page);
	if($("common_query_a"))
		$("common_query_a").addEvent("click", goto_query_page);
}

function add_latest_view(serverid, equipid){
	var equipids = Cookie.read('latest_views') || '';
	var sp = equipids.split('-');
	var new_one = serverid + '_' + equipid;
	var pos1 = equipids.indexOf(new_one);
	if(pos1 != -1){
		var pos2 = pos1 + new_one.length;
		if(pos1 > 0)
			pos1--;
		else
			pos2++;
		equipids = equipids.substring(0, pos1) + equipids.substring(pos2);
	}
	else{
		if(sp.length >= 20)
			equipids = equipids.substring(equipids.indexOf('-')+1);
	}
	if(equipids != '')
		equipids += '-' + new_one;
	else
		equipids += new_one;
	Cookie.write('latest_views', equipids, {'duration': 30, 'path': '/'});
}


function gen_latest_view()
{
	var panel_el = $("recent_list_panel");
	
	var load_status = panel_el.getAttribute("loaded");
	if(load_status=="success" || load_status=="loading"){
		return;
	}
	
	var latest = Cookie.read("latest_views");
	if(latest == null || latest == ''){
		render_to_replace('recent_list_panel', 'recent_empty_templ', {});
		return;
	}
	var equips = latest.split('-');
	var equipids = '';
	var equip_cnt = 0;
	var equipids_sp = new Array();
	for(var i=equips.length-1; i>=0; i--){
		var e =  equips[i].split("_");
		if(ServerInfo['server_id'] == e[0]){
			equipids += ','+e[1];
			equip_cnt += 1;
			equipids_sp.push(e[1]);
			if(equip_cnt >= 10){
				break;
			}
		}
	}
	if(equipids == ''){
		render_to_replace('recent_list_panel', 'recent_empty_templ', {});
		return;
	}
	var url = CgiRootUrl + '/equipquery.py';
	var params = {
		"act": "latest_view",
		"equipids": equipids}
	var ajax = new Request.JSON({"url":url,
		"onSuccess": function(data, txt){
			latest_view_callback(data,txt,equipids_sp);
		},
		"onError": function(text, error){
			alert("登录超时或查询错误！");
			render_to_replace("recent_list_panel", "recent_empty_templ", {});
		}
	});
	panel_el.setAttribute("loaded", "loading");
	render_to_replace('recent_list_panel', 'recent_load_templ', {});
	ajax.get(params)
}

function latest_view_callback(result, txt, equipids_sp)
{	
	if(result["status"] != 0){
		panel_el.setAttribute("loaded", "error");
		alert('查询出错！' + result['msg']);
		return;
	}
	var equips = js_eval(result['msg']);
	render_to_replace('recent_list_panel', 'recent_list_templ', 
		{'equips': equips, 'order': equipids_sp});
	$("recent_list_panel").setAttribute("loaded", "success");
}

function save_equip_price_info(equipid, price)
{
	var identify = "identify_" + equipid;
	
	// create ck value
	var ck_value = price;
	var ck_time = 10 * (1 / (24 * 60 * 60));
	Cookie.write(identify, ck_value, {"duration":ck_time});
}


function gen_ad_html()
{
	if (window.NoAdInfo==true){
		return;
	}
	
	var area_list = $$(".area");
	if (area_list.length != 3){
		return;
	};

	if(!window.xyq_ad_list 
		|| !xyq_ad_list.bottom_ad 
		|| xyq_ad_list.bottom_ad.length == 0) 
		return;

	var ad_data = xyq_ad_list.bottom_ad;

	// create ad html
	var ul_html = "<ul>";
	var nav_html = "<div>";
	for (var i=0; i < ad_data.length; i++){
		var item = ad_data[i];
		ul_html += "<li><a href='"+item.link_url+"' target='_blank' title='"+""+"' tid=\"web_bottom_1\"" + "data_trace_text='" + item.id + "'><img width='920' height='50' src='"+item.image_url+"' alt='"+ "" +"' /></a></li>";
		nav_html += "<a href='"+item.link_url+"'>"+(i+1)+"</a>";		
	}	
	nav_html += "</div>";
	ul_html += "</ul>";
	
	if (ad_data.length > 1){
		var ad_html = ul_html + nav_html;
	} else {
		var ad_html = ul_html;
	}
	
	var blank_el = new Element("div", {"class":"blank12 hasLayout"});
	blank_el.inject(area_list[1], "bottom");
				
	var el = new Element("div", {"id":"cbg_bottom_ad", "class":"slide"});
	el.inject(area_list[1], "bottom");
	el.set("html", ad_html);

	var movie = $$("#cbg_bottom_ad ul")[0];
	var nav_list = $$("#cbg_bottom_ad div a");
	
	// add auto play event
	var switch_start = 1;
	var switch_delay = 5000;
	var auto_switch = function(){
		
		// deal nav
		for (var i=0; i < nav_list.length; i++){
			if (switch_start == i){
				nav_list[i].addClass("on");
			} else {
				nav_list[i].removeClass("on");
			}
		}
		
		movie.tween("top", switch_start * (-50));
		
		switch_start = switch_start + 1;
		if (switch_start == ad_data.length){
			switch_start = 0;
		}
	};
	
	var timer_obj = null;
	if (ad_data.length > 1){
		nav_list[0].addClass("on");

		timer_obj =setInterval(auto_switch, switch_delay);
	
		// add nav event
		nav_list.each(function(el, idx){
	
			el.addEvent("click", function(){return false});
		
			el.addEvent("mouseover", function(){
				clearInterval(timer_obj);
				switch_start = idx;
				auto_switch();	
			})
		
			el.addEvent("mouseout", function(){
				timer_obj =setInterval(auto_switch, switch_delay);
			})
		});
	};
	
}

window.addEvent('domready', function() {
    gen_ad_html();
});


//gen cart info
function show_shop_cart_info()
{
	if ((window.IsLogin || is_user_login())
		&& $("buy_cart_panel")){
		$("buy_cart_panel").setStyle("display", "block");
		var order_num = Cookie.read("unpaid_order_num");
		if (!order_num){
			return;
		}
		order_num = order_num.toInt();
		if (order_num > 0){
			$("cart_order_num").set("html", "(" + order_num + ")");
		}
	}
}

function show_wallet_guide() {
	if (!is_user_login()) {
		return;
	}
	
	var WELLET_BALANCE_TIPS = 1;
	var WELLET_LOCKED_TIPS = 2;
	var tipsContent;
	
	if (WalletData.is_locked) {
		if (Cookie.read("wallet_tips") != WELLET_LOCKED_TIPS) {
			tipsContent = '您的钱包已被锁定，请<a href="'
				+ WalletData.customer_service_url
				+ '" target="_blank" class="cPink" style="margin-left:2px;">联系客服</a>';
			Cookie.write("wallet_tips", WELLET_LOCKED_TIPS, {duration: 0});
		}
	} else if(WalletData.balance > 0) {
		if (Cookie.read("wallet_tips") != WELLET_BALANCE_TIPS) {
			tipsContent = '卖出商品所得金额将实时存入钱包，钱包余额可用于购买，提现。';
			Cookie.write("wallet_tips", WELLET_BALANCE_TIPS);
		}
	}

	var target = $$('.userInfo .title')[0];
	if (tipsContent && target){
    var el_guide = new Element("div#balanceChangeTips.balanceChangeTips.tipsBlack.popArrowUp");
    var html = [
      '<div class="tipsContent">',
        tipsContent,
      '</div>',
      '<div class="tipsAction">',
        '<button>我知道了</button>',
      '</div>'
    ].join('');
    el_guide.inject(document.body);
    
    var coordinates = target.getCoordinates();
    el_guide.set("html", html);
    el_guide.setStyles({
      "top": coordinates.bottom + 8 + "px",
      "left": coordinates.left - 35 + "px"
    });
    el_guide.getElement("button")
      .addEvent("click", function(){
        el_guide.setStyle("display", "none");
        WebGuide.next();
      });
	}
}
function init_get_money (){
	var dialog;
	var timer = null;

	function getHtml(){
		var html = [
			'<div style="position:relative;width:453px;margin:20px;border:1px solid #bdbfdb;background:#ededf4;">',
				'<div style="float:left;width:185px;padding:12px 20px;border-right:1px solid #bdbfdb;line-height:1.8;">',
					'<h2 class="f14px fB" style="margin:2px 0 8px;">',
						'当前可提现：<span class="cDRed">',
							fen2yuan(Math.max(WalletData.free_balance, 0)),
						'元</span>',
					'</h2>',
					'<p class="cDGray">',
						'<strong>可提现余额少于钱包余额？</strong><br/>',
						'卖出商品所得金额需经过72小时考察后方可提现，因此可提现余额有可能暂时少于钱包余额。<br/>',
						'<a href="/help/help33.html" target="_blank">提现有疑问？</a>',
					'</p>',
					
				'</div>',
				'<div style="float:left;width:185px;margin-left:-1px;padding:20px;border-left:1px solid #bdbfdb;text-align:center;font-size:14px;">',
					'<h2 class="f14px fB">提现金额：</h2>',
					'<p style="margin:20px 0;white-space:nowrap;">',
						'<input type="text" placeholder="免手续费" id="get_money_count" style="width:148px" /> 元',
					'</p>',
					'<p><a href="#" class="btn1 disabled" id="submit_get_money">提交</a></p>',
				'</div>',
				'<div style="position:absolute;left:0;bottom:-20px;width:100%;text-align:center;">',
					'<span id="get_money_tips" style="display:none;font-size:14px;color:#fff;line-height:34px;padding:0 18px;border-radius:17px;background:#000;">请输入需要存入的金额</span>',
				'</div>',
				'<div style="clear:both"></div>',
			'</div>',
			'<div class="recommandWrp popupDialogRecmmds2" style="margin:20px;"',
      '  data_title="为您精选"',
      '  data_per="4"',
      '  equip_refer="51"',
      '  view_loc="wallet_epay_select"',
      '>',
      '  <textarea style="display: none" class="params">',
      '    {"act": "recommd_by_collects", "count": 8, "max_price": '+ (window.WalletData && WalletData.balance || 0) +'}',
      '  </textarea>',
      '</div>'
		];
		return html.join('');
	}

	function initEvents(){
		$("get_money_count").addEvent("keyup", function(){
			var amount = this.value;
			if(amount.charAt(0) == '.'){
				this.value = '0' + amount;
			}
			if(amount == 0) {
				$("submit_get_money").addClass("disabled");
			} else {
				$("submit_get_money").removeClass("disabled");
			}
			
		});
		$("submit_get_money").addEvent("click", function(){
			var value = $('get_money_count').value;
			if(!value 
				|| value.trim() == '' 
				|| isNaN(value) 
				|| parseFloat(value) <= 0){
				showTips("请检查输入提现金额");
			} else if(!/^\d*(\.\d{1,2})?$/.test(value.trim())){
				showTips('抱歉，提现的最小单位是分');
			} else {
				var amount = yuan2fen(value);
				if(amount > WalletData.free_balance) {
					showTips("最多可提现" + fen2yuan(Math.max(WalletData.free_balance, 0)) + "元，您已超出，请修改金额");
				} else {
					showConfrim(amount);
				}
			}
		});
	}

	function showTips(content){
		var el_tips = $("get_money_tips");
		el_tips.set("html", content);
		el_tips.setStyle("display", "inline-block");
		timer && clearTimeout(timer);
		timer = setTimeout(function(){
			el_tips.setStyle("display", "none");
		}, 3000);
	}
	
	function showConfrim(amount){
		var tmpl = [
			'<div style="padding:14px 24px;font-size:14px;line-height:1.7;">',
				'<p style="padding:6px 12px 6px 0">',
					'您提现至网易支付的金额为：',
					'<span class="cDRed fB" style="margin-right:2px;">',
						fen2yuan(amount),
					'</span>',
					'元，是否确认提现？',
				'</p>',
				'<div class="divider" style="margin:14px 0;"></div>',
				'<div class="textCenter">',
					'<a id="btn_confrim_get_money" class="btn1" href="javascript:;">确认提现</a>',
				'</div>',
			'</div>'
		].join('');
		var confirmDialog = new PopupDialog("提示", tmpl);
		confirmDialog.show();
		$('btn_confrim_get_money').addEvent('click', function(){
			confirmDialog.hide();
			submit(amount);
		});
	}
	
	function showAuthenticationTips(){
		var tmpl = [
			'<div style="padding:14px 24px;font-size:14px;line-height:1.7;">',
				'<p style="text-indent:2em;">抱歉，您还没有在网易支付进行实名认证，余额无法提现，<br>请认证后再操作。</p>',
				'<div class="divider" style="margin:14px 0;"></div>',
				'<div class="textCenter"><a class="btn1" href="https://epay.163.com/i.htm?popup=1" target="_blank">前往认证</a></div>',
			'</div>'
		].join('');
		new PopupDialog("提示", tmpl).show();
	}
	
	function showSuccessTips(){
		var tmpl = [
			'<div style="padding:14px 24px;text-align:center;font-size:14px;line-height:1.7;">',
				'<img src="/images/qr_pay_suc.png">',
				'<p style="margin:16px 4px;">提现成功，您可以继续去网易支付提现到银行卡。</p>',
				'<div class="divider" style="margin:14px 0;"></div>',
				'<div class="textCenter">',
					'<a class="btn1" href="https://epay.163.com/servlet/controller?operation=drawCashView" target="_blank">提现至银行卡</a>',
				'</div>',
			'</div>'
		].join('');
		new PopupDialog({
			title: '提示',
			content: tmpl,
			onClose: function(){
				location.reload();
				return true;
			}
		}).show();
	}

	function submit(amount){
		var url = CgiRootUrl + "/usertrade.py?act=ajax_cbg_wallet_withdraw";
		var params = {"amount_fen": amount};
		var req = new Request.JSON({"url": url, 
		onSuccess: function(result){
			if(result.status != 1){
				if(result.need_guide_epay_identity){
					showAuthenticationTips();
				} else {
					showTips(result.msg);
				}
			} else {
				showSuccessTips();
			}
		}, onFailure: function(){
			showTips('访问出错');
		}, "noCache": true, "async": false});
		req.get(params);
	}

	var btn_get_money = $("btn_get_money");
	btn_get_money && btn_get_money.addEvent("click", function() {
		dialog = new PopupDialog("提现至网易支付", getHtml());
		dialog.show();
		if (WalletData.free_balance <= 0){
			$('get_money_count').set("disabled", "disabled");
		} else {
			initEvents();
		}
		window.init_recommands && window.init_recommands();
	});
}

function init_wallet_tips(){
	var tips = [
		'<div class="tipsContent">',
			'<div class="walletTipsItem">',
				'<span class="fl">可提现余额:</span>',
				'<span class="fr">', fen2yuan(Math.max(WalletData.free_balance, 0)), '元</span>',
			'</div>',
			'<div class="walletTipsItem">',
				'<span class="fl">考察期余额:</span>',
				'<span class="fr">', fen2yuan(WalletData.checking_balance), '元</span>',
			'</div>',
		'</div>',
		'<div class="tipsDesc">提示：考察期余额72小时后方可购买梦幻币和消耗品。</div>'
	].join('');
	var el_targets = $$('.walletTips');
	if(el_targets.length > 0){
		el_targets.set('data-popover-cont', tips);
	}
}
function init_wallet(){
	if (window.ServerInfo && window.ServerInfo['is_server_open_wallet']){
		$$('[data-type=show_with_wallet]').setStyle('display', '');
		if (window.WalletData){
			if ($('wallet_balance')){
				$('wallet_balance').set('html', fen2yuan(WalletData.balance) + '元')
			}
			init_wallet_tips();
			init_get_money();
			show_wallet_guide();
		}
	}
}
function init_right_float_menu(){
	if (!$('right_float_pannel')) return;
	var latest_view_open = false;
	var lvo_fx = new Fx.Tween('right_float_pannel', {duration: 'short'});
	$("latest_view_btn").addEvent("click", function(){
		if(!latest_view_open){
			if(window.gen_latest_view_overall_search){
				gen_latest_view_overall_search();
			} else {
				gen_latest_view();
			}
			lvo_fx.start('right', -152, 0);
			latest_view_open = true;
			this.addClass('on');
		} else {
			lvo_fx.start('right', 0, -152);
			latest_view_open = false;
			this.removeClass('on');
		}
	});

	var tt;
	if(Browser.ie6){
		window.addEvent("scroll", function(){
			if(tt){clearTimeout(tt);}
			tt = setTimeout(function(){
				$('right_float_pannel').setStyle("top", (window.getScroll().y + 24) + "px");
			}, 100);
		});
	}

	var el_customer_service_link = $('goto_online_customer_service');
	var customer_service_url = el_customer_service_link.getAttribute('data-href');
	if (el_customer_service_link
		&& customer_service_url
		&& !customer_service_url.startWith('<'+'!--')){
		if(!is_user_login()){
			el_customer_service_link.addEvent('click', function(){
				alert_login();
			});
		} else {
			if(customer_service_url && !customer_service_url.startWith('<'+'!--')){
				el_customer_service_link.href = customer_service_url;
				el_customer_service_link.target = "_blank";
			}
		}
		el_customer_service_link.getParent().setStyle('display', '');
	}
}

window.addEvent('domready', function() {
	if (window.page_type && page_type == "overall_search") {
		if (LoginInfo && LoginInfo.login){
			var ctx = {LoginInfo:LoginInfo};
			render_to_replace('login_info_panel', 'login_info_template', ctx);
		}
	}
	show_shop_cart_info();
	init_wallet();
	WebGuide && WebGuide.next();
	init_right_float_menu();

	$$(".js-popoverHook").each(function(el){
		init_popover({
			target: el,
			content: el.getAttribute("data-popover-cont"),
			content_id: el.getAttribute("data-popover-target"),
			class_name: el.getAttribute("data-popover-class")
		});
	});
	if (history.length <= 1) {
		$$('a[href=javascript:history.go(-1)]').setStyle('display', 'none');
	}
});

function adjust_table_row_style()
{
	var el_list = $$("table.tb01");
	if (el_list.length != 1){
		return;
	}
	var count = 0;
	var tr_list = $$("table.tb01 tr")
	for (var i=0; i < tr_list.length; i++){
		if (count % 2 == 1){
			tr_list[i].addClass("even");
		}
		count = count + 1;
	}
}


var Popup = function(pop_el){
	this.pop_el = pop_el;
}
Popup.prototype = {
	show_over_layer: function(){
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
	},

	set_size: function(){
		var overLayer = $('pop_over');
		document_size = get_documentsize();
		overLayer.style.height = document_size.height + 'px';
		overLayer.style.width = document_size.width + 'px';
		set_position_center(this.pop_el);
	},

	show: function(){
		this.show_over_layer();		
		this.pop_el.style.display = 'block';
		set_position_center(this.pop_el)
		var __this = this;
		window.onresize = function(){
			__this.set_size();
		};
	},

	hide: function(){
		var overLayer = $('pop_over');
		if(overLayer){
			overLayer.style.display = 'none';
			this.pop_el.style.display = 'none';
			window.onresize = null;
		}
	}
}

//新功能描述请限定在40字以内, 若为空则不显示弹出框
var new_function_desc = '';
var new_function_url = '';

CAPTCHA_LEN = 5;

function parseDatetime(datetime){
	var reg = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
	var values = reg.exec(datetime);
	var v = values.slice(1).map(function(v){return parseInt(v,10)});
	return new Date(v[0], v[1]-1, v[2], v[3], v[4], v[5]);
}

/**
 * 鼠标移动出现的悬浮 tips
 * 
 * @param config {
 *     target: 目标对象的 dom 或 dom id
 *     content（可选）: tips 内容（自动将#n转化为<br>）
 *     content_id（可选）: tips 内容指向的 dom id
 *     class_name（可选）：tips 的 className，可用于自定义样式
 * }
 **/
function init_popover(config){
	var el_target, content, class_name;
	
	el_target = $(config.target);
	if (config.content) {
		content = transform_newline(config.content);
	} else if(config.content_id) {
		var el_content = $(config.content_id);
		if (el_content) {
			content = el_content.get("html");
		}
	} else {
		return;
	}
	class_name = config.class_name || "popover";
	el_target.addEvents({
		mouseenter: function() {
			var popover = $("popover");
			if (!popover) {
				popover = new Element("div#popover");
				popover.inject(document.body);
			}
			var coordinates = el_target.getCoordinates();
			popover.set({
				"html": content,
				"class": class_name,
				"styles" : {
					"display": "block",
					"top": coordinates.bottom + 5 + "px",
					"left": coordinates.right + 5 + "px"
				}
			});
		},
		mouseleave: function() {
			var popover = $("popover");
			if (popover) {
				popover.setStyle("display", "none");
			}
		}
	});
}

/**
 * 通用弹出框
 * ===
 * @param1 config {title:String, content: String, onClose: Function}
 * ===
 * @param1 title: String
 * @param2 content: String
 **/
var PopupDialog = new Class({
	initialize: function(title, content){
		if (typeof arguments[0] === 'object'){
			var config = arguments[0];
			this._title = config.title;
			this._content = config.content;
			this._onClose = config.onClose;
		} else {
			this._title = title;
			this._content = content;
		}
		this.setup();
	},
	
	setup: function(){
		// this.dialog  = $("PopupDialog");
		if(!this.dialog){
			this.dialog = new Element("div.popupDialog");
			this.dialog.inject(document.body);
		}
		this.dialog.set("html", this.getTemplate());
	},
	
	getTemplate: function(){
		var tmpl = [
			'<div class="dialogWrap">',
				'<div class="blockTitle">',
					this._title,
					'<span class="dialogClose"></span>',
				'</div>',
				'<div class="dialogCont">',
					this._content,
				'</div>',
			'</div>'
		];
		return tmpl.join('');
	},
	
	showMask: function(){
		// var el_mask = $('PopupDialogMask');
		if (!this.el_mask){
			var el_mask = this.el_mask = new Element("div.popupDialogMask");
			el_mask.inject(document.body);
		}
	},
	hideMask: function(){
		var el_mask = this.el_mask;
		el_mask && document.body.removeChild(el_mask);
	},
	
	hide: function(){
		if (!this._onClose || !this._onClose()){
			var el_dialog = this.dialog;
			el_dialog && document.body.removeChild(el_dialog);
			this.hideMask();
		}
	},
	
	show: function(){
		var that = this;
		var dialog = this.dialog;
		dialog.set('style', '');
		dialog.getElement(".dialogClose")
			.addEvent("click", function(){
				that.hide();
			});
		dialog.setStyles({
			"right": "50%",
			"margin-top" : -dialog.clientHeight/2,
			"margin-right" : -dialog.clientWidth/2
		});
		// for lt IE8
		dialog.setStyle('width', dialog.getWidth());
		this.showMask();
	}
});

var PopupManager = new Class({
	initialize : function(popup_id, over_layer_id){
		this._popup_id = popup_id;
		
		if (over_layer_id){
			this._over_layer_id = over_layer_id;
		} else {
			this._over_layer_id = "pop_over";		
		}
		
		this._win_change = null;
		
	},
	
	show_over_layer : function(){
		// create and show layer
		var over_layer = $(this._over_layer_id);
		if (!over_layer){
			over_layer = new Element("div", {"id":this._over_layer_id});
			over_layer.addClass("pageCover");
			over_layer.inject(document.body);
		}
		
		// set size
		over_layer.setStyle("height", Document.getScrollHeight());
		over_layer.setStyle("display", "block"); //设置页面遮罩层显示	 	
	},
	
	show_popup : function(){
		// show popup
		popup = $(this._popup_id);
  	popup.setStyle("display", "block");
  	
  	popup.setStyles({
  	    "left" : ((Window.getWidth() - popup.getSize().x)/2) + "px",
  	    "top"  : (Window.getHeight() - popup.getHeight())/2 + Window.getScrollTop() + "px"
  	});		
	},
	
	hide : function(){
		window.removeEvent("scroll", this._win_change);
		window.removeEvent("resize", this._win_change);
		$(this._popup_id).setStyle("display", "none");
		$(this._over_layer_id).setStyle("display", "none");
	},
	
	show : function(){
		this.show_over_layer();
		this.show_popup();
		
		var that = this;
		var win_change = function(){
			if ($(that._popup_id).getStyle("display") != "block"){
				that.hide();
				return;
			}
			that.show_over_layer();
			that.show_popup();		
		};
		
		this._win_change = win_change;
		window.addEvent("scroll", win_change);
		window.addEvent("resize", win_change);
	}
});


function show_mobile_popup_ad()
{
	return;
	// check if can display
	// if there is a new message, ignore
	var new_msg_num = Cookie.read("new_msg_num");
	if (new_msg_num && new_msg_num > 0 && !Cookie.read("alert_msg_flag")){
		return;
	}
	
	// check if has appear
	if (Cookie.read("view_mobile_app_ad")){
		return;
	}
	
	var alert_flag = Cookie.read("alert_msg_flag");
	/*
	if (alert_flag){
		return;
	}
	*/
		
	var popup = new PopupManager("layer_mobile_ad");
	popup.show();

	$("btn_go_moblie_app_page").addEvent("click", function(){
		Cookie.write("view_mobile_app_ad", "1", {"path":"/", "duration":30});	
		window.open("http://xyq.cbg.163.com/app/?from=cbgpopup");
		popup.hide();
		return false;
	});
	
	$("btn_close_mobile_ad_layer").addEvent("click", function(){
		Cookie.write("view_mobile_app_ad", "1", {"path":"/", "duration":30});	
		popup.hide();
		return false;
	});

	$("btn_close_mobile_ad_layer_2").addEvent("click", function(){
		Cookie.write("view_mobile_app_ad", "1", {"path":"/", "duration":30});	
		popup.hide();
		return false;
	});
}

function ObjectToString(obj){
	var result = [];
	for(var p in obj){
		result.push(p + '=' + obj[p]);
	}
	return result.join('&');
}

function try_login_to_buy(equipid, serverid, server_name, area_id, area_name)
{
	var login_url = CgiRootUrl + '/show_login.py?act=show_login&server_id='+serverid+'&server_name='+encodeURIComponent(server_name)+'&area_name='+encodeURIComponent(area_name)+'&area_id='+area_id+'&equip_id='+equipid;
	var equip_refer = getPara('equip_refer') || '1';
	var return_url =CgiRootUrl + '/equipquery.py?equip_refer=' + equip_refer + '&act=buy_show_equip_info&equip_id='+equipid+'&server_id='+serverid;

	// if login, try auto switch server
	var is_login = parseInt(Cookie.read("is_user_login"));
	if (is_login == 1){
		var args = {
			"act" : "auto_switch_server",
			"go_serverid" : serverid,
			"login_url" : login_url,
			"return_url" : return_url
		};
		var url = CgiRootUrl + "/login_check.py?" + Object.toQueryString(args);
	} else {
		var url = login_url + "&return_url=" + encodeURIComponent(return_url);
	}
	window.open(url);
}
var RACE_INFO = {0:"", 1:"人", 2:"魔", 3:"仙"};

function parse_role_info(raw_info){
  try {
    return JSON.decode(desc);
  } catch (e) {
    return js_eval(lpc_2_js(raw_info));
  }
}

function parse_desc_info(desc_info){
	try {
		return JSON.decode(desc_info).desc;
	} catch (e) {
		return desc_info;
	}
}

function select_rank(serverid, index){
	var rank = $('rank_select');
	if(index == 1){
		window.location = '/static_file/'+serverid+'/rank_pages/worth_rank1.html';
		return
	}
	else if(index == 2){
		window.location = '/static_file/'+serverid+'/rank_pages/collect_rank1.html';
		return
	}
}

function dict_get(dict_obj, key, default_value)
{
    if (dict_obj[key] != undefined){
        return dict_obj[key];
    } else {
        return default_value;
    }
}

function gen_highlight_html(highlight_list, separator, if_add_search_link)
{
	var html_list = [];
	for (var i=0; i < highlight_list.length; i++){
		var item = highlight_list[i];
		
		var color = "";
		if (item[1] >= 90){
			color = "#A805EC";
		} else if (item[1] >= 70 && item[1] <= 80){
			color = "#F60707";
		} else if (item[1] >=40 && item[1] <= 60){
			color = "#0A06ED";			
		} else {
			continue;
		}
		if (if_add_search_link){
			var search_paras = JSON.encode(item).toBase64();
			html_list.push('<a href="#" data_paras="' + search_paras + '" onclick="add_highlight_filter(this);return false;" style="color:' + color + '">' + item[0] + '</a>');
		} else {
			html_list.push('<span style="color:' + color + '">' + item[0] + '</span>');
		}
	}

	return html_list.join(separator);
}

function get_sub_kinds(kind_tree, parent_kindid)
{
    if(!kind_tree || kind_tree.length != 2){
        return [];
    }

    var ret = [];

    var sub_kinds = kind_tree[1];

    if(sub_kinds.length > 0){
        var is_equal = kind_tree[0][0] === parent_kindid;

        for(var i=0;i<sub_kinds.length;i++){
            var kind = sub_kinds[i];
            
            if(is_equal){
                ret.push({
                    'kindid': kind[0][0],
                    'name': kind[0][1]
                });
                if(parent_kindid == 60){
                    a = 1;
                }
                ret = ret.concat(get_sub_kinds(kind, kind[0][0]));
            }else{
                ret = ret.concat(get_sub_kinds(kind, parent_kindid));
            }
        }
    }

    return ret;
}

function is_lingshi(kindid)
{
    kindid = parseInt(kindid);
    if(kindid == 60){
        return true;
    }

    var lingshi_kinds = get_sub_kinds(kind, 60);

    for(var i=0;i<lingshi_kinds.length;i++){
        if(kindid == lingshi_kinds[i].kindid){
            return true;
        }
    }

    return false;
}

function is_pet_equip(kindid)
{
	if(kindid == 29){
		return true;
	}

	return false;
}

function handle_advance_search_link(type)
{
	if(window.location.pathname.search('equipquery.py') >= 0){
		window.location.href = '/cgi-bin/query.py?act=query&search_menu='+type;
		return;
	}
	
	window['show_'+type+'_search_form']();
}

function check_int_args(args_config_list)
{
	var re = /^[0-9]\d*$/;
	
	var args = {};
	
	for (var i=0; i < args_config_list.length; i++){
		var item = args_config_list[i];
		var item_value = $(item[0] + "").value.trim();		
		if (item_value.length == 0){
			continue;
		}
		
		if (!re.test(item_value) || item_value.length > 9){
			return {"result":false, "msg":item[1] + "填写错误，请重新输入"}
		}
		
		item_value = parseInt(item_value);
		if (item_value <= 0){
			continue;
		}
		
		args[item[0]] = item_value;
	}
	
	return {"result":true, "args":args};
}

function get_auction_price_additional_msg(equip_status, auction_status, bid_count, auction_condition)
{
	if (equip_status == EQUIP_AUCTION) {
		if (!auction_condition) {
			// “拍卖行”以外的其他页面上
			if (auction_status == AUCTION_BIDDING) {
				return '<span class="labelAuctioning">竞拍中</span>';
			} else if (auction_status == AUCTION_OPEN_BUY) {
				return '<span class="labelAuctioning">抢付中</span>';
			}
		} else if (auction_status == AUCTION_BIDDING) {
			if (bid_count == 0)
				return ''; //<b class="dashed"></b><span class="f12px cGray">尚无出价</span>';
			else
				return'<b class="dashed"></b><span class="f12px cRed">' +  bid_count + '次出价</span>';
		} else if (auction_status == AUCTION_OPEN_BUY) {
			return '<b class="dashed"></b><span class="f12px cRed">抢付中</span>';
		}
	}
	return '';
}

function get_exact_remain_time_desc(seconds)
{
	var text = '';
	if (seconds >= 3600) {
		text += Math.floor(seconds / 3600) + '小时';
		seconds %= 3600;
	}
	if (seconds >= 60) {
		text += Math.floor(seconds / 60) + '分';
		seconds %= 60;
	}
	text += seconds + '秒';
	return text;
}

function get_user_auction_status(auction_status, is_top, is_buyer)
{
	switch (auction_status) {
		case AUCTION_BIDDING:
			return '拍卖中'
		case AUCTION_BOOKED:
			if (is_top)
				return '<span class="cRed">竞拍成功<br>待支付</span>';
			else
				return '等待中标者付款<br><span class="cGray">未付款则可抢付</span>'
		case AUCTION_OPEN_BUY:
			if (is_top)
				return '竞拍失败<br><span class="cRed">未支付</span>'
			else
				return '抢付中';
		case AUCTION_PAID:
		case AUCTION_OPEN_BUY_PAID:
			if (is_buyer)
				return '已购买'
			else if (is_top)
				return '竞拍失败<br><span class="cRed">未支付</span>'
			else
				return '竞拍失败<br>未中标'
		case AUCTION_CANCEL:
			return '拍卖取消'
		case AUCTION_ABORT:
			return '流拍'
		default:
			return '未知状态'
	}
}

function get_user_auction_action(auction_status, is_top)
{
	if (auction_status == AUCTION_BIDDING)
		return '去跟价';
	else if (auction_status == AUCTION_BOOKED && is_top)
		return '去支付';
	else if (auction_status == AUCTION_OPEN_BUY && !is_top)
		return '抢付';
	else
		return '查看详情';
}

function init_topbox_for_auction()
{
	if (!CgiRootUrl.startWith(window.location.protocol))
		return;
	if (!window.IsLogin)
		return;

	// 设置一个短暂的timeout，让其他domready事件先执行，以便这里能正确判断#top_sell_menu的状态
	setTimeout(function() {
		if ($('top_sell_menu').hasClass('on'))
			return;

		var ajax = new Request.JSON({
			url: CgiRootUrl + '/auction.py',
			onSuccess: function(data, txt){
				if (data.status != 1)
					return;
				render_to_replace('topbox_auction', 'topbox_auction_tmpl', data);
				$$('#topbox_auction .js-alertClose').addEvent('click', function(e) {
					var parent = this.getParent('.js-divAlertWrap');
					Cookie.write(parent.getAttribute('data-hide-key'), parent.getAttribute('data-hide-value'));
					parent.parentNode.removeChild(parent);
				});
				$$("#topbox_auction a[data-game_ordersn]").addEvent('click', function() {
					var parent = this.getParent('.js-divAlertWrap');
					var cookie_name = parent.getAttribute('data-hide-key');
					// console.log(cookie_name, this.getAttribute('data-game_ordersn'));
					Cookie.write(cookie_name, (Cookie.read(cookie_name) || '') + '|' + this.getAttribute('data-game_ordersn'));
				});

				(function(wrapper) {
					if (!wrapper) return;
					var delay = 3000;
					var wrapperHeight = wrapper.getStyle('height').toInt();
					var listElem = wrapper.getChildren('.js-trottingList')[0];
					var itemsElem = listElem.getChildren('.js-trottingItem');
					itemsElem[0].clone().inject(listElem);
					var length = itemsElem.length;
					var count = 0;
					var pause = false;
					setTimeout(function throtting() {
						if (!pause) {
							if (count < length) {
								count++;
							} else {
								listElem.setStyle('margin-top', 0);
								count = 1;
							}
							listElem.tween('margin-top', -count * wrapperHeight);
						}
						setTimeout(throtting, delay);
					}, delay);
					wrapper.addEvents({
						mouseenter: function() { pause = true; },
						mouseleave: function() { pause = false; }
					});
				})($('throtting'));

			},
			noCache: true
		});
		ajax.get({
			act: 'user_notifications'
		})
	}, 300);
}

var popupModal = (function() {
	var cover, popup, popupBody, popupHeader, popupTitle, popupClose;
	var closeCallback;
	return {
		show: function(options) {
			var self = this;
			if (popup === undefined) {
				if (!$("popup")) {
					popup = new Element("div", {"class": "popup", "id": "popup"});
					popup.inject(document.body);
				} else {
					popup = $("popup");
				}
			}

			if (cover === undefined) {
				if (!$("pageCover")) {
					cover = new Element("div", {"class": "pageCover", "id": "pageCover", "style": {"display": "none"}});
					cover.inject(document.body);
				} else {
					cover = $("pageCover");
				}
			}

			if (popupTitle === undefined) {
				popupHeader = new Element("div", {"class": "popupHeader"});
				popupTitle = new Element("div", {"class": "popupTitle", html: options.title});
				popupClose = new Element("i", {
					"class": "popupClose",
						   "events": {
							   click: function() {
								   self.hide();
								   closeCallback();
							   }
						   }
				});

				popupTitle.inject(popupHeader);
				popupClose.inject(popupHeader);
				popupHeader.inject(popup);
			} else if (typeof options.title === "string") {
				popupTitle.set("text", options.title);
			}

			if (popupBody === undefined) {
				popupBody = new Element("div", {"class": "popupBody", "html": options.body});
				popupBody.inject(popup);
			} else if (typeof options.body === "string") {
				popupBody.set("html", options.body);
			}

			if (typeof options.bodyWidth === "number") {
				var pl = parseFloat(popupBody.getStyle("paddingLeft"));
				var pr = parseFloat(popupBody.getStyle("paddingRight"));
				popup.setStyle("width", options.bodyWidth + pl + pr + "px");
			}

			closeCallback = options.closeCallback || function(){};

			cover.setStyle("display", "block");
			popup.setStyle("display", "block");
			this.adjust(Document.getScrollHeight());
		},
		adjust: function(height) {
			if (cover && typeof height === "number") {
				cover.setStyle("height", height);
			}

			if (popup) {
				setTimeout(function() {
					popup.setStyles({
						"left" : ((Window.getWidth() - popup.getWidth())/2) + "px",
					"top"  : (Window.getHeight() - popup.getHeight())/2 + Window.getScrollTop() + "px"
					});
				}, 0);
			}
		},
		hide: function() {
			cover.setStyle("display", "none");
			popup.setStyle("display", "none");
		}
	}
})();

var popupGrowl = (function() {
	var growl, growlIcon, growlMessage;
	var timer;
	return {
		show: function(options) {
			var self = this;
			options = options || {};
			var type = options.type || "warning";
			var message = options.message || "";
			var duration = options.duration || 3000;

			if (!growl) {
				growl = new Element("div", {"id": "grwol", "class": "growl"});
				growlIcon = new Element("i", {"class": "growlIcon " + type});
				growlMessage = new Element("p", {"class": "growlMessage", "html": message});
				growlIcon.inject(growl);
				growlMessage.inject(growl);
				growl.inject(document.body);
			} else {
				growlMessage.set("html", message);
				growlIcon.set("class", "growlIcon " + type);
			}
			growl.setStyle("display", "block");
			growl.setStyles({
				"left": ((Window.getWidth() - growl.getWidth())/2) + "px",
				"top": (Window.getHeight() - growl.getHeight())/2 + Window.getScrollTop() + "px"
			})

			if (timer) clearTimeout(timer);
			timer = setTimeout(function() {
				self.hide();
			}, duration);
		},
		hide: function() {
			growl && growl.setStyle("display", "none");
		}
	}
})();

$(window).addEvents({
	scroll: throttle(popupModal.adjust, 200, true),
	resize: throttle(popupModal.adjust, 300, true)
});

function throttle(fn, delay, immediate, debounce) {
	var curr = +new Date(),
		last_call = 0,
		last_exec = 0,
		timer = null,
		diff,
		context,
		args,
		exec = function() {
			last_exec = curr;
			fn.apply(context, args);
		};

	return function() {
		curr = +new Date();
		context = this,
				args = arguments,
				diff = curr - (debounce ? last_call : last_exec) - delay;
		clearTimeout(timer);
		if (debounce) {
			if (immediate) {
				timer = setTimeout(exec, delay);
			} else if (diff >= 0) {
				exec();
			}
		} else {
			if (diff >= 0) {
				exec();
			} else if (immediate) {
				timer = setTimeout(exec, -diff);
			}
		}
		last_call = curr;
	}
}

function debounce(fn, delay, immediate) {
	throttle(fn, delay, immediate, true);
}

function switch_select(ctrl_box_id, el_list_id)
{
	var v = $(ctrl_box_id).checked;
	var el_list = $$(el_list_id)
	for (var i=0; i < el_list.length; i++){
		el_list[i].checked = v;
		el_list[i].setAttribute("checked", v);

	}
}

function cascade_checkbox(el_main, el_sub, callback)
{
	el_main.addEvent('click', function(){
		el_sub.set('checked', this.checked)
		callback && callback.call(this);
	});
	
	el_sub.addEvent('click', function(){
		var isChecked = true;
		for (var i = el_sub.length-1; i >= 0 ; i--){
			if (!el_sub[i].checked){
				isChecked = false;
				break;
			}
		}
		el_main.checked = isChecked;
	});
}

function init_fingerprint()
{
	if (!$("device_id")){
		return;
	}    

	new Fingerprint2().get(function(result, components){
		$("device_id").value = result;
	});  
}

function get_fingerprint()
{
	if ($("device_id")){
		return $("device_id").value;
	} else {
		return "";
	}
}

function show_collect_panel() {
  $$('#remindful_price').set('value', '');
	show_layer_center($("pageCoverCollect"), $("popupWinCollect"));
	return;
}

function hide_collect_panel() {
	$("pageCoverCollect").setStyle("display", "none");
	$("popupWinCollect").setStyle("display", "none");
}

var BargainPanel = (function() {
	var cover, popup;
	var equip;
	var bargain_loc;
  
  // 移过事件设置
  function setHoverEvent($root, selector, options) {
    if (!selector) {
      return;
    }
    options = Object.merge({
      enter: function() {},
      leave: function() {}
    }, options || {});
    
    $root.addEvent('mouseenter:relay('+ selector +')', function(e) {
      options.enter.call(this, e);
      
    }).addEvent('mouseleave:relay('+ selector +')', function(e){
      options.leave.call(this, e);
    });
  }

	var init = function() {
    var timerInput;
    function fnInput(e) {
      var ctx = this;
      clearTimeout(timerInput);
      timerInput = setTimeout(function() {
        update_msg.call(ctx, e);
      }, 400);
    }
    // 策划同学要求，延迟 0.4s 才开始检测
		$('bargain_price').addEvents({
			blur: fnInput,
			keyup: fnInput,
			change: fnInput
		});
    
		$('btn_send_bargain').addEvent('click', send_bargain);
		$('btn_close_bargain').addEvent('click', hide);
		cover = $("pageCoverBargain");
		popup = $("popupWinBargain");
    
    // 移过“详情”
    var msgTip;
    setHoverEvent(popup, '.jsMsgHover', {
      enter: function() {
        if (!msgTip) {
          msgTip = new FloatTip(this, {
            icon: false,
            dir: 'bottom',
            x: 0,
            y: 2
          });
        }
        msgTip.$root.setStyles({'z-index': 10003, 'font-size': 12, 'min-width': 320 });
        msgTip.show($('bargain_msg_panel').get('html'));
      },
      leave: function() {
        msgTip && msgTip.hide();
        msgTip = null;
      }
    });
    
    // 移过小问号
    var fkTip;
    setHoverEvent(popup, '.jsTip', {
      enter: function() {
        if (!fkTip) {
          fkTip = new FloatTip(this, {
            icon: false,
            dir: 'right',
            x: 5,
            y: -2 
          });
        }
        fkTip.update(this);
        fkTip.$root.setStyles({'z-index': 10003, 'font-size': 12 });
        
        var $target = fkTip.$target;
        fkTip.show($target.get('data-title'));
      },
      leave: function() {
        fkTip && fkTip.hide();
        fkTip = null;
      }
    });
    
    // 还价提示
    popup.getElement('.bargainTipRange').set('html', 
      '（还价的范围为<span class="cRed">'+ (BargainLimits[1].final_range[0] / 100) + '</span>元-<span class="cRed">' + (BargainLimits[1].final_range[1] / 100) + '</span>元）'
    );
    
    if (typeOf(window.CurrentEquipRemainBargainTimesToday) === 'number') {
      // 仅在测试服开启此功能，非测试服，此值为 null
      popup.getElement('.bargainTipLeaveTimes').set('html', 
        window.CurrentEquipRemainBargainTimesToday ? 
          ('您对该商品剩余还价次数：<span class="cRed">'+ CurrentEquipRemainBargainTimesToday +'</span>次') : '<span class="cRed">今天对该物品的还价次数已用完</span>'
      );
    }
    popup.getElement('.bargainTipAllLeaveTimes').set('html', 
      RemainBargainTimesToday ? 
        ('今日总还价次数剩余：<span class="cRed">'+ RemainBargainTimesToday +'</span>次') : '<span class="cRed">今天的还价次数已用完</span>'
    );
    
		init = function(){};
	};

	function show(equip_info, loc) {
		if (!BargainLimits[0]) {
			alert(BargainLimits[1]);
			return;
		}
    
		if (RemainBargainTimesToday <= 0) {
			return alert("抱歉，今天总还价次数已达上限10次，请明天再来。");
		}
    
    if (typeOf(window.CurrentEquipRemainBargainTimesToday) === 'number' && CurrentEquipRemainBargainTimesToday <= 0) {
			return alert("抱歉，每天对单个商品还价的次数不能超过3次。");
		}

		init();

		equip = equip_info || window.equip;
		bargain_loc = loc || '';

		$("bargain_price").value = "";
		update_msg();

		show_layer_center(cover, popup);
		$("bargain_price").focus();
	}

	function hide() {
		cover.style.display = popup.style.display = 'none';
	}

	function check_price(price_yuan) {
		if (!/^\d+$/.test(price_yuan))
			return "您填写的价格有错误"

		var lim = BargainLimits[1];
		var price = Math.round(price_yuan * 100);

		if (price >= lim.cur_price)
			return "还价价格要低于原价，请重新输入！";

		if (price < Math.round(lim.cur_price * 0.65))
			return "低于可还价范围";

		if (price <= lim.last_bargain_price)
			return '还价价格必须高于上次还价价格(' + (lim.last_bargain_price / 100) + '元)';

		if (price >= lim.last_rebargain_price)
			return '还价价格高于卖家还价价格，请直接购买';

		if (price < lim.equip_min_price)
			return '还价价格不能低于该物品允许的最低价格(' + (lim.equip_min_price / 100) + '元)';

		return null;
	}

	function check_price_level(price_yuan) {
		var price = Math.round(price_yuan * 100);
		var cur_price = BargainLimits[1].cur_price;
		if (price < cur_price * 0.7)
			return {
        text: typeOf(window.CurrentEquipRemainBargainTimesToday) === 'number' ? '极低；您很有可能被卖家标识为恶意还价玩家；请谨慎还价。<span class="s-icon s-icon-ask jsTip" data-title="被标记为恶意还价玩家后，<br/>卖家将不会接收到你的还价信息。"></span>' : '极低', 
        color: 'red'
      };
		else if (price < cur_price * 0.9)
			return {text: '一般', color: 'orange'};
		else
			return {text: '高', color: 'green'};
	}
  
  var isSendingBargain = false;
	function send_bargain() {
		var new_price = $("bargain_price").value.trim();
		var msg = check_price(new_price);
		if (msg) {
			alert(msg);
			return;
		}
    if (isSendingBargain) {
      return;
    }
    
    var fnFail = function() { 
      isSendingBargain = false; 
      alert('网络繁忙，请稍候再试'); 
    };
		var Ajax = new Request.JSON({
			url: CgiRootUrl + "/message.py?act=bargain_msg_add",
			onSuccess: function(data, txt) { 
        isSendingBargain = false;
        alert(data.msg);
        // 兼容 ie11 出现白色边框问题
        setTimeout(function() {
          location.reload();
        }, 120);
      },
      onFailure: fnFail,
			onError: fnFail
		});
    
    isSendingBargain = true;
		Ajax.post({
			price : new_price,
      accept_text_message: popup.getElement('.jsAccept').checked ? 1 : 0,
			equipid : equip["equipid"],
			obj_server_id : equip['server_id'],
			loc: bargain_loc
		});
	}

	function update_msg() {
		var new_price = $("bargain_price").value.trim();
    var warning;
    
		if (new_price.length > 0) {
			warning = check_price(new_price);
			var price_info = new_price;
			if (warning) {
				warning = '<span class="cRed">' + warning + '</span>';
			} else {
				var level_info = check_price_level(new_price);
				warning = '还价成功率：<span style="color:' + level_info.color + '">' + level_info.text + '</span>';
			}
		} else {
			var price_info = '?';
			var warning = '还价成功率：--';
		}
    
		$('bargain_warning').set('html', warning);

		var from_server_name = ServerInfo.server_name;

		if (window.LoginInfo && LoginInfo.login)
			from_server_name = LoginInfo.server_name;

		var msg = $("bargain_msg_templ").value
			.replace(/<!--bargain_price_desc-->/g, htmlEncode(price_info))
			.replace(/\n+/g, '<br/>');
		$("bargain_msg_panel").innerHTML = msg;
		$$('#bargain_msg_panel .j_equip_icon').setStyle('display', 'none');
		$$('#bargain_msg_panel a').setStyle('display', 'none');
	}

	return {
		show: show,
		hide: hide
	};

})();

var BargainResponsePanel = (function() {

	var cur_msgid, cur_bargainid;
	var cur_loc;

	function init(loc) {
		cur_loc = loc;

		// 关闭弹窗
		$$('.j_hide_bargain_popup').addEvent('click', function() {
			$("pageCoverBargainOwner").setStyle("display", "none");
			this.getParent('.popupWin').setStyle("display", "none");
			return false;
		});

		// 打开弹窗
		$$('.j_bargain_response_action').addEvent('click', function() {
			var datas = $(this).getParent();
			var popup = $(this.getAttribute('data-key') + 'BargainPopupWin');

			popup.getElements('[data-key]').each(function(sub) {
				var key = sub.getAttribute('data-key');
				sub.set('html', datas.getAttribute('data-' + key));
			});

			cur_msgid = datas.getAttribute('data-msgid');
			cur_bargainid = datas.getAttribute('data-bargainid');

			show_layer_center($('pageCoverBargainOwner'), popup);
			return false;
		});

		// 操作事件
		$('btn_accept_bargain').addEvent('click', function() { bargain_response('accept'); });
		$('btn_refuse_bargain').addEvent('click', function() { bargain_response('refuse'); });
		$('btn_rebargain').addEvent('click', function() {
			var price = $('rebargain_price').value.trim();
			if (!/^\d+(\.\d?\d?)?$/.test(price)) {
				alert('请正确输入价格');
				return;
			}
			price = +price;

			if (price <= $('rebargain_price_min').get('text')) {
				alert('价格过低');
				return;
			}
			if (price >= $('rebargain_price_max').get('text')) {
				alert('价格过高');
				return;
			}
			bargain_response('rebargain', price);
		});
		$('btn_malicious_bargain').addEvent('click', function() {
			var radios = $$('input[name=maliciousBargainRadio]:checked');

			var opt = radios && radios[0] && radios[0].get('value');
			if(opt == 'ignore')
				bargain_response('refuse');
			else if(opt == 'forbidden')
				bargain_response('malicious');
			else
				alert('请选择期望的处理方式');
		});
	}

	function bargain_response(resp_type, resp_price_yuan){
		url = CgiRootUrl + '/message.py?act=resp_bargain';
		
		params = {
			msgid: cur_msgid || '',
			bargainid: cur_bargainid || '',
			resp_type: resp_type,
			resp_price: resp_price_yuan || '',
			safe_code: safe_code,
			loc: cur_loc
		}

		var ajax = new Request.JSON({
			url: url,
			onSuccess: function(data, txt) {
				if(data["status"] == 1){
					alert("操作成功");
					window.location.reload();
				}else{
					alert("操作失败："+data["msg"]);
				}
			},
			onError: function(text, error) {
				alert("登录超时或者操作失败");
			}
		});

		ajax.post(params);
	}


	return {
		init: init
	};
})();


var IsDoingCollectOP = false;
// 添加到收藏，并且提醒价格
function add_collect_remind_price(equip) {
	if (IsDoingCollectOP) {
		return; 
	}
  
  equip = equip || window.collect_equip || window.equip || {};

	var remindful_price_value = $('remindful_price').get('value').trim();
	var remindful_price = parseInt(remindful_price_value);
	if(!remindful_price_value) {
    hide_collect_panel();
		alert('当商品降价≥5%或50元时，你会在站内信和游戏系统消息中收到通知');
		return;
	}
  if (isNaN(remindful_price)) {
    alert('请输入数字');
    return;
  }
	if(remindful_price <= 0){
		alert("玩家输入价格<=0，提醒价格必须大于0元，请重新设置。");
		return;
	}else if(remindful_price >= equip['price']){
		alert("输入价格需要小于商品价格，请重新输入");
		return;
	}

	var url = CgiRootUrl + "/userinfo.py?act=ajax_change_remindful_price&initial_set=1";
	url += "&order_sn=" + equip["game_ordersn"];
	url += "&remindful_price=" + remindful_price;

	var success_handler = function(data, txt){
    IsDoingCollectOP = false;
		if (!data["status"]){
      alert(data["msg"]);
			return;
		}
    hide_collect_panel();
    alert('当商品价格 ≤ '+ remindful_price +'元，您会在站内信和游戏系统消息中收到通知');
	};
  var failure_handler = function() {
    IsDoingCollectOP = false;
    alert('提醒价格设置失败，请重试');
  };

	var Ajax = new Request.JSON({
    url: url,
    onSuccess: success_handler,
    onFailure: failure_handler,
    onError: failure_handler,
    noCache: true
  });
	Ajax.get();
  
  return false;
}

// 添加到收藏
function add_to_favorites(equip, options) {
  if (IsDoingCollectOP)
		return;
  
  var user_level = Cookie.read('login_user_level');
	if (user_level && parseInt(user_level) < 50){
		if (!confirm("尊敬的玩家，您好！由于您的角色等级不足50级，收藏该商品后，将不计算在商品收藏数当中，但是收藏功能（查看收藏、降价提醒等）可正常使用，您确定要收藏该商品吗？")){
			return options.complete();
		}
	}
  
  equip = equip || window.collect_equip || window.equip || {};
  options = Object.merge({ 
    success: function(data) {
      if (!data["status"]) {
        alert(data['msg']);
        options.complete();
        return
      }
      show_collect_panel();
      equip.add_collect_callback && equip.add_collect_callback();
      options.complete();
    }, 
    fail: function() {
      alert('收藏失败，请重试');
      options.complete();
    }, 
    complete: function() {}
  }, options || {});
  
  /*
    // 这个判定，是什么鬼？全局搜索，都没有 addention_onsale_check 这个玩意~~~
    var attention = 1;
    if($('addention_onsale_check') && $('addention_onsale_check').checked)
      attention = 2;
  */
  
  // 现在请求是旧的，不知道是否需要一个新的收藏请求
  var url = CgiRootUrl + "/userinfo.py?act=ajax_add_collect&order_sn=" + equip["game_ordersn"] + "&attention=1&query_tag=" + (window.CurQueryTag || '') + "&obj_server_id=" + equip['server_id'];
  
  if(equip.collect_refer) {
    url += '&refer=' + equip.collect_refer;
  }
  
  var requestFailure = function(message) {
    options.fail(message);
  };

  var ajax = new Request.JSON({ 
    url: url, 
    onSuccess: function(data) {
      options.success(data);
    },
    onFailure: requestFailure,
    onError: requestFailure,
    noCache: true
  });
  ajax.get();
}

function del_from_favorites() {
	if (IsDoingCollectOP)
		return;
	var equip = window.collect_equip || window.equip;
	var url = CgiRootUrl + "/userinfo.py?act=ajax_del_collect&order_sn=" + equip["game_ordersn"];
	var Ajax = new Request.JSON({
		url: url,
		noCache: true,
		onSuccess: function(data, txt) {
			IsDoingCollectOP = false;
			if (data.status != 1) {
				alert(data.msg);
        equip.del_collect_error_callback && equip.del_collect_error_callback();
				return;
			}
			alert("删除收藏成功，请到“我的藏宝阁->我的收藏“里面查看。");
			equip.del_collect_callback && equip.del_collect_callback();
		}
	});
	Ajax.get();
}

function login_to_collect()
{
	if (confirm("登录后才能进行该项操作!\n您要登录吗？") == true){
		window.location.href = get_login_url({
				"equip_id" : $("equipid") ? $("equipid").value : '',
				"return_url" : window.location.href
		});
		return false;
	}
	return false;
}

var CHINESE_NUM_CONFIG = {1:"一", 2:"二", 3:"三", 4:"四", 5:"五", 6:"六", 7:"七", 8:"八", 9:"九", 10:"十"};
var ROLE_ZHUAN_ZHI_CONFIG = {0:"未飞升", 1:"飞升", 2:"渡劫"};

function get_descendant_kinds(kind_data, parent_kindid){
	var kindid = kind_data[0][0];
	var children = kind_data[1];
	var all_child_kinds = [];

	if(children.length == 0 && kindid == parent_kindid){
		all_child_kinds = [kind_data];
	}
	
	for(var i=0;i<children.length;i++){
		if(kindid == parent_kindid){
			tmp_parent_kindid = children[i][0][0];
		}else{
			tmp_parent_kindid = parent_kindid	
		}

		var child = children[i];
		var child_kinds = get_descendant_kinds(child, tmp_parent_kindid);
		all_child_kinds.extend(child_kinds);
	}

	return all_child_kinds;
}

function get_descendant_kindids(kind_data, parent_kindid){
	var children = get_descendant_kinds(kind_data, parent_kindid);
	var kindids = [];

	for(var i=0;i<children.length;i++){
		var child = children[i];
		kindids.push(child[0][0]);
	}

	return kindids;
}

function fen2yuan(fen){
	return (fen/100).toFixed(2);
}

function fen2yuan_float(fen){
	return fen/100;
}

function yuan2fen(yuan){
	return Math.round(parseFloat(yuan)*100);
}

function safe_json_decode(json){
	try{
		return JSON.decode(json);
	} catch(e){
		return null;
	}
}

var AlertDialog = new Class({
	defaultOptions: {
		width: 570,
		confirmText: "确认",
		cancelText: "取消",
		onConfirm: null
	},

	initialize: function(title, content, options){
		this.options = Object.merge(Object.clone(this.defaultOptions), options);
		this.options.title = title;
		this.options.content = content;
		this.dialog = null;
		this.popup = null;
	},

	getTemplate : function(){
		var tmpl = [
			'<div class="cont noIndent">',
				this.options.title ? '<h3 class="cDYellow f14px fB textCenter">'+ this.options.title+'</h3>' : '',
				this.options.content,
				'<div class="textCenter" style="border-top:1px solid #ccc; padding:15px; text-align:center; margin-top:10px;">',
					'<input type="button" class="btn1 dialog_btn_confirm" value="'+ this.options.confirmText+'" />',
					'&nbsp;&nbsp;',
					'<input type="button" class="btn1 dialog_btn_cancel" value="'+ this.options.cancelText +'" />',
				'</div>',
			'</div>'
		 ];
		return tmpl.join('');
	},

	getDialog: function(){
		if(!this.dialog){
			var id = 'util_alert_dialog';
			var dialog  = $(id);
			if(!dialog){
				dialog = new Element("div", {"class": "popupWin", "id": id});
				dialog.setStyle('width', '350px');
				dialog.inject(document.body);
			}
			this.dialog = dialog;
		}
		this.dialog.setStyle('width', this.options.width + 'px');
		return this.dialog;
	},

	getPopup: function(){
		if(!this.popup){
			this.popup = new Popup(this.getDialog());
		}
		return this.popup;
	},

	show: function(){
		var dialog = this.getDialog();
		dialog.set("html", this.getTemplate());
		var that = this;
		dialog.getElement(".dialog_btn_confirm").addEvent("click", function(){
			that.hide();
			if(that.options.onConfirm){
				that.options.onConfirm();
			}
		});
		dialog.getElement(".dialog_btn_cancel").addEvent("click", function(){
			that.hide();
		});
		this.getPopup().show();
	},

	hide: function(){
		this.getPopup().hide();
	}
});


var ToastTip = new Class({
	initialize: function(text){
		this.text = text.trim().replace(/\n/g, '<br>');
	},

	getTipDialog: function(){
		if(!this.dialog){
			var id = 'toast_tip_dialog';
			var dialog = $(id);
			if (!dialog){
				dialog = new Element('div', {'class': 'ToastTip', 'id': id});
				dialog.inject(document.body);
			}
			this.dialog = dialog;
		}
		return this.dialog;
	},

	show: function(){
		var dialog = this.getTipDialog();
		dialog.set({
			'style': 'visibility:hidden',
			'html': this.text
		});
		dialog.setStyles({
			'visibility': '',
			'right': '50%',
			'margin-top' : -dialog.clientHeight/2,
			'margin-right' : -dialog.clientWidth/2
		});
		var millisec = 3000;
		if (this.text.length > 20) {
			millisec = Math.max(5000, this.text.length * 100)
		}
		clearTimeout(ToastTip.timer);
		ToastTip.timer = setTimeout(this.hide.bind(this), millisec);
	},

	hide: function(){
		this.getTipDialog().setStyle('display', 'none');	
	}
});

/**
  * 浮出的提示
  * var floatTip = new FloatTip(dom元素, {appendTo: 选择器, dir: bottom|top|left|right, x:0, y: 0});
  * floatTip.show('显示内容，如果有 js-close 这个类，点击会关闭这个提示').on('hide', function() { 关闭的回调 });
*/ 
var FloatTip = new Class({
	initialize: function($root, options){
    var ctx = this;
		ctx.$target = $($root);
    ctx.$root = new Element('div', {'class': 'page-tips-float'});
    ctx.options = options = Object.merge({icon: true, appendTo: 'body', dir: 'bottom', x: 0, y: 0}, options || {});
    
    if (options.appendTo) {
      $$(options.appendTo).grab(ctx.$root);
    }
    ctx.$root.addClass('page-tips-float-' + options.dir);
    
    var cls = options.cls;
    if (cls) {
      ctx.$root.addClass(cls);
    }
    if (!options.icon) {
      ctx.$root.addClass('page-tips-float-no-icon');
	}
  },
  update: function($target) {
    this.$target = $target;
    return this;
  },
  show: function(html) {
    var ctx = this;
    var $root = ctx.$root, $target = ctx.$target;
    var options = ctx.options;
    $root.setStyles({visibility: 'visible'}).set('html', html);
    
    var targetInfo = $target.getCoordinates();
    var rootInfo = $root.getCoordinates();
    
    var styles = { };
    switch (options.dir) {
      case 'left':
        styles = {
          left: targetInfo.left - rootInfo.width + options.x,
          top: targetInfo.top + options.y
        };
        break;
      case 'right':
        styles = {
          left: targetInfo.left + targetInfo.width + options.x,
          top: targetInfo.top + options.y
        };
        break; 
      case 'top':
        styles = {
          left: targetInfo.left + options.x,
          top: targetInfo.top - rootInfo.height + options.y
        };
        break;
      default:
        styles = {
          left: targetInfo.left + options.x,
          top: targetInfo.top + targetInfo.height + options.y
        };
    }
    $root.setStyles(styles);
    
    var $closes = $root.getElements('.js-close');
    var fn = function(e) {
      ctx.hide();
      $closes.removeEvent('click', fn);
    };
    $closes.addEvent('click', fn);
    
    $root.fireEvent('show');
    return $root;
  },
  hide: function(isDestroy) {
    isDestroy = isDestroy === void 0 ? true : isDestroy;
    var $root = this.$root;
    $root.setStyles({visibility: 'hidden'});
    isDestroy && $root.dispose();
    $root.fireEvent('hide');
    return $root;
  }
});

// 简单的无限时期存储器
var StoreDB = (function() {
  var hasStorage = false;
  var storage = window.localStorage;
  
  if (storage) {
    try {
      var key = '__test__', oldValue = storage.getItem(key);
      storage.setItem(key, 1);
      storage.getItem(key);
      storage.removeItem(key);
      if (oldValue !== void 0) {
        storage.setItem(key, oldValue);
      }
      hasStorage = true;
    } catch(e) {
      // nothing
    }
  }
  
  var getItem, setItem, removeItem;
  if (hasStorage) {
    getItem = function(key) { return storage.getItem(key); };
    setItem = function(key, val) { return storage.setItem(key, val); };
    removeItem = function(key) { return storage.removeItem(key); };
  } else {
    getItem = function(key) { return Cookie.read(key); };
    setItem = function(key, val) { return Cookie.write(key, val, { duration: 180 }); };
    removeItem = function(key) { return Cookie.dispose(key); };
  }
  
  return {
    hasStorage: hasStorage,
    getItem: getItem,
    setItem: setItem,
    removeItem: removeItem
  };
})();

// 网页功能导向
var WebGuide = {
  list: [],
  // item 必须实现 run 方法
  add: function(item) {
    this.list.push(item);
  },
  clear: function() {
    this.list = [];
  },
  // 调用 WebGuide.next 执行下一个配置
  next: function() {
    var item = this.list.shift();
    item && item.run();
  }
};

function desc_4_mhb(amount){
	if(amount < 1000000)
		return '';
		
	msg = '';
	ten_million = parseInt(amount / 10000000) % 10;
	if(ten_million > 0)
		msg += ten_million + '千';

	million = parseInt(amount / 1000000) % 10;
	if(million > 0)
		msg += million + '百';

	if(!ten_million){
		hundred_thousand = parseInt(amount / 100000) % 10;
		if(hundred_thousand > 0)
			msg += hundred_thousand + '十';
	}
	return '约' + msg + '万';
}

var AjaxConstants = {
	Failed: 0,
	Ok: 1,
	Error: 2
};

function submit_by_form(options) {
  options = Object.merge({ method: 'post', url: '/', data: {} }, options || {});

  var data = options.data;
  var form = document.createElement('form');
  var method = options.method.toLowerCase();
  form.setAttribute('method', method);
  form.setAttribute('action', options.url);
  options.target && form.setAttribute('target', options.target);

  Object.each(data, function(value, key) {
    var input = document.createElement('input');
    input.setAttribute('id', key);
    input.setAttribute('name', key);
    input.value = value;
    form.appendChild(input);
  });

  form.style.display = 'none';
  document.getElementsByTagName('body')[0].appendChild(form);

  form.submit();
}
