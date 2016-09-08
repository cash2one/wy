var MaxTradeYuan = 500000;

function getPara(paraName)
{
	var pageUrl;
	var urlPara;
	var urlParaName;
	var urlParaValue;
	pageUrl=document.location;
	pageUrl=pageUrl.toString();
	urlPara=pageUrl.split("?");
	urlPara=urlPara[1];
	if (urlPara == undefined)
		return "";

	urlPara=urlPara.split("&");

	for(i=0;i<urlPara.length;i++)
	{
		urlParaName=urlPara[i].split("=")[0];
		urlParaValue=urlPara[i].split("=")[1];
		if(paraName==urlParaName)
		{
			return urlParaValue == undefined ? "" : urlParaValue;
			break;
		}
	}

	return "";
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
		if (selobj.options[i].value == value || selobj.options[i].value + "ʡ" == value || selobj.options[i].value + "��" == value || selobj.options[i].value + "��" == value)
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
}


function transform_newline(content)
{
	return content.replace(/#r/g, "<br>");
}

//�ܱ�����������
function checkppc(ppc) {
	return /^\d{3,9}$/.test(ppc);
}

//��������������
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
	initialize: function(template_id){
		this.options = {
			"tag_re": /<%=?(.*?)%>/g
		};
		this.template = this.get_template_source(template_id);
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
    cover_el.setStyle("display", "block"); //����ҳ�����ֲ���ʾ
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
	var unit = if_add_unit ? "��Ԫ��" : "";
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
	return "<span class='" + cls + "'>��" + price.toFixed(2) + unit + "</span>"
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

	if (window.confirm("�ر���������������"+offsale_equips_num+"����Ʒ��ʱ��δ�ϼܣ�׼�����������ϼܣ�")){
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


	if (window.confirm("�ر����������������µ���Ϣ����ע�����ա�")){
		window.location.href = CgiRootUrl + '/message.py?act=msg_list';
		return;
	}
}

function alert_login()
{
	if (confirm("��¼�����ܽ��и�������!\n��Ҫ��¼����") == true){
		window.location.href = get_login_url();
		return false;
	}
	return false;
}

function fix_anonymous_menu_link()
{
	if (is_user_login()){
		return;
	}
	$("top_sell_menu_a").addEvent("click", alert_login);
	$("top_mycbg_menu_a").addEvent("click", alert_login);
	$("to_login_link").href = get_login_url({});
	$("top_fairshow_menu_a").href = $("top_fairshow_menu_a").href +'&server_id='+ServerInfo["server_id"];
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
EquipStatus[EQUIP_TAKE_BACK] =  "��ȡ��";
EquipStatus[EQUIP_STORE] =  "δ�ϼ�";
EquipStatus[EQUIP_SELLING] =  "�ϼ���";
EquipStatus[EQUIP_BOOKING] =  "���µ�";
EquipStatus[EQUIP_PAID] =  "������";
EquipStatus[EQUIP_TRADE_FINISH] =  "������";
EquipStatus[EQUIP_TAKE_AWAY] =  "������";
EquipStatus[EQUIP_PROBLEM_TRADE] =  "������Ʒ";
EquipStatus[EQUIP_AUCTION] = "������";


var ORDER_NO_PAY = 1;
var ORDER_PAIED = 2;
var ORDER_CANCEL = 3;
var ORDER_EXPIRED = 4;
var ORDER_REFUNDMENT = 5;
var ORDER_SUCCESS = 6;
var ORDER_REFUNDMENT_FINISH = 7;

var OrderStatus = {};
OrderStatus[ORDER_NO_PAY] = "������";
OrderStatus[ORDER_PAIED] = "�Ѹ���";
OrderStatus[ORDER_CANCEL] = "�ѷϳ�";
OrderStatus[ORDER_EXPIRED] = "����";
OrderStatus[ORDER_REFUNDMENT] = "�˿���";
OrderStatus[ORDER_SUCCESS] = "���׳ɹ�";
OrderStatus[ORDER_REFUNDMENT_FINISH] = "���˿�";

var AUCTION_BIDDING = 1;
var AUCTION_BOOKED = 2;
var AUCTION_PAID = 3;
var AUCTION_OPEN_BUY = 4;
var AUCTION_OPEN_BUY_PAID = 6;
var AUCTION_ABORT = 7;
var AUCTION_CANCEL = 8;

var AuctionStatus = {};
AuctionStatus[AUCTION_BIDDING] = '������';
AuctionStatus[AUCTION_BOOKED] = '�����������ȴ�����';
AuctionStatus[AUCTION_PAID] = '�������۳�';
AuctionStatus[AUCTION_OPEN_BUY] = '��������������δ����\n������';
AuctionStatus[AUCTION_OPEN_BUY_PAID] = '�����ɹ�';
AuctionStatus[AUCTION_ABORT] = '����';
AuctionStatus[AUCTION_CANCEL] = 'ȡ��';


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

function get_role_iconid(type_id){
	var need_fix_range = [
		[13, 24],
		[37, 48],
		[61, 72],
		[215, 226],
		[239, 245],
		[263, 269]
	];
	for(var i=0; i<need_fix_range.length; i++){
		var range = need_fix_range[i];
		if(type_id >= range[0] && type_id <= range[1]){
			type_id = type_id - 12
			break;
		}
	}
	return type_id;
}

var OtpRexp = /^\d{6}$/;
var PpcRexp = /^\d{3,9}$/;
var MobileRexp = /^1\d{10}$/;
var MobileValidCodeRexp = /^\d{6}$/;

function checkMobileMb(mb_type){
	if(mb_type == 'otp'){
		if(!$('otp_input').value){
			alert('�����뽫����');
			return false;
		}
		if(!OtpRexp.test($('otp_input').value)){
			alert('��������ʽ����');
			return false;
		}
	}
	else if(mb_type == 'ppc'){
		if(!$('ppc_input').value){
			alert('�������ܱ�������');
			return false;
		}
		if(!PpcRexp.test($('ppc_input').value)){
			alert('�ܱ���������ʽ����');
			return false;
		}

	}
	return true;
}


function is_user_login()
{
	var is_login = parseInt(Cookie.read("is_user_login"));
	var user_nickname = Cookie.read("login_user_nickname");
	if (is_login == 1 && user_nickname){
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
	var msg = "վ����";
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

	// ��½�û����Ƽ�����ʱ��������ʾ�Ƽ�
	var recommend_url = Cookie.read('recommend_url');
	var go_recommend_page = function(){
		window.location = recommend_url;
		return false;
	};
	if (is_user_login() && recommend_url){
		if ($("top_buy_menu_a")){
			$("top_buy_menu_a").addEvent("click", go_recommend_page);
		}

		if ($("common_query_a")){
			$("common_query_a").addEvent("click", go_recommend_page);
		}
		return false
	}

	//����������������ҳ��̬ҳ�����ã�����ת��ҳ��̬ҳ��
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
			alert("��¼��ʱ����ѯ������");
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
		alert('��ѯ������' + result['msg']);
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

	if(!window.xyq_ad_list)
		return

	if(xyq_ad_list.length == 0)
		return;

	var ad_data = xyq_ad_list;

	// create ad html
	var ul_html = "<ul>";
	var nav_html = "<div>";
	for (var i=0; i < ad_data.length; i++){
		var item = ad_data[i];
		ul_html += "<li><a href='"+item.link_url+"' target='_blank' title='"+""+"'><img width='920' height='50' src='"+item.image_url+"' alt='"+ "" +"' /></a></li>";
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
	if (!is_user_login() || !$("buy_cart_panel")){
		return;
	}

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

window.addEvent('domready', function() {
    show_shop_cart_info();

	$$(".js-popoverHook").addEvents({
		mouseenter: function() {
			var html = this.getAttribute("data-popover-cont") || $(this.getAttribute("data-popover-target")).get("html");

			if (html) {
				var popover = $("popover");
				if (!popover) {
					popover = new Element("div", {"class": "popover", "id": "popover"});
					popover.inject(document.body);
				}
				var coordinates = $(this).getCoordinates();
				popover.set("html", html);
				popover.setStyles({
					"display": "block",
					"top": coordinates.bottom + 5 + "px",
					"left": coordinates.right + 5 + "px"
				});
			}
		},
		mouseleave: function() {
			var popover = $("popover");
			if (popover) {
				popover.setStyle("display", "none");
			}
		}
	});
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

//�¹����������޶���40������, ��Ϊ��������ʾ������
var new_function_desc = '';
var new_function_url = '';

CAPTCHA_LEN = 5;

function parseDatetime(datetime){
	var reg = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
	var values = reg.exec(datetime);
	var v = values.slice(1).map(function(v){return parseInt(v,10)});
	return new Date(v[0], v[1]-1, v[2], v[3], v[4], v[5]);
}


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
		over_layer.setStyle("display", "block"); //����ҳ�����ֲ���ʾ
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
	var return_url =CgiRootUrl + '/equipquery.py?equip_refer=1&act=buy_show_equip_info&equip_id='+equipid+'&server_id='+serverid;

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
var RACE_INFO = {0:"", 1:"��", 2:"ħ", 3:"��"};

function parse_role_info(raw_info){
	return js_eval(lpc_2_js(raw_info));
}

function parse_desc_info(desc_info){
	return desc_info;
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
			return {"result":false, "msg":item[1] + "��д����������������"}
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
			// �������С�����������ҳ����
			if (auction_status == AUCTION_BIDDING) {
				return '<span class="labelAuctioning">������</span>';
			} else if (auction_status == AUCTION_OPEN_BUY) {
				return '<span class="labelAuctioning">������</span>';
			}
		} else if (auction_status == AUCTION_BIDDING) {
			if (bid_count == 0)
				return ''; //<b class="dashed"></b><span class="f12px cGray">���޳���</span>';
			else
				return'<b class="dashed"></b><span class="f12px cRed">' +  bid_count + '�γ���</span>';
		} else if (auction_status == AUCTION_OPEN_BUY) {
			return '<b class="dashed"></b><span class="f12px cRed">������</span>';
		}
	}
	return '';
}

function get_exact_remain_time_desc(seconds)
{
	var text = '';
	if (seconds >= 3600) {
		text += Math.floor(seconds / 3600) + 'Сʱ';
		seconds %= 3600;
	}
	if (seconds >= 60) {
		text += Math.floor(seconds / 60) + '��';
		seconds %= 60;
	}
	text += seconds + '��';
	return text;
}

function get_user_auction_status(auction_status, is_top, is_buyer)
{
	switch (auction_status) {
		case AUCTION_BIDDING:
			return '������'
		case AUCTION_BOOKED:
			if (is_top)
				return '<span class="cRed">���ĳɹ�<br>��֧��</span>';
			else
				return '�ȴ��б��߸���<br><span class="cGray">δ������������</span>'
		case AUCTION_OPEN_BUY:
			if (is_top)
				return '����ʧ��<br><span class="cRed">δ֧��</span>'
			else
				return '������';
		case AUCTION_PAID:
		case AUCTION_OPEN_BUY_PAID:
			if (is_buyer)
				return '�ѹ���'
			else if (is_top)
				return '����ʧ��<br><span class="cRed">δ֧��</span>'
			else
				return '����ʧ��<br>δ�б�'
		case AUCTION_CANCEL:
			return '����ȡ��'
		case AUCTION_ABORT:
			return '����'
		default:
			return 'δ֪״̬'
	}
}

function get_user_auction_action(auction_status, is_top)
{
	if (auction_status == AUCTION_BIDDING)
		return 'ȥ����';
	else if (auction_status == AUCTION_BOOKED && is_top)
		return 'ȥ֧��';
	else if (auction_status == AUCTION_OPEN_BUY && !is_top)
		return '����';
	else
		return '�鿴����';
}

function init_topbox_for_auction()
{
	if (!CgiRootUrl.startWith(window.location.protocol))
		return;
	if (!window.IsLogin)
		return;

	// ����һ�����ݵ�timeout��������domready�¼���ִ�У��Ա���������ȷ�ж�#top_sell_menu��״̬
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
					console.log(cookie_name, this.getAttribute('data-game_ordersn'));
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

function show_collect_panel()
{
	show_layer_center($("pageCoverCollect"), $("popupWinCollect"));
	return;
}

function hide_collect_panel()
{
	$("pageCoverCollect").setStyle("display", "none");
	$("popupWinCollect").setStyle("display", "none");
}

var IsDoingCollectOP = false;
function add_to_favorites()
{
	hide_collect_panel();
	if (IsDoingCollectOP){
		return;
	}

	var equip = window.collect_equip || window.equip;

	var attention = 1;
	if($('addention_onsale_check') && $('addention_onsale_check').checked)
		attention = 2;

	var remindful_price_value = $('remindful_price').get('value');
	var remindful_price = parseInt(remindful_price_value);
	if(remindful_price_value && isNaN(remindful_price)){
		alert("����������");
		return;
	}
	if(remindful_price <= 0){
		alert("���������۸�<=0�����Ѽ۸���������0Ԫ�����������á�");
		return;
	}else if(remindful_price >= equip['price']){
		alert("���������۸�>=��Ʒ��ǰ�۸������Ѽ۸�����С����Ʒ��ǰ�۸������������á�");
		return;
	}
	var user_level = Cookie.read('login_user_level');
	if (user_level && parseInt(user_level) < 50){
		if (!confirm("�𾴵����ң����ã��������Ľ�ɫ�ȼ�����50�����ղظ���Ʒ�󣬽�����������Ʒ�ղ������У������ղع��ܣ��鿴�ղء��������ѵȣ�������ʹ�ã���ȷ��Ҫ�ղظ���Ʒ����")){
			return;
		}
	}

	var url = CgiRootUrl + "/userinfo.py?act=ajax_add_collect&order_sn=" +
		equip["game_ordersn"] + "&attention=" + attention +
		"&query_tag=" + (window.CurQueryTag || '') + "&obj_server_id=" + equip['server_id'];

	if(remindful_price){
		url = url + "&remindful_price=" + remindful_price;
	}
	if(equip.collect_refer) {
		url += '&refer=' + equip.collect_refer;
	}
	var add_collect = function(data, txt){
		IsDoingCollectOP = false;
		if (!data["status"]){
			alert(data["msg"]);
			return;
		}
		alert("�����ղسɹ����뵽���ҵĲر���->�ҵ��ղء������鿴��");
		equip.add_collect_callback && equip.add_collect_callback();
	};

	var Ajax = new Request.JSON({"url":url,"onSuccess":add_collect, "noCache":true});
	Ajax.get();
	return false;
}

function del_from_favorites()
{
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
				return;
			}
			alert("ɾ���ղسɹ����뵽���ҵĲر���->�ҵ��ղء������鿴��");
			equip.del_collect_callback && equip.del_collect_callback();
		}
	});
	Ajax.get();
}

function login_to_collect()
{
	if (confirm("��¼�����ܽ��и�������!\n��Ҫ��¼����") == true){
		window.location.href = get_login_url({
				"equip_id" : $("equipid") ? $("equipid").value : '',
				"return_url" : window.location.href
		});
		return false;
	}
	return false;
}

var CHINESE_NUM_CONFIG = {1:"һ", 2:"��", 3:"��", 4:"��", 5:"��", 6:"��", 7:"��", 8:"��", 9:"��", 10:"ʮ"};
var ROLE_ZHUAN_ZHI_CONFIG = {0:"δ����", 1:"����", 2:"�ɽ�"};
