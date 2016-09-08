/* overall search equip */
var OverallSearchAct = 'overall_search_pet';
var PetSkills = [
	[571, '力劈华山'],
	[554, '善恶有报'],
	[552, '死亡召唤'],
	[661, '须弥真言'],
	[595, '壁垒击破'],
	[579, '法术防御'],
	[639, '灵能激发'],
	[638, '法力陷阱'],
	[597, '剑荡四方'],
	[599, '移花接木'],
	[553, '上古灵符'],
	[505, '迟钝'],
	[596, '嗜血追击'],

	[404, '高级吸血'],
	[416, '高级必杀'],
	[425, '高级偷袭'],
	[405, '高级连击'],
	[407, '高级隐身'],
	[422, '高级敏捷'],
	[411, '高级神佑复生'],
	[412, '高级鬼魂术'],
	[424, '高级魔之心'],
	[573, '高级法术连击'],
	[577, '高级法术暴击'],
	[578, '高级法术波动'],

	[434, '高级强力'],
	[413, '高级驱鬼'],
	[435, '高级防御'],
	[414, '高级毒'],
	[406, '高级飞行'],
	[410, '高级冥思'],
	[415, '高级慧根'],
	[627, '高级法术抵抗'],
	[430, '高级雷属性吸收'],
	[431, '高级土属性吸收'],
	[432, '高级水属性吸收'],
	[433, '高级火属性吸收'],

	[401, '高级夜战'],
	[408, '高级感知'],
	[641, '高级合纵'],
	[629, '高级盾气'],
	[403, '高级反震'],
	[417, '高级幸运'],
	[418, '高级精神集中'],
	[419, '高级神迹'],
	[426, '奔雷咒'],
	[427, '泰山压顶'],
	[428, '水漫金山'],
	[429, '地狱烈火'],

	[301, '夜战'],
	[308, '感知'],
	[640, '合纵'],
	[628, '盾气'],
	[303, '反震'],
	[317, '幸运'],
	[318, '精神集中'],
	[319, '神迹'],
	[326, '雷击'],
	[327, '落岩'],
	[328, '水攻'],
	[329, '烈火'],

	[304, '吸血'],
	[316, '必杀'],
	[325, '偷袭'],
	[305, '连击'],
	[307, '隐身'],
	[322, '敏捷'],
	[311, '神佑复生'],
	[312, '鬼魂术'],
	[324, '魔之心'],
	[510, '法术连击'],
	[575, '法术暴击'],
	[576, '法术波动'],

	[334, '强力'],
	[313, '驱鬼'],
	[335, '防御'],
	[314, '毒'],
	[306, '飞行'],
	[310, '冥思'],
	[315, '慧根'],
	[626, '法术抵抗'],
	[330, '雷属性吸收'],
	[331, '土属性吸收'],
	[332, '水属性吸收'],
	[333, '火属性吸收'],

	[402, '高级反击'],
	[420, '高级招架'],
	[421, '高级永恒'],
	[409, '高级再生'],
	[423, '高级否定信仰'],
	[593, '八凶法阵'],
	[624, '龙魂'],
	[572, '夜舞倾城'],
	[551, '惊心一剑'],
	[302, '反击'],
	[320, '招架'],
	[321, '永恒'],
	[309, '再生'],
	[323, '否定信仰'],
	[650, '苍鸾怒击'],
	[663, '天降灵葫'],
	[667, '大快朵颐']
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
]

var HighNeidans = [
	[935, '生死决'], 
	[924, '舍身击'], 
	[927, '双星爆'], 
	[928, '催心浪'], 
	[916, '玄武躯'], 
	[919, '碎甲刃'], 
	[930, '隐匿击'], 
	[934, '血债偿'], 
	[914, '神机步'], 
	[917, '龙胄铠'], 
	[915, '腾挪劲'], 
	[918, '玉砥柱'], 
	[920, '阴阳护'], 
	[921, '凛冽气'], 
	[925, '电魂闪'], 
	[926, '通灵法'],
	[937, '朱雀甲']
];

var LowNeidans = [
	[901, '迅敏'], 
	[902, '狂怒'], 
	[904, '静岳'], 
	[907, '矫健'], 
	[932, '连环'], 
	[903, '阴伤'], 
	[906, '灵身'], 
	[905, '擅咒'], 
	[908, '深思'], 
	[909, '钢化'], 
	[910, '坚甲'], 
	[913, '撞击'], 
	[922, '无畏'], 
	[923, '愤恨'], 
	[929, '淬毒'], 
	[931, '狙刺'], 
	[933, '圣洁'], 
	[936, '灵光'], 
	[912, '慧心']
];

var Colors = [
	[1, '&nbsp;1&nbsp;'],
	[2, '&nbsp;2&nbsp;']
];

var TexingTypes = [
	[701,"识药"],
	[702,"御风"],
	[703,"巧劲"],
	[704,"抗法"],
	[705,"抗物"],
	[706,"力破"],
	[707,"争锋"],
	[708,"吮魔"],
	[709,"弑神"],
	[710,"复仇"],
	[711,"暗劲"],
	[712,"顺势"],
	[713,"阳护"],
	[714,"怒吼"],
	[715,"护佑"],
	[716,"瞬击"],
	[717,"瞬法"],
	[718,"灵刃"],
	[719,"灵法"],
	[720,"灵断"],
	[721,"逆境"],
	[722,"预知"],
	[723,"洞察"],
	[724,"灵动"],
	[725,"识物"],
	[726,"乖巧"],
	[727,"自恋"]
];

var FightLevels = [
	[65, "参战45-65"],
	[66, "参战75-105"],
	[67, "参战125-145"],
	[68, "飞升120-155"],
	[69, "渡劫155-175"],
	[70, "个性宠"],
	[71, "神兽"]
];

var OVERALL_SEARCH_PET_ARGS_CONFIG = [
	['level', '等级', 'slider'],
	['skill', '技能', 'list', '#pet_skill_panel li'],
	['front_status', '出售状态', 'list', '#fair_show_panel li'],
	['server_type', '开服时间', 'list', '#server_type_panel li'],
	['color', '变异类型', 'list', '#color_panel li'],
	['texing', '特性', 'list', '#texing_panel li'],
	['kindid', '参战等级', 'list', '#fight_level_panel li'],
	['skill_num', '技能数量'],
	['attack_aptitude', '攻击资质'],
	['defence_aptitude', '防御资质'],
	['physical_aptitude', '体力资质'],
	['magic_aptitude', '法力资质'],
	['speed_aptitude', '速度资质'],
	['price', '价格', 'range'],
	['max_blood', '气血'],
	['attack', '攻击'],
	['defence', '防御'],
	['speed', '速度'],
	['wakan', '灵力'],
	['lingxing', '灵性'],
	['growth', '成长'],
	['skill_with_suit', '含套装技能', 'checkbox'],
	['is_baobao', '宝宝', 'checkbox'],
	['summon_color', '染色', 'checkbox'],
	['neidan', '高级内丹', 'list', '#high_neidan_panel li'],
	['neidan', '低级内丹', 'list', '#low_neidan_panel li'],
	['type', '类型', 'autocomplete', 'pet_select_box', SaleablePetNameInfo]
];

var OverallPetSearcher = new Class({
	initialize: function(){
		this.skill_checker = new PetSkillButtonChecker(PetSkills.slice(0,42), $('pet_skill_panel'));
		this.server_type_checker = new ButtonChecker(ServerTypes, $('server_type_panel'));
		this.front_status_checker = new ButtonChecker(FrontStatus, $('fair_show_panel'));
		this.high_neidan_checker = new ButtonChecker(HighNeidans, $('high_neidan_panel'));
		this.low_neidan_checker = new ButtonChecker(LowNeidans, $('low_neidan_panel'));
		this.color_checker = new ButtonChecker(Colors, $('color_panel'));
		this.select_server = new DropSelectServer($('sel_area'), $('sel_server'));
		this.init_level_slider();
		this.init_pet_select_box();
		this.reg_event();
		this.init_search_btn();
		this.init_reset_btn();
		this.texing_checker = new ButtonChecker(TexingTypes, $('texing_panel'));
		
		this.fight_level_checker = new ButtonChecker(FightLevels, $('fight_level_panel'));
	},

	init_reset_btn: function(){
		var __this = this;
		$('reset_basic').addEvent('click', function(){
			__this.reset_basic();
		});

		$('reset_detail').addEvent('click', function(){
			__this.reset_detail();
		});

		$('reset_server_info').addEvent('click', function(){
			__this.reset_server_info();
		});

		$('reset_all').addEvent('click', function(){
			__this.reset_basic();
			__this.reset_detail();
			__this.reset_server_info();
		});
	},

	reset_basic: function(){
		var checkers = [
			this.level_slider,
			this.skill_checker,
			this.front_status_checker,
			this.fight_level_checker
		];
		var txt_inputs = [
			$('pet_select_box'),
			$('txt_skill_num'),
			$('txt_growth'),
			$('txt_attack_aptitude'),
			$('txt_defence_aptitude'),
			$('txt_physical_aptitude'),
			$('txt_magic_aptitude'),
			$('txt_speed_aptitude'),
			$('txt_price_min'),
			$('txt_price_max')
		];
		this.reset(checkers, txt_inputs);
		$('chk_skill_with_suit').checked = false;
	},

	reset_detail: function(){
		var checkers = [
			this.high_neidan_checker,
			this.low_neidan_checker,
			this.color_checker,
			this.texing_checker
		];
		var txt_inputs = [
			$('txt_max_blood'),
			$('txt_attack'),
			$('txt_defence'),
			$('txt_speed'),
			$('txt_wakan'),
			$('txt_lingxing')
		];
		this.reset(checkers, txt_inputs);
		$('chk_is_baobao').checked = false;
		$('chk_summon_color').checked = false;
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

	init_level_slider: function(){
		this.level_slider = new LevelSlider($('level_slider'), {
			grid: 20,
			offset: -23,
			range: [0, 180],
			step: 10,
			default_value: [0, 180]
		});
	},

	init_pet_select_box: function(){ 
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
		new AutoComplete($('pet_select_box'),{
			"startPoint" : 1,
			"promptNum" : 20,
			"handle_func" : handle_pet_search,
			"callback": function(){}
		});
	},

	get_pet_type_value: function(){
		var result = [];
		var pet_name = $('pet_select_box').value;			
		if(!pet_name){
			return null;
		}
		for(var pet_type in SaleablePetNameInfo){
			if(SaleablePetNameInfo[pet_type].indexOf(pet_name) != -1){
				result.push(pet_type);
			}
		}
		return result.join(',');
	},

	reg_event: function(){
		var __this = this;
		$('btn_all_skill').addEvent('click', function(){
			if($(this).retrieve('spread')){
				return;
			}
			__this.skill_checker.extend(PetSkills.slice(42));
			$(this).store('spread', true);
			$(this).setStyle('display', 'none');
			
		});
	},

	init_search_btn: function(){
		var __this = this;
		$('btn_pet_search').addEvent('click', function(){
			__this.search();
		});
	},

	search: function(){
		var arg = {};
		if($('pet_select_box').value){
			var pet_type = this.get_pet_type_value();
			if(!pet_type){
				alert('不存在你要搜的召唤兽名称');
				return false;
			}
			arg['type'] = pet_type;
		}
		arg['level_min'] = this.level_slider.value.min;
		arg['level_max'] = this.level_slider.value.max;
		var check_items = [
			['skill', this.skill_checker, false],
			['front_status', this.front_status_checker, true],
			['server_type', this.server_type_checker, true],
			['color', this.color_checker, false],
			['texing', this.texing_checker, false],
			['kindid', this.fight_level_checker, true]
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

		var neidan_values = [
			this.high_neidan_checker.get_value(),
			this.low_neidan_checker.get_value()
		].filter(function(x){ return x!='';});
		if(neidan_values.length > 0){
			arg['neidan'] = neidan_values.join(',');
		}

		if($('chk_skill_with_suit').checked){
			arg['skill_with_suit'] = 1;
		}
		if($('chk_is_baobao').checked){
			arg['is_baobao'] = 1;
		}
		if($('chk_summon_color').checked){
			arg['summon_color'] = 1;
		}
		var txt_int_items = [
			['skill_num', 0, 10000, '技能数量'],
			['attack_aptitude', 0, 10000, '攻击资质'],
			['defence_aptitude', 0, 10000, '防御资质'],
			['physical_aptitude', 0, 10000, '体力资质'],
			['magic_aptitude', 0, 10000, '法力资质'],
			['speed_aptitude', 0, 10000, '速度资质'],
			['price_min', 0, MaxTradeYuan, '价格'],
			['price_max', 0, MaxTradeYuan, '价格'],
			['max_blood', 0, 20000, '气血'],
			['attack', 0, 4000, '攻击'],
			['defence', 0, 4000, '防御'],
			['speed', 0, 2000, '速度'],
			['wakan', 0, 2000, '灵力'],
			['lingxing', 0, 10000, '灵性']
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
		var growth = $('txt_growth').value;
		if(growth){
			if(!/^\d\.\d{1,3}$/.test(growth)){
				alert('成长值错误, 最多3位小数');
				return False;
			} else {
				arg['growth'] = parseInt(parseFloat(growth) * 1000);
			}
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
