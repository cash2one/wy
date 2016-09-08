var CurSearchValue = {};
CurSearchValue.order_by = {
	key:null,
	sort: null
};
function overall_search(search_arg, page, order_by){
	if(!page){page=1;}
	var arg = {
		"act" : OverallSearchAct,
		"page": page
	}
	if(order_by.key){
		arg['order_by'] = order_by.key + ' ' + order_by.sort;
	}
	for(p in search_arg){
		arg[p] = search_arg[p];
	}
	var request = new Request.JSON({
		'url': CgiRoot + '/xyq_overall_search.py',
		"noCache" : true,
		'onRequest': function(){
			$('loading_img').setStyle('display', '');
			$('search_result').empty();
			$('pager').empty();
		},
		'onSuccess': function(result){
			$('loading_img').setStyle('display', 'none');
			if(result['status'] == 2){
				show_captcha();
				return;
			} else if(result.status != 0){
				alert(result.msg);
				return;
			}
			if (result.msg.length > 0){
				var equips = result.msg;
				render_to_replace('search_result', 'search_result_templ', {
					'equips': equips});
				reg_tips_event();
			} else {
				render_to_replace('search_result', 'search_empty_templ');
			}
			if(result.paging.num_end > 1){
				render_to_replace("pager", "pager_templ", {"pager":result.paging});
			}
		}
	}).get(arg);
}

function go_overall_search(arg){
	CurSearchValue.arg = arg;
	overall_search(arg, null, CurSearchValue.order_by);
	update_overall_search_saved_query();
}

function goto(page_num)
{
	if(CurSearchValue.arg){
		overall_search(CurSearchValue.arg, page_num, CurSearchValue.order_by);
	}
}

function pager_keydown_handler(src, e)
{
	var e = e || window.event;
	var keynum;
	try{keynum=e.keyCode}catch(e){keynum=e.which}
	if(keynum == 13){//enter
		goto(src.value);
	}
}

function search_order_by(order_key){
	if(CurSearchValue.order_by.key == order_key){
		CurSearchValue.order_by.sort = CurSearchValue.order_by.sort == 'DESC'? 'ASC': 'DESC';
	} else {
		CurSearchValue.order_by.key = order_key;	
		CurSearchValue.order_by.sort = 'DESC';
	}
	overall_search(CurSearchValue.arg, null, CurSearchValue.order_by);
}

function get_name_from_conf(id, conf){
	for(var i=0; i<conf.length; i++){
		if(conf[i][0] == id){
			return conf[i][1];
		}
	}
}

function get_names_by_value(value, conf){
	return value.map(function(v){return get_name_from_conf(v, conf)});
}

function get_name_from_dict(id, conf){
	for(var p in conf){
		if(conf[p] == id){
			return p;	
		}
	}
}

function parse_role_info(raw_info){
	return js_eval( lpc_2_js(raw_info) )
}

function parse_desc_info(desc_info){
	return desc_info;
}

/*
*
* cross server: user server select
*
*/

var UserServerSelector = new Class({
    initialize : function(){
    	// add reset event
    	var self = this;
    	$("btn_reset_user_server").addEvent("click", function(){
			Cookie.write("cross_server_serverid", "");
			Cookie.write("cross_server_areaname", "");
			Cookie.write("cross_server_servername", "");
			if ($("user_serverid")){
				$("user_serverid").value = "";
			}
	    			
    		self.no_server_selected();
    		return false;
    	});
    
    },
    
    no_server_selected : function(){
    	render_to_replace("user_server_info_box", "no_server_select_templ", {});
    	
    	// add ev
    	var self = this;
    	$("btn_show_server_select_box").addEvent("click", function(){
    		self.show_server_select_box();
    		return false;
    	});
    },
    
    chose_server : function(args){
    	/*
		alert(args["server_id"]);
		
		alert(args["server_name"]);
    	*/
    	
		Cookie.write("cross_server_serverid", decodeURIComponent(args["server_id"]));
		Cookie.write("cross_server_areaname", decodeURIComponent(args["area_name"]));
		Cookie.write("cross_server_servername", decodeURIComponent(args["server_name"]));
    
    	this.close_popup_box();
    	
    	this.show_user_server_info();	
    },
    
    close_popup_box : function(){
    	// hidden server select box
    	$("pageCover").setStyle("display", "none");
    	$("select_server_popup").setStyle("display", "none");
    
    },
    
    show_server_select_box : function(){
		// init server info
		var self = this;
		var chose_server = function(args){
			self.chose_server(args);
		};
    	var obj = new SelectServer(chose_server);
		obj.show();

    	// show popup
  		var cover = $("pageCover");
    	var popup = $("select_server_popup");

		cover.setStyle("height", Document.getHeight() + Document.getScrollHeight());

		cover.setStyle("display", "block"); //设置页面遮罩层显示
		popup.setStyle("display", "block");
		popup.setStyles({
			"left" : ((Window.getWidth() - popup.getWidth())/2) + "px",
			"top"  : (Window.getHeight() - popup.getHeight())/2 + Window.getScrollTop() + "px"
		});
		
		// add close event
		$("btn_close_server_popup").addEvent("click", function(){
			self.close_popup_box();
		})
    },
    
    show_server : function (serverid, area_name, server_name){
		var ctx = {
			"serverid" : serverid,
			"area_name" : area_name,
			"server_name" : server_name
		};
    	render_to_replace("user_server_info_box", "user_server_info_templ", ctx);
    	
		var self = this;
    	$("btn_change_user_server").addEvent("click", function(){
    		self.show_server_select_box();
    	});
    	
    	
    },
    
    show_user_server_info : function(){
		var cross_serverid = Cookie.read("cross_server_serverid");
		if (!cross_serverid){
			this.no_server_selected();
			return;
		}
	
		var cross_servername = decodeURIComponent(Cookie.read("cross_server_servername"));
		var cross_areaname = decodeURIComponent(Cookie.read("cross_server_areaname"));
		
		this.show_server(cross_serverid, cross_areaname, cross_servername);
    }
    
});

function get_cross_buy_addon_args()
{
	var cross_serverid = Cookie.read("cross_server_serverid");
	if (!cross_serverid){
			return "";
	}
	
	var arg = {
		"cross_buy_serverid" : cross_serverid,
		"cross_buy_server_name" :  decodeURIComponent(Cookie.read("cross_server_servername")),
		"cross_buy_area_name" : decodeURIComponent(Cookie.read("cross_server_areaname"))
	
	}
	return Object.toQueryString(arg);
}

var CrossServerBuyOperator = new Class({
    initialize : function(){
    	var btn = $("btn_buy");

		var self = this;
		
    	// 仅支持本服购买
    	if (!AllowCrossBuy || CrossBuyServerids.length <= 1 || !CrossBuyKindids.contains(EquipInfo["kindid"])){
    		btn.addEvent("click", function(){  		
    			try_login_to_buy(EquipInfo["equipid"], 
    					EquipInfo["server_id"], EquipInfo["server_name"], EquipInfo["area_id"], EquipInfo["area_name"]);
    		});
			btn.set("value", '登录"' + EquipInfo["server_name"] + '"购买');
    	
    	// 处于登陆状态，并且可以跨服交易，直接下跨服订单	
    	} else if (this.check_if_can_add_order_directly()){
			// 显示公示期预订费
			if (!EquipInfo["is_pass_fair_show"] && $("fairshow_buy_info")){
				$("fairshow_buy_info").setStyle("display", "");
 			}
 			
			if (EquipInfo && EquipInfo.status == 8)
				$("cross_auction_buy_tips").setStyle("display", "");
			else
				$("buy_equip_tips").setStyle("display", "");
    		
    		btn.addEvent("click", function(){
				if(!EquipInfo['is_pass_fair_show'] && !$('agree_fair_show_pay').checked){
					alert('同意公示期预定收费规则后，才能预定');
					return false;
				}
				
				if(EquipInfo["server_id"] != LoginInfo["serverid"] && 
					(test_server_list.contains(parseInt(EquipInfo["server_id"])) || test_server_list.contains(LoginInfo["serverid"]))){
					var ret = confirm('您的角色所在服务器和该商品所在服务器属于不同的测试服版本，完成购买后商品暂时无法取出（藏宝阁有未取出商品时无法转服），每周二测试服更换后才能尝试取出，您确定要下单购买吗？');
					if(ret !== true){
						return;
					}
				}

    			window.location.href = self.get_add_order_url();
    		});
    		
    		if (EquipInfo["is_pass_fair_show"]){
				btn.set("value", "下单购买");
    		} else {
				btn.set("value", "预订");    		
    		}
    		
			if (EquipInfo["server_id"] != LoginInfo["serverid"]){	
				this.display_cross_buy_poundage();
			}
    	//  未登陆状态，可以跨服交易，先登陆再买
    	} else if (this.if_go_login_buy_step()){
			btn.addEvent("click", function(){
    			window.location.href = self.get_login_buy_url();
			});
			btn.set("value", "登录购买");

    	// 需要玩家选择要登陆的服务器
    	} else {
			btn.addEvent("click", function(){
				self.show_popup_select_server_box();
    		});
			btn.set("value", "登录购买");
    	}
    	
    },
    
    is_login : function(){
    	return LoginInfo && LoginInfo["login"];
    },
    
    get_add_order_url : function(){
    	var arg = {
    		"obj_serverid" : EquipInfo["server_id"],
    		"obj_equipid" : EquipInfo["equipid"],
			"device_id" : get_fingerprint(),
    		"act" : "cross_server_buy_add_order"
    	};
    	return CgiRootUrl + "/usertrade.py?" + Object.toQueryString(arg);
    },
    
    display_cross_buy_poundage : function(){
    	var url = CgiRootUrl + "/userinfo.py";
    	var args = {
			"obj_serverid" : EquipInfo["server_id"],
			"obj_equipid" : EquipInfo["equipid"],
			"act" : "get_cross_buy_poundage"
    	}
    	
    	var display_poundage = function(data, txt){
    		if (data["status"] != 1){
    			return;
    		}
    		var el = $("equip_price_addon_info");
    		if (el){
				el.innerHTML = "+&nbsp;￥" + data["poundage"] + "（元）(跨服交易费)";
    		}
    	};
    	
        var Ajax = new Request.JSON({"url":url,"onSuccess":display_poundage, "noCache":true});
    	Ajax.get(args);
 
    },
    
    get_login_buy_url : function(){
    	// show cross equip detail
    	var arg = {
    		"obj_serverid" : EquipInfo["server_id"],
    		"obj_equipid" : EquipInfo["equipid"],
    		"act" : "show_cross_server_buy_detail"
    	};
		var equip_detail_url = CgiRootUrl + "/usertrade.py?" + Object.toQueryString(arg);

		if(EquipInfo && EquipInfo.status == EQUIP_AUCTION){
			var arg = {
				"serverid" : EquipInfo["server_id"],
				"equip_id" : EquipInfo["equipid"],
				"act" : "overall_search_show_detail"
			};
			equip_detail_url = CgiRootUrl + '/equipquery.py?' + Object.toQueryString(arg);
		}
    	
    	var login_arg = {
    		"server_id" : getPara("cross_buy_serverid"),
    		"server_name" : decodeURIComponent(getPara("cross_buy_server_name")),
    		"area_name" : decodeURIComponent(getPara("cross_buy_area_name")),
    		"return_url" : equip_detail_url,
    		"act" : "show_login"
		};
		return CgiRootUrl + "/show_login.py?" + Object.toQueryString(login_arg);
	},
    
    
    check_if_can_add_order_directly : function(){
    	// must be login
    	if (!LoginInfo || !LoginInfo["login"]){
    		return false;
    	}
    	
    	// must be in allow crosss server buy
    	if (CrossBuyServerids.contains(LoginInfo["serverid"])){
    		return true;
    	} else {
    		return false;
    	}
    },
    
    if_go_login_buy_step : function(){
		var buy_serverid = getPara("cross_buy_serverid");
		var buy_server_name = getPara("cross_buy_server_name");
		var buy_area_name = getPara("cross_buy_area_name");
		
		if (!buy_serverid || !buy_server_name || !buy_area_name){
			return false;
		}
		
		if (!CrossBuyServerids.contains(parseInt(buy_serverid))){
			return false;
		}
		
		return true;
		
    },
    
    chose_server : function(args, is_show_all_servers){
		if(is_show_all_servers || EquipInfo.status == EQUIP_AUCTION){
			var arg = {
				"serverid" : EquipInfo["server_id"],
				"equip_id" : EquipInfo["equipid"],
				"act" : "overall_search_show_detail"
			};
			var cgi_script_name = "equipquery.py";
		}
		else{
    		// show cross equip detail
    		var arg = {
				"obj_serverid" : EquipInfo["server_id"],
				"obj_equipid" : EquipInfo["equipid"],
				"act" : "show_cross_server_buy_detail"
			};
			var cgi_script_name = "usertrade.py";
		}
		
		var equip_detail_url = CgiRootUrl + "/"+cgi_script_name+"?" + Object.toQueryString(arg);
    	
    	var login_arg = {
    		"server_id" : args["server_id"],
    		"server_name" : args["server_name"],
    		"area_id" : args["area_id"],
    		"area_name" : args["area_name"],
    		"return_url" : equip_detail_url,
    		"act" : "show_login"
		};
		var url = CgiRootUrl + "/show_login.py?" + Object.toQueryString(login_arg);
    	window.location.href = url;
    },
    
    close_server_popup_box : function(){
    	$("pageCover").setStyle("display", "none");
    	$("select_server_popup").setStyle("display", "none");
    },
    
    show_popup_select_server_box : function(is_show_all_servers){
		// init server info
		var self = this;
		var chose_server = function(args){
			if (!is_show_all_servers && 
				!CrossBuyServerids.contains(parseInt(args["server_id"]))){
				$("not_allow_buy_tips").setStyle("display", "");
				return;
			}
			
			self.chose_server(args, is_show_all_servers);
		};
		// disable server
		var disable_server = function(a_el, serverid){
			if (!is_show_all_servers && 
				!CrossBuyServerids.contains(parseInt(serverid))){
				a_el.getParent().addClass("disabled");
				a_el.setStyle("cursor", "pointer");
			}
		};
		
		$("not_allow_buy_tips").setStyle("display", "none");
		
		// add close event
		$("btn_close_server_popup").addEvent("click", function(){
			self.close_server_popup_box();
			return false;
		})
    
    	var obj = new SelectServer(chose_server, disable_server);
		obj.show();

    	// show popup
  		var cover = $("pageCover");
    	var popup = $("select_server_popup");

		cover.setStyle("height", Document.getHeight() + Document.getScrollHeight());

		cover.setStyle("display", "block"); //设置页面遮罩层显示
		popup.setStyle("display", "block");
		popup.setStyles({
			"left" : ((Window.getWidth() - popup.getWidth())/2) + "px",
			"top"  : (Window.getHeight() - popup.getHeight())/2 + Window.getScrollTop() + "px"
		});
    }
});

function get_saved_query_title(args_config, query){
	var count = 3;
	var title = '';
	var is_omitted = false;

	for(var i=0;count>0 && i<args_config.length;i++){
		var config = args_config[i];
		var key = config[0];
		var id = key;
		
		if(config.length == 2){
			var type = 'int';
		}else{
			var type = config[2];
		}
		
		if(OverallSearchType != 'role' && OverallSearchType != 'pet_equip'){
			if(type === 'int'){
				id = 'txt_' + id;
			}else if(type === 'checkbox'){
				id = 'chk_' + id;
			}
		}

		if(type === 'range' || type === 'slider'){
			var min_key = key + '_min';
			var max_key = key + '_max';

			if(min_key in query && max_key in query){
				if(key === 'price'){
					title += config[1] + ':' + query[min_key]/100 + '-' + query[max_key]/100 + ' ';
				}else{
					title += config[1] + ':' + query[min_key] + '-' + query[max_key] + ' ';
				}
				count--;
			}

			continue;
		}
		
		var fixed_value_list = [];
		
		if(type === 'key_list'){
			for(var k in query){
				var m = k.match(key);
				if(m && m.length >= 2){
					fixed_value_list.push(m[1]);
				}
			}
			
			if(fixed_value_list.length > 0){
				type = 'list';
			}
		}else if(!(key in query)){
			continue;
		}

		if(key === 'switchto_serverid' || key === 'cross_buy_serverid'){
			for (var areaid in server_data){
				var server_list = server_data[areaid][1];

				for (server in server_list){
					if(server_list[server][0] == query[key]){
						title += config[1] + ':' + server_list[server][1] + ' ';
						count--;
						break;
					}
				}
			}
			continue;
		}

		if(type === 'int'){
			if(key === 'growth'){
				title += config[1] + ':' + query[key]/1000 + ' ';
			}else if($(id).getChildren('option').length > 0){
				title += config[1] + ':' + $(id).getChildren('option[value='+query[key]+']')[0].get('text') + ' ';
			}else{
				title += config[1] + ':' + query[key] + ' ';
			}
			count--;
		}else if(type === 'list'){
			var item_list = $$(config[3]);
			if(fixed_value_list.length > 0){
				var value_list = fixed_value_list;
			}else{
				var value_list = query[key].split(',');
			}
			var v_map = {};
			var name = [];

			for (var n=0; n<value_list.length; n++){
				v_map[value_list[n]] = true;
			}

			for (var n=0; n<item_list.length; n++){
				var item = item_list[n];
				var value = item.getAttribute('data_value');
				if(!value){
					value = item.retrieve('value');
				}
				if(value in v_map){
					var item_name = item.get('text');
					if(!item_name){
						item_name = item.getElement('*[title][alt]').get('title');
					}
					name.push(item_name);
					if(name.length >= count){
						break;
					}
				}
			}

			if(name.length < value_list.length){
				is_omitted = true;
			}

			if(key === 'race' || key === 'school'){
				title += name.join(',') + ' ';
			}else{
				title += config[1] + ':' + name.join(',') + ' ';
			}
			count -= name.length;
		}else if(type === 'checkbox'){
			title += config[1] + ':' + (query[key] == 1 ? '是' : '否') + ' ';
			count--;
		}else if(type === 'func'){
			title += config[1] + ':' + config[3](query[key]) + ' ';
			count--;
		}else if(type === 'autocomplete'){
			var value = query[key];

			if(value in config[4]){
				title += config[1] + ':' + config[4][value];
			}
		}
	}

	if(title === ''){
		title = '默认名称';
	}

	if(title.length > 30 || Object.keys(query).length > 3 || is_omitted){
		title = title.substr(0,30) + '...';
	}

	return title;
};

function fix_args_config(args_config){
	var new_args_config = [];

	for(var i=0;i<args_config.length;i++){
		var config = args_config[i];
		var key = config[0];
		
		if(config.length == 2){
			var type = 'int';
		}else{
			var type = config[2];
		}

		if(type === 'range'){
			new_args_config.push([key+'_max', config[1]+'上限']);
			new_args_config.push([key+'_min', config[1]+'下限']);
		}else if(type === 'slider'){
			new_args_config.push([key+'_max', config[1]+'上限', type]);
			new_args_config.push([key+'_min', config[1]+'下限', type]);
		}else{
			new_args_config.push(config);
		}
	}

	return new_args_config;
};

function restore_query_form(args_config, saved_query)
{
	var args_config = fix_args_config(args_config);

	$("reset_all").fireEvent("click");

	for(var i=0;i<args_config.length;i++){
		var config = args_config[i];
		var key = config[0];
		var id = key;
		
		if(config.length == 2){
			var type = 'int';
		}else{
			var type = config[2];
		}

		if(OverallSearchType != 'role' && OverallSearchType != 'pet_equip'){
			if(type === 'int'){
				id = 'txt_' + id;
			}else if(type === 'checkbox'){
				id = 'chk_' + id;
			}
		}
		
		var fixed_list_value = [];
		
		if(type === 'slider'){
			id = id.substr(0, id.length - 4);
		}
		
		if(type === 'key_list'){
			for(var k in saved_query){
				var m = k.match(key);
				if(m && m.length >= 2){
					fixed_list_value.push(m[1]);
				}
			}
			
			if(fixed_list_value.length > 0){
				type = 'list';
			}
		}else if(!(key in saved_query)){
			continue;
		}
		
		if(type === 'int'){
			if(key === 'price_min' || key === 'price_max'){
				$(id).set('value', saved_query[key]/100);
			}else if(key === 'growth'){
				$(id).set('value', saved_query[key]/1000);
			}else{
				$(id).set('value', saved_query[key]);
			}
		}else if(type === 'list'){
			var item_list = $$(config[3]);
			if(fixed_list_value.length > 0){
				var value_list = fixed_list_value;
			}else{
				var value_list = saved_query[key].split(',');
			}

			var parent_el = item_list.getParent()[0];
			if(parent_el && parent_el.btn_checker){
				parent_el.btn_checker.restore(value_list);
				continue;
			}

			var v_map = {};

			for (var n=0; n<value_list.length; n++){
				v_map[value_list[n]] = true;
			}

			for (var n=0; n<item_list.length; n++){
				var item = item_list[n];

				value = item.getAttribute('data_value');

				if(value in v_map){
					item.addClass('on');
				}else{
					item.removeClass('on');
				}
			}
		}else if(type === 'radio'){
			if(config.length == 3){
				$(key).set('checked', true);
			}else if(config.length == 4){
				$$(config[3]).each(function(el, i){
					if(el.value === saved_query[key]){
						el.fireEvent('click');
						el.checked = true;
					}
				});
			}
		}else if(type === 'checkbox'){
			if(saved_query[key] == 1){
				if(config.length == 3){
					$(id).checked = true;
				}else if(config.length == 4){
					$(config[3]).checked = true;
				}
			}
		}else if(type === 'slider'){
			var min = null;
			var max = null;

			if(key.test('_min$')){
				min = saved_query[key];
			}else if(key.test('_max$')){
				max = saved_query[key];
			}

			$(id+'_slider').slider.set_value([min, max]);
		}else if(type === 'func'){
			config[4](saved_query[key]);
		}else if(type === 'autocomplete'){
			var value = saved_query[key];

			if(value in config[4]){
				$(config[3]).set('value', config[4][value]);
			}
		}
	}

	if('switchto_serverid' in saved_query){
		$('sel_area').select_server.set_select_server(saved_query['switchto_serverid']);
	}

	return;	
}    

function get_overall_search_action_desc(equip) {
	var auction_status = equip.auction_status;
	if (auction_status == AUCTION_BIDDING)
		return '去竞拍';
	else if (auction_status == AUCTION_OPEN_BUY)
		return '去抢付';
	else
		return '查看详情';
}
