/* query.js */

function query(common_var, query_var){
	var arg = Object.merge(common_var, query_var);
	var static_url = get_static_url(arg);
	if (static_url){
		location.href = static_url;
	} else {
		var url = CgiRootUrl + '/query.py';
		submit_advance_search(arg, url);
	}
}

function get_static_url(arg){
	if(!StaticFileConfig.is_using){
		return null;
	}
	if(arg.act != 'query' || arg.page > StaticFileConfig.max_page || NoStaticKindIds.contains(arg.kindid)){
		return null;	
	}
	if(!['', 'selling_time DESC'].contains(arg.query_order)){
		return null;
	}
	if(arg.kind_depth > MaxStaticDepth){
		return null;
	}
	if(arg.kindid && arg.kindid>0){
		return StaticFileConfig["res_root"] + "/" + ServerInfo["server_id"] +
			"/search_by_kind/" + arg.kindid + "/equip_list" + arg.page + ".html";	
	} else {
		return StaticFileConfig["res_root"] + "/" + ServerInfo["server_id"] +
			"/buy_equip_list/equip_list" + arg.page + ".html";
	}
}

function search_by_kind(kindid, kind_depth)
{
	if(FairShowType == 'pass_fair_show'){
		CommonVar['act'] = 'query';
	} else {
		CommonVar['act'] = 'fair_show_query';
	}
	CommonVar['page'] = 1;
	CommonVar['query_order'] = '';
	query_var = {'kindid': kindid, 'kind_depth': kind_depth};
	query(CommonVar, query_var);
}

function goto_page(page){
	CommonVar['page'] = page;
	if(CommonVar.act == 'query' && getPara('kind_depth')){
		QueryVar.kind_depth = parseInt(decodeURIComponent(getPara("kind_depth")));
	}
	if(getPara('search_text')){
		QueryVar.search_text = decodeURIComponent(getPara('search_text'));
	}
	query(CommonVar, QueryVar);
}

function search_order_by(order_by, order)
{
	if (!order_by) {
		CommonVar.query_order = '';
	} else if (order_by.startWith('auction') || order_by == 'expire_time') {
		CommonVar.query_order = order_by + " " + order;
	} else if (order_by == "price" || order_by == "unit_price"){
		if (order != null){
			CommonVar.query_order = order_by + " " + order;
		}
	} else {
		if (el_order.value == "price ASC"){
			CommonVar.query_order = "price DESC";
		} else {
			CommonVar.query_order = "price ASC";
		}
	}
	goto_page(1);
}

function show_equip_search_form()
{

	var arg = QueryVar;
	if(CheckVar.cur_storage_type != StorageStype.equip){
		arg = {};
	}
	$("advance_search_panel").setStyle("display", "block");
	$$('.advance_search_link').removeClass('on');
	$('equip_search') && $('equip_search').addClass('on');
	render_to_replace("advance_search_panel", "equip_search_templ", {"arg":arg, "common_arg": CommonVar});
	if(CommonVar.act == 'search_material'){
		$('sel_material_s_type').set('value', arg.s_type || "");
	} else if(CommonVar.act ==  'search_jl_stone'){
		$('sel_jl_stone_s_type').set('value', arg.s_type || "");
	}
	init_msyj_select_box(); 
	set_equip_search_event();
	set_chk_fair_show(arg, 'equip');

	$('suit_effect_panel').suit_value_getter = new SuitValueGetter();

	var item_list = $$("#sum_attr_panel li");
	var selected_types = arg['sum_attr_type']?arg['sum_attr_type']:'';

	for (var i=0; i < item_list.length; i++){
		var item = item_list[i];
		var label = item.getAttribute('data_value');
		if(label && selected_types.search(label) != -1){
			item.addClass('on');
		}
		item.addEvent("click", function (){
			var el = $(this);
			if (el.hasClass("on")){
				el.removeClass("on");
			} else {
				el.addClass("on");
			}
		})
	}

	var suit_effect = arg['suit_effect'];

	var arr = {
		'added_status': SuitAddedStatus,
		'append_skill': SuitAppendSkills,
		'transform_skill': SuitTransformSkills,
		'transform_charm': SuitTransformCharms
	}

	for(var k in arr){
		var v = arr[k];

		for(var name in v){
			var code = v[name];

			if(code+'' == suit_effect){
				$('radio_'+k).setProperty('checked', true);
				$('txt_'+k).value = name;
				break;
			}
		}
	}

	QueryVar['hide_lingshi'] = 1;
}

function show_pet_equip_search_form()
{
	var arg = QueryVar;
	if(CommonVar.act !== "search_pet_equip" && !is_pet_equip(QueryVar.kindid)) {
		arg = {};
	}
	$("advance_search_panel").setStyle("display", "block");
	$$('.advance_search_link').removeClass('on');
	$('pet_equip_search').addClass('on');
	render_to_replace("advance_search_panel", "pet_equip_search_templ", {"arg":arg, "common_arg": CommonVar});
	
	init_addon_status_box();
	set_chk_fair_show(arg, 'equip');
	
	var item_list = $$("#addon_skill_box li");
	
	for (var i=0; i < item_list.length; i++){
		var item = item_list[i];
		var label = item.getAttribute('data_value');
		if(label && arg[label] === "1"){
			item.addClass('on');
		}
		item.addEvent("click", function (){
			var el = $(this);
			if (el.hasClass("on")){
				el.removeClass("on");
			} else {
				el.addClass("on");
			}
		})
	}
}

function check_search_panel()
{
	if(CheckVar.cur_storage_type == StorageStype.role){
		show_role_search_form();
		$$('.advance_search_link').removeClass('on');
		$('role_search').addClass('on');
		$("highlight_filter").value = safe_attr(QueryVar["highlight_filter"]);
		update_highlight_filter_panel();
	} else if(CheckVar.cur_storage_type == StorageStype.pet) {
		show_pet_search_form();
		$$('.advance_search_link').removeClass('on');
		$('pet_search') && $('pet_search').addClass('on');
		$("highlight_filter").value = safe_attr(QueryVar["highlight_filter"]);
		update_highlight_filter_panel();
	} else if(CommonVar.act === "search_lingshi" || is_lingshi(QueryVar.kindid)) {
		show_lingshi_search_form();	
		$$('.advance_search_link').removeClass('on');
		$('lingshi_search').addClass('on');
	} else if(CommonVar.act === "search_pet_equip" || is_pet_equip(QueryVar.kindid)) {
		show_pet_equip_search_form();
		$$('.advance_search_link').removeClass('on');
		$('pet_equip_search').addClass('on');
	} else if(CheckVar.cur_storage_type == StorageStype.equip) {
		show_equip_search_form();	
		$$('.advance_search_link').removeClass('on');
		$('equip_search') && $('equip_search').addClass('on');
		$("highlight_filter").value = safe_attr(QueryVar["highlight_filter"]);
		update_highlight_filter_panel();
	} else {
		$("advance_search_panel").style.display = "none";
	}
}

function show_role_search_form()
{
	var arg = QueryVar;
	if(CheckVar.cur_storage_type != StorageStype.role){
		arg = {};
	}
	$("advance_search_panel").setStyle("display", "block");
	$$('.advance_search_link').removeClass('on');
	$('role_search').addClass('on');
	render_to_replace("advance_search_panel", "role_search_templ", {"arg": arg});
	var bb_expt_attrs = ['bb_expt_gongji', 'bb_expt_fangyu', 'bb_expt_fashu',
		 'bb_expt_kangfa', 'bb_expt_total'];
	var s_bb_expt = null;
	for(var i=0; i<bb_expt_attrs.length; i++){
		var k =  bb_expt_attrs[i];
		if(arg[k]){
			s_bb_expt=k;
			break;
		}
	}
	if(s_bb_expt){
		$('sel_expt_bb').set('value', s_bb_expt);
		$('txt_bb_expt').set('value', arg[s_bb_expt]);
	}
	$('sel_school_skill_num').set('value', arg.school_skill_num);
}


function show_pet_search_form()
{
	var arg = QueryVar;
	if(CheckVar.cur_storage_type != StorageStype.pet){
		arg = {};
	}
	$("advance_search_panel").style.display = "block";
	$$('.advance_search_link').removeClass('on');
	$('pet_search') && $('pet_search').addClass('on');
	render_to_replace("advance_search_panel", "pet_search_templ", {"arg":arg});
	init_pet_select_box();
	var pet_aptitudes = ['attack_aptitude', 'defence_aptitude',
		'physical_aptitude', 'magic_aptitude', 'speed_aptitude',
		'avoid_aptitude'
	];
	var s_pet_aptitude = null;
	for(var i=0; i<pet_aptitudes.length; i++){
		var k = pet_aptitudes[i];
		if (arg[k]){
			s_pet_aptitude = k;
			break;
		}
	}
	if(s_pet_aptitude){
		$('sel_pet_aptitude').set('value', s_pet_aptitude);
		$('txt_pet_aptitude').set('value', arg[s_pet_aptitude]);
	}
	var pet_status = "";
	if(arg.is_baobao == "0"){
		pet_status = 'yesheng';
	} else if (arg.is_baobao == "1"){
		pet_status = 'baobao';
	} else if (arg.color == "1"){
		pet_status = 'color1';
	} else if(arg.color == "2") {
		pet_status = 'color2';
	}
	$('sel_pet_status').set('value', pet_status);
	$('sel_pet_skill').set('value', arg.skill);
	set_chk_fair_show(arg, 'pet');
}

function init_lingshi_select_box(){
	var basic_attr = {
		61: [
				['damage', '戒指&middot;伤害'],
				['defense', '戒指&middot;防御']
			],
		62: [
				['magic_damage', '耳饰&middot;法伤'],
				['magic_defense', '耳饰&middot;法防']
			],
		63: [
				['fengyin', '手镯&middot;封印'],
				['anti_fengyin', '手镯&middot;抗封']
			],
		64: [
				['speed', '佩饰&middot;速度']
			]
	};

    var add_attr1 = [
        [1, '固伤'],
        [2, '伤害'],
        [3, '速度'],
        [4, '法伤'],
        [5, '狂暴'],
        [6, '物理暴击'],
        [7, '法术暴击'],
        [8, '封印'],
        [9, '法伤结果'],
        [10, '穿刺'],
        [11, '治疗']
    ];

    var add_attr2 = [
        [12, '气血'],
        [13, '防御'],
        [14, '法防'],
        [15, '抗物理暴击'],
        [16, '抗法术暴击'],
        [17, '抗封'],
        [18, '格挡'],
        [19, '回复']
    ];

    var sel_lingshi_type = $('sel_lingshi_type').value;
    sel_lingshi_type = parseInt(sel_lingshi_type);
	
	var target_attr = [];

	if(basic_attr[sel_lingshi_type]){
		target_attr = basic_attr[sel_lingshi_type];
	}else{
		for(var i=61;i<65;i++){
			target_attr = target_attr.concat(basic_attr[i]);
		}
	}

	var option_html = '<option value="">--请选择属性--</option>';
	for(var i=0;i<target_attr.length;i++){
        var item = target_attr[i];
        option_html += '<option value="'+item[0]+'">'+item[1]+'</option>';
    }
    $('sel_basic_attr_type').innerHTML = option_html;

    option_html = '<option value="0">不限</option>';
    option_html += '<option value="-1">无</option>';

    target_attr = [];

    if(sel_lingshi_type == 61 || sel_lingshi_type == 62){
        target_attr = add_attr1;
    }else if(sel_lingshi_type == 63 || sel_lingshi_type == 64){
        target_attr = add_attr2;
    }else{
        target_attr = add_attr1.concat(add_attr2);
    }

    for(var i=0;i<target_attr.length;i++){
        var item = target_attr[i];
        option_html += '<option value="'+item[0]+'">'+item[1]+'</option>';
    }

    $('sel_add_attr1').innerHTML = option_html;
    $('sel_add_attr2').innerHTML = option_html;
    $('sel_add_attr3').innerHTML = option_html;
}

function show_lingshi_search_form()
{
	var arg = QueryVar;
	if(CommonVar.act !== "search_lingshi" && !is_lingshi(arg.kindid)){
		arg = {};
	}
	$("advance_search_panel").style.display = "block";
	$$('.advance_search_link').removeClass('on');
	$('lingshi_search').addClass('on');
	render_to_replace("advance_search_panel", "lingshi_search_templ", {"arg":arg});
	init_lingshi_select_box();
    $('sel_lingshi_type').addEvent('change', init_lingshi_select_box);
    
    basic_attr_keys = ['damage', 'defense', 'magic_damage', 'magic_defense',
                       'fengyin', 'anti_fengyin', 'speed'];

    for(var i=0;i<basic_attr_keys.length;i++){
        var key = basic_attr_keys[i];

        if(arg[key]){
            $('sel_basic_attr_type').set('value', key);
            $('txt_lingshi_basic_attr_value').set('value', arg[key]);
            break;
        }
    }

    if(arg['added_attr_num'] > 0){
		var saved_pos = Cookie.read('lingshi_search_add_attr_pos');
		saved_pos = saved_pos.split(',');
		var temp_map = {};
		var temp_count = 0;

		for(var i=0;i<saved_pos.length;i++){
			var attr = parseInt(saved_pos[i]);
			
			if(attr < 0){continue;}
			temp_count++;
			if(attr == 0){continue;}

			if(temp_map[attr]){
				temp_map[attr] = temp_map[attr] + 1;
			}else{
				temp_map[attr] = 1;
			}
		}
		
		var is_match_saved = true;

		for(var key in temp_map){
			var value = temp_map[key];
			if(value != arg['added_attr.'+key]){
				is_match_saved = false;
				break;
			}
		}
	
		if(temp_count !== parseInt(arg['added_attr_num'])){
			is_match_saved = false;
		}

		if(is_match_saved){
			for(var i=0;i<saved_pos.length;i++){
				var attr = saved_pos[i];
                $('sel_add_attr'+(i+1)).value = attr;
			}
		}else{
			var count = 1;

			for(var key in arg){
				var m = key.match(/^added_attr\.(\d+)$/);
				var value = parseInt(arg[key]);
				for(;m && value > 0 && count <= 3;count++,value--){
					$('sel_add_attr'+count).value = m[1];
				}
				if(count > 3){
					break;
				}
			}
			var limit = parseInt(arg['added_attr_num']);
			for(count=3;count>limit;count--){
				$('sel_add_attr'+count).value = -1;
			}
		}
    }

	$('lingshi_level_min').set('value', arg['equip_level_min']);
	$('lingshi_level_max').set('value', arg['equip_level_max']);
	$('txt_lingshi_jinglian_level').set('value', arg['jinglian_level']);
	set_chk_fair_show(arg, 'lingshi');
}

function search_auto_complete(form_obj, ename_data){
	var keyword = form_obj.search_text.value.trim();
	if (!keyword || keyword=="输入物品名称进行搜索"){
		alert("请输入物品名称进行搜索！");
		return false;
	}
	
	if(FairShowType == 'pass_fair_show'){
		CommonVar.act =  'type_query';
	} else {
		CommonVar.act = 'fair_show_type_query';
	}
	CommonVar.page = 1;
	query_var = {
		'search_text': keyword.toBase64()
	}
	query(CommonVar, query_var);
}

function set_chk_fair_show(arg, search_type){
	if(FairShowType == 'pass_fair_show' && !CommonVar.auction_condition && $('include_fair_show_panel')){
		$('include_fair_show_panel').setStyle('display', '');	
	}
	if(search_type == 'equip'){
		var search_acts = ['search_role_equip', 'search_pet_equip', 'search_material', 'search_stone', 'search_jl_stone', 'search_msyj_neidan'];
	} else if (search_type == 'pet'){
		var search_acts = ['search_pet'];
	} else if (search_type == 'lingshi'){
        var search_acts = ['search_lingshi']
    }
	if(search_acts.contains(CommonVar.act) && arg.pass_fair_show){
		$('chk_include_fair_show').checked = false;
	} else {
		$('chk_include_fair_show').checked = true;
	}
}

function init_search_text(){
	var advance_search_box = $('advance_search_box');
	if (advance_search_box) {
		if(getPara('search_text')){
			advance_search_box.value = decodeURIComponent(getPara('search_text')).fromBase64();
		} else {
			advance_search_box.value = '输入物品名称进行搜索';
		}
	}
}

function parse_role_info(desc){
	return JSON.decode(desc)
}

function parse_desc_info(desc_info){
	return JSON.decode(desc_info).desc;
}

function init_recommend_menu()
{
	if (!is_user_login()){
		$$("#soldList tbody").setStyle("display", "");
		return;
	}
	
	// 推荐
	if (QueryVar["recommend_type"]){
		var recommend_menu = $("menu_recommend_type_" + QueryVar["recommend_type"]);
		if (recommend_menu){
			recommend_menu.addClass("on");
		}
	}

	//推荐装备
	if (QueryVar["recommend_type"] == 2 && CommonVar.page == 1){
		show_recommd_equips_in_list();
	}else{
		$$("#soldList tbody").setStyle("display", "");
	}
	
	var type_info = Cookie.read("recommend_typeids");
	if (CommonVar.auction_condition || !type_info){
		$("menu_recommend_all").setStyle("display", "");
		return;
	}
	
	$("menu_recommend").setStyle("display", "");
	
	var type_list = type_info.split(",");
	for (var i=0; i < type_list.length; i++){
		var el = $("menu_recommend_type_" + type_list[i]);
		el.getParent().getParent().setStyle("display", "");
	}	
	
}

function init_auction_conditions()
{
	// 生成竞拍排序HTML
	var sortContainer = $('auction_sort_container');
	if (sortContainer) {
		var sortInfo;
		if (CommonVar.auction_condition == 'open_buy')
			sortInfo = [
				{label: '抢付价格', key: 'auction_cur_price', ASC: '由低到高', DESC: '由高到低', tid: 'not_set'}
			];
		else
			sortInfo = [
				{label: '剩余时间', key: 'expire_time', ASC: '由少到多', DESC: '由多到少', tid: 'web_auc_4'},
				{label: '竞拍价格', key: 'auction_cur_price', ASC: '由低到高', DESC: '由高到低', tid: 'web_auc_5'},
				{label: '出价次数', key: 'auction_bid_count', ASC: '由少到多', DESC: '由多到少', tid: 'web_auc_6'}
			];

		var order_info = CommonVar.query_order.split(' ');

		render_to_replace('auction_sort_container', 'auction_sort_templ', {
			sortInfo: sortInfo,
			sortKey: order_info[0] || '',
			sortDir: order_info[1] || '',
			reverseOrder: {ASC: 'DESC', DESC: 'ASC'}
		});

		// 排序链接
		sortContainer.getElements('a[data-sort]').addEvent('click', function() {
			var orderby = this.getAttribute('data-sort').split(' ');
			search_order_by(orderby[0] || '', orderby[1] || '');
			return false;
		});

		// 竞拍排序弹出菜单
		$$('.js-listNavItem').addEvents({
			'mouseenter': function(e) {
				this.getChildren('.js-dropdown').setStyle('display', 'block');
			},
			'mouseleave': function(e) {
				this.getChildren('.js-dropdown').setStyle('display', 'none');
			}
		})
	}

	// 全服选择
	var overall_tgl = $('auction_overall_toggle');
	if (overall_tgl) {
		var links = overall_tgl.getElements('a[data-overall]');
		links.each(function(a) {
			if (a.getAttribute('data-overall') == CommonVar.auction_overall) {
				a.addClass('on');
			}
		});
		links.addEvent('click', function() {
			CommonVar.auction_overall = this.getAttribute('data-overall');
			goto_page(1);
			return false;
		});
	}
}

function init_equip_list_collect(refer) {
	// 收藏功能
	$$('.equipListCollect').addEvent('click', function() {
		if (!IsLogin) {
			login_to_collect();
			return;
		}
		var _this = this;
		var game_ordersn = this.getAttribute('data-game_ordersn');
		var img_el = $('equip_img_' + game_ordersn);
		window.collect_equip = {
			'price': img_el.getAttribute('data_price'),
			'equip_id': img_el.getAttribute('data_equipid'),
			'server_id': img_el.getAttribute('data_serverid'),
			'game_ordersn': game_ordersn,
			'collect_refer': refer
		}
		if (this.hasClass('on')) {
			collect_equip.del_collect_callback = function() {
				_this.removeClass('on');
			};
			del_from_favorites();
		} else {
			collect_equip.add_collect_callback = function() {
				_this.addClass('on');
			};
			show_collect_panel();
		}
	});

	$$('.equipListCollect').each(function(el) {
		var game_ordersn = el.getAttribute('data-game_ordersn');
		var img_el = $('equip_img_' + game_ordersn);
		var status = parseInt(img_el.getAttribute('data_status'));
		if ([1, 2, 3, 8].indexOf(status) < 0)
			el.setStyle('visibility', 'hidden')
	});
}
