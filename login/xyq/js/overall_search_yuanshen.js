/* overall search yuanshen */
var OverallSearchAct = 'overall_search_yuanshen';

var YuanshenEquipTypes = [
	[4221, '枪'], 
	[4222, '斧'], 
	[4223, '剑'], 
	[4224, '扇'], 
	[4225, '刀'], 
	[4226, '锤'], 
	[4227, '双剑'], 
	[4228, '飘带'], 
	[4229, '爪刺'], 
	[4230, '魔棒'], 
	[4231, '长鞭'], 
	[4232, '双环'], 
	[4233, '头盔'], 
	[4234, '冠冕'], 
	[4235, '坚甲'], 
	[4236, '纱衣'], 
	[4237, '鞋履'], 
	[4238, '束带'], 
	[4239, '挂坠'], 
	[4240, '弓'], 
	[4241, '宝珠'], 
	[4242, '长杖']
];

var ServerTypes = [
	[3, '3年以上服'],
	[2, '1到3年服'],
	[1, '1年内服']
];

var EquipAttrs = [
	['tizhi', '体质'],
	['liliang', '力量'],
	['moli', '魔力'],
	['naili', '耐力'],
	['minjie', '敏捷']
];

var OVERALL_SEARCH_YUANSHEN_ARGS_CONFIG = [
	['equip_type', '类型', 'list', '#equip_type_check_panel li'],
	['additional_attrs', '增加属性', 'list', '#equip_attr_check_panel li'],
	['server_type', '开服时间', 'list', '#server_type_panel li'],
	['attr_value', '元身属性'],
	['attr_type', '元身属性类型', 'func',
		function(val){return $('attr_type').getSelected().get('text')[0]},
		function(val){$('attr_type').set('value', val)}],
	['addon_effect_chance', '附加特技概率'],
	['addon_skill_chance', '附加特效概率'],
	['price', '价格', 'range']
];

var OverallYuanshenSearcher = new Class({
	initialize: function(){
		this.equip_type_checker = new ButtonChecker(YuanshenEquipTypes, $('equip_type_check_panel'));
		this.equip_attr_checker = new ButtonChecker(EquipAttrs, $('equip_attr_check_panel'));
		this.server_type_checker = new ButtonChecker(ServerTypes, $('server_type_panel'));
		this.select_server = new DropSelectServer($('sel_area'), $('sel_server'));
		this.init_search_btn();
		this.init_reset_btn();
	},

	init_reset_btn: function(){
		var __this = this;
		$('reset_equip_type').addEvent('click', function(){
			__this.equip_type_checker.reset_value();
		});
		$('reset_equip_attr').addEvent('click', function(){
			$('attr_type').selectedIndex = 0;
			__this.reset([__this.equip_attr_checker], [$('txt_attr_value'), $('txt_addon_skill_chance'), $('txt_addon_effect_chance')]);
		});
		$('reset_equip_price').addEvent('click', function(){
			__this.reset([], [$('txt_price_min'), $('txt_price_max')]);
		});
		$('reset_equip_server').addEvent('click', function(){
			__this.reset([__this.server_type_checker, __this.select_server], []);
		});
		$('reset_all').addEvent('click', function(){
			__this.equip_type_checker.reset_value();
			$('attr_type').selectedIndex = 0;
			__this.reset([__this.equip_attr_checker], [$('txt_attr_value'), $('txt_addon_skill_chance'), $('txt_addon_effect_chance')]);
			__this.reset([], [$('txt_price_min'), $('txt_price_max')]);
			__this.reset([__this.server_type_checker, __this.select_server], []);
		});
	},

	reset: function(checkers, txt_inputs){
		for(var i=0; i<checkers.length; i++){
			checkers[i].reset_value();	
		}
		for(var i=0; i<txt_inputs.length; i++){
			txt_inputs[i].set('value', '');
		}
	},

	init_search_btn: function(){
		var __this = this;
		$('btn_yuanshen_search').addEvent('click', function(){
			__this.search();
		});
	},

	search: function(){
		var arg = {};
		var check_items = [
			['equip_type', this.equip_type_checker, true],
			['additional_attrs', this.equip_attr_checker, true],
			['server_type', this.server_type_checker, true]
		];
		for(var i=0; i<check_items.length; i++){
			var item = check_items[i];
			if(item[2] && item[1].is_check_all()){
				continue;
			}
			var value = item[1].get_value();
			if(value){
				arg[item[0]] = value;
			}
		}
		arg['attr_type'] = $('attr_type').value;
		var txt_int_items = [
			['attr_value', 0, 10000, '元身属性'],
			['addon_effect_chance', 0, 20, '附加特技概率'],
			['addon_skill_chance', 0, 20, '附加特效概率'],
			['price_min', 0, MaxTradeYuan, '最低价格'],
			['price_max', 0, MaxTradeYuan, '最高价格']
		];
		var intReg = /^\d+$/;
		for(var i=0; i<txt_int_items.length; i++){
			var item = txt_int_items[i];
			var el = $('txt_'+item[0]);
			var value = el.value;
			if(!value){continue;}
			if(!intReg.test(value)){
				alert(item[3]+'必须是整数');
				el.focus();
				return;
			}
			if(!(parseInt(value) >= item[1] && parseInt(value)<=item[2])){
				alert(item[3]+'超出取值范围:' + item[1] + '-' + item[2]);
				el.focus();
				return;
			} 
			arg[item[0]] = parseInt(value);
		}
		if(arg['price_min'] > arg['price_max']){
			alert('最低价格不能大于最高价格');
			return;
		}
		if(arg['price_min']){
			arg['price_min'] = arg['price_min'] * 100;
		}
		if(arg['price_max']){
			arg['price_max'] = arg['price_max'] * 100;
		}
		/*
		if($('sel_server').value){
			arg['switchto_serverid'] = $('sel_server').value;
		}
		*/
		if ($("user_serverid") && $("user_serverid").value){
			arg['cross_buy_serverid'] = $("user_serverid").value;
		}
		go_overall_search(arg);
	}
});

function search_yuanshen_order_by(order_key, default_order){
	if(CurSearchValue.order_by.key == order_key){
		CurSearchValue.order_by.sort = CurSearchValue.order_by.sort == 'ASC'? 'DESC': 'ASC';
	} else {
		CurSearchValue.order_by.key = order_key;	
		if(default_order != undefined)
			CurSearchValue.order_by.sort = default_order;
		else
			CurSearchValue.order_by.sort = 'DESC';
	}
	overall_search(CurSearchValue.arg, null, CurSearchValue.order_by);
}
