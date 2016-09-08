/* overall search equip */
var OverallSearchAct = 'overall_search_equip';
var EquipKinds = [
	[10, '扇'],
	[6, '剑'],
	[14, '刀'],
	[5, '斧'],
	[15, '锤'],
	[4, '枪'],
	[13, '双环'],
	[7, '双剑'],
	[12, '鞭子'],
	[9, '爪刺'],
	[11, '魔棒'],
	[8, '飘带'],
	[52, '宝珠'],
	[53, '弓箭'],
	[54, '法杖'],
	[18, '男衣'],
	[59, '女衣'],
	[17, '男头'],
	[58, '女头'],
	[20, '腰带'],
	[19, '鞋子'],
	[21, '饰品']
];

var SpecialEffects = [
	[1, "无级别"],
	[2, "简易"],
	[3, "愤怒"],
	[4, "暴怒"],
	[5, "永不磨损"],
	[6, "神农"],
	[7, "神佑"],

	[8, "精致"],
	[9, "坚固"],
	[10, "狩猎"],
	[11, "绝杀"],
	[12, "专注"],
	[13, "伪装"],
	[14, "易修理"],
	[15, "再生"],
	[16, "必中"],
	[17, "迷踪"],
	[18, "珍宝"]
];

var SpecialSkills = [
	[1027, "罗汉金钟"],
	[1015, "晶清诀"],
	[1014, "玉清诀"],
	[1012, "水清诀"],
	[1018, "笑里藏刀"],
	[1024, "流云诀"],
	[1034, "凝滞术"],
	[1036, "破血狂攻"],
	[1042, "破碎无双"],
	[1037, "弱点击破"],
	[1020, "野兽之力"],
	[1030, "放下屠刀"],
	[1032, "破甲术"],
	[1010, "起死回生"],
	[1008, "四海升平"],
	[2004, "燃烧之光"],
	[1033, "碎甲术"],
	[1011, "慈航普度"],
	[1045, "虚空之刃"],
	[1022, "光辉之甲"],
	[1023, "圣灵之甲"],

	[1001, "气疗术"],
	[1002, "心疗术"],
	[1003, "命疗术"],
	[1004, "凝气决"],
	[1005, "凝神决"],
	[1006, "气归术"],
	[1007, "命归术"],
	[1009, "回魂咒"],
	[1013, "冰清诀"],
	[1016, "诅咒之伤"],
	[1017, "诅咒之亡"],
	[1019, "绝幻魔音"],
	[1021, "魔兽之印"],
	[1025, "啸风诀"],
	[1026, "太极护法"],
	[1028, "修罗咒"],
	[1029, "天衣无缝"],
	[1031, "河东狮吼"],
	[1035, "停陷术"],
	[1038, "吸血"],
	[1039, "残月"],
	[1040, "冥王暴杀"],
	[1041, "乾坤斩"],
	[1043, "帝释无双"],
	[1044, "伽罗无双"],
	[1046, "亡灵之刃"],
	[1047, "死亡之音"],
	[1048, "身似菩提"],
	[1049, "心如明镜"], [1050, "移形换影"],
	[2001, "凝心决"], [2002, "聚精会神"], [2003, "先发制人 "], 
	[2005, "毁灭之光"], [2006, "金刚不坏"], [2007, "菩提心佑"]
];

var SuitEffects = [
	[4011, "变身"],
	[4002, "定心"],
	[4005, "逆鳞"],
	[4008, "幽冥鬼眼"],
	[4016, "一苇渡江"],
	[4004, "金刚护法"],
	[4015, "杀气诀"],

	[4001, "盘丝阵"],
	[4013, "炼气化神"],
	[4009, "楚楚可怜"],
	[4012, "普渡众生"],
	[4006, "生命之泉"],
	//[4003, "极度疯狂"],
	[4007, "魔王回首"],
	[3011, "满天花雨"],
	[3033, "横扫千军"],
	[4017, "碎星诀"],
	[3050, "浪涌"]
];

var SuitAddedStatus = {
	'变身':4011,
	'定心术':4002,
	'逆鳞':4005,
	'幽冥鬼眼':4008,
	'一苇渡江':4016,
	'盘丝阵':4001,
	'极度疯狂':4003,
	'金刚护法':4004,
	'生命之泉':4006,
	'魔王回首':4007,
	'楚楚可怜':4009,
	'百毒不侵':4010,
	'普渡众生':4012,
	'炼气化神':4013,
	'修罗隐身':4014,
	'杀气诀':4015,
	'碎星诀':4017,
	'明光宝烛':4018
};

var SuitAppendSkills = {
	'满天花雨':3011,'知己知彼':3001,'镇妖':3002,'百万神兵':3003,'魔音摄魂':3004,'含情脉脉':3005,'威慑':3006,'催眠符':3007,'失心符':3008,
	'落魄符':3009,'定身符':3010,'似玉生香':3012,'尸腐毒':3013,'勾魂':3014,'摄魄':3015,'姐妹同心':3016,'唧唧歪歪':3017,'龙卷雨击':3018,
	'龙腾':3019,'龙吟':3020,'五雷咒':3021,'飞砂走石':3022,'三昧真火':3023,'阎罗令':3024,'判官令':3025,'紧箍咒':3026,'日光华':3027,
	'靛沧海':3028,'巨岩破':3029,'苍茫树':3030,'地裂火':3031,'后发制人':3032,'横扫千军':3033,'日月乾坤':3034,'无敌牛虱':3035,
	'雷击':3036,'落岩':3037,
	'水攻':3038,'烈火':3039,'奔雷咒':3040,'泰山压顶':3041,'水漫金山':3042,'地狱烈火':3043,'落叶萧萧':3044,
	'尘土刃':3045,'荆棘舞':3046,'冰川怒':3047,'夺命咒':3048,'夺魄令':3049,'浪涌':3050,'裂石':3051
};

var SuitTransformSkills = {
	'巨蛙':1001,'大海龟':1002,'护卫':1003,'树怪':1004,'赌徒':1005,'强盗':1006,'海毛虫':1007,'大蝙蝠':1008,'山贼':1009,
	'野猪':1010,'骷髅怪':1011,'羊头怪':1012,'蛤蟆精':1013,'狐狸精':1014,'老虎':1015,'黑熊':1016,'花妖':1017,
	'牛妖':1018,'小龙女':1019,'野鬼':1020,'狼':1021,'虾兵':1022,'蟹将':1023,'龟丞相':1024,'兔子怪':1025,
	'蜘蛛精':1026,'黑熊精':1027,'僵尸':1028,'牛头':1029,'马面':1030,'雷鸟人':1031,'蝴蝶仙子':1032,'古代瑞兽':1033,
	'白熊':1034,'黑山老妖':1035,'天兵':1036,'天将':1037,'地狱战神':1038,'风伯':1039,'凤凰':1040,'蛟龙':1041,'雨师':1042,
	'如意仙子':1043,'芙蓉仙子':1044,'巡游天神':1045,'星灵仙子':1046,'幽灵':1047,'鬼将':1048,'吸血鬼':1049,'净瓶女娲':1050,
	'律法女娲':1051,'灵符女娲':1052,'画魂':1053,'幽萤娃娃':1054,'大力金刚':1055,'雾中仙':1056,'灵鹤':1057,'夜罗刹':1058,
	'炎魔神':1059,'噬天虎':1060,'踏云兽':1061,'红萼仙子':1062,'龙龟':1063,'机关兽':1064,'机关鸟':1065,'连弩车':1066,
	'巴蛇':1067,'葫芦宝贝':1069,'猫灵（人型）':1070,'狂豹（人型）':1071,'蝎子精':1072,'混沌兽':1073,'长眉灵猴':1074,
	'巨力神猿':1075,'修罗傀儡鬼':1076,'修罗傀儡妖':1077,'金身罗汉':1078,'藤蔓妖花':1079,'曼珠沙华':1080,'蜃气妖':1081
};

var SuitTransformCharms = {
	'巨蛙':2001,'大海龟':2002,'树怪':2003,'海毛虫':2004,'大蝙蝠':2005,'羊头怪':2006,'蛤蟆精':2007,
	'狐狸精':2008,'老虎':2009,'黑熊':2010,'花妖':2011,'牛妖':2012,'小龙女':2013,'野鬼':2014,
	'狼':2015,'虾兵':2016,'蟹将':2017,'龟丞相':2018,'兔子怪':2019,'蜘蛛精':2020,'黑熊精':2021,
	'僵尸':2022,'牛头':2023,'马面':2024,'雷鸟人':2025,'蝴蝶仙子':2026,'古代瑞兽':2027,'白熊':2028,
	'黑山老妖':2029,'天兵':2030,'天将':2031,'地狱战神':2032,'风伯':2033,'凤凰':2034,'蛟龙':2035,
	'雨师':2036,'如意仙子':2037,'芙蓉仙子':2038,'巡游天神':2039,'星灵仙子':2040
};

var SumAttrs = [
	['physique', '体质'],
	['endurance', '耐力'],
	['dex', '敏捷'],
	['magic', '魔力'],
	['power', '力量']
];

var ServerTypes = [
	[3, '3年以上服'],
	[2, '1到3年服'],
	[1, '1年内服']
];

var FairShowStatus = [
	[1, '已上架'],
	[0, '公示期']
];

var FrontStatus= [
	['pass_fair_show', '已上架'],
	['fair_show', '公示期'],
	['bidding', '拍卖中'],
	['open_buy', '抢付中']
];

var Gems = [
	[1, '红玛瑙'],
	[2, '太阳石'],
	[3, '舍利子'],
	[4, '光芒石'],
	[5, '月亮石'],
	[6, '黑宝石'],
	[7, '神秘石']
];

var ProduceFroms = [
	[1, '系统产出'],
	[2, '人造']
];

var OVERALL_SEARCH_EQUIP_ARGS_CONFIG = [
	['special_mode', '特技/特效', 'radio', '#check_mode_panel input'],
	['kindid', '类型', 'list', '#kind_check_panel li'],
	['special_effect', '特效', 'list', '#special_effect_panel li'],
	['special_skill', '特技', 'list', '#special_skill_panel li'],
	['front_status', '出售状态', 'list', '#fair_show_panel li'],
	['server_type', '开服时间', 'list', '#server_type_panel li'],
	['gem_value', '镶嵌宝石', 'list', '#gem_panel li'],
	['produce_from', '装备出处', 'list', '#produce_from_panel li'],
	['sum_attr_type', '属性类型', 'list', '#sum_attr_panel li'],
	['init_damage', '初伤（包含命中）'],
	['init_damage_raw', '初伤（不含命中）'],
	['all_damage', '总伤'],
	['damage', '伤害'],
	['init_defense', '初防'],
	['init_hp', '初血'],
	['init_dex', '初敏'],
	['init_wakan', '初灵'],
	['sum_attr_value', '属性总和'],
	['price', '价格', 'range'],
	['gem_level', '宝石锻炼等级'],
	['hole_num', '装备开孔数目'],
	['repair_fail', '修理失败次数'],
	['star', '星位', 'checkbox'],
	['level', '等级', 'slider'],
	['suit_effect', '套装', 'func', get_suit_name_by_value, function(val){
		if($('suit_effect_panel').suit_value_getter){
			$('suit_effect_panel').suit_value_getter.set_value(val);
		}
	}]
]

var OverallEquipSearcher = new Class({
	initialize: function(){
		this.kind_checker = new ButtonChecker(EquipKinds, $('kind_check_panel'));
		this.special_effect_checker = new ButtonChecker(SpecialEffects, $('special_effect_panel'));
		this.special_skill_checker = new ButtonChecker(SpecialSkills.slice(0,28), $('special_skill_panel'));
		this.sum_attr_checker = new ButtonChecker(SumAttrs, $('sum_attr_panel'));
		this.server_type_checker = new ButtonChecker(ServerTypes, $('server_type_panel'));
		this.front_status_checker = new ButtonChecker(FrontStatus, $('fair_show_panel'));
		this.gem_checker = new ButtonChecker(Gems, $('gem_panel'));
		this.produce_from_checker = new ButtonChecker(ProduceFroms, $('produce_from_panel'));
		this.select_server = new DropSelectServer($('sel_area'), $('sel_server'));
		this.init_check_mode();
		this.init_level_slider();
		this.init_suit();
		this.reg_event();
		this.init_search_btn();
		this.init_reset_btn();
	},

	init_reset_btn: function(){
		var __this = this;
		$('reset_equip_attr').addEvent('click', function(){
			__this.reset_equip_attr();
		});

		$('reset_server_info').addEvent('click', function(){
			__this.reset_server_info();
		});

		$('reset_all').addEvent('click', function(){
			__this.reset_equip_attr();
			__this.reset_server_info();
		});
	},

	init_suit: function(){
		var sel_el = $('sel_short_cut');
		for(var i=0; i<SuitEffects.length; i++){
			var item = SuitEffects[i];
			sel_el.grab(new Element('option', {'value': item[0], 'html': item[1]}));
		}
		this.suit_value_getter = new SuitValueGetter();
		$('suit_effect_panel').suit_value_getter = this.suit_value_getter;
	},

	reset_equip_attr: function(){
		var checkers = [
			this.level_slider,
			this.kind_checker,
			this.special_effect_checker,
			this.special_skill_checker,
			this.sum_attr_checker,
			this.gem_checker,
			this.produce_from_checker,
			this.front_status_checker
		];
		var txt_inputs = [
			$('txt_init_damage'),
			$('txt_init_defense'),
			$('txt_init_hp'),
			$('txt_init_dex'),
			$('txt_init_wakan'),
			$('txt_all_damage'),
			$('txt_damage'),
			$('txt_sum_attr_value'),
			$('txt_gem_level'),
			$('txt_hole_num'),
			$('txt_repair_fail'),
			$('txt_price_min'),
			$('txt_price_max'),
			$('txt_added_status'),
			$('txt_append_skill'),
			$('txt_transform_skill'),
			$('txt_transform_charm')
		];
		this.reset(checkers, txt_inputs);
		this.reset_check_mode();
		$('chk_star').checked = false;
		$('sel_short_cut').options[0].selected = true;
	},

	reset_server_info: function(){
		var checkers = [
			this.server_type_checker,
			this.select_server
		];
		this.reset(checkers, []);
	},

	reset: function(checkers, txt_inputs){
		for(var i=0; i<checkers.length; i++){
			checkers[i].reset_value();	
		}
		for(var i=0; i<txt_inputs.length; i++){
			txt_inputs[i].set('value', '');
		}
	},

	reset_check_mode: function(){
		if(this.check_mode != 'or'){
			return;
		}
		$$('#check_mode_panel input').each(function(el, i){
			if(el.value == 'or'){
				el.checked = false;
			} else {
				el.checked = true;
			}
		});
		this.check_mode = 'and';
		this.set_check_mode();
	},

	init_level_slider: function(){
		this.level_slider = new LevelSlider($('level_slider'), {
			grid: 20,
			offset: -23,
			range: [60, 160],
			step: 10,
			default_value: [60, 160]
		});
	},

	init_check_mode: function(){
		var check_mode = null;
		$$('#check_mode_panel input').each(function(el, i){
			if(el.checked){
				check_mode = el.value;
			}
		});
		this.set_check_mode(check_mode);
	},

	set_check_mode: function(check_mode){
		if(check_mode == 'or'){
			this.special_effect_checker.set_max_num(null);
			this.special_skill_checker.set_max_num(null);
		} else {
			this.special_effect_checker.set_max_num(16);
			this.special_skill_checker.set_max_num(1);
		}
		this.check_mode = check_mode;
	},

	reg_event: function(){
		var __this = this;
		$('btn_all_special_skill').addEvent('click', function(){
			if($(this).retrieve('spread')){
				return;
			}
			__this.special_skill_checker.extend(SpecialSkills.slice(28));
			$(this).store('spread', true);
			$(this).setStyle('display', 'none');
			
		});
		$$('#check_mode_panel input').addEvent('click', function(){
			var check_mode = this.value;		
			if(check_mode == __this.check_mode){return;}
			__this.set_check_mode(check_mode);
		});
	},

	init_search_btn: function(){
		var __this = this;
		$('btn_equip_search').addEvent('click', function(){
			__this.search();
		});
	},

	search: function(){
		var arg = {};
		arg['level_min'] = this.level_slider.value.min;
		arg['level_max'] = this.level_slider.value.max;
		//[name, checker, empty if check all]
		var check_items = [
			['kindid', this.kind_checker, true],
			['special_effect', this.special_effect_checker, false],
			['special_skill', this.special_skill_checker, false],
			['front_status', this.front_status_checker, true],
			['server_type', this.server_type_checker, true],
			['gem_value', this.gem_checker, false],
			['produce_from', this.produce_from_checker, true]
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
		arg['special_mode'] = this.check_mode;
		var sum_attr_type = this.sum_attr_checker.get_value();
		if(sum_attr_type){
			arg['sum_attr_type'] = sum_attr_type;
		}
		var txt_int_items = [
			['init_damage', 0, 10000, '初伤（包含命中）'],
			['init_damage_raw', 0, 10000, '初伤（不含命中）'],
			['all_damage', 0, 10000, '总伤'],
			['damage', 0, 10000, '伤害'],
			['init_defense', 0, 10000, '初防'],
			['init_hp', 0, 10000, '初血'],
			['init_dex', 0, 10000, '初敏'],
			['init_wakan', 0, 10000, '初灵'],
			['sum_attr_value', 0, 10000, '属性总和'],
			['price_min', 0, MaxTradeYuan, '价格'],
			['price_max', 0, MaxTradeYuan, '价格'],
			['gem_level', 0, 20, '宝石锻炼等级'],
			['hole_num', 0, 5, '装备开孔数目'],
			['repair_fail', 0, 5, '修理失败次数']
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
			if(!(item[1]<=parseInt(value) && parseInt(value)<=item[2])){
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
		if($('chk_star').checked){
			arg['star'] = 1;
		}
		/*
		if($('sel_server').value){
			arg['switchto_serverid'] = $('sel_server').value;
		}
		*/

		var suit_effect_ret = this.suit_value_getter.get_value();
		if(!suit_effect_ret.valid){
			alert(suit_effect_ret.value);
			return;
		}
		if(suit_effect_ret.value){
			arg['suit_effect'] = suit_effect_ret.value;
		}

		if ($("user_serverid") && $("user_serverid").value){
			arg['cross_buy_serverid'] = $("user_serverid").value;		
		}
		
		go_overall_search(arg)
	}
});

var SuitInputAutor = new Class({
	initialize: function(tagid, values, text, getter){
		this.tagid = tagid;
		this.values = values;
		this.text = text;
		this.getter = getter;
		this.init();
		var that = this;
		$('radio_' + this.tagid).addEvent('click', function(){
			that.getter.chose(that);
		});
		$('txt_' + this.tagid).addEvent('click', function(){
			that.getter.chose(that);
		});
	},

	init: function(){
		var dom_id = 'txt_' + this.tagid;
		var values = this.values;
		new AutoComplete($(dom_id),{
			"startPoint" : 1,
			"promptNum" : 20,
			"handle_func" : function(keyword){
				var result = new Array();
				for(var p in values){
					if(p.indexOf(keyword) != -1){
						result.push(p);	
					}
				}
				return result;
			},
			"callback": function(){}
		});
	},

	isChose: function(){
		var radio_id = 'radio_' + this.tagid;
		if($(radio_id).checked){return true;} else {return false;}
	},

	get_value: function(){
		var dom_id = 'txt_' + this.tagid;
		var values = this.values;
		var keyword = $(dom_id).value;
		if(!keyword || keyword.trim() == ''){
			return [true, null];
		}
		var result = [];
		for(var p in values){
			if(p.indexOf(keyword) != -1){
				result.push(values[p]);
			}
		}
		if (result.length == 0){
			return [false, this.text + keyword + '没有匹配的结果'];
		}
		return [true, result.join(',')];
	},

	set_value: function(val){
		var dom_id = 'txt_' + this.tagid;
		var radio_id = 'radio_' + this.tagid;

		for(var p in this.values){
			if(val == this.values[p]){
				$(dom_id).set('value', p);
				$(radio_id).checked = true;
				this.getter.chose(this);
				return true;
			}
		}

		return false;
	},

	reset: function(){
		$('txt_' + this.tagid).set('value', '');
	}
});

var SuitSelectAutor = new Class({
	initialize: function(tagid, getter){
		this.tagid = tagid;
		this.getter = getter;
		var that = this;
		$('radio_' + this.tagid).addEvent('click', function(){
			that.getter.chose(that);
		});
		$('sel_' + this.tagid).addEvent('click', function(){
			that.getter.chose(that);
		});
	},

	isChose: function(){
		var radio_id = 'radio_' + this.tagid;
		if($(radio_id).checked){return true;} else {return false;}
	},

	get_value: function(){
		return [true, $('sel_' + this.tagid).value];
	},

	set_value: function(val){
		var options = $$('#sel_' + this.tagid + ' option');

		for(var i=0;i<options.length;i++){
			var el = options[i];
			if(el.value == val){
				el.selected = true;
				this.getter.chose(this);
				return true;
			}
		}

		return false;
	},

	reset: function(){
		$('sel_' + this.tagid).options[0].selected = true;
	}
});

var SuitValueGetter =new Class({
	initialize: function(){
		this.autors = [
			new SuitSelectAutor('short_cut', this),
			new SuitInputAutor('added_status', SuitAddedStatus, '附加状态', this),
			new SuitInputAutor('append_skill', SuitAppendSkills, '追加技能', this),
			new SuitInputAutor('transform_skill', SuitTransformSkills, '变化术之', this),
			new SuitInputAutor('transform_charm', SuitTransformCharms, '变化咒之', this)
		];
	},

	get_value: function(){
		for(var i=0; i<this.autors.length; i++){
			var autor = this.autors[i];
			if(!autor.isChose()){continue;}
			var autor_value = autor.get_value();
			var valid = autor_value[0];
			var msg = autor_value[1];
			if(!valid){
				return {valid:false, value: msg};
			} else {
				return {valid: true, value: msg};	
			}
		}
	},

	set_value: function(val){
		for(var i=0; i<this.autors.length; i++){
			var autor = this.autors[i];
			if(autor.set_value(val)){
				break;
			}
		}
	},

	chose: function(chose_autor){
		for(var i=0; i< this.autors.length; i++){
			if(this.autors[i] != chose_autor){
				this.autors[i].reset();
			}
		}	
	}
});

function get_suit_name_by_value(value){
	var name = get_name_from_conf(value, SuitEffects);
	if(name){return name;}
	name = get_name_from_dict(value, SuitAddedStatus);
	if(name){return name;}
	name = get_name_from_dict(value, SuitAppendSkills);
	if(name){return '追加法术' + name;}
	name = get_name_from_dict(value, SuitTransformSkills);
	if(name){return '变身术之' + name;}
	name = get_name_from_dict(value, SuitTransformCharms);
	if(name){return '变化咒之' + name;}
	return "";
}
