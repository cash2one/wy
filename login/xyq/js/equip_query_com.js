/*
 *
 */
var StoneList = {4002:"太阳石", 4003:"月亮石", 4004:"光芒石", 4005:"神秘石", 4010:"黑宝石", 4011:"红玛瑙", 4012:"舍利子",4244:"星辉石"};
function save_equip_price_info(equipid, price)
{
	var identify = "identify_" + equipid;
	
	// create ck value
	var ck_value = price;
	var ck_time = 10 * (1 / (24 * 60 * 60));
	Cookie.write(identify, ck_value, {"duration":ck_time});
}

function show_kind_tree(hide_kinds)
{
	render_to_replace("kind_tree_panel", "kind_tree_templ", {"hide_kinds": hide_kinds});
}

function tree_folding(node, panel_id)
{
	var node = $(node);
	if(node.hasClass("on")){
		node.removeClass("on");
		$(panel_id).setStyle("display", "none");
	} else {
		node.addClass("on");
		$(panel_id).setStyle("display", "block");
	}
}

function get_kind_family(kind_data, kindid)
{
	kind[0][0] = kind[0][0].toInt();
	var result = [];
	var kind_item = kind_data[0];
	var sub_kinds = kind_data[1];
	if (kind_item[0] == kindid){
		result = [kindid];
		return result;
	} else {
		for (var i=0; i < sub_kinds.length; i++){
			ret = get_kind_family(sub_kinds[i], kindid);
			if (ret.length > 0){
				result.push(kind_item[0]);
				result.append(ret);
				return result;
			}
		}
		return [];
	}
}

function init_sub_nav(){
	var NavManager = function(dom){
		var __this = this;
		this.dom = dom;
		this.item_dom_list = this.dom.getElementsByTagName("a");

		if (SearchType == SearchTypes["role_search"]){
			//this.item_index = 1;	
		} else if(SearchType == SearchTypes["pet_search"]){
			//this.item_index = 2;
		} else if(SearchType == SearchTypes["equip_search"]){
			//this.item_index = 3;
		} else if(SearchType == SearchTypes['offsale_search']){
			this.item_index = 2;
		} else if (SearchType == SearchTypes['appointed_search']){

		} else if (SearchType == SearchTypes['seller_search']){
			//
		} else {
			this.item_index = 0;
		}
		if(this.item_index != undefined)
			this.item_dom_list[this.item_index].className = "on";

		for(var i=0; i<this.item_dom_list.length; i++){
			var item_dom = this.item_dom_list[i];
			item_dom.index = i;
			/*
			item_dom.onclick = function(e){
				var e = e || event;
				var target = e.target || e.srcElement;
				__this.item_dom_list[__this.item_index].className = "";
				__this.item_index =  this.index;
				target.className = "on";
			}
			*/
		}
	};
	if (!CommonVar.auction_condition)
		new NavManager(document.getElementById("querySubNav"));

	var search_menu = getPara('search_menu');

	if(search_menu){
		handle_advance_search_link(search_menu);
	}
}

function close_search_form(){
	$("advance_search_panel").setStyle("display", "none");
	$$('.advance_search_link').removeClass('on');
}



function search_to_wtb(wtb_type){
	window.location = CgiRootUrl + '/wanttobuy.py?act=search_to_wtb&wtb_type=' + wtb_type + '&args='+JSON.encode(SearchArg);
}

function init_autocomplete(box, options) {
	if (box)
		new AutoComplete(box, options);
}

function init_pet_select_box(){ 
    // advance pet search
    var handle_pet_search = function(keyword){
        var result = new Array();
        for (var pet_type in SaleablePetNameInfo) {
            if (SaleablePetNameInfo[pet_type].indexOf(keyword)!= -1){
				var type_name = SaleablePetNameInfo[pet_type];
				if (result.indexOf(type_name) == -1){
	                result.push(type_name);
	            }
            }
        }

        return result;
    };
    var do_pet_search = function (){};
    init_autocomplete($('pet_select_box'),{
        "startPoint" : 1,
        "promptNum" : 20,
        "handle_func" : handle_pet_search,
        "callback": do_pet_search
    });
}

function init_msyj_select_box(){
    // advance pet search
	var items = MO_SHOU_YAO_JUE.concat(SaleNeidanSkills);
	var handle_msyj_search = function(keyword){
		var result = new Array();   
		for (var i=0; i < items.length; i++) {
			if (items[i].indexOf(keyword)!= -1){
				result.push(items[i]);
			}
		}
		return result;
	};
	var do_msyj_search = function (){};
	init_autocomplete($('msyj_select_box'),{
		"startPoint" : 1,
		"promptNum" : 10,
		"handle_func" : handle_msyj_search,
		"callback": do_msyj_search
	});
}

function submit_advance_search(arg, url)
{
	$("advance_search").innerHTML = "";
	var search_form = document.advance_search;
	search_form.method = 'GET';
	if(url){search_form.action = url;}
	var create_input_el = function(el_name, el_value){
			var input = document.createElement('input');
			input.type = 'hidden';
			input.name = el_name;
			input.value = el_value;
			return input;
	};
	for (var field in arg){
		search_form.appendChild(create_input_el(field, arg[field]));
	}
	search_form.submit();
}

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

function get_fair_show_arg(){
	var arg = {};
	if(FairShowType == 'pass_fair_show'){
		if(!$('chk_include_fair_show').checked){
			arg['pass_fair_show'] = 1;
		}
	} else {
		arg['pass_fair_show'] = 0;
	}
	return arg;
}

function search_pet(page){
	var arg = {
		"act" : "search_pet"
	};
	
	if (page){
		arg["page"] = page;
	}
	if (CommonVar.auction_condition)
		arg.auction_condition = CommonVar.auction_condition;
	Object.append(arg, get_fair_show_arg());
	// get pet type
	var pet_name = $("pet_select_box").value.trim();
	var pet_type = [];
	for (var type_id in SaleablePetNameInfo){
		if (SaleablePetNameInfo[type_id] == pet_name){
			pet_type.push(type_id);
		}
	}
	if (pet_type.length > 0){
		arg["type"] = pet_type.join(",");
	}
	var level_min = parseInt($("pet_level_min").value);
	var level_max = parseInt($("pet_level_max").value);
	if (!check_level(level_min, level_max, 0, 180)){
		return;
	}
	if(!isNaN(level_min)){arg["level_min"] = level_min;}
	if(!isNaN(level_max)){arg["level_max"] = level_max;}

	var growth = parseFloat($("pet_growth").value);
	if (growth > 0){
		if (growth > 1.295){
			alert("召唤兽成长只能输入0到1.295之间的正数，且小数点后不超过3位。请您重新输入。");
			return;
		}
		arg['growth'] = parseInt(growth * 1000);
	}
	arg['skill_num'] = $("pet_skill_num").value;
	var txt_int_items = [
		['price_min', 0, MaxTradeYuan, '价格'],
		['price_max', 0, MaxTradeYuan, '价格'],
		['aptitude', 0, 5000, '召唤兽资质']
	];
	var int_args = check_txt_int_arg(txt_int_items, 'pet_');
	Object.append(arg, int_args);
	if(arg['price_min'] > arg['price_max']){
		alert('最低价格不能大于最高价格');
		return;
	}
	if(arg['price_min'] == 0){delete arg['price_min'];}
	if(arg['price_max'] == MaxTradeYuan){delete arg['price_max'];}
	if(arg['price_min']){
		arg['price_min'] = arg['price_min'] * 100;
	}
	if(arg['price_max']){
		arg['price_max'] = arg['price_max'] * 100;
	}
	if($('sel_pet_aptitude').value && arg.aptitude){
		arg[$('sel_pet_aptitude').value] = arg.aptitude;
	}
	if(arg.aptitude){delete arg.aptitude;}
	if($('sel_pet_skill').value){
		arg['skill'] = $('sel_pet_skill').value;
	}
	var pet_status = $('sel_pet_status').value;
	if(pet_status == 'yesheng'){
		arg['is_baobao'] = 0;
	} else if (pet_status == 'baobao'){
		arg['is_baobao'] = 1;
	} else if (pet_status == 'color1'){
		arg['color'] = 1;
	} else if (pet_status == 'color2'){
		arg['color'] = 2;
	} 

	var highlight_filter = $("highlight_filter").value;
	if (highlight_filter.length > 0){
		arg["highlight_filter"] = highlight_filter;
	}
			
	submit_advance_search(arg, CgiRootUrl + '/query.py');
}

function search_lingshi(page){
	var arg = {
		"act" : "search_lingshi"
	};
	
	if (page){
		arg["page"] = page;
	}
	Object.append(arg, get_fair_show_arg());
	// get lingshi type
	var lingshi_type = $("sel_lingshi_type").value;
    if(lingshi_type){
	    arg["kindid"] = lingshi_type;
    }

	var level_min = parseInt($("lingshi_level_min").value);
	var level_max = parseInt($("lingshi_level_max").value);
	if (!check_level(level_min, level_max, 60, 160)){
		return;
	}
	if(!isNaN(level_min)){arg["equip_level_min"] = level_min;}
	if(!isNaN(level_max)){arg["equip_level_max"] = level_max;}

	var txt_int_items = [
		['price_min', 0, MaxTradeYuan, '价格'],
		['price_max', 0, MaxTradeYuan, '价格'],
		['jinglian_level', 0, 16, '精练等级'],
		['basic_attr_value', 0, 5000, '基础属性']
	];
	var int_args = check_txt_int_arg(txt_int_items, 'lingshi_');
	Object.append(arg, int_args);
	if(arg['price_min'] > arg['price_max']){
		alert('最低价格不能大于最高价格');
		return;
	}
	if(arg['price_min'] == 0){delete arg['price_min'];}
	if(arg['price_max'] == MaxTradeYuan){delete arg['price_max'];}
	if(arg['price_min']){
		arg['price_min'] = arg['price_min'] * 100;
	}
	if(arg['price_max']){
		arg['price_max'] = arg['price_max'] * 100;
	}
	if($('sel_basic_attr_type').value && arg.basic_attr_value){
		arg[$('sel_basic_attr_type').value] = arg.basic_attr_value;
	}

	Object.append(arg, get_fair_show_arg());

    var add_attr_num = 0;
    var add_attrs = {};
	var add_attrs_pos = [];

    for(var i=1;i<4;i++){
        var add_attr = $('sel_add_attr'+i).value;
		add_attrs_pos.push(add_attr);

        if(add_attr > 0){
			if(add_attrs[add_attr]){
				add_attrs[add_attr] = add_attrs[add_attr] + 1;
			}else{
				add_attrs[add_attr] = 1;
			}
            add_attr_num++;
        }else if(add_attr == 0){
            add_attr_num++;
        }else{
            continue;
        }
    }

	Cookie.write('lingshi_search_add_attr_pos', add_attrs_pos.join(','));

    arg['added_attr_num'] = add_attr_num;

	for(var key in add_attrs){
		var value = add_attrs[key];

		arg['added_attr.'+key] = value;
	}

    arg['added_attr_logic'] = 'and';

	if(arg.aptitude){delete arg.aptitude;}
	submit_advance_search(arg, CgiRootUrl + '/query.py');
}

function check_level(level_min, level_max, min_value, max_value)
{
	if (level_min < min_value || level_min > max_value) {
		alert("你设置的最低等级有错误");
		return false;
	}
	if (level_min < min_value) {
		alert("最低级别为" + min_value + "，请重新设置");
		return false;
	}

	if (level_max < min_value || level_max > max_value) {
		alert("您设置的最高等级有错误");
		return false;
	}
	if (level_min > level_max){
		alert("等级设置错误，最低等级高于最高等级");
		return false;
	}
	return true;
}

function get_price_arg(prefix){
	var arg = {};
	var txt_int_items = [
		['price_min', 0, MaxTradeYuan, '价格'],
		['price_max', 0, MaxTradeYuan, '价格']
	];
	arg = check_txt_int_arg(txt_int_items, prefix);
	if(arg['price_min'] > arg['price_max']){
		alert('最低价格不能大于最高价格');
		return;
	}
	if(arg['price_min'] == 0){delete arg['price_min'];}
	if(arg['price_max'] == MaxTradeYuan){delete arg['price_max'];}
	if(arg['price_min']){
		arg['price_min'] = arg['price_min'] * 100;
	}
	if(arg['price_max']){
		arg['price_max'] = arg['price_max'] * 100;
	}
	return arg;
}

function search_equip(page, act)
{
	var arg = {};
	if (act){
		arg["act"] = act;
		kind = act;
	} else {
		var kind = get_radio_value("equip_kind");
		arg["act"] = kind;
	}
	
	if (page){
		arg["page"] = page;
	}
	if (CommonVar.auction_condition)
		arg.auction_condition = CommonVar.auction_condition;
	Object.append(arg, get_fair_show_arg());
	if (kind == 'search_role_equip'){
		var sp_skill = $('sel_equip_special_skill').value;
		var sp_effect = $('sel_equip_special_effect').value;
		
		var attr_type = $('sel_equip_attr').value;
		var attr_value = $('txt_equip_attr').value;

		if(sp_skill){
			arg['special_skill'] = sp_skill;
		}
		if(sp_effect){
			arg['special_effect'] = sp_effect;
		}
		arg['special_mode'] = 'and'

		if(attr_type){
			arg[attr_type] = attr_value;
		}
		
		var sum_attr_type = '';
		var el_list = $$("#sum_attr_panel li");
		for (var i=0; i < el_list.length; i++){
			var item = el_list[i];
			if (item.hasClass("on")){
				var attr_name = item.getAttribute("data_value");
				sum_attr_type += attr_name + ',';
			}
		}
		
		var sum_attr_value = $('txt_sum_attr_value').value;

		if(sum_attr_value && sum_attr_type){
			try{
				sum_attr_value = parseInt(sum_attr_value);
			}catch(e){
				alert('属性总和必须为整数');
			}
			arg['sum_attr_value'] = sum_attr_value;
			arg['sum_attr_type'] = sum_attr_type.slice(0,-1);
		}

		var level_min = parseInt($("s_role_level").value);
		var level_max = 160;
		if(level_min){
			level_max = level_min + 9;
		}else{
			level_min = 0;
		}

		var suit_value_getter = $('suit_effect_panel').suit_value_getter;
		var suit_effect_ret = suit_value_getter.get_value();
		if(!suit_effect_ret.valid){
			alert(suit_effect_ret.value);
			return;
		}
		if(suit_effect_ret.value){
			arg['suit_effect'] = suit_effect_ret.value;
		}

		arg['level_min'] = level_min;
		arg['level_max'] = level_max;
		arg["kindid"] = $("s_role_type").value;
		Object.append(arg, get_price_arg('equip_'));

		arg['hide_lingshi'] = 1;
		
		var highlight_filter = $("highlight_filter").value;
		if (highlight_filter.length > 0){
			arg["highlight_filter"] = highlight_filter;
		}
		
	} else if (kind == 'search_pet_equip' || kind == 'search_pet_by_pet_equip'){
		var args_config = [
			["speed", "速度"], ["fangyu","防御"],
			["mofa", "魔法"], ["shanghai", "伤害"],
			["hp", "气血"], ["xiang_qian_level", "宝石"],
			["addon_sum_min", "属性总和"], ["addon_minjie_reduce", "敏捷减少"]
		];
		
		var result = check_int_args(args_config);
		if (!result["result"]){
			alert(result["msg"]);
			return;
		}
		var args = result["args"];
		arg = Object.merge(arg, args);	
	
		var addon_el_list = $$("#addon_skill_box li");
		for (var i=0; i < addon_el_list.length; i++){
			var item = addon_el_list[i];
			if (item.hasClass("on")){
				var attr_name = item.getAttribute("data_value");
				arg[attr_name] = 1;
			}
		}

		arg["level"] = $("s_pet_level").value;
		arg["equip_pos"] = $("s_pet_type").value;
		arg["addon_status"] = $('txt_addon_status').value;
		Object.append(arg, get_price_arg('pet_'));
	} else if (kind == 'search_stone'){
		arg["equip_level"] = $("s_stone_level").value;
		arg["s_type"] = $("s_stone_type").value;
	} else if(kind == 'search_msyj_neidan') {
		var s_name = $("msyj_select_box").value.trim();
		if (s_name.length != 0){
			if(MO_SHOU_YAO_JUE.contains(s_name)){
				arg['s_type'] = '611,18521';
				arg['skill_name'] = s_name.toBase64();
			}
			if(SaleNeidanSkills.contains(s_name)){
				arg['s_type'] = '4103';
				arg['skill_name'] = s_name.toBase64();
			}
		}
	} else if(kind == 'search_material'){
		arg['equip_level'] = $('sel_material_level').value;
		arg['s_type'] = $('sel_material_s_type').value;
		arg['keyword'] = $('sel_dianhuashi_skill').value;
	} else if (kind == 'search_jl_stone'){
		arg['equip_level'] = $('sel_jl_stone_level').value;
		arg['s_type'] = $('sel_jl_stone_s_type').value;
	}
	
	submit_advance_search(arg, CgiRootUrl + '/query.py');
}

function search_role(page)
{
	var arg = {
		"act" : "search_role",
		"school" : $("role_school").value,
		"race" : $("role_type").value
	}
	if (page){
		arg["page"] = page;
	}
	var txt_int_items = [
		['level_min', 0, 175, '等级'],
		['level_max', 0, 175, '等级'],
		['price_min', 0, MaxTradeYuan, '价格'],
		['price_max', 0, MaxTradeYuan, '价格'],
		['sum_exp_min', 0, 3000000, '总经验'],
		['sum_exp_max', 0, 3000000, '总经验'],
		['bb_expt', 0, 100, '宠物修炼'],
		['qian_yuan_dan', 0, 200, '乾元丹'],
		['school_skill_level', 0, 200, '师门技能等级'],
		['qian_neng_guo', 0, 500, '潜能果数']
	];
	var int_args = check_txt_int_arg(txt_int_items);
	if(int_args == null){return;}
	Object.append(arg, int_args)
	if(arg['price_min'] > arg['price_max']){
		alert('最低价格不能大于最高价格');
		return;
	}
	if(arg['price_min'] == 0){delete arg['price_min'];}
	if(arg['price_max'] == MaxTradeYuan){delete arg['price_max'];}
	if(arg['price_min']){
		arg['price_min'] = arg['price_min'] * 100;
	}
	if(arg['price_max']){
		arg['price_max'] = arg['price_max'] * 100;
	}
	if(arg['level_min'] > arg['level_max']){
		alert('最低等级不能高于最高等级');
		return;
	}
	if($('sel_expt_bb').value && arg.bb_expt){
		arg[$('sel_expt_bb').value] = arg.bb_expt;
		delete arg.bb_expt;
	} else {
		delete arg.bb_expt;
	}
	if($('sel_school_skill_num').value && arg.school_skill_level){
		arg['school_skill_num'] = $('sel_school_skill_num').value;
	} else {
		delete arg.school_skill_level;
	}
	var confs = [
		'expt_gongji',
		'expt_fangyu',
		'expt_fashu',
		'expt_kangfa',
		'expt_lieshu'
	];
	for(var i=0; i<confs.length; i++){
		var k = confs[i];
		var value = $(k).value;
		if(value && parseInt(value) > 0){
			arg[k] = value;
		}
	}

	var highlight_filter = $("highlight_filter").value;
	if (highlight_filter.length > 0){
		arg["highlight_filter"] = highlight_filter;
	}
		
	submit_advance_search(arg, CgiRootUrl+'/query.py');
}

function check_txt_int_arg(txt_int_items, prefix){
	if(!prefix){
		prefix='';
	}
	var arg = {};
	var intReg = /^\d+$/;
	for(var i=0; i<txt_int_items.length; i++){
		var item = txt_int_items[i];
		var el = $('txt_' + prefix+item[0]);
		var value = el.value;
		if(!value){continue;}
		if(!intReg.test(value)){
			alert(item[3]+'必须是整数');
			el.focus();
			return;
		}
		if(!(item[1]<=parseInt(value) && parseInt(value)<=item[2])){
			alert(item[3]+'超出取值范围:' + item[1] + '-' + item[2]);
			el.focus();
			return;
		} 
		arg[item[0]] = parseInt(value);
	}
	return arg;
}


function init_advance_search_box()
{
	var name_list = window.SearchableEquipNames;
	if (!name_list) {
		name_list = [];
		for (var i = 0; i < ename_data.length; ++i) {
			name_list.push(ename_data[i][0]);
		}
	}

	var handler = function(keyword){
		var result = new Array();
		for (var i = 0; i < name_list.length; i++){
			var ename = name_list[i];
			if (ename.indexOf(keyword) != -1)
				result.push(ename);
		}
		return result;
	};
	init_autocomplete($('advance_search_box'),{
		"startPoint" : 1,
		"promptNum" : 20,
		"handle_func" : handler,
		"callback": search_by_equip_name
	});
}

function search_by_equip_name(cur_equip_name) //auto call back
{
	return search_auto_complete(document.search_browse_f, ename_data);
}

function update_role_type()
{
    var box = $("role_type");
    // clear old options
	box.empty();
    // add new options
    box.grab(new Option("--不限--", ""));
    var school = $("role_school").value;
	if(school){
    	var kind_list = SchoolKindMapping[school];
	} else {
		var kind_list = Object.keys(RoleKindNameInfo);
	}
    for (var i=1; i <= kind_list.length; i++){
        var kind = kind_list[i-1];
        box.grab(new Option(RoleKindNameInfo[kind], kind));
    }
}

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

function fen2yuan_para(fen){
	if(fen == null || fen == undefined || fen==""){
		return "";
	} else {
		return parseInt(fen/100);
	}
}

function decode_base64_para(b64_para){
	if(b64_para){
		return b64_para.fromBase64();
	} else {
		return "";
	}
}

function init_addon_status_box(){
	var EquipAddonStatus = ["高级合纵","高级法术抵抗","高级盾气","合纵","法术抵抗","盾气","惊心一剑","死亡召唤","上古灵符","善恶有报","力劈华山","夜舞倾城","剑荡四方"];
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
	init_autocomplete($('txt_addon_status'),{
		"startPoint" : 1,
		"promptNum" : 20,
		"handle_func" : skill_search,
		"callback": function(){}
	});
}

function reset_material_info()
{
	$('sel_material_level').setStyle('display', 'none');
	$('sel_dianhuashi_skill').setStyle('display', 'none');
}

function set_equip_search_event(){
	$('sel_material_s_type') && $('sel_material_s_type').addEvent('change', function(){
		if(['4202', '1', '2'].contains(this.value)){
			reset_material_info();
			$('sel_material_level').set('value', '');
		} else if (this.value == "4034"){
			reset_material_info();
			$('sel_dianhuashi_skill').setStyle('display', '');
		} else {
			reset_material_info();
			$('sel_material_level').setStyle('display', '');
		}
	}).fireEvent('change');

	$$('#advance_search_panel .label_role_equip').addEvent('focus', function(){
		set_radio_check('equip_kind', 'search_role_equip');
	});
	$$('#advance_search_panel .label_pet_equip').addEvent('focus', function(){
		set_radio_check('equip_kind', 'search_pet_equip');
	});
	$$('#advance_search_panel .label_role_equip').addEvent('focus', function(){
		set_radio_check('equip_kind', 'search_role_equip');
	});
	$$('#advance_search_panel .label_material').addEvent('focus', function(){
		set_radio_check('equip_kind', 'search_material');
	});
	$$('#advance_search_panel .label_stone').addEvent('focus', function(){
		set_radio_check('equip_kind', 'search_stone');
	});
	$$('#advance_search_panel .label_jl_stone').addEvent('focus', function(){
		set_radio_check('equip_kind', 'search_jl_stone');
	});
	$$('#advance_search_panel .label_msyj_neidan').addEvent('focus', function(){
		set_radio_check('equip_kind', 'search_msyj_neidan');
	});
}

function set_radio_check(radio_name, value){
	$$('input[name='+radio_name+']').each(function(el){
		if(el.value == value){el.checked = 'checked';}
	});
}

function get_subkinds_by_name(kind_data, kind_name)
{
    var cur_kind_name = kind_data[0][1];
    
    var sub_kinds = kind_data[1];
    if (cur_kind_name == kind_name){
		var result = [kind_data[0][0]];
		for (var i=0; i < sub_kinds.length; i++){
			result.push(sub_kinds[i][0][0]);
		}
		return result;
    } else {
	    for (var i=0; i < sub_kinds.length; i++){
    		var result = get_subkinds_by_name(sub_kinds[i], kind_name);
    		if (result.length > 0){
 				return result;
 			}   		    
    	}
    	return [];
    }
}

var WeaponKinds = null;
function get_weapon_kinds()
{
	if (WeaponKinds == null){
		WeaponKinds = get_subkinds_by_name(kind, "武器");
	}
	
	return WeaponKinds;
}

var FangjuKinds = null;
function get_fangju_kinds()
{
	if (FangjuKinds == null){
		FangjuKinds = get_subkinds_by_name(kind, "防具");
	}
	return FangjuKinds;	
}

function if_need_display_highlight()
{
	// 装备/召唤兽搜索，需要显示亮点
	if (CommonVar && (CommonVar["act"] == "search_role_equip" || CommonVar["act"] == "search_pet" || CommonVar["act"] == "search_role")){
	//if (CommonVar && (CommonVar["act"] == "search_role_equip" || CommonVar["act"] == "search_pet")){
		return true;
	}
	// 武器，防具类别，需要显示亮点
	if (CommonVar["act"] == "query" && CheckVar["cur_storage_type"] == StorageStype["equip"]){
		var weapon_kinds = get_weapon_kinds();
		if (weapon_kinds.contains(parseInt(QueryVar["kindid"]))){
			return true;
		}
		
		var fangju_kinds = get_fangju_kinds();
		if (fangju_kinds.contains(parseInt(QueryVar["kindid"]))){
			return true;
		}		
	}
	// 召唤兽需要显示亮点
	if (CommonVar["act"] == "query" && CheckVar["cur_storage_type"] == StorageStype["pet"]){
		return true;
	}
	
	
	if (CommonVar["act"] == "query" && CheckVar["cur_storage_type"] == StorageStype["role"]){
		return true;
	}
	
	
	if (CommonVar["act"] == "recommend_search"){
		var recommend_type = parseInt(QueryVar["recommend_type"]);
		if (recommend_type == 2 || recommend_type == 3 || recommend_type == 1){
			return true;
		}
	}
	
	return false;
}

function gen_table_header()
{
	if (CommonVar.auction_condition) {
		return render("AuctionHeader", {'highlight': if_need_display_highlight()});
	} else if (if_need_display_highlight()){
		return render("HighlightHeader", {});
	} else {
		return render("CommonTableHeader", {});
	}
}

function gen_highlight(highlights)
{
	if (if_need_display_highlight()){
		return "<td>" + gen_highlight_html(highlights, "<br />", true) + "</td>";
	} else {
		return "";
	}
}

function if_display_all_menu()
{
	if (!is_user_login() || CommonVar["act"] == "fair_show_query"){
		return true
	} else {
		return false;
	}	
}


function do_highlight_search()
{
	if (CheckVar["cur_storage_type"] == StorageStype["pet"]){
		search_pet(1);
	} else if (CheckVar["cur_storage_type"] == StorageStype["equip"]){
		QueryVar["act"] = "search_role_equip";	
		search_equip(1, "search_role_equip");
	} else if (CheckVar["cur_storage_type"] == StorageStype["role"]){
		QueryVar["act"] = "search_role";	
		search_role(1);	
	} else {
	}
}

function update_highlight_filter_panel()
{
	var exists_filters_str = $("highlight_filter").value;
	if (!exists_filters_str){
		exists_filters = [];
	} else {
		exists_filters = JSON.decode(exists_filters_str);
	}
	
	for (var i=0; i < exists_filters.length; i++){
		var item = exists_filters[i];
		item[0] = item[0].fromBase64();
	}
	
	render_to_replace("highlight_filter_panel", "highlight_filter_templ", {"filter_list":exists_filters});	
}

function add_highlight_filter(el)
{
	var el = $(el);
	var new_filter = JSON.decode(el.getAttribute("data_paras").fromBase64());
	
	var exists_filters_str = $("highlight_filter").value;
	if (!exists_filters_str){
		exists_filters = [];
	} else {
		exists_filters = JSON.decode(exists_filters_str);
	}
	
	if (exists_filters.length >= 6){
		alert("最多只能有 6 个亮点搜索条件");
		return false;
	}
	
	for (var i=0; i < exists_filters.length; i++){
		if (exists_filters[i][0].fromBase64() == new_filter[0]){
			return;
		}
		
		if (exists_filters[i][2]["key"] == new_filter[2]["key"]){
			exists_filters.splice(i, 1);
		}
	}
	new_filter[0] = new_filter[0].toBase64();
	exists_filters.push(new_filter);
	$("highlight_filter").value = JSON.encode(exists_filters);

	update_highlight_filter_panel();
	do_highlight_search();
		
}

function del_highlight_filter(el)
{
	var el = $(el);
	var new_filter = JSON.decode(el.getAttribute("data_paras").fromBase64());
	
	var exists_filters_str = $("highlight_filter").value;
	if (!exists_filters_str){
		exists_filters = [];
	} else {
		exists_filters = JSON.decode(exists_filters_str);
	}
	
	for (var i=0; i < exists_filters.length; i++){
		if (exists_filters[i][0].fromBase64() == new_filter[0]){
			exists_filters.splice(i, 1);
		}
	}		
	$("highlight_filter").value = JSON.encode(exists_filters);
	
	update_highlight_filter_panel();
	
	do_highlight_search();

}
