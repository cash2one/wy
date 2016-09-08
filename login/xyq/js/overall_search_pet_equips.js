var SearchFormObj = null;
var QueryArgs = null;
var EquipAddonStatus = ["高级合纵","高级法术抵抗","高级盾气","合纵","法术抵抗","盾气","惊心一剑","死亡召唤","上古灵符","善恶有报","力劈华山","夜舞倾城","剑荡四方"];


var OVERALL_SEARCH_PET_EQUIP_ARGS_CONFIG = [
	['price', '价格', 'range'],
	['level', '等级', 'slider'],
	['speed', '速度'],
	['fangyu', '防御'],
	['mofa', '魔法'],
	['shanghai', '伤害'],
	['hp', '气血'],
	['speed', '速度'],
	['xiang_qian_level', '宝石'],
	['addon_sum_min', '属性总和'],
	['repair_failed_times', '修理失败'],
	['addon_minjie_reduce', '敏捷减少'],
	['equip_pos', '装备类型', 'list', '#EquipPosBox li'],
	['server_type', '开服时间', 'list', '#server_type li'],
	['addon_status', '附加状态', 'autocomplete', 'addon_status', function(){
		var _map = {};
		var arr = SENIOR_YAO_JUE.extend(PRIMARY_YAO_JUE).extend(EquipAddonStatus);
		for(var i=0;i<arr.length;i++){
			_map[arr[i]] = arr[i];
		}
		return _map;
	}()],
	[/^(addon_[^_]*)$/, '附加属性', 'key_list', '#addon_skill_box li']	
];

var PetEquipSearchFormInit = new Class({
    initialize : function(){
    
		// level slider
		this.level_slider = this.init_level_slider();
		
		// addon status
		this.init_addon_skill_box();
		
		this.reg_item_selected_ev();
		
		this.reg_reset_event();

    	this.select_server = new DropSelectServer($('sel_area'), $('switchto_serverid'));
		

    	$("btn_do_query").addEvent("click", function(){
    		query_pet_equips();
    	});
    	
    	
	},

	init_level_slider: function(){
		this.level_slider = new LevelSlider($('level_slider'), {
			grid: 20,
			offset: -23,
			range: [65, 145],
			step: 10,
			default_value: [65, 145]
		});
		
		return this.level_slider;
	},

   reg_item_selected_ev : function(){
		var item_list = $$("#EquipPosBox li");
		//item_list.append($$("#EquipPosBox li"));
		item_list.append($$("#addon_skill_box li"));
		item_list.append($$("#server_type li"));
		
		for (var i=0; i < item_list.length; i++){
			var item = item_list[i];
			item.addEvent("click", function (){
				var el = $(this);
				if (el.hasClass("on")){
					el.removeClass("on");
				} else {
					el.addClass("on");
				}
			})
		}
    },

	init_addon_skill_box: function(){ 
		var self = this;
		var skill_search = function(keyword){
			var result = [];
			for (var i=0; i < SENIOR_YAO_JUE.length; i++){
				if (SENIOR_YAO_JUE[i].indexOf(keyword)!= -1){
					result.push(SENIOR_YAO_JUE[i]);
				}
			}

			for (var i=0; i < PRIMARY_YAO_JUE.length; i++){
				if (PRIMARY_YAO_JUE[i].indexOf(keyword)!= -1){
					result.push(PRIMARY_YAO_JUE[i]);
				}
			}
			
			for (var i=0; i < EquipAddonStatus.length; i++){
				if (EquipAddonStatus[i].indexOf(keyword)!= -1){
					result.push(EquipAddonStatus[i]);
				}
			}
			
			return result;
		};
		new AutoComplete($('addon_status'),{
			"startPoint" : 1,
			"promptNum" : 20,
			"handle_func" : skill_search,
			"callback": function(){}
		});
	},

	empty_input_box : function(item_list){
		for (var i=0; i < item_list.length; i++){
			$(item_list[i]).value = "";
		}
	},
	
	clear_select_items : function(item_list){
		for (var i=0; i < item_list.length; i++){
			var item = item_list[i];
			if (item.hasClass("on")){
				item.removeClass("on");
			}
		}
	},
	
	reg_reset_event : function(){
		var self = this;
		$("reset_basic").addEvent("click", function(){
			self.clear_select_items($$("#EquipPosBox li"));
			
			// reset this.level_slider
			self.level_slider.reset_value();
			return false;
			
		});
		
		$("reset_equips_attr").addEvent("click", function(){
			self.clear_select_items($$("#addon_skill_box li"));

			self.empty_input_box($$("#PetEquipAttrBox input"));

			self.empty_input_box($$("#PetEquipAttrBox select"));			
 			return false;
		});
		
		$("reset_price").addEvent("click", function(){
			self.empty_input_box($$("#EquipPriceBox input"));
			return false;
		});

		
		$("reset_server_selected").addEvent("click", function(){
			//self.empty_input_box($$("#EquipPriceBox select"));
			self.select_server.reset_value();
			self.clear_select_items($$("#server_type li"));
			return false;
		});
		
    	$("reset_all").addEvent("click", function(){
    		$("reset_basic").fireEvent("click");
    		$("reset_equips_attr").fireEvent("click");
    		$("reset_price").fireEvent("click");
    		$("reset_server_selected").fireEvent("click");
   
    		return false;
    	});
    			
		
	}
	
});


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

function get_item_selected(item_list)
{
	var value_list = [];
	for (var i=0; i < item_list.length; i++){
		var item = item_list[i];
		if (item.hasClass("on")){
			value_list.push(item.getAttribute("data_value"));
		}
	}
	
	if (value_list.length == item_list.length){
		return "";
	} else {
		return value_list.join(",");	
	}	
}

function query_pet_equips()
{
	var args_config = [
		["speed", "速度"], ["fangyu","防御"],
		["mofa", "魔法"], ["shanghai", "伤害"],
		["hp", "气血"], ["xiang_qian_level", "宝石"],
		["addon_sum_min", "属性总和"], ["addon_minjie_reduce", "敏捷减少"],
		["switchto_serverid", "转服至"]
	];
	
	var result = check_int_args(args_config);
	if (!result["result"]){
		alert(result["msg"]);
		return;
	}
	var args = result["args"];
	
	args["level_min"] = SearchFormObj.level_slider.value.min;
	args["level_max"] = SearchFormObj.level_slider.value.max;
	
	var equip_pos = get_item_selected($$("#EquipPosBox li"));
	if (equip_pos){
		args["equip_pos"] = equip_pos;
	}
	
	var addon_el_list = $$("#addon_skill_box li");
	for (var i=0; i < addon_el_list.length; i++){
		var item = addon_el_list[i];
		if (item.hasClass("on")){
			var attr_name = item.getAttribute("data_value"); 
			args[attr_name] = 1;
		}
	}
	
	var repair_failed_times = $("repair_failed_times").value;
	if (repair_failed_times.length > 0){
		args["repair_failed_times"] = repair_failed_times;
	}
	
	if ($("price_min").value.trim().length > 0){
		var price_min_value = parseFloat($("price_min").value);
		if (!price_min_value || price_min_value <= 0){
			alert("您输入的最低价格有错误");
			return false;
		}
		args["price_min"] = parseInt(price_min_value * 100);		
	}

	if ($("price_max").value.trim().length > 0){
		var price_max_value = parseFloat($("price_max").value);
		if (!price_max_value || price_max_value <= 0){
			alert("您输入的最高价格有错误");
			return false;
		}
		args["price_max"] = parseInt(price_max_value * 100);		
	}
	
	if (args["price_min"] && args["price_max"]){
		if (args["price_max"] < args["price_min"]){
			alert("您输入的价格有错误");
			return false;
		}
	}
	
	// addon
	var addon_status = $("addon_status").value;
	if (addon_status.length > 0){
		if (!MO_SHOU_YAO_JUE.contains(addon_status) && !EquipAddonStatus.contains(addon_status)){
			alert("附加状态填写错误");
			return false;
		}
		args["addon_status"] = addon_status;
	}
	
	var server_type = get_item_selected($$("#server_type li"));
	if (server_type.length > 0){
		args["server_type"] = server_type;
	}

	if ($("user_serverid") && $("user_serverid").value){
		args['cross_buy_serverid'] = $("user_serverid").value;
	}
	
	if (Object.getLength(args) == 0){
		alert("请选择搜索条件");
		return false;
	}
	
	QueryArgs = args;
	
	update_overall_search_saved_query();
	do_query(1);

}


function add_orderby_ev()
{
	var el_list = $$("#order_menu a");
	for (var i=0; i < el_list.length; i++){
		var el = el_list[i];
		el.addEvent("click", function(){
			change_query_order($(this));
			return false;
		})
	}
	
}

var OrderInfo = {"field_name":"", "order":""};
function change_query_order(el)
{
	var attr_name = el.getAttribute("data_attr_name");
	var new_order = "DESC"
	var orderby = attr_name + " " + new_order;
	if (OrderInfo["field_name"] == attr_name){
		var new_order = OrderInfo["order"] == "DESC" ? "ASC":"DESC";
		orderby = attr_name + " " + new_order;
	}
	OrderInfo["field_name"] = attr_name;
	OrderInfo["order"] = new_order;

	QueryArgs["order_by"] = orderby;
	do_query(1);	
}

function get_equip_addon_attr(equip_desc)
{
	var re = new RegExp("#G[^#]+", "g");
	var match_result = equip_desc.match(re);
	if (!match_result){
		return "";
	}
	var attr_list = [];
	for (var i=0; i < match_result.length; i++){
		attr_list.push(match_result[i].replace("#G", ""));
	}
	return attr_list.join("&nbsp;");
}

function show_loading()
{
	$("loading_img").setStyle("display", "");
}

function loading_finish()
{
	$("loading_img").setStyle("display", "none");
}

function show_query_result(result, txt)
{
	loading_finish();
	
	if (result["status"] == QueryStatus["need_captcha"]){
		show_captcha_layer();
		return;
	}
	
	if (result["status"] != 0){
		alert(result["msg"]);
		return;
	}
	
	if (result["equip_list"].length == 0){
		render_to_replace("query_result", "no_result", {});
		return;
	}
	
	for(var i=0; i < result["equip_list"].length; i++){
		var equip = result["equip_list"][i]
		equip["equip_icon_url"] = ResUrl + '/images/small/' + equip["icon"];
		equip["addon_attr"] = get_equip_addon_attr(equip["equip_desc"]);
	}
	
	
	var ctx = {
		"equip_list" : result["equip_list"],
		"pager" : result["pager"]
	}
	QueryResult = result["equip_list"];
	
	render_to_replace("query_result", "equip_list_templ", ctx);
	
	// add order event
	add_orderby_ev();
	
	// add pager info
	render_to_replace("pager_bar", "pager_templ", {"pager":result["pager"]});
	
	// reg tips
	var el_list = $$("#soldList a.soldImg");
	for (var i=0; i < el_list.length; i++)
	{
		var el = el_list[i];
		el.addEvent("mouseover", function(){
			show_equip_tips_box($(this));
		});
		el.addEvent("mouseout", hidden_tips_box);
	}	
	
}


function goto(page_num)
{
	do_query(page_num);
}

function show_error()
{
	loading_finish();
	alert("系统繁忙，请稍后再试");
}

function do_query(page_num)
{
	var query_url = CgiRootUrl + "/xyq_overall_search.py";
	QueryArgs["act"] = "overall_search_pet_equip";
	QueryArgs["page"] = page_num;
	var Ajax = new Request.JSON({
		"url" : query_url,
		"onSuccess":show_query_result,
		"onException" : show_error,
		"noCache" : true,
		"onError" : show_error,
		"onFailure" : show_error,
		"onRequest": function() {
            $('loading_img').setStyle('display', '');
            $('query_result').empty();
        }
	});
	show_loading();
	Ajax.get(QueryArgs);
}


function show_equip_tips_box(el)
{
	var icon_url = ResUrl + '/images/small/' + el.getAttribute("data_icon");
	var ctx = {
		"icon_url" : icon_url,
		"name" : el.getAttribute("data_name"),
		"type_desc" : el.getAttribute("data_type_desc"),
		"desc" : el.getAttribute("data_desc")
	};
	
	render_to_replace("TipsBox", "EquipTipsTempl", ctx);
	
	adjust_tips_position(el, $("TipsBox"));	
}

function hidden_tips_box()
{
	$("TipsBox").setStyle("display", "none");	
}


	
