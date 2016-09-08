var Recommd = {
	url: "http://recommd.xyq.cbg.163.com/cgi-bin/recommend.py"
};

function show_recommd_equips_in_list(){
	try{
		var recommd_info = JSON.decode(RecommdInfo);
		var collect_equips = recommd_info['collect_equips'];
	}catch(e){
		return;
	}

	if(!collect_equips){
		return;
	}

	var arg = {
		'equips': JSON.encode(collect_equips),
		'count': 4,
		'serverid': ServerInfo.server_id
	};

	var is_timeout = false;
	var show_equip_list = function(){
		$$('#soldList tbody').setStyle('display', '');
		is_timeout = true;
	}

	var callback = function(result, txt){
		if(is_timeout || result.status !== 1){
			show_equip_list();
			return;
		}
		console.log(result);

		var html = render('recommd_result_templ', {'equips': result.equips});
		
		var tbody = $$('#soldList tbody')[0];

		tbody.innerHTML = html + tbody.innerHTML;
		tbody.setStyle('display', '');

		reg_tips_event();
	}
	
	var Ajax = new Request.JSONP({
		"url": Recommd.url,
		"onSuccess": callback,
		"onFailure": show_equip_list
	});
	Ajax.send({'data':arg});

	setTimeout(show_equip_list, 1000);
}

function reg_tips_box_for_recommd_equips(){
	var el_list = $$("#recommd_result_panel ul li img");
	for (var i=0; i < el_list.length; i++){
		var el = el_list[i];
		el.addEvent("mouseover", show_tips_box);
		el.addEvent("mouseout", hidden_tips_box);
	}
}

function parse_desc_info(desc_info){
	try {
		return JSON.decode(desc_info).desc;
	} catch(e) {
		return desc_info;
	}
}

function show_recommd_equips_in_detail(page){
	if(!window.equip){
		return;
	}

	if(!page){
		page = 1;
	}

	var equips = [[equip['server_id'], equip['game_ordersn']]];

	var arg = {
		'equips': JSON.encode(equips),
		'count': 6,
		'serverid': ServerInfo.server_id,
		'cross_server': 1,
		'page': page
	};
	
	var callback = function(result, txt){
		if(result.status !== 1){
			if(page > 2){
				$('get_more_recommds').href = 'javascript:show_recommd_equips_in_detail(1)';
			}
			if(page > 1){
				alert('没有更多的相似物品了')
			}

			return;
		}

		var html = render_to_replace('recommd_result_panel', 'recommd_equips_in_detail_templ', {'equips': result.equips});
		reg_tips_box_for_recommd_equips();

		$('get_more_recommds').href = 'javascript:show_recommd_equips_in_detail('+(page+1)+')';
	}
	
	var Ajax = new Request.JSONP({
		"url": Recommd.url,
		"onSuccess": callback
	});
	Ajax.send({'data': arg});
}
