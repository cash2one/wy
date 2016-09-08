function goto(page_num)
{
	search_role(page_num);
}

function show_equip_detail(server_id, equip_id, orderid, reonsale_identify)
{
	var url = CgiRootUrl + '/equipquery.py?act=overall_search_show_role_detail' +
			'&equip_id=' + equip_id +'&serverid=' + server_id;
	//Cookie.write('identify_' + equip_id, reonsale_identify, {"duration": 20/(24*3600), "path": "/"});
	window.open(url);
}

var QueryStatus = {
	"success" : 0,
	"param_error" : 1,
	"need_captcha" : 2,
	"failed" : 3,
	"error" : 4
};

function update_ck_img(){
	var img = $("validate_img");
	img.src = CgiRootUrl + "/create_validate_image.py?act=search_captcha&stamp=" + Math.random();
}

function hidden_layer()
{
	$("pageCover").setStyle("display", "none");
	$("popupWin").setStyle("display", "none");	
}

var is_ajax_check_captcha = false;
function check_captcha()
{
	if (is_ajax_check_captcha){
		alert("正在验证所输入的验证码，请稍候！");
		return;
	}
	
	var captcha_value = $("captcha_value").value.trim();
	if (captcha_value.length == 0){
		alert("请输入正确的验证码");
		return;
	}
	
	var deal_result = function(result, txt){
		is_ajax_check_captcha = false;
		if (result["status"] == QueryStatus["success"]){
			hidden_layer();
			alert("验证通过，请继续使用搜索功能！");
			return;
		} else {
			alert(result["msg"]);
			update_ck_img();
			return;
		}
	};
	
	var url = CgiRootUrl + '/equipquery.py';
	var Ajax = new Request.JSON({
		"url":url,
		"onSuccess":deal_result,
		"onFailure" : function (){
			is_ajax_check_captcha = false;
			alert("系统繁忙，请稍候再试");
			return;
			}
		});
		
	is_ajax_check_captcha = true;
	Ajax.post({
		"act" : "check_search_cpatcha",
		"captacha" : captcha_value 
	});
}

function show_captcha_layer()
{
	is_ajax_check_captcha = false;
	show_layer_center($("pageCover"), $("popupWin"));
	update_ck_img();
}

function search_callback(result, txt){	
	$('loading_img').style.display = 'none';
	if(result['status'] != 0){
		if (result['status'] == QueryStatus["need_captcha"]){
			show_captcha_layer();
			return;
		}
		 
		//silently ignore the error.
		alert('查询出错！');
		return;
	}
	var equips = result["msg"];
	if (equips.length > 0){
		render_to_replace("search_result_panel", "search_result_templ", {"equips":equips});
		adjust_table_row_style();
	}
	else{
		render_to_replace("search_result_panel", "search_empty_templ", {});
	}
	$('pager').empty();
	if(result.paging.num_end > 1){
		render_to_replace("pager", "pager_templ", {"pager":result.paging});
	}
	set_img_icon();
	reg_tips_event();
	/*var equips_cookie = '';
	for(var i=0; i < equips.length; i++)
		equips_cookie += "|" + equips[i]["serverid"] + "_" + equips[i]["equipid"];
	Cookie.write('overall_search_equips_cookie', equips_cookie);*/
}

function submit_advance_search(arg)
{
    var url = CgiRootUrl + '/overall_search.py';
	$('loading_img').style.display = '';
	var Ajax = new Request.JSON({"url":url,"noCache" : true,"onSuccess":search_callback});
	Ajax.get(arg);
	//execute_ajax(search_callback, url, params, 'POST');
}

function search()
{
	search_role(1, true);
}

function search_role(page, check_freq)
{
	if(trim($('expt_gongji').value) == '')
		$('expt_gongji').value = '0';
	var expt_gongji = parseInt(trim($('expt_gongji').value));
	if(isNaN(expt_gongji) || expt_gongji < 0 || expt_gongji > 25){
		alert('请填写正确的攻击修炼条件');
		return;
	}

	if(trim($('expt_fangyu').value) == '')
		$('expt_fangyu').value = '0';
	var expt_fangyu= parseInt(trim($('expt_fangyu').value));
	if(isNaN(expt_fangyu) || expt_fangyu< 0 || expt_fangyu> 25){
		alert('请填写正确的防御修炼条件');
		return;
	}

	if(trim($('expt_fashu').value) == '')
		$('expt_fashu').value = '0';
	var expt_fashu= parseInt(trim($('expt_fashu').value));
	if(isNaN(expt_fashu) || expt_fashu< 0 || expt_fashu> 25){
		alert('请填写正确的法术修炼条件');
		return;
	}

	if(trim($('expt_kangfa').value) == '')
		$('expt_kangfa').value = '0';
	var expt_kangfa= parseInt(trim($('expt_kangfa').value));
	if(isNaN(expt_kangfa) || expt_kangfa< 0 || expt_kangfa> 25){
		alert('请填写正确的抗法修炼条件');
		return;
	}

	if(trim($('bb_gongji').value) == '')
		$('bb_gongji').value = '0';
	var bb_gongji = parseInt(trim($('bb_gongji').value));
	if(isNaN(bb_gongji) || bb_gongji < 0 || bb_gongji > 25){
		alert('请填写正确的攻击控制力条件');
		return;
	}

	if(trim($('bb_fangyu').value) == '')
		$('bb_fangyu').value = '0';
	var bb_fangyu = parseInt(trim($('bb_fangyu').value));
	if(isNaN(bb_fangyu) || bb_fangyu < 0 || bb_fangyu > 25){
		alert('请填写正确的防御控制力条件');
		return;
	}

	if(trim($('bb_fashu').value) == '')
		$('bb_fashu').value = '0';
	var bb_fashu = parseInt(trim($('bb_fashu').value));
	if(isNaN(bb_fashu) || bb_fashu < 0 || bb_fashu > 25){
		alert('请填写正确的法术控制力条件');
		return;
	}

	if(trim($('bb_kangfa').value) == '')
		$('bb_kangfa').value = '0';
	var bb_kangfa = parseInt(trim($('bb_kangfa').value));
	if(isNaN(bb_kangfa) || bb_kangfa < 0 || bb_kangfa > 25){
		alert('请填写正确的抗法控制力条件');
		return;
	}

	if(trim($('qian_yuan_dan').value) == '')
		$('qian_yuan_dan').value = '0';
	var qian_yuan_dan = parseInt(trim($('qian_yuan_dan').value));
	if(isNaN(qian_yuan_dan) || qian_yuan_dan < 0){
		alert('请填写正确的乾元丹数');
		return;
	}

	if(trim($('qian_neng_guo').value) == '')
		$('qian_neng_guo').value = '0';
	var qian_neng_guo = parseInt(trim($('qian_neng_guo').value));
	if(isNaN(qian_neng_guo) || qian_neng_guo < 0){
		alert('请填写正确的潜能果数');
		return;
	}

	if(trim($('shanghai').value) == '')
		$('shanghai').value = '0';
	var shanghai = parseInt(trim($('shanghai').value));
	if(isNaN(shanghai) || shanghai < 0){
		alert('请填写正确的人物伤害');
		return;
	}

	if(trim($('lingli').value) == '')
		$('lingli').value = '0';
	var lingli = parseInt(trim($('lingli').value));
	if(isNaN(lingli) || lingli < 0){
		alert('请填写正确的人物灵力');
		return;
	}

	if(trim($('sudo').value) == '')
		$('sudo').value = '0';
	var sudo = parseInt(trim($('sudo').value));
	if(isNaN(sudo) || sudo < 0){
		alert('请填写正确的人物速度');
		return;
	}

	/*
	if(check_freq){
		var search_time = getCookieValue('o_search_time');
		if(search_time != null){
			alert('您搜索的太频繁了，请稍后再试～');
			return;
		}
		setCookieSecond('o_search_time', 'Y', 5, '/');
	}
	*/

	//search_key = $('school').value + '_' + $('level').value + '_' + $('price').value + '_' + $('qiang_shen').value;
	var arg = {
		"act" : "overall_search_role",
		//"search_key" : search_key,
		"school" : $('school').value,
		"level_index" : $('level').value,
		"price_index" : $('price').value,
		"qiang_shen_index" : $('qiang_shen').value,
		"expt_gongji" : expt_gongji,
		"expt_fangyu" : expt_fangyu,
		"expt_fashu" : expt_fashu,
		"expt_kangfa" : expt_kangfa,
		"qian_yuan_dan" : qian_yuan_dan,
		"qian_neng_guo" : qian_neng_guo,
		"bb_gongji" : bb_gongji,
		"bb_fangyu" : bb_fangyu,
		"bb_fashu" : bb_fashu,
		"bb_kangfa" : bb_kangfa,
		"shanghai" : shanghai,
		"lingli" : lingli,
		"sudo" : sudo
	}
	var new_arg = {};
	for(var p in arg){
		if(arg[p] != 0)
			new_arg[p] = arg[p];
	}
	if (page){
		new_arg["page"] = page;
	}
	
	var other_arg = [];
	new_arg["other_arg"] = other_arg.join(";");
	submit_advance_search(new_arg);
}
