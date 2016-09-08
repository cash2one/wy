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

function tuneHeight(frame_name)
{
	var frm = document.getElementById(frame_name);
	var subWeb = document.frames ? document.frames[frame_name].document : frm.contentDocument;
	if(frm != null && subWeb != null)
	{
		if (subWeb.body.scrollHeight > 600)
			frm.height = subWeb.body.scrollHeight;
		else
			frm.height = 600;
	}
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

function addLoadEvent(func) 
{	
	var oldonload = window.onload;	
	if (typeof window.onload != 'function') 
	{		
		window.onload = func;	
	}	
	else 
	{		
		window.onload = function() 
		{			
			oldonload();			
			func();		
		}	
	}
}
function htmlEncode(s) {
		var str = new String(s);
		str = str.replace(/&/g, "&amp;");
		str = str.replace(/</g, "&lt;");
		str = str.replace(/>/g, "&gt;");
		str = str.replace(/"/g, "&quot;");
		return str;
}

function setCookie(name,value,expires,path,domain,secure)
{
	var cookie_str = name + "=" + escape(value);

	// set date
	var expireTime = new Date();
	if ( expires )
	{
		var expDays = expires*24*60*60*1000;
		expireTime.setTime(expireTime.getTime() + expDays);

		cookie_str += "; expires=" + expireTime.toGMTString();
	}
	//cookie_str += "; expires=" + expireTime.toGMTString();

	if( path )
	{
			cookie_str += "; path=" + path;
	}

	if( domain )
	{
			cookie_str += "; domain=" + domain;
	}

	if( secure )
	{
			cookie_str += "; secure=" + secure;
	}


	document.cookie = cookie_str

}

function setCookieSecond(name,value,expires,path,domain,secure)
{
	var cookie_str = name + "=" + escape(value);

	// set date
	var expireTime = new Date();
	if ( expires )
	{
		var expDays = expires*1000;
		expireTime.setTime(expireTime.getTime() + expDays);

		cookie_str += "; expires=" + expireTime.toGMTString();
	}
	//cookie_str += "; expires=" + expireTime.toGMTString();

	if( path )
	{
			cookie_str += "; path=" + path;
	}

	if( domain )
	{
			cookie_str += "; domain=" + domain;
	}

	if( secure )
	{
			cookie_str += "; secure=" + secure;
	}
	document.cookie = cookie_str
}

function getCookieValue(name)
{
	var m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));

	if (m)
	{
		return unescape(m[2])
	}

	return null;
}

function clearCookie(name)
{
    var expireTime=new Date();
    expireTime.setTime(expireTime.getTime()-10000);
    document.cookie = name + "=; expires=" + expireTime.toGMTString();
}

function deleteCookie(name, path, domain, secure){
    var expireTime=new Date();
    expireTime.setTime(expireTime.getTime()-10000);
    var cookie_str = name + "=; expires=" + expireTime.toGMTString();
	if( path )
	{
		cookie_str += "; path=" + path;
	}
	if( domain )
	{
			cookie_str += "; domain=" + domain;
	}
	if( secure )
	{
			cookie_str += "; secure=" + secure;
	}
	document.cookie = cookie_str
}


function load_user_menu(url)
{
	window.location = url;
}

function clear_old_cookie_var()
{
	clearCookie("main_menu_id");
	clearCookie("left_menu_id");
	clearCookie("msg_box_flag");
}

function get_login_url(other_arg)
{
	var server_name = ServerInfo["server_name"];
	if (Cookie.read("cur_servername")){
		var servername_in_ck = decodeURIComponent(Cookie.read("cur_servername"));
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

function is_login()
{
	var sid_value = getCookieValue('sid');
	if (!sid_value)
	{
		return false;
	}

	return true;
}

function alert_login()
{
	if (confirm("登录后才能进行该项操作!\n您要登录吗？") == true){
		window.location.href = get_login_url();
		return false;	
	}	
	return false;
}

function is_user_login()
{
	var is_login = parseInt(Cookie.read("is_user_login"));
	if (is_login == 1){
		return true;	
	} else {
		return false;	
	}
}

function fix_anonymous_menu_link()
{
	if (is_user_login()){
		return;
	}
	if ($("a_add_purchase_1")){
		$("a_add_purchase_1").addEvent("click", alert_login);
	}

	if ($("a_add_purchase_2")){
		$("a_add_purchase_2").addEvent("click", alert_login);
	}

	if($('banner_purchase_a')){
		$("banner_purchase_a").addEvent("click", alert_login);
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

var xmlhttp = null;
function trim(str)
{
	return str.replace(/(^\s*)|(\s*$)/g, "");
}
function get_response()
{
	return trim(xmlhttp.responseText);
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

function error(str)
{
	alert(str);
}


function get_xmhttp(){
	 function try_xmlhttp() {
	    var returnValue;
	    for (var i = 0, length = arguments.length; i < length; i++) {
  	    var lambda = arguments[i];
  	    try {
    	    returnValue = lambda();
    	    break;
    	  } catch (e) { }
    	}
    return returnValue
	}
	
	return try_xmlhttp(
      	function() {return new XMLHttpRequest()},
      	function() {return new ActiveXObject('Msxml2.XMLHTTP')},
      	function() {return new ActiveXObject('Microsoft.XMLHTTP')}
   ) || false; 
}

function execute_ajax(callback, url, data, method) {
	/*
    xmlhttp = (window.ActiveXObject) ? 
			new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
	*/
	xmlhttp = get_xmhttp();
	if (xmlhttp)
	{
		xmlhttp.onreadystatechange = callback;
		method = (method || 'GET').toUpperCase();
		if(method == 'GET'){
			url = url + "?" + data;
			xmlhttp.open(method, url, true);
			xmlhttp.send(null);
		}
		else if(method == 'POST'){
			xmlhttp.open(method, url, true);
			xmlhttp.send(data);
		}
	}
}

/* 
*
* Javascript Template
*
*/
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
                  
		var functionBody = "var __out = " + delimeter 
				+ body + delimeter + ";\n" + "return __out;\n";

		// Convert ' to \' and then change the delimeter to '
		functionBody = functionBody.replace(/'/g, "\\'");
		var regex = new RegExp(delimeter, 'g');
		functionBody = functionBody.replace(regex, "'");

		// Compile our function and return it
		return new Function(functionBody);
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

function js_eval(js_str){
	return eval("(" + js_str + ")");
}

function set_position_center(obj)
{
	obj_width = obj.offsetWidth;
	obj_height = obj.offsetHeight;
	with(obj.style)
	{
		left = document.documentElement.scrollLeft + (document.documentElement.clientWidth - obj_width)/2 + "px";
		top = document.documentElement.scrollTop + (document.documentElement.clientHeight - obj_height)/2 + "px";
	}
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
		var match_str = $1.replace(/\s+/g, "");
		return convert_dict[match_str];
	}
	var parser = new RegExp("\\(\\[|,?\\s*\\]\\)|\\({|,?\\s*}\\)", "g");
	return lpc_str.replace(parser, convert);
}

function search_equip_name(form_obj, ename_data)
{
	keyword = form_obj.search_text.value.trim();
	if (!keyword || keyword=="输入物品名称进行搜索")
	{
		alert("请输入物品名称进行搜索！");
		return false;
	}
	var result = [];
	for (j=0;j<ename_data.length;j++)
	{
		var ename = ename_data[j][0];
		if ((ename+"").indexOf(keyword) != -1)
		{
			result = result.concat(ename_data[j][2]);
		}
	}

	form_obj.equip_type_ids.value = result.join();
	form_obj.submit();
	return true;
}

function quick_sort(arr)
{
	if (arguments.length>1)
	{
		var low = arguments[1];
		var high = arguments[2];
	} 
	else
	{
		var low = 0;
		var high = arr.length-1;
	}
	if(low < high)
	{
		var i = low;
		var j = high;
		var pivot = arr[i];
		while(i<j)
		{
			while(i<j && arr[j]>=pivot)
				j--;
			if(i<j)
				arr[i++] = arr[j];
			while(i<j && arr[i]<=pivot)
				i++;
			if(i<j)
				arr[j--] = arr[i];
		}
		arr[i] = pivot;
		var pivotpos = i; 
		quick_sort(arr, low, pivotpos-1);
		quick_sort(arr, pivotpos+1, high);
	} 
	else
		return arr;
	return arr;
}

function  format_num_by_thousand(num)   
{   
	if(!/^(\+|-)?(\d+)(\.\d+)?$/.test(num))
		return num;
	var a = RegExp.$1, b = RegExp.$2, c = RegExp.$3;   
	var re = new RegExp("(\\d)(\\d{3})(,|$)");  
	while(re.test(b))   b = b.replace(re, "$1,$2$3");   
	return   "" + a + b + c;   
}

function dateDiff(interval, date1, date2)
{
	var objInterval = {'D' : 1000 * 60 * 60 * 24, 'H' : 1000 * 60 * 60, 'M' : 1000 * 60, 'S' : 1000, 'T' : 1};
	interval = interval.toUpperCase();
	var dt1 = Date.parse(date1.replace(/-/g, '/'));
	var dt2 = Date.parse(date2.replace(/-/g, '/'));
	return Math.round((dt2 - dt1) / objInterval[interval]);
} 

function get_browser()
{
	var Sys = {};
	var ua = navigator.userAgent.toLowerCase();
	window.ActiveXObject ? Sys.ie = ua.match(/msie ([\d.]+)/)[1] :
	(/firefox/i.test(ua)) ? Sys.firefox = ua.match(/firefox\/([\d.]+)/)[1] :
	(/chrome/i.test(ua) && /webkit/i.test(ua) && /mozilla/i.test(ua)) ? Sys.chrome = ua.match(/chrome\/([\d.]+)/)[1] :
	window.opera ? Sys.opera = ua.match(/opera.([\d.]+)/)[1] :
	window.openDatabase ? Sys.safari = ua.match(/version\/([\d.]+)/)[1] : 0;
	return Sys;
}

function redirect_with_referer(url){
	if(document.all){
		var link = document.getElementById('temp_redirect_with_referer_link');
		if(link){
			link.href=url;
			link.click();
		}
	}
	else{
		window.location = url;
	}
}

function getBrowserWidth(){
		if (window.innerWidth){
			winWidth = window.innerWidth;
		}else if ((document.body) && (document.body.clientWidth)){
			winWidth = document.body.clientWidth;
		}
		if (document.documentElement && document.documentElement.clientWidth){
			winWidth = document.documentElement.clientWidth;
		}
		return winWidth;
}

function get_window_size()
{
	var x,y;
	if (window.innerHeight) { 
		x = window.innerWidth;
		y = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight){
		x = document.documentElement.clientWidth;
		y = document.documentElement.clientHeight;
	} else if (document.body) {
		x = document.body.clientWidth;
		y = document.body.clientHeight;
	}
	return {"x":x, "y":y};
}

function get_window_scroll()
{
	var x,y;
	if(document.documentElement.scrollTop){
		x = document.documentElement.scrollLeft;
		y = document.documentElement.scrollTop;
	} else {
		x =  document.body.scrollLeft;
		y = document.body.scrollTop;
	}
	return {"x":x, "y": y};

}

function show_tips(el, tips_box)
{
	tips_box.style.display = 'block';
	var el_position = getAbsolutePos(el);

	w_size = get_window_size()
	w_scroll = get_window_scroll();
	// left post
	if(el_position.x + el.offsetWidth + 8 + tips_box.offsetWidth  > w_size.x + w_scroll.x){
		tips_box.style.left = (el_position.x - tips_box.offsetWidth - 8) + 'px';
	} else {
		tips_box.style.left = (el_position.x + el.offsetWidth + 8) + 'px';
	}

	// top pos
	if(el_position.y + tips_box.offsetHeight > w_size.y + w_scroll.y){
		if(el_position.y + el.offsetHeight - tips_box.offsetHeight < w_scroll.y){
			tips_box.style.top = (w_scroll.y + 10) + 'px';
		}
		else{
			tips_box.style.top = (el_position.y + el.offsetHeight - tips_box.offsetHeight) + 'px';
		}
	
	} else {
		tips_box.style.top =  el_position.y + 'px';
	}
}

function add_latest_view(serverid, equipid){
	var equipids = getCookieValue('latest_views') || '';
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
	setCookie('latest_views', equipids, 30, "/");
}

var Popup =  new Class({
	initialize: function(pop_el){
		this.pop_el = pop_el;
	},

	show_over_layer: function(){
		var overLayer = $('pop_over');
		if(overLayer == null){
			var overLayer = document.createElement('div');
			overLayer.id = 'pop_over';
			overLayer.className = 'pageCover';
			document.body.appendChild(overLayer);
		}
		document_size = window.getScrollSize();
		overLayer.style.height = document_size.y + 'px';
		overLayer.style.width = document_size.x + 'px';
		overLayer.style.display = 'block';
	},

	set_position_center: function(el){
		var el_size = el.getSize();
		var window_size = window.getSize();
		var window_scroll = window.getScroll();
		styles = {
			"left": window_scroll.x + window_size.x/2 - el_size.x/2,
			"top": window_scroll.y + window_size.y/2 - el_size.y/2
		}
		el.setStyles(styles);
	},

	set_size: function(){
		var overLayer = $('pop_over');
		document_size = window.getScrollSize();
		overLayer.style.height = document_size.y + 'px';
		overLayer.style.width = document_size.x + 'px';
		this.set_position_center(this.pop_el);
	},

	show: function(){
		this.show_over_layer();		
		this.pop_el.style.display = 'block';
		this.set_position_center(this.pop_el)
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
});

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

var EQUIP_TAKE_BACK = 0;
var EQUIP_STORE = 1;
var EQUIP_SELLING = 2;
var EQUIP_BOOKING = 3;
var EQUIP_PAID = 4;
var EQUIP_TRADE_FINISH = 5;
var EQUIP_TAKE_AWAY = 6;
var EQUIP_PROBLEM_TRADE = 7;

var EquipStatus = {
	0 : "取回",
	1 : "暂存",
	2 : "上架中",
	3 : "被预订",
	4 : "被预订",
	5 : "已付款购买",
	6 : "交易完成"
};

var ORDER_NO_PAY = 1;  
var ORDER_PAIED = 2;  
var ORDER_CANCEL = 3;  
var ORDER_EXPIRED = 4;  
var ORDER_REFUNDMENT = 5;  
var ORDER_SUCCESS = 6;  
var ORDER_REFUNDMENT_FINISH = 7;

var OrderStatus = {
	1 : "未付款",
	2 : "已付款",
	3 : "已废除",
	4 : "过期",
	5 : "退款中",
	6 : "交易成功",
	7 : "已退款"
};

var StorageStype = {"equip":1,"pet":2,"money":3,"role" :4};


function get_kind_id_obj_by_name_list(kind_list, name_list)
{
	var result = {};
	for (var i=0; i < kind_list.length; i++){
		var kind_id =  kind_list[i][0][0];
		var kind_name =  kind_list[i][0][1];
		if (name_list.indexOf(kind_name)>-1){
			result[kind_name] = kind_id;
		}
		
		var childs = kind_list[i][1];
		if (childs.length != 0){
			var child_result = get_kind_id_obj_by_name_list(childs, name_list);
			for(var p in child_result){
				result[p] = child_result[p];
			}
		}
	}
	return result;
}

function get_kind_info_by_name_list(name_list)
{
	//[kind] is global
    var kind_list = [];
    var kind_id_obj = get_kind_id_obj_by_name_list([kind], name_list);
    for (var i=0; i < name_list.length; i++){
        if (kind_id_obj[name_list[i]]){
            kind_list.push({"kind_name":name_list[i], "kind_id":kind_id_obj[name_list[i]]});
        }
    }
    return kind_list;
}


function get_color_price(price, if_add_unit) /* yuan */
{
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

function if_is_testing()
{
	if (["332"].contains(ServerInfo["server_id"])){
		// check testing server
		if (ServerInfo["server_id"] == "332"){
			if (["500", "测试服"].contains(ServerInfo["server_name"])){
				return true;
			} else {
				return false;
			}
		}
		return true;
	}
	
	return false;
}
CAPTCHA_LEN = 5;


function get_human_read_dhb(amount)
{
	if(amount < 1000000)
		return;
		
	msg = '';
	var need_w = false;
	hundred_million = amount / 100000000;
	if(hundred_million >= 1)
	{
		msg += parseInt(hundred_million) + '亿';
		amount = amount % 100000000;
	}
	ten_million = amount / 10000000;
	if(ten_million >= 1)
	{
		msg += parseInt(ten_million) + '千';
		amount = amount % 10000000;
		need_w = true;
	}
	else
	{
		if(msg != "" && amount / 1000000 >= 1)
			msg += '零';
	}
	million = amount / 1000000; 
	if(million >= 1)
	{
		msg += parseInt(million) + '百';
		amount = amount % 1000000;
		need_w = true;
	}

	if(need_w)
		msg += '万';
	if(amount != 0)
		msg = '约' + msg;
	if(msg != '')
	{
		var style = "font-weight:bold;";
		if(hundred_million >= 1){
			style += "color:#C00";
		}
		return "<span style='" + style + "'>" + msg + "</span>";
	}
}

function get_pager_num(cur_page, total_pages, num_span)
{
	var middle = parseInt(num_span/2);
	
	if (cur_page <= middle + num_span%2){
		beginp = 1;
		if (total_pages < num_span){
			endp = total_pages;
		}else{
			endp = num_span;
		}
		return [beginp, endp];
	}
	if (cur_page > total_pages - middle - num_span%2){
		endp = total_pages;
		beginp = total_pages - num_span + 1;
		if (beginp < 1){
			beginp = 1;
		}
		return [beginp, endp]
	}
	
	beginp = cur_page - middle;
	endp = cur_page + middle - 1 + num_span%2;
	return [beginp, endp];
}

function is_purchase_test_server()
{
	if (window.ServerInfo == undefined){
		return;
	}
	

	if ($("purchase_guide_panel")){
		$("purchase_guide_panel").setStyle("display", "");
	}
	
	if ($("mycbg_purchase")){
		$("mycbg_purchase").setStyle("display", "");
	}
}
window.addEvent('domready', is_purchase_test_server);


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
	if (Cookie.read("view_mkey_app_ad")){
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
		Cookie.write("view_mkey_app_ad", "1", {"path":"/", "duration":30});	
		window.open("http://mkey.163.com/help/2013/10/29/11419_401365.html");
		popup.hide();
		return false;
	});
	
	$("btn_close_mobile_ad_layer").addEvent("click", function(){
		Cookie.write("view_mkey_app_ad", "1", {"path":"/", "duration":30});	
		popup.hide();
		return false;
	});

	$("btn_close_mobile_ad_layer_2").addEvent("click", function(){
		Cookie.write("view_mkey_app_ad", "1", {"path":"/", "duration":30});	
		popup.hide();
		return false;
	});	
}


function parse_pet_skills(pet_desc)
{
	var re = new RegExp('技能[1-9]{1}\:[^；;#]+', "g");
	var skill_list = pet_desc.match(re);
	if (!skill_list){
		skill_list = [];
	}
	
	var special_skill_re = new RegExp('神兽技能格\:[^；;#]+', "g");
	var special_skills = pet_desc.match(special_skill_re);
	if (special_skills){
		skill_list.extend(special_skills);
	}
	return skill_list;
}

function fen2yuan(fen){
	var yuan = fen/100;
	return yuan.toFixed(2);
}

function get_equip_level_desc(storage_type, level_desc_str, equip_desc)
{
	// just deal pet
	if (storage_type != StorageStype["pet"]){
		return level_desc_str;
	}
	var pet_re = /^\(\[/;
	if (!pet_re.test(equip_desc)){
		return level_desc_str;
	}

	var info = js_eval(lpc_2_js(equip_desc));
	if (info["iFlyupFlag"] != undefined && info["iFlyupFlag"]){
		var zhuan_index = level_desc_str.indexOf("转");
		if(zhuan_index == -1) {
			return level_desc_str;
		}
		var new_level_str = "点化" + level_desc_str.substring(zhuan_index + 1);
		return new_level_str;
	} else {
		return level_desc_str;
	}
}

function get_pet_level(raw_level_str, pet_desc) 
{
	var info = js_eval(lpc_2_js(pet_desc));
	if (info["iFlyupFlag"] != undefined && info["iFlyupFlag"]){
		var zhuan_index = raw_level_str.indexOf("转");
		if(zhuan_index == -1) {
			return raw_level_str;
		}
		var new_level_str = "点化" + raw_level_str.substring(zhuan_index + 1);
		return new_level_str;
	} else {
		return raw_level_str;
	}
}

function get_role_level(info)
{
	if (typeof info == "string")
		info = js_eval(lpc_2_js(info));
	if (info.iFlyupFlag){
		return "飞升" + info["iGrade"] + "级";
	} else {
		return info["iRei"] + "转" + info["iGrade"] + "级";
	}
}

function get_real_equip_level()
{
	// add equip level
	var xianqi_kindid = "";
	var kind_list = get_kind_info_by_name_list(["仙器"]);
	if (kind_list.length != 0){
		xianqi_kindid = kind_list[0]["kind_id"] + "";
	}
	var type_info = KindEquipTypes[xianqi_kindid];

	var equip_el_list = $$("#t_equip_list .photo img");
	for (var i=0; i < equip_el_list.length; i++){
		var el = equip_el_list[i];
		var equipid = el.getAttribute("data_equipid");
		if (!equipid){
			continue;
		}
		var equip_type = el.getAttribute("data_equip_type");
		var equip_level = el.getAttribute("data_equip_level");
		var equip_level_desc = el.getAttribute("data_equip_level_desc")
		var storage_type = el.getAttribute("data_storage_type");
		var desc = $('large_equip_desc_' + equipid).value.trim();
		if(storage_type == "2"){
			var level_desc = get_pet_level(equip_level_desc, desc);
		} else if (type_info[equip_type]){
			var level_desc = equip_level + "阶";
		} else {
			var level_desc = equip_level_desc;
		}
		
		$("level_desc_" + equipid).innerHTML = level_desc;		
	}
}

function init_fingerprint()
{
	var device_id = new Fingerprint().get();

	if ($("device_id")){
		$("device_id").value = device_id;
	}	
}

var OrderedRoleName = ["逍遥生","剑侠客","猛壮士","飞剑侠","纯阳子","飞燕女","英女侠","俏千金","燕山雪","红拂女","虎头怪","巨魔王","夺命妖","逆天魔","混天魔","狐美人","小蛮妖","骨精灵","媚灵狐","九尾狐","神天兵","智圣仙","龙战将","武尊神","紫薇神","舞天姬","玄剑娥","精灵仙","玄天姬","霓裳仙","无涯子","猎魂引","祭剑魂","夜溪灵","墨衣行","幽梦影","神秀生","玲珑女","绝影魔","霜月灵","青阳使","云中君","南冠客","镜花影"];


