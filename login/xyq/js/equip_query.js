/* equip_query.js */

function goto_page(page_num)
{
	if (SearchType == SearchTypes["role_search"]){
		show_role_search_form();
		return search_role(page_num);
	} else if (SearchType == SearchTypes["pet_search"]){
		show_pet_search_form();
		return search_pet(page_num);
	} else if(SearchType == SearchTypes["equip_search"]){
		show_equip_search_form();
		return search_equip(page_num);
	} else if(SearchType == SearchTypes['search_by_type']){
		var form_obj = document.search_browse_f;
		form_obj.search_page.value = page_num;
		return search_auto_complete(form_obj, ename_data);
	}
	
	var obj_form = document.magic;
	var order_by = obj_form.query_order.value;
	var kind_id = obj_form.kind_id.value.toInt();
	var kind_depth = obj_form.kind_depth.value;
	$("page").value = page_num;
		
	if (!StaticFileConfig["is_using"]	
			|| page_num > StaticFileConfig["max_page"] || order_by!="selling_time DESC"){		
		document.magic.submit();
		return;			
	}
		
	if (obj_form.act.value=="query" && kind_id > 0 && kind_depth <= MaxStaticDepth && !NoStaticKindIds.contains(kind_id)){
		window.location = StaticFileConfig["res_root"] + "/" + ServerInfo["server_id"] + "/search_by_kind/" 
				+ kind_id + "/equip_list" + page_num + ".html";	
					
	} else if (obj_form.act.value=="query" && kind_id <= 0){
		window.location = StaticFileConfig["res_root"] + "/" + ServerInfo["server_id"] + "/buy_equip_list/equip_list" + page_num + ".html";
	
	}else{
		$("page").value = page_num;
		document.magic.submit();
	}		
}

function search_by_kind(kindid, kind_depth)
{
	SearchType = SearchTypes["normal_search"];
	
	if (kindid == 0){
		if (kind[1].length == 1){
			kindid = kind[1][0][0][0]; 
		}
	} 
	
	var form_obj = document.magic;
	$("page").value = 1;
	$("kind_depth").value = kind_depth;
	$("kind_id").value = kindid;
	form_obj.query_order.value = "selling_time DESC";
	
	goto_page(1);
}

function search_order_by(order_by, order)
{
	if (SearchType==SearchTypes['search_by_type']){
		var q_form = document.search_browse_f;
	} else {
		var q_form = document.magic;
	}
	var el_order = $(q_form.query_order);
	if (order_by == "price" || order_by == "unit_price"){
		if (order != null){
			el_order.value = order_by + " " + order;
		}
	} else {
		if (el_order.value == "price ASC"){
			el_order.value = "price DESC";
		} else {
			el_order.value = "price ASC";
		}
	}
	goto_page(1);
}

function search_auto_complete(form_obj, ename_data)
{
	var keyword = form_obj.search_text.value.trim();
	if (!keyword || keyword=="输入物品名称进行搜索"){
		alert("请输入物品名称进行搜索！");
		return false;
	}
	
	var result = [];
	for (var i=0; i<ename_data.length; i++){
		var ename = ename_data[i][0];
		if ((ename+"").indexOf(keyword) != -1){
			result = result.concat(ename_data[i][2]);
		}
	}
	if (result.length == 0){
		alert("您搜索的物品不存在，请重新输入！");
		return false;
	}
	IsClickBtnSearch = true;
	form_obj.equip_type.value = result.join();
	form_obj.submit();
	return true;
}

function show_equip_search_form()
{
	if (!TypeInfo["is_equip_type"] && SearchType!=SearchTypes["equip_search"]){
		SearchArg = {};
	}
	$("advance_search_panel").setStyle("display", "block");
	$$('.advance_search_link').removeClass('on');
	$('equip_search').addClass('on');
	render_to_replace("advance_search_panel", "equip_search_templ", {"arg":SearchArg});
	init_msyj_select_box(); 
	init_addon_status_box();
	set_equip_search_event();
	$('include_fair_show_panel').setStyle('display', '');
	$('chk_include_fair_show').checked = true;
}

function check_search_panel()
{
	if (SearchType == SearchTypes['offsale_search']){
		$("advance_search_panel").style.display = "none";		
		return;
	}
	if (SearchType == SearchTypes["role_search"] || TypeInfo["is_role_type"]){
		show_role_search_form();
		$$('.advance_search_link').removeClass('on');
		$('role_search').addClass('on');
	} else if(SearchType == SearchTypes["pet_search"] || TypeInfo["is_pet_type"]){
		show_pet_search_form();
		$$('.advance_search_link').removeClass('on');
		$('pet_search').addClass('on');
	}	else if(SearchType == SearchTypes["equip_search"] || TypeInfo["is_equip_type"]){
		show_equip_search_form();	
		$$('.advance_search_link').removeClass('on');
		$('equip_search').addClass('on');
	} else if (SearchType == SearchTypes["appointed_search"]){
		$$('.advance_search_link').removeClass('on');
		$("advance_search_panel").style.display = "none";		
		$("sub_menu_appointed_to_me").addClass("on");
	} else if (SearchType == SearchTypes["seller_search"]){
		$$('.advance_search_link').removeClass('on');
		$("advance_search_panel").style.display = "none";		
	} else {
		$("advance_search_panel").style.display = "none";		
	}
}

function show_role_search_form()
{
	if (!TypeInfo["is_role_type"] && SearchType!=SearchTypes["role_search"]){
		SearchArg = {};
	}
	$("advance_search_panel").setStyle("display", "block");
	$$('.advance_search_link').removeClass('on');
	$('role_search').addClass('on');
	render_to_replace("advance_search_panel", "role_search_templ", {"arg":SearchArg});
}

function show_pet_search_form()
{
	if (!TypeInfo["is_pet_type"] && SearchType!=SearchTypes["pet_search"]){
		SearchArg = {};
	}
	$("advance_search_panel").style.display = "block";
	$$('.advance_search_link').removeClass('on');
	$('pet_search').addClass('on');
	render_to_replace("advance_search_panel", "pet_search_templ", {"arg":SearchArg});
	init_pet_select_box();
	$('include_fair_show_panel').setStyle('display', '');
	$('chk_include_fair_show').checked = true;
}

function parse_role_info(raw_info){
	return js_eval( lpc_2_js(raw_info) )
}

function parse_desc_info(desc_info){
	return desc_info;
}
