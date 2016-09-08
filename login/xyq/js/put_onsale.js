/*
 *
 */

var PutOnSale = new Class({
	initialize : function(){
		this.max_equip_price  = MaxPrice;
		this.min_equip_price = MinPrice;
		
		this.poundage = 0;
		this.overall_poundage = 0;
		
		this.init_check_flag();
		
		this.last_price_value = null;
		
		this.poundage_cache = {};
		
		this.first_onsale_price = FirstOnsalePrice;
		this.price_change_min_range = PriceRange;
	},

	init_check_flag : function(){
		this.pass_basic_check      = false;
		this.get_poundage_finished = false;	
		this.if_price_ok = false;
	},

	msg : function (msg){
		$("extrainfo").innerHTML = msg;
	},
	
	check_price_range : function(price){
		
	},

	query_poundage : function(){
		if (!this.pass_basic_check){
			return;
		}
		
		var price = $("price").value;
		var is_overall = $('chk_overall').checked ? 1 : 0;
		
		var cache_key = price + '_' + is_overall;
		if (this.poundage_cache[cache_key]){
			this.poundage = this.poundage_cache[cache_key].poundage;
			this.overall_poundage = this.poundage_cache[cache_key].overall_poundage;
			var income    = Math.round((price - this.poundage - this.overall_poundage)* 100) / 100;
			var msg = "交易成功后将收取信息费：" + this.poundage + "元, ";
			if(this.overall_poundage > 0){
				msg += "全服推广信息费"+ this.overall_poundage +"元, ";
			}
			msg += "您将得到:"+ income + "元!";
			this.msg(msg);
			this.get_poundage_finished = true;
			this.if_price_ok = true;
			return;
		}
		
		var query_url  = CgiRootUrl + "/usertrade.py"	
		var self_obj = this;
		function display_poundage(data, txt){
			self_obj.display_poundage(data, txt);
		}
		$("price").disabled = true;
		if(!IsOverall){
			$("chk_overall").disabled = true;
		}

		var Ajax = new Request.JSON({"url":query_url,"onSuccess":display_poundage});
		this.msg("正在计算信息费，请稍候...");
		Ajax.get({
			"act" : "get_poundage",
			"equipid" : $("equipid").value,
			"serverid" : ServerInfo["server_id"],
			"price" : price,
			"is_overall": is_overall
		});
		
	},

	display_poundage : function(result, txt){
		$("price").disabled = false;
		if(!IsOverall){
			$("chk_overall").disabled = false;
		}
		
		if (!this.pass_basic_check){
			return;
		}
		
		if (result["status"] != 1){
			if (this.pass_basic_check){
				this.get_poundage_finished = true;
				this.msg(result["msg"]);
				alert(result["msg"]);
			}	
			return;
		}
		this.poundage = result["poundage"];
		this.overall_poundage = result["overall_poundage"];
		var price   = $("price").value;
		var income  = Math.round((price - this.poundage - this.overall_poundage) * 100) / 100;

		var is_overall = $('chk_overall').checked ? 1 : 0;
		
		this.poundage_cache[price+'_'+is_overall] = {
			poundage: this.poundage, 
			overall_poundage: this.overall_poundage
		};
		
		var msg = "交易成功后将收取信息费：" + this.poundage + "元, ";
		if(this.overall_poundage > 0){
			msg += "全服推广信息费："+ this.overall_poundage +"元, ";
		}
		msg += "您将得到:"+ income + "元!";
		this.msg(msg);
		this.get_poundage_finished = true;
		this.if_price_ok = true;
	},

	check_form: function(){
		if (!this.if_price_ok){
			if ($("price").value.trim().length == 0){
				alert("请输入商品价格");
				return false;
			} else {
				alert($("extrainfo").innerHTML);
				return false;
			}
		}
		
		// check roleid
		if ($("appoint_buyer_box").checked){
			var roleid = $("appointed_roleid").value;
			var roleid_match = /^[1-9][0-9]*$/;
			if (!roleid_match.test(roleid)){
				alert("请填写正确的角色ID，若不需要指定买家，请取消选择。");
				return false;
			}
		}

		if(PassFairShow == 0){
			if(!this.fair_pop){
				var __this = this;
				var pop = this.fair_pop = new Popup($('fair_confirm_pop'));
				$('btn_do_sale').addEvent('click', function(){
					pop.hide();
					__this.submit_form();
				});
				$('btn_cancel_sale').addEvent('click', function(){
					pop.hide();
				});
			}
			this.fair_pop.show();
		} else {
			this.submit_form();	
		}
	},
	
	submit_form : function(){
		var msg = "请确认:\n-------------------------------------\n";
		
		msg += "[名称]:  " + $('equip_name_panel').get('html') + "\n"; 
		msg += "[价格]:  "     + $("price").value + "元\n";
		msg += "[信息费]:  "   + this.poundage + "元\n";
		if(this.overall_poundage>0){
			msg += "[全服推广信息费]:  "  + this.overall_poundage + "元\n";
		}
		msg += "[上架天数]:  " + $("days").value + "天\n";
		msg += "[指定买家ID]:  " + ($("appoint_buyer_box").checked ? $("appointed_roleid").value : "未指定") + "\n";
		msg += "[是否接受还价]:  " + $("bargain").options[$("bargain").selectedIndex].text + "\n\n";
		if(this.first_onsale_price == 0)
		{
			var min_price = this.price_change_min_range * parseFloat($("price").value);
			msg += "如果是角色类商品，以后改价将不能低于" + min_price + "元, 除非在游戏内重新寄售。\n网易客服绝不会在电话中索要您的帐号密码和密保。";
		}
		
		if (confirm(msg) == false)
			return ;
		document.magic.submit();		
	},

	check_price : function(){
		this.init_check_flag();
		//var price_str = $("price").value;
		var price     = $("price").value;
		
		var pattern =/^[0-9]+[\.]?[0-9]{0,2}$/;
		
		if (price == ""){
			this.msg("请输入商品价格");
		}
		else if (pattern.test(price) == false){
			this.msg("请输入正确的价格(价格不能超过两位小数)!");
		}
		else if (price < this.min_equip_price){
			this.msg("价格不能少于" + this.min_equip_price + "元!");
		}
		else if (price > this.max_equip_price){
			this.msg("价格不能超过" + this.max_equip_price + "元!");
		} else {
			this.msg("");
			this.pass_basic_check = true;
		}
	}	
	
});

var on_sale_obj = new PutOnSale();

function basic_check(){
	on_sale_obj.check_price();
}

function cal_poundage(){
	basic_check();
	on_sale_obj.query_poundage();
}

function appoint_buyer_check(el)
{
	if (el.checked){
		$("appointed_roleid").disabled = false;
	} else {
		$("appointed_roleid").disabled = true;
	}
}

function confirm_form(){
	if(!on_sale_obj.get_poundage_finished)
		on_sale_obj.query_poundage();
	on_sale_obj.check_form();
}

function overall_check(){
	if(CanSetOverall){
		$('overall_panel').setStyle('display', '');
		if(IsOverall){
			var chk = $('chk_overall');
			chk.checked = true;
			chk.disabled = true;
		}
	}
}

function check_appointed_roleid(){
	if(EquipStorageType ==  StorageStype['money']){
		$('appoint_buyer_box').checked = false;	
	} else {
		$('appointed_buyer_panel').setStyle('display', '');
	}
}

function init_page()
{
	$("top_sell_menu").addClass("on");
	$("menu_equip_store").addClass("on");
	cal_poundage();
	$("days").value = 14;

	if(EquipStorageType ==  StorageStype['money']){
		$("bargain").value = 0;
	}else{
		$("bargain").value = 1;
	}

	$("appoint_buyer_box").checked = false;
	appoint_buyer_check($("appoint_buyer_box"));
	overall_check();
	check_appointed_roleid();
}

window.addEvent('domready', function() {
   init_page();
});
