// captcha check
CK_SESSION_TIMEOUT = 3;

var LoginCaptchaCheck = new Class({
	initialize : function(){
		this.pass_check = false;
		this.is_query = false;
		this.current_ck = null;
		this.error_history = [];
		
		this.img_right = ResUrl + "/images/check_right.gif";
		this.img_wrong = ResUrl + "/images/check_wrong.gif";
		this.img_querying = ResUrl + "/images/check_loading.gif";
	},

	reset_status : function(){
		this.is_query = false;
		$("captcha_check_indicator").setStyle("display", "none");
		this.current_ck = null;
		this.pass_check = false;
	},
	
	reset_ck_history : function(){
		this.error_history = [];
	},
	
	check_captcha_success : function(){
		this.is_query = false;
		this.pass_check = true;
		this.captcha_is_right();
		this.current_ck = null;	
	},
	
	do_check_captcha : function(data, txt){
		if ($("image_validate").value != this.current_ck){
			this.reset_status();
			this.check_login_captcha();
			return;			
		}
		
		// if captcha session timeout
		if (data["status"] == CK_SESSION_TIMEOUT){
			error_msg("请重新输入验证码");
			this.reset_status();
			update_cpatcha_img();
			return;
		}
		
		if (data["status"] == 1){
			this.check_captcha_success();
			return;
		} else {
			this.reset_status();
			this.cpatcha_is_wrong();
			this.error_history.push($("image_validate").value);
			if ($("image_validate").value != this.current_ck){
				this.check_login_captcha();
				return;
			}
			return;
		}
	},
	
	cpatcha_is_wrong : function(){
		$("captcha_check_indicator").src = this.img_wrong;
		$("captcha_check_indicator").setStyle("display", "");
	},
	
	captcha_is_right : function(){
		$("captcha_check_indicator").src = this.img_right;
		$("captcha_check_indicator").setStyle("display", "");	
	},

	captcha_is_pending : function(){
		$("captcha_check_indicator").src = this.img_querying;
		$("captcha_check_indicator").setStyle("display", "");	
	},
	
	
	check_login_captcha : function(){
		if (this.is_query){
			return;
		}
		
		if ($("image_validate").value.length < CAPTCHA_LEN){
			//$("captcha_check_indicator").src = this.img_wrong;
			$("captcha_check_indicator").setStyle("display", "none");
			return;
		}
		
		if (this.error_history.contains($("image_validate").value)){
			this.cpatcha_is_wrong();
			return;
		}
		
		var query_url  = CgiRootUrl + "/show_captcha.py";   
		var self_obj = this;
		function do_check_captcha(data, txt){
				self_obj.do_check_captcha(data, txt);
		}   
		
		this.captcha_is_pending();
		this.is_query = true;
		this.current_ck = $("image_validate").value;
		var Ajax = new Request.JSON({
			"url":query_url,
			"onSuccess":do_check_captcha,
			"onException" : update_cpatcha_img,
			"onFailure" : update_cpatcha_img,
			"onError" : update_cpatcha_img,
			"onTimeout" : update_cpatcha_img
		});		
		Ajax.get({
			"act" : "check_login_captcha",
			"captcha" : $("image_validate").value
		}); 
		
	}
});


var CaptchaManager = null;
function check_login_captcha(event)
{
	if (event.key == "enter" && CaptchaManager.pass_check){
		return;
	}
	
	CaptchaManager.check_login_captcha();
}

function update_cpatcha_img()
{
	CaptchaManager.reset_status();
	CaptchaManager.reset_ck_history();
	$("validate_img").src = CgiRootUrl + "/show_captcha.py?stamp=" + Math.random();	
}

function init_captcha_manager()
{
	CaptchaManager = new LoginCaptchaCheck();
	$("image_validate").addEvent("keyup", check_login_captcha);
	$("validate_img").addEvent("click", update_cpatcha_img);
	update_cpatcha_img();
}


function init_vrboard()
{
		$("use_vkboard").innerHTML = "<a class='keyboard' href='javascript:show_vrboard()'>使用软键盘</a>"
}

function show_vrboard()
{
	$("use_vkboard").innerHTML = "<a class='keyboard' href='javascript:hidden_vrboard()'>关闭软键盘</a>"	
	if (!vkb)
	{
		vkb = new VKeyboard("keyboard",    // container's id
		keyb_callback, // reference to the callback function
		true,          // create the numpad or not? (this and the following params are optional)
		"",            // font name ("" == system default)
		"14px",        // font size in px
		"#000",        // font color
		"#F00",        // font color for the dead keys
		"#FFF",        // keyboard base background color
		"#FFF",        // keys' background color
		"#DDD",        // background color of switched/selected item
		"#777",        // border color
		"#CCC",        // border/font color of "inactive" key (key with no value/disabled)
		"#FFF",        // background color of "inactive" key (key with no value/disabled)
		"#F77",        // border color of the language selector's cell
		true,          // show key flash on click? (false by default)
		"#CC3300",     // font color during flash
		"#FF9966",     // key background color during flash
		"#CC3300",     // key border color during flash
		false);        // embed VKeyboard into the page?

		var position = getAbsolutePos($("use_vkboard"));
		var keyboard_obj = $("keyboard");
		keyboard_obj.style.position = "absolute";
		keyboard_obj.style.left = (position.x - 130) + "px";
		keyboard_obj.style.top = (position.y + 20)+ "px";
		keyboard_obj.style.visibility = "visible";
		
		// test
		var close_button = $("close_keyboard");
		close_button.style.left = (position.x + 245) + "px";
		close_button.style.top = (position.y + 130)+ "px";
		close_button.style.visibility = "visible";
	}
	else
	{
		vkb.Show(true);
		$("close_keyboard").style.visibility = "visible";
	}

}

function hidden_vrboard()
{
		$("use_vkboard").innerHTML = "<a class='keyboard' href='javascript:show_vrboard()'>使用软键盘</a>";
		vkb.Show(false);
		$("close_keyboard").style.visibility = "hidden";
}

// Callback function:
function keyb_callback(ch)
{
		var text = $("password"); 
		var val  = text.value;
		switch(ch)
		{
				case "BackSpace":
						var min = (val.charCodeAt(val.length - 1) == 10) ? 2 : 1;
				text.value = val.substr(0, val.length - min);
				break;

				case "Enter":
						text.value += "\n";
				break;

				default:
				text.value += ch;
		}

		text.focus();
}


		function show_server_info()
		{
			var area_name   = htmlEncode(decodeURIComponent(getPara("area_name")));
			var server_name = htmlEncode(decodeURIComponent(getPara("server_name")));
			var server_id   = htmlEncode(getPara("server_id"));
			var area_id     = htmlEncode(getPara("area_id"));
			var equip_id    = htmlEncode(getPara("equip_id"));
			
			var server_info = '';
			if(area_name)
				server_info = area_name + "->";
			if(server_name)
				server_info += server_name;
			$("server_info").innerHTML = server_info;
			$("server_name").value     = server_name;
			$("server_id").value       = server_id;
			$("area_id").value         = area_id;
			$("area_name").value         = area_name;
			$("equip_id").value        = equip_id;
			
		}

		function error_msg(msg)
		{
			$("login_alert_msg").setStyle("display", "");
			$("login_alert_msg").innerHTML = msg;
		}
				
		function check_input(input_data)
		{
				var urs = input_data.urs.value;
				var urs_len = urs.length;
				if (urs_len <MinUrsLen || urs_len > MaxUrsLen || urs.indexOf("@") == -1 || urs == AutoUrs.defaultUrs)
				{
						error_msg("请输入正确的通行证帐号！");
						return false;
				}

				var pwd = input_data.password.value;
				var pwd_len = pwd.length;
				if ( pwd_len < MinPwdLen || pwd_len > MaxPwdLen)
				{
						error_msg("请输入正确的通行证密码！");
						return false;
				}

				var img_validate = input_data.image_validate.value;
				if (!match_obj.test(img_validate))
				{
					error_msg("请输入正确的验证码！");
					input_data.image_validate.select();
					return false;
				}
				

				return true;
		}

		function create_hidden_input(name, value){
			var input = document.createElement('input');
			input.type = 'hidden';
			input.name = name;
			input.value = value;
			return input;
		}

		function anonymous_search()
		{
			// var image_validate = $("image_validate").value;
			// if (!match_obj.test(image_validate))
			// {
			// 	error_msg("请输入正确的验证码进行匿名浏览！");
			// 	$("image_validate").select();
			// 	return false;
			// }

			var server_id   = getPara("server_id");
			var server_name = decodeURIComponent(getPara('server_name'));
			var form = document.createElement('form');
			form.action = CgiRootUrl + '/login.py';
			form.method='GET';
			form.appendChild(create_hidden_input('act', 'do_anon_auth'));
			// form.appendChild(create_hidden_input('image_value', image_validate));
			form.appendChild(create_hidden_input('server_id', server_id));
			form.appendChild(create_hidden_input('server_name', server_name));
			var next_url = getPara('return_url');
			if(next_url)
				form.appendChild(create_hidden_input('next_url', decodeURIComponent(next_url)));
			document.body.appendChild(form);
			form.submit();
		}

function reg_submit(){
	var login_form = $('login_form');
	var suc_paras = {
		'act': 'suc',
		'server_id': login_form.server_id.value,
		'server_name': login_form.server_name.value,
		'area_id': login_form.area_id.value,
		'area_name': login_form.area_name.value
	}
	var url = 'https://reg.163.com/logins.jsp';
	var paras = {
		'username': login_form.urs.value,
		'password': login_form.password.value.toMD5(),
		'type': 0,
		'url': CgiRootUrl + '/reg_login.py?' + Object.toQueryString(suc_paras),
		'url2': CgiRootUrl + '/reg_login.py?act=error',
		'product': 'cbg',
		'savelogin': 0,
		'noRedirect': 0
	};	
	var f = $('common_submit_form');
	if(!f){
		var f = new Element('form', {'id': 'common_submit_form'});
		f.setStyle('display', 'none');
		f.inject(document.body);
	}
	f.method = 'post';
	f.action = url;
	f.empty();
	for(var p in paras){
		f.grab(new Element('input', {'type': 'hidden', 'name': p, 'value': paras[p]}));
	}
	f.submit();
}

function login_submit(){
	var login_form = $('login_form');
	if (!check_input(login_form)){
		return	
	}
	if(login_form.retrieve('submiting')){
		return;	
	}
	error_msg('loading......');
	login_form.store('submiting', true);
	var url = CgiRootUrl + '/reg_login.py?act=check_captcha';
	var req = new Request.JSON({
		url: url,
		onSuccess: function(result, txt){
			if(result['status'] == 1){
				reg_submit();
			} else {
				error_msg(result.msg);
			}
		},
		onComplete: function(){
			login_form.eliminate('submiting');
		}
	});
	req.post({'code': login_form.image_value.value});
}

var login_tabs = [
	{
		div: 'passwordLogin',
		tab: 'passwordLoginTab',
		server_name_container: 'passwordLoginServerNameContainer',
		captcha_container: 'passwordLoginCaptchaContainer',
		captcha_input_container: 'passwordLoginCaptchaInputContainer',
		alert_container: 'passwordLoginAlertContainer'
	},
	{
		div: 'qrLogin',
		tab: 'qrLoginTab',
		server_name_container: 'qrLoginServerNameContainer',
		captcha_container: null,
		captcha_input_container: null,
		alert_container: null
	},
	{
		div: 'anonymousLogin',
		tab: 'anonymousLoginTab',
		server_name_container: 'anonymousLoginServerNameContainer',
		captcha_container: 'anonymousLoginCaptchaContainer',
		captcha_input_container: 'anonymousLoginCaptchaInputContainer',
		alert_container: 'anonymousLoginAlertContainer'
	}
];
function move_node(child, newparent) {
	if (newparent) {
		var child_node = $(child);
		$(newparent).appendChild(child_node.parentNode.removeChild(child_node));
		// Hiding and redisplaying fixes a strange problem in IE6
		$(child).setStyle('display', 'none');
		$(child).setStyle('display', '');
	}
}
var current_login_tab = -1;
function select_login_tab(k) {
	if (current_login_tab == k)
		return;
	current_login_tab = k;
	for (var i = 0; i < login_tabs.length; ++i) {
		if (i == k) {
			$(login_tabs[i].div).style.display = '';
			$(login_tabs[i].tab).addClass('on');
		} else {
			$(login_tabs[i].div).style.display = 'none';
			$(login_tabs[i].tab).removeClass('on');
		}
	}
	$('login_alert_msg').setStyle('display', 'none');
	move_node('serverNameSpan', login_tabs[k].server_name_container);
	move_node('captchaSpan', login_tabs[k].captcha_container);
	move_node('captchaInputSpan', login_tabs[k].captcha_input_container);
	move_node('loginAlertSpan', login_tabs[k].alert_container);
	// When qrcode.min.js draws QR code in an invisible DIV,
	// it sets unreasonable margin values if <table> is used (IE only). Fix it here.
	var children = $('qrcode').childNodes;
	for (var i = 0; i < children.length; ++i) {
		var child = children[i];
		if (child.nodeName.toLowerCase() == "table")
			child.style.margin = '0px';
	}
	// Enabling/disabling polling URS
	qrcode_set_polling_status(k == 1);
}
function login_tab_init() {
	qrcode_login_init(CgiRootUrl, CgiRootUrl, {size: [120, 120]});
	select_login_tab(0);
	for (var i = 0; i < login_tabs.length; ++i) {
		(function(i) {
			$(login_tabs[i].tab).addEvent('mouseover', function() {
				select_login_tab(i);
			});
		})(i);
	}
}

/*  cross server login logic start */


var ShowCrossServerList = new Class({
	initialize : function(){
		this.chose_areaid = null;	
		this.chose_areaname = null;
			
		this.chose_serverid = null;
		this.chose_server_name = null;

		this.area_row_num = 1;
		this.area_column_num = 4;
		this.default_area_el = null;
				
		// gen area html
		this.init_area_element();
		
		// gen server html
		this.server_row_num = 9;
		this.server_column_num = 7;
		this.init_server_element();

		
		//show default servers
		this.chose_area(this.default_area_el);
		
		this.last_selected_server_el = null;

	},
	
	chose_area : function(area_el){
		this.chose_areaid = area_el.getAttribute("data_areaid");
		this.chose_areaname = area_el.getAttribute("data_area_name");
		
		this.chose_serverid = null;
		
		var area_el_list = $$("#area_table_panel li a");
		for (var i=0; i < area_el_list.length; i++){
			area_el_list[i].getParent().removeClass("alt");
		}
		area_el.getParent().addClass("alt");
		
		this.show_servers_of_area(parseInt(this.chose_areaid));
	},
	
	chose_server : function(server_el){
		var el_list = $$("#server_table_panel li a");
		for (var i=0; i < el_list.length; i++){
			el_list.removeClass("on");
		}
		server_el.addClass("on");
		
		this.chose_serverid = server_el.getAttribute("data_serverid");
		this.chose_server_name = server_el.getAttribute("data_server_name");
		
		notify_server_change(this.chose_areaid, this.chose_areaname, this.chose_serverid, this.chose_server_name);
	},
		
	init_area_element: function(){
		var inner_html = [];
		for(var i =0; i < this.area_row_num; i++){
			for(var j=0; j < this.area_column_num; j++){
				inner_html.push('<li id="area_el_' + (i * this.area_column_num + j + 1) + '">&nbsp;</li>');
			}
		}
		$("area_table_panel").innerHTML = inner_html.join("");
		
		// fill area le conetn
		
		var i = 0;
		var default_el_id;
		for(area_id in server_data){
			var area_name = server_data[area_id][0][0];
			var position  = server_data[area_id][0][1].split("_");
			var game_areaid = server_data[area_id][0][2];
			var el_id = "area_el_" + (parseInt((position[1] -1) * this.area_column_num) + parseInt(position[0]));
			
			var a_content = "<a id='link_10" + ( i + 2)+ "' href='#' data_area_name='" + area_name + "' data_areaid='" + area_id + "'>" + area_name + "</a>";
			$(el_id).innerHTML = a_content;
	
			i++;
		}
		
		// add click event
		var area_el_list = $$("#area_table_panel li a");
		var that = this;
		for(var i=0; i < area_el_list.length; i++){
			if (i == 0){
				this.default_area_el = area_el_list[i];
			}
			
			area_el_list[i].addEvent("click", function(){
				that.chose_area($(this));
				return false;
			});
		}
		
	},
	
	init_server_element : function(){
		var inner_html = [];
		for(var i =0; i < this.server_row_num; i++){
			for(var j=0; j < this.server_column_num; j++){
				inner_html.push('<li class="empty" id="server_el_' + (i * this.server_column_num + j + 1) + '"></li>');
			}
		}
		$("server_table_panel").innerHTML = inner_html.join("");
	},
	
	show_servers_of_area : function(area_id){
		// clear all old
		this.init_server_element();
				
		var server_list = server_data[area_id][1];
		
		for(var i=0; i < server_list.length; i++){
			var serverid = server_list[i][0];
			var server_name = server_list[i][1];
			var position = server_list[i][2].split("_");
			
			var cls = "";
			if (!AllowServeridList.contains(serverid)){
				cls = "disable";
			}
			
			var el_id = "server_el_" + (parseInt((position[1] -1) * this.server_column_num) + parseInt(position[0]));
			
			var el_html = '<a href="#" data_serverid="' + serverid + '"';
			el_html += ' data_server_name="' + server_name + '"'
			el_html += 'class="' + cls + '">' + server_name + '</a>'
		
			$(el_id).innerHTML = el_html;
			$(el_id).classNmae = "";
		}
	
		var el_list = $$("#server_table_panel li a");
		var that = this;
		for (var i=0; i < el_list.length; i++){
			if (el_list[i].hasClass("disable")){
				el_list[i].addEvent("click", function(){
					alert("不允许跨服购买");
					return false;
				});
			} else {
				el_list[i].removeClass("empty");
				el_list[i].addEvent("click", function(){
					that.chose_server($(this));
					return false;
				});
			}
		}
		
	}	
	
});

function notify_server_change(areaid, area_name, serverid, server_name)
{
	if (server_name.length == 0){
		var server_info = "请选择服务器";	
	} else {
		var server_info = area_name + '->' + server_name;
	}
	
	$("server_info").innerHTML = server_info;
	$("server_name").value = server_name;
	$("server_id").value = serverid;
	$("area_id").value  = areaid;
	$("area_name").value = area_name;
}

function chose_server_by_name()
{
	var server_name = $("ssearch_text").value;

	if (server_name == '服务器搜索'){
		alert("请输入正确的服务器名称");
		return;
	}

	for (var areaid in server_data){
		var area_data = server_data[areaid];
		
		var servers = area_data[1];
		for (var i=0; i < servers.length; i++){

			var serverid = servers[i][0];
			if (server_name == servers[i][1] && AllowServeridList.contains(serverid)){
				notify_server_change(areaid, area_data[0][0], serverid, server_name);
				return;
			}
		}
	}
	
	alert("未找到相关服务器");
	return;
}

function server_name_auto_complete_init()
{
	var handle_func = function(keyword){
		var result = new Array();
		for (var j in server_data){
			var server_list = server_data[j][1];
			for (var i = 0; i < server_list.length; i++){
				var server = server_list[i];
				if (AllowServeridList.contains(server[0]) && server[1].indexOf(keyword) != -1){
					result.push(server[1]);
				}
			}
		}
		return result;
	};
	new AutoComplete($('ssearch_text'),{
		"startPoint" : 1,
		"promptNum" : 20,
		"handle_func" : handle_func,
		"callback" : function(){}
	});
}

function submit_cross_server_login_form()
{
	if ($("server_id").value.length == 0){
		alert("请选择服务器");
		return false;
	}
	login_submit();
}

function cross_server_page_init()
{
	var ServerManager = new ShowCrossServerList();
	notify_server_change("", "", "", "");
	
	server_name_auto_complete_init();
	
	AutoUrs.bind("urs",{tabTo:"password",cookie:"global"});
	$('login_form').onkeypress =  function(e){
		var e = e || event;
		var keynum;
		try{keynum=e.keyCode}catch(e){keynum=e.which}
			if(keynum == 13){
				if(this.urs.value!='' && this.urs.value != AutoUrs.defaultUrs){
					login_submit();
				} else {
					anonymous_search();
				}
				return false;
			}
			return true;
	};
	
	if (server_type == 3){
		$("server_type_tips").innerHTML = "只能选择四年以上服务器";
	} else if (server_type == 2){
		$("server_type_tips").innerHTML = "只能选择一年半至4年服务器";	
	} else {}
	
}

function reselect_server()
{
	notify_server_change("", "", "", "");
}
