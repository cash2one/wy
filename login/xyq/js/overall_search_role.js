/*
**
*/
var SuitEffects = [
	[1,"变身"],[2,"定心术"],[3,"金刚护法"],[4,"逆鳞"],[5,"满天花雨"],[6,"炼气化神"],[7,"普渡众生"],
	[8,"生命之泉"],[50,"碎星诀"], [51,"浪涌"], [9,"变身术之凤凰"],[10,"变身术之蛟龙"],[11,"变身术之雨师"],[12,"变身术之如意仙子"],[13,"变身术之芙蓉仙子"],[14,"变身术之巡游天神"],
	[15,"变身术之星灵仙子"],[16,"变身术之幽灵"],[17,"变身术之鬼将"],[18,"变身术之吸血鬼"],[19,"变身术之净瓶女娲"],[20,"变身术之律法女娲"],[21,"变身术之灵符女娲"],
	[22,"变身术之画魂"],[23,"变身术之幽萤娃娃"],[24,"变身术之大力金刚"],[25,"变身术之雾中仙"],[26,"变身术之灵鹤"],[27,"变身术之夜罗刹"],[28,"变身术之炎魔神"],
	[29,"变身术之噬天虎"],[30,"变身术之踏云兽"],[31,"变身术之红萼仙子"],[32,"变身术之龙龟"],[33,"变身术之机关兽"],[34,"变身术之机关鸟"],[35,"变身术之连弩车"],
	[36,"变身术之巴蛇"],[37,"变身术之葫芦宝贝"],[38,"变身术之猫灵（人型）"],[39,"变身术之狂豹（人型）"],[40,"变身术之蝎子精"],[41,"变身术之混沌兽"],[42,"变身术之长眉灵猴"],
	[43,"变身术之巨力神猿"],[44,"变身术之修罗傀儡鬼"],[45,"变身术之修罗傀儡妖"],[46,"变身术之金身罗汉"],[47,"变身术之藤蔓妖花"],[48,"变身术之曼珠沙华"],[49,"变身术之蜃气妖"]
];

var RoleSearchFormInit = new Class({
    initialize : function(){
    
    	this.gen_equip_levels();
		this.init_taozhuang();
    	
    	this.reg_advance_search_fold_ev();
    	
    	this.reg_item_selected_ev();
    	
    	this.reg_reset_ev();
    	
    	this.select_server = new DropSelectServer($('sel_area'), $('switchto_serverid'));
		$('sel_area').select_server = this.select_server;
    	
    	$("btn_do_query").addEvent("click", function(){
    		submit_query_form();
    	});
	},

	init_taozhuang: function(){
		var con = $('taozhuang_type');
		for(var i=0; i<SuitEffects.length; i++){
			var item = SuitEffects[i];
			var option = new Element('option', {'value': item[0], 'html': item[1]});
			con.grab(option);
		}
	},
    
    gen_equip_levels : function(){
    	var el_list = [$("equip_level_min"), $("equip_level_max")];
    	for (var i=0; i < el_list.length; i++){
    		var el = el_list[i];
    		var op = new Element("option", {"text":"不限", "value":""});
    		op.inject(el);
    		
    		var j = 10;
    		while(j <= 160){
	    		var op = new Element("option", {"text":j, "value":j});
    			op.inject(el);
    			j = j + 10;    			
    		}	
    	}
    },
    
    reg_advance_search_fold_ev : function(){
    	$("btn_advance_search_fold").addEvent("click", function(){
    		if ($("advance_search_box").getStyle("display") == "block"){
    			$("advance_search_box").setStyle("display", "none");
    		} else {
    			$("advance_search_box").setStyle("display", "block");    		
    		}
    	});
    	
    },
    
    
    reg_item_selected_ev : function(){
		var item_list = $$("#school_list li");
		//item_list.extend($$("#school_list li"));
		item_list.extend($$("#race_list li"));
		item_list.extend($$("#equip_teji li"));
		item_list.extend($$("#pet_box li"));
		item_list.extend($$("#xiangrui_box li"));
		item_list.extend($$("#server_type li"));
		item_list.extend($$("#school_change_list li"));
		
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
	      
    reg_reset_ev : function(){
    	var self = this;
    	$("reset_role_basic").addEvent("click", function(){
    		self.empty_input_box($$("#role_basic_panel input"));
	    	self.clear_select_items($$("#school_list li"));
    		self.clear_select_items($$("#race_list li"));
	    	$("zhuang_zhi").value = "";
	    	return false;		
    	});
    	
		$("reset_role_attr").addEvent("click", function(){
    		self.empty_input_box($$("#role_attr_panel input"));
			return false;
    	});
    	
		$("reset_role_expt").addEvent("click", function(){
    		self.empty_input_box($$("#role_expt_panel input"));
			return false;
    	});
    	
		$("reset_role_skills").addEvent("click", function(){
    		self.empty_input_box($$("#role_skills_panel input"));
    		self.empty_input_box($$("#role_skills_panel select"));
			return false;
    	});
    	
		$("reset_role_carry").addEvent("click", function(){
			self.empty_input_box($$("#role_carry_panel input"));
			self.empty_input_box($$("#role_carry_panel select"));

			$("teji_match_signle").checked = true;
			$("teji_match_all").checked = false;			
			self.clear_select_items($$("#equip_teji li"));

			$("pet_match_signle").checked = true;
			$("pet_match_all").checked = false;
			self.clear_select_items($$("#pet_box li"));
			
			$("xiangrui_match_signle").checked = true;
			$("xiangrui_match_all").checked = false;
			self.clear_select_items($$("#xiangrui_box li"));			
			return false;
    	});
    	
		$("reset_role_other").addEvent("click", function(){
    		self.empty_input_box($$("#role_other_box input"));
    		self.empty_input_box($$("#role_other_box select"));
			return false;
    	});

		$("reset_server_selected").addEvent("click", function(){
			self.select_server.reset_value();
    		self.empty_input_box($$("#server_info_box input"));
    		//self.empty_input_box($$("#server_info_box select"));
			self.clear_select_items($$("#server_type li"));			
			return false;
    	});
    	
    	
    	$("reset_all").addEvent("click", function(){
    		$("reset_role_basic").fireEvent("click");
    		$("reset_role_attr").fireEvent("click");
    		$("reset_role_expt").fireEvent("click");
    		$("reset_role_skills").fireEvent("click");
    		$("reset_role_carry").fireEvent("click");
    		$("reset_role_other").fireEvent("click");
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
		
		if (!re.test(item_value) || item_value.length > 10){
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
	/*
	if (value_list.length == item_list.length){
		return "";
	} else {
		return value_list.join(",");	
	}
	*/
	return value_list.join(",");	
}

OVERALL_SEARCH_ROLE_ARGS_CONFIG = [
		['school', '门派', 'list', '#school_list li'],
		['race', '角色', 'list', '#race_list li'],
		['level', '等级', 'range'],
		['price', '价格', 'range'],
		['sum_exp', '角色总经验', 'range'],
		['qian_neng_guo', '潜能果'],
		['expt_gongji','攻击修炼'],
		['expt_fangyu', '防御修炼'],
		['expt_fashu', '法术修炼'],
		['expt_kangfa', '抗法修炼'],
		['max_expt_gongji', '攻击上限'],
		['max_expt_fangyu', '防御上限'],
		['max_expt_fashu', '法术上限'],
		['max_expt_kangfa', '抗法上限'], 
		['expt_lieshu', '猎术修炼'],
		['expt_total', '修炼总和'], 
		['bb_expt_gongji', '攻击控制'],
		['bb_expt_fangyu', '防御控制'], 
		['bb_expt_fashu', '法术控制'],
		['bb_expt_kangfa', '抗法控制'], 
		['bb_expt_total', '宠修总和'],
		['school_skill_num','师门技能数'],
		['school_skill_level', '师门技能等级'],
		['zhuang_zhi', '飞升'],

		['shang_hai' , '伤害'],
		['ming_zhong','命中'],
		['ling_li' , '灵力'],
		['fang_yu','防御'],
		['hp' , '气血'],
		['speed', '速度'],
		['fa_shang', '法伤'],
		['fa_fang', '法防'],
		['skill_qiang_shen', '强身'], 
		['skill_shensu', '神速'],
		['skill_qiang_zhuang','强健'],
		['skill_ming_xiang', '冥想'],
		['skill_dazao','打造技巧'], 
		['skill_pengren','烹饪技巧'],
		['skill_caifeng', '裁缝技巧'],
		['skill_zhongyao','中药医疗'],
		['skill_qiaojiang', '巧匠之术'],
		['skill_lingshi', '灵石技巧'],
		['skill_lianjin', '炼金术'],
		['skill_jianshen','健身术'],
		['skill_yangsheng', '养生之道'],
		['skill_anqi', '暗器技巧'],
		['skill_taoli', '逃离技巧'],
	   	['skill_zhuibu', '追捕技巧'],
		['skill_ronglian', '熔炼技巧'],
		['skill_danyuan', '丹元济会'],
	   	['skill_miaoshou', '妙手空空'],
		['skill_baoshi', '宝石工艺'],
	   	['skill_qimen','奇门遁甲'],
		['skill_gudong','古董评估'],
		['skill_xianling','仙灵店铺'],
		['skill_jianzhu', '建筑之术'],
		['skill_bianhua', '变化之术'],
		['skill_cuiling', '淬灵之术'],
		['skill_huoyan', '火眼金睛'],
	   	['max_equip_duan_zao','携带装备最高锻造'],
		['max_weapon_shang_hai', '携带武器最大总伤'],
		['max_necklace_ling_li', '携带项链最大灵力'],
		['pet_skill_num', '技能数量'],
	   	['pet_advance_skill_num', '高级技能数量'],
		['xian_yu', '仙玉'],
		['cash','现金'],
		['upexp','当前经验'],
		['badness','善恶'],
		['school_offer','门贡'],
		['org_offer', '帮贡'],
		['cheng_jiu', '成就'],
		['body_caiguo','染色折合彩效果数'],
		['all_caiguo','所有染色折算彩果数'], 
		['box_caiguo', '保存染色方案数'],
		['clothes_num', '锦衣数量'],
		['taozhuang_num', '套装数量'],
		['taozhuang_type', '套装类型'],
		['is_niceid', '是否靓号'],
	   	['has_community', '社区'],
		['fangwu_level', '房屋'],
	   	['tingyuan_level', '庭院'],
		['muchang_level', '牧场'],
		['switchto_serverid', '转服至'], 
		['is_married', '婚否'],
		['is_tongpao', '同袍'],
		//range
		['equip_level', '装备等级', 'range'],
		//str list
		['school_change_list', '历史门派', 'list', '#school_change_list li'],
		['teji_list', '特技', 'list', '#equip_teji li'],
		['pet_type_list', '召唤兽', 'list', '#pet_box li'],
		['xiangrui_list', '祥瑞', 'list', '#xiangrui_box li'],
		['server_type', '开服时间', 'list', '#server_type li'],
		//radio
		['teji_match_all', '满足全部特技', 'radio'],
		['pet_match_all', '满足全部召唤兽', 'radio'],
		['xiangrui_match_all', '满足全部祥瑞', 'radio']

];


function submit_query_form()
{
	var args_config = [
		["level_min","角色最低等级"],["level_max","角色最高等级"],
		["shang_hai" , "伤害"], ["ming_zhong","命中"],
		["ling_li" , "灵力"], ["fang_yu","防御"],
		["hp" , "气血"], ["speed", "速度"],
		["fa_shang", "法伤"],["fa_fang", "法防"],
		["qian_neng_guo", "潜能果"], ["expt_gongji","攻击修炼"],
		["expt_fangyu", "防御修炼"], ["expt_fashu", "法术修炼"],
		["expt_kangfa", "抗法修炼"], ["max_expt_gongji", "攻击上限"],
		["max_expt_fangyu", "防御上限"], ["max_expt_fashu", "法术上限"],
		["max_expt_kangfa", "抗法上限"], ["expt_lieshu", "猎术修炼"],
		["expt_total", "修炼总和"], ["bb_expt_gongji", "攻击控制"],
		["bb_expt_fangyu", "防御控制"], ["bb_expt_fashu", "法术控制"],
		["bb_expt_kangfa", "抗法控制"], ["bb_expt_total", "宠修总和"],
		["skill_qiang_shen", "强身"], ["skill_shensu", "神速"],
		["skill_qiang_zhuang","强健"],["skill_ming_xiang", "冥想"],
		["skill_dazao","打造技巧"], ["skill_pengren","烹饪技巧"],
		["skill_caifeng", "裁缝技巧"],["skill_zhongyao","中药医疗"],
		["skill_qiaojiang", "巧匠之术"],["skill_lingshi", "灵石技巧"],
		["skill_lianjin", "炼金术"],["skill_jianshen","健身术"],
		["skill_yangsheng", "养生之道"],["skill_anqi", "暗器技巧"],
		["skill_taoli", "逃离技巧"], ["skill_zhuibu", "追捕技巧"],["skill_ronglian", "熔炼技巧"],
		["skill_danyuan", "丹元济会"], ["skill_miaoshou", "妙手空空"],
		["skill_baoshi", "宝石工艺"], ["skill_qimen","奇门遁甲"],
		["skill_gudong","古董评估"],["skill_xianling","仙灵店铺"],
		["skill_jianzhu", "建筑之术"],["skill_bianhua", "变化之术"],["skill_cuiling", "淬灵之术"],
		["skill_huoyan", "火眼金睛"], ["max_equip_duan_zao","携带装备最高锻造"],
		["max_weapon_shang_hai", "携带武器最大总伤"],["max_necklace_ling_li", "携带项链最大灵力"],
		["pet_skill_num", "技能数量"], ["pet_advance_skill_num", "高级技能数量"],
		["xian_yu", "仙玉"],["cash","现金"],
		["upexp","当前经验"],["badness","善恶"],
		["school_offer","门贡"],["org_offer", "帮贡"],
		["cheng_jiu", "成就"],["body_caiguo","染色折合彩效果数"],["all_caiguo","所有染色折算彩果数"], 
		["box_caiguo", "保存染色方案数"],["clothes_num", "锦衣数量"],
		["zhuang_zhi", "飞升"],["school_skill_num","师门技能数"],
		["equip_level_min", "装备最低等级"], ["equip_level_max", "装备最高等级"],
		["taozhuang_num", "套装数量"], ["taozhuang_type", "套装类型"],
		["is_niceid", "是否靓号"], ["has_community", "社区"],
		["fangwu_level", "房屋"], ["tingyuan_level", "庭院"],
		["muchang_level", "牧场"],["switchto_serverid", "转服至"], 
		["school_skill_level", "师门技能等级"],
		['sum_exp_min', '角色总经验'],
		['sum_exp_max', '角色总经验']
	];
	var input_check = check_int_args(args_config);
	if (!input_check["result"]){
		alert(input_check["msg"]);
		return;
	}
	var args = input_check["args"];
	
	// check level range
	if (args["level_min"] != undefined && args["level_max"] != undefined){
		if (args["level_max"] < args["level_min"]){
			alert("搜索等级范围填写错误");
			return false;
		}
	}
	
	if (args["level_min"] != undefined && args["level_max"] == undefined){
		args["level_max"] = 200;
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

	// check price range
	if (args["price_min"] != undefined && args["price_max"] != undefined){
		if (args["price_max"] < args["price_min"]){
			alert("搜索价格范围填写错误");
			return false;
		}
	}

	if(args['sum_exp_min'] && args['sum_exp_max'] && args['sum_exp_min'] > args['sum_exp_max']){
		alert('角色总经验最小值不能大于最大值');
		return false;
	}

	var school = get_item_selected($$("#school_list li"));
	if (school.length > 0){
		args["school"] = school;
	}

	var school_change_list = get_item_selected($$("#school_change_list li"));
	if (school_change_list.length > 0){
		args["school_change_list"] = school_change_list;
	}

	var race = get_item_selected($$("#race_list li"));
	if (race.length > 0){
		args["race"] = race;
	}
	
	var teji_list = get_item_selected($$("#equip_teji li"));
	if (teji_list.length > 0){
		if ($("equip_level_min").value.length == 0 && $("equip_level_max").value.length == 0){
			alert("请选择装备等级");
			return false;
		}
		args["teji_list"] = teji_list;
	}
	
	var pet_type_list = get_item_selected($$("#pet_box li"));
	if (pet_type_list.length > 0){
		args["pet_type_list"] = pet_type_list;
	}
	
	var xiangrui_list = get_item_selected($$("#xiangrui_box li"));
	if (xiangrui_list.length > 0){
		args["xiangrui_list"] = xiangrui_list;
	}
	
	var server_type = get_item_selected($$("#server_type li"));
	if (server_type.length > 0){
		args["server_type"] = server_type;
	}
	
	var is_married = $("is_married").value;
	if (is_married.length > 0){
		args["is_married"] = is_married;	
	}
	
	var is_tongpao = $("is_tongpao").value;
	if (is_tongpao.length > 0){
		args["is_tongpao"] = is_tongpao;	
	}
	
	if (Object.getLength(args) == 0){
		alert("您选择的查询条件过少，请选择更多查询条件");
		return false;
	}
	
	
	if ($("teji_match_all").checked){
		args["teji_match_all"] = 1;
	}
	
	if ($("pet_match_all").checked){
		args["pet_match_all"] = 1;
	}
	
	if ($("xiangrui_match_all").checked){
		args["xiangrui_match_all"] = 1;
	}
	
	$("query_args").value = JSON.encode(args);

	update_overall_search_saved_query();

	document.query_form.submit();
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

function show_loading()
{
	show_layer_center($("LoadingCover"), $("LoadingImg"));
}

function loading_finish()
{
	$("LoadingCover").setStyle("display", "none");
	$("LoadingImg").setStyle("display", "none");	
}

var NextProc = null;

function show_query_result(result, txt)
{
	loading_finish();
	if (result["status"] == QueryStatus["need_captcha"]){
		show_captcha_layer();
		return;
	}
	
	NextProc = null;
	
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
		equip["icon"] = ResUrl + '/images/smallface/' + get_role_iconid(equip["icon"]) + '.gif'
	}
	
	
	var ctx = {
		"role_list" : result["equip_list"],
		"pager" : result["pager"]
	}
	QueryResult = result["equip_list"];
	
	render_to_replace("query_result", "role_list_templ", ctx);
	
	// add order event
	add_orderby_ev();
	
	// add pager info
	render_to_replace("pager_bar", "pager_templ", {"pager":result["pager"]});
	
	// reg role tips
	var el_list = $$("#soldList a.soldImg");
	for (var i=0; i < el_list.length; i++)
	{
		var el = el_list[i];
		el.addEvent("mouseover", function(){
			show_role_tips_box($(this));
		});
		el.addEvent("mouseout", hidden_tips_box);
	}	
	
}

function show_error()
{
	loading_finish();
	alert("系统繁忙，请稍后再试");
}

var OrderInfo = {"field_name":"", "order":""};
var QueryResult = null;
function change_query_order(el)
{
	var attr_name = el.getAttribute("data_attr_name");
	var new_order = "DESC"
	var orderby = attr_name + " " + new_order;
	if (OrderInfo["field_name"] == attr_name){
		var new_order = OrderInfo["order"] == "ASC" ? "DESC":"ASC";
		orderby = attr_name + " " + new_order;
	}
	OrderInfo["field_name"] = attr_name;
	OrderInfo["order"] = new_order;

	QueryArgs["order_by"] = orderby;
	do_query(1);	
}

function do_query(page_num)
{
	NextProc = "do_query(" + page_num + ")";
	
	var query_url = CgiRootUrl + "/xyq_overall_search.py";
	QueryArgs["act"] = "overall_search_role";
	QueryArgs["page"] = page_num;
	var Ajax = new Request.JSON({
		"url" : query_url,
		"onSuccess":show_query_result,
		"onException" : show_error,
		"onError" : show_error,
		"noCache" : true,
		"onFailure" : show_error
	});
	show_loading();
	Ajax.get(QueryArgs);
}

function goto(page_num)
{
	do_query(page_num);
}

function make_img_name(img_name)
{
	var img_id = parseInt(img_name)
	var addon = "";
	if (img_id < 10){
		addon = "000";
	} else if (img_id >= 10 && img_id < 100){
		addon = "00";
	} else if (img_id >= 100 && img_id < 1000){
		addon = "0";
	} 
	return addon + img_name;
}

function get_skill_icon(skillid)
{
	var img_name = make_img_name(skillid) + ".gif";
	return ResUrl + "/images/role_skills/" + img_name;
}
	
var Config = new RoleNameConf();
function show_role_tips_box(el)
{
	var game_ordersn = el.getAttribute("data_game_ordersn");
	
	var role = null;
	for (var i=0; i < QueryResult.length; i++){
		if (QueryResult[i]["game_ordersn"] == game_ordersn){
			role = QueryResult[i];
			break;
		}
	}
	if (!role){
		return;
	}

	// parse school info
	var school_skills = JSON.decode(role["school_skills"]);
	var school_skill_info = {};
	for (var i=1; i < 8; i++){
		school_skill_info["school_skill" + i + "_icon"]  = EmptySkillImg;
		school_skill_info["school_skill" + i + "_grade"] = "";
		school_skill_info["school_skill" + i + "_name"]  = "";		
	}
	 	
	for (var i=0; i < school_skills.length; i++){
		var skill_id = school_skills[i]["id"];
		var level = school_skills[i]["level"];
		var pos = Config.skill["school_skill"][skill_id]["pos"];
		var name = Config.skill["school_skill"][skill_id]["name"];
		school_skill_info["school_skill" + pos + "_icon"]  = get_skill_icon(skill_id);
		school_skill_info["school_skill" + pos + "_grade"] = level;
		school_skill_info["school_skill" + pos + "_name"]  = name;				
	}
	role["icon"] = ResUrl + '/images/bigface/' + get_role_iconid(role["race"]) + ".gif";
	
	var ctx = {"role":role, "school_skill":school_skill_info};
	render_to_replace("RoleTipsBox", "role_tips_templ", ctx);
	
	adjust_tips_position(el, $("RoleTipsBox"));	
}

function hidden_tips_box()
{
	$("RoleTipsBox").setStyle("display", "none");	
}
