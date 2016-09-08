var RoleInfoParser = new Class({
	initialize : function(role_desc){
		
		this.raw_info = js_eval( lpc_2_js($("equip_desc_value").value.trim() ));
		
		this.conf = new RoleNameConf();
		this.result   = {};

		this.last_tab = null;
		this.last_sub_tab = null;
		
		this.reg_tab_ev();		
		this.parse_role();
		
	},

	// only use in bbs share function
	adjust_frame_height : function(){
		if (window.self != window.top){
			reset_iframe();
		}
	},

	reg_tab_ev : function(){
		var self_obj = this;
		
		$("role_basic").addEvent("click", function(){
			self_obj.show_basic();
			self_obj.adjust_frame_height();
		});		

		$("role_skill").addEvent("click", function(){
			self_obj.show_skill();
			self_obj.adjust_frame_height();
		});		

		$("role_equips").addEvent("click", function(){
			self_obj.show_equips();
			self_obj.adjust_frame_height();
		});		

		$("role_pets").addEvent("click", function(){
			self_obj.show_pets();
			self_obj.adjust_frame_height();
		});		

		$("role_riders").addEvent("click", function(){
			self_obj.show_riders();
			self_obj.adjust_frame_height();
		});	

		$("role_clothes").addEvent("click", function(){
			self_obj.show_clothes();
			self_obj.adjust_frame_height();
		});	

	},

	switch_tab : function(el){
		if (this.last_tab){
			this.last_tab.removeClass("on");
		}
		this.last_tab = el;
		el.addClass("on");
		
		$("RoleEquipTipsBox").setStyle("display", "none");
		//hidden_tips_box();
		//hidden_tips_box_has_icon();
	},
	
	switch_sub_tab : function(el){
		if (this.last_sub_tab){
			this.last_sub_tab.removeClass("on");
		}
		el.addClass("on");
		this.last_sub_tab = el;	
	},
		
	show_basic : function(){
		this.switch_tab($("role_basic"));
		render_to_replace("role_info_box", "role_basic_templ", this.result);
		$("role_icon").src = this.result["basic_info"]["icon"];
	},
	
	show_skill : function(){
		this.switch_tab($("role_skill"));
	
		var school_skill_info = {};
		for (var i=1; i < 8; i++){
			school_skill_info["school_skill" + i + "_icon"]  = EmptySkillImg;
			school_skill_info["school_skill" + i + "_grade"] = "";
			school_skill_info["school_skill" + i + "_name"]  = "";		
		}         
		for (var i=0; i < this.result["role_skill"]["school_skill"].length; i++){
			var skill = this.result["role_skill"]["school_skill"][i];	
			school_skill_info["school_skill" + skill["skill_pos"] + "_icon"]  = skill.skill_icon;
			school_skill_info["school_skill" + skill["skill_pos"] + "_grade"] = skill.skill_grade;
			school_skill_info["school_skill" + skill["skill_pos"] + "_name"]  = skill.skill_name;
		}
		var ctx = Object.merge(school_skill_info, this.result["role_skill"]);	
		render_to_replace("role_info_box", "role_skill_templ", ctx);
	},
	
	reg_equip_tips_ev : function(el_list){
		var _this = this;

		var show_tips_box = function(){
			var el = $(this);
			var ctx = {
				"name" : el.getAttribute("data_equip_name"),
				"desc" : el.getAttribute("data_equip_desc"),
				"type_desc" : el.getAttribute("data_equip_type_desc")
			}
			render_to_replace("RoleEquipTipsBox", "role_equip_tips_templ", ctx);
			adjust_tips_position(el, $("RoleEquipTipsBox"));
			var lock_types = el.getAttribute("lock_types");
			if(lock_types){
				_this.show_lock($("RoleEquipTipsBox").children[0], el.getAttribute("lock_types").split(","), true);
			}
		};
		
		var hidden_tips_box = function(){
			$("RoleEquipTipsBox").setStyle("display", "none");
		};
		
		for (var i=0; i < el_list.length; i++){
			var el = el_list[i];
			el.addEvent("mouseover", show_tips_box);
			el.addEvent("mouseout", hidden_tips_box);
		}
	},

	show_lock : function(el, _lock_types, is_tips){
		if(_lock_types == null || _lock_types.length < 1){
			return;
		}

		var lock_types = [];

		for(var i=0; i<_lock_types.length;i++){
			var lock_type = _lock_types[i];
			// 8 for time_lock,  9 for cross_server_time_lock
			if(lock_type == 8 || lock_type == 9){
				lock_types.push(lock_type);
			}
		}

		if(lock_types.length < 1){
			return;
		}

		if(!is_tips){
			lock_types.sort();
			lock_types = [lock_types[lock_types.length-1]];
		}

		var size = "14px";
		var padding = "0px";
		if(is_tips){
			size = "28px";
			padding = "10px";
		}
		
		var div = document.createElement("div");
		div.style.position = "absolute";
		div.style.height = size;
		div.style.right = padding;
		div.style.top = padding;
		
		for(var i=0; i<lock_types.length;i++){
			var lock_type = lock_types[i];

			var e = document.createElement("img");
			e.src = "/images/time_lock_"+lock_type+".png";
			e.style.height = "14px";
			e.style.width = "14px";

			div.appendChild(e);
		}

		var parentNode = el.parentNode;
		parentNode.appendChild(div);
		
		try{
			var currentStyle = window.getComputedStyle(parentNode)
		}catch(ex){
			var currentStyle = parentNode.currentStyle;
		}

		if(currentStyle != undefined && currentStyle.position !== "absolute"){
			parentNode.style.position = "relative";
		}
	},

	show_equips : function(){
		this.switch_tab($("role_equips"));
		
		render_to_replace("role_info_box", "role_equips_templ", this.result);
		
		this.reg_equip_tips_ev($$("#RoleUsingEquips img"));	
		this.reg_equip_tips_ev($$("#RoleStoreEquips img"));	
		this.reg_equip_tips_ev($$("#RoleUsingFabao img"));	
		this.reg_equip_tips_ev($$("#RoleStoreFabao img"));

		// fill using equips info
		var using_equips = {};
		for(var i=0; i < this.result["using_equips"].length; i++){
			var equip = this.result["using_equips"][i];
			using_equips[equip["pos"]] = equip;
		}

		var using_pos_list = [1,2,3,4,5,6,187,188,189,190];
		for (var i=0; i < using_pos_list.length; i++){
			var pos = using_pos_list[i];
			var el = $("role_using_equip_" + pos);
			var equip = using_equips[pos];

			if (equip){
				el.setAttribute("data_equip_name",equip["name"]); 
				el.setAttribute("data_equip_type",equip["type"]); 
				el.setAttribute("data_equip_desc",equip["desc"]);
				el.setAttribute("data_equip_type_desc", equip["static_desc"]);
				el.src = equip["small_icon"];

				el.setAttribute("lock_types", equip["lock_type"]);

				this.show_lock(el, equip["lock_type"]);
			} else {
				el.destroy();
			}
		}
		
		for(var i=0; i < this.result["not_using_equips"].length; i++){
			var equip = this.result["not_using_equips"][i];
			var el = $("store_equip_tips" + (i+1));
			
			el.setAttribute("lock_types", equip["lock_type"]);

			this.show_lock(el, equip["lock_type"]);
		}
		
		// fill using fabao info
		var using_fabao = {};
		for(var i=0; i < this.result["using_fabao"].length; i++){
			var fabao = this.result["using_fabao"][i];
			using_fabao[fabao["pos"]] = fabao;
		}
		for (var i=1; i <=4; i++){
			var el = $("using_fabao_" + i);
			if (using_fabao[i]){
				el.setAttribute("data_equip_name",using_fabao[i]["name"]); 
				el.setAttribute("data_equip_type",using_fabao[i]["type"]); 
				el.setAttribute("data_equip_desc",using_fabao[i]["desc"]);
				el.setAttribute("data_equip_type_desc", using_fabao[i]["static_desc"]);
				el.src = using_fabao[i]["icon"]; 
			} else {
				el.destroy();
			}
		}
		
	},
	
	show_pet_detail : function(el, pet){
		this.switch_sub_tab(el);
		render_to_replace("pet_detail_panel", "pet_detail_templ", {"pet":pet});
		
		var el_list = $$("#RolePetEquips img");
		this.reg_equip_tips_ev(el_list);

		for (var i=0; i < el_list.length; i++){
			var el = el_list[i];
			this.show_lock(el, el.getAttribute("lock_types"));
		}	
	},
	
	show_pets : function(){
		this.switch_tab($("role_pets"));		
		render_to_replace("role_info_box", "role_pet_templ", this.result);
		var that = this;
		
		var show_pet_detal = function(){
			var el = $(this);
			var idx = el.getAttribute("data_idx");
			that.show_pet_detail(el, that.result["pet_info"][idx]);
		};
		var el_list = $$("#RolePets img");
		for (var i=0; i < el_list.length; i++){
			el_list[i].addEvent("click", show_pet_detal);
			var idx = el_list[i].getAttribute("data_idx");
			var pet = this.result["pet_info"][idx];
			this.show_lock(el_list[i], pet["lock_type"]);
		}
		
		var show_child_detal = function(){
			var el = $(this);
			var idx = el.getAttribute("data_idx");
			that.show_pet_detail(el, that.result["child_info"][idx]);
		};
		var el_list = $$("#RoleChilds img");
		for (var i=0; i < el_list.length; i++){
			el_list[i].addEvent("click", show_child_detal);
		}
		
		// show the first pet or child
		if(this.result["pet_info"].length != 0){
			$$("#RolePets img")[0].fireEvent("click");
		} else if (this.result["child_info"].length != 0){
			$$("#RoleChilds img")[0].fireEvent("click");		
		}
	},
	
	show_rider_detail : function(el, rider){
		this.switch_sub_tab(el);
		render_to_replace("rider_detail_panel", "rider_detail_templ", {"rider":rider});
	},

	show_xiangrui_detail : function(el, xiangrui){
		this.switch_sub_tab(el);
		render_to_replace("xiangrui_detail_panel", "xiangrui_detail_templ", {"xiangrui":xiangrui});
	},

	show_riders : function(){
		this.switch_tab($("role_riders"));
		render_to_replace("role_info_box", "role_riders_templ", this.result);
		var that = this;
		
		// rider detail
		var show_rider_detail = function(){
			var el = $(this);
			var idx = el.getAttribute("data_idx");
			that.show_rider_detail(el, that.result["rider_info"][idx]);
		};
		var el_list = $$("#RoleRiders img");
		for (var i=0; i < el_list.length; i++){
			el_list[i].addEvent("click", show_rider_detail);
		}
		if(this.result["rider_info"].length > 0){
			 $$("#RoleRiders img")[0].fireEvent("click");
		}
		
		// xiangrui
		/*
		var show_xiangrui_detail = function(){
			var el = $(this);
			var idx = el.getAttribute("data_idx");
			that.show_xiangrui_detail(el, that.result["xiangrui"][idx]);
		};
		var el_list = $$("#RoleXiangRui img");
		for (var i=0; i < el_list.length; i++){
			el_list[i].addEvent("click", show_xiangrui_detail);
		}					
		if(this.result["xiangrui"] && this.result["xiangrui"].length > 0){
			 $$("#RoleXiangRui img")[0].fireEvent("click");
		}
		*/

	},
	
	show_clothes : function(){
		this.switch_tab($("role_clothes"));
		render_to_replace("role_info_box", "role_clothes_templ", this.result);
		//this.reg_equip_tips_ev($$("#RoleClothes img"));	
	},
	
	get_lock_types : function(equip){
		var locks = [];
		if(equip["iLock"]){
			locks.push(equip["iLock"]);
		}
		if(equip["iLockNew"]){
			locks.push(equip["iLockNew"]);
		}
		return locks;
	},

	parse_role : function(){
		
		// 角色基本信息
		this.parse_basic_role_info();
		
		// 角色技能
		this.parse_role_skill();
		
		// 装备信息, 已装备的和携带的
		this.parse_equip_info();

		// 法宝信息， 已装备和携带
		this.parse_fabao_info();
		
		// 角色修炼信息
		this.parse_role_xiulian();
		
		// 召唤兽控制信息
		this.parse_pet_ctrl_skill();

		// 召唤兽信息
		this.parse_pet_info();

		// 坐骑信息
		this.parse_rider_info();

		// 锦衣信息
		this.parse_clothes_info();

		// 祥瑞信息
		this.parse_xiangrui_info();

		// 配置信息
		this.set_common_info();
		
		return this.result;
	},

	safe_attr : function(attr_value, default_value){
		if (attr_value == undefined || attr_value == null){
			return default_value != undefined ? default_value:"未知";
		}
		return attr_value;
	},
	
	set_common_info : function(){
		this.result["empty_td_img"] = ResUrl + "/images/empty_cell_of_roleinfo.gif";
	},
	
	parse_role_skill : function(){
		var life_skill    = [];
		var school_skill  = [];
		var ju_qing_skill = [];
		
		var conf = this.conf.skill;

		var that = this;	
		var get_skill_icon = function (skill_id){
			var skill_img =  that.make_img_name(skill_id) + ".gif";
			return  ResUrl + "/images/role_skills/" + skill_img;
		};
		 
		var raw_skill_info = this.raw_info["all_skills"];
		this.result["yu_shou_shu"] = this.raw_info["all_skills"]["221"];
		for (skill in raw_skill_info){
			var info = {"skill_id":skill, "skill_grade":raw_skill_info[skill], "skill_pos":0};
			info["skill_icon"] = get_skill_icon(skill);
			
			// 生活技能
			if (conf["life_skill"][skill]){
				info["skill_name"] = conf["life_skill"][skill];
				life_skill.push(info);

			// 门派技能
			} else if(conf["school_skill"][skill]){
				info["skill_name"] = conf["school_skill"][skill]["name"];
				info["skill_pos"]  = conf["school_skill"][skill]["pos"]
				school_skill.push(info);

			// 剧情技能
			} else if(conf["ju_qing_skill"][skill]){
				info["skill_name"] = conf["ju_qing_skill"][skill];
				ju_qing_skill.push(info);
			}
		}

		var shuliandu = {
			"smith_skill"   : this.safe_attr(this.raw_info["iSmithski"]),
			"sew_skill"     : this.safe_attr(this.raw_info["iSewski"])
		}

		var result = {
			"life_skill"    : life_skill,
			"school_skill"  : school_skill,
			"ju_qing_skill" : ju_qing_skill,
			"left_skill_point" : this.raw_info["iSkiPoint"],
			"shuliandu"		: shuliandu
		};
		
		this.result["role_skill"] = result;
	}, // end
	
	get_marry_info : function(marry, marry2){
		if (marry == undefined){
			return ["未知", "未知"];
		}
		
		if (marry != undefined && marry != 0){
			return ["是", marry];
		}else{
			return ["否", "不存在"];
		}
	},
	
	get_tongpao_info : function(tongpao){
		if (tongpao == undefined){
			return ["未知", "未知"];
		}
		
		if (tongpao != undefined && tongpao != 0){
			return ["是", tongpao];
		}else{
			return ["否", "不存在"];
		}
	},
	
	get_married_info : function(relation, grade, r_setting){
		if (relation === "未知" || grade == undefined){
			return "未知";
		}
		if (grade == 0){
			return "无";
		}
		if (relation === "已婚"){
			return "夫妻共有";
		}
		else if(relation === "同袍"){
			return "同袍共有";
		} else {
			return r_setting[grade];
		}		
	},
	
	get_fangwu_info : function(relation, fangwu_grade){
		return this.get_married_info(relation, fangwu_grade, this.conf.fangwu_info);
	},
	
	get_tingyuan_info : function(relation, tingyuan_grade){
		return this.get_married_info(relation, tingyuan_grade, this.conf.tingyuan_info);	
	},
	
	get_muchang_info : function(relation, muchang_grade){
		return this.get_married_info(relation, muchang_grade, this.conf.muchang_info);
	},
	
	get_real_upexp : function(){
		var exp_num = this.raw_info["iUpExp"];
		if (this.raw_info["ExpJw"] == undefined || this.raw_info["ExpJwBase"]==undefined){
			return exp_num;
		}
		exp_num += this.raw_info["ExpJw"] * this.raw_info["ExpJwBase"];
		return exp_num;		
	},
	
	get_change_school_list : function(change_list){
		if (change_list == undefined){
			return "未知";
		}
		if (!change_list){
			return "";
		}
		
		var school_list = [];
		for (var i=0; i < change_list.length; i++){
			var school_name = SchoolNameInfo[change_list[i]];
			if (!school_list.contains(school_name)){
				school_list.push(school_name);
			}
		}
		return school_list.join(",");
		
	},
	
	get_race_by_school : function(school){
        if ([1,2,3,4,13].contains(school)){
        	return "人";
        } else if([9,10,11,12,15].contains(school)){
        	return "魔";
        } else if ([5,6,7,8,14].contains(school)){
        	return "仙";
        } else {
        	return "未知";
        }
	},

	get_role_kind_name : function(icon_id){
		var icon_id = get_role_iconid(icon_id);
		return get_role_kind_name(icon_id)
	},
	
	// parse basic role info
	parse_basic_role_info : function(){
		var that = this;
		var get_role_icon = function(icon_id){
			var role_type =  get_role_iconid(icon_id);
			return ResUrl + "/images/bigface/" + role_type + ".gif";
		};

		var school_name = SchoolNameInfo[ this.raw_info["iSchool"] ];
		if (!school_name){
			school_name = "";
		}
		
		var marry_info = this.get_marry_info(this.raw_info["iMarry"]);
		var tongpao_info = this.get_tongpao_info(this.raw_info["iMarry2"]);
	
		var relation = "否";

		if(marry_info[0] === "未知" && tongpao_info[0] === "未知"){
			relation = "未知";
		}
		else if(marry_info[0] === "否" && tongpao_info[0] === "否"){
			relation = "否";
		}
		else{
			if(marry_info[0] === "是"){
				relation = "已婚";
			}
			else if(tongpao_info[0] === "是"){
				relation = "同袍";
			}
		}

		// 社区
		var community_info = "";
		if (this.raw_info["commu_name"] && this.raw_info["commu_gid"]){
			community_info = this.raw_info["commu_name"] + "&nbsp;" + this.raw_info["commu_gid"];
		} else if (this.raw_info["commu_name"] == undefined || this.raw_info["commu_gid"] == undefined){
			community_info = "未知";
		} else {
			community_info = "无";
		}
		// 房屋
		
		// 获取善恶值
		var that = this;
		var get_goodness = function(){
			if (that.raw_info["iGoodness"] == null){
				return that.raw_info["iBadness"];
			} else {
				return that.raw_info["iGoodness"];
			}
		};

		// 总经验
		var sum_exp = "";
		if (this.raw_info["sum_exp"] === undefined) {
			sum_exp = "未知";
		} else if (this.raw_info["sum_exp"] == 0) {
			sum_exp = "<1亿";
		} else {
			sum_exp = this.raw_info["sum_exp"] + "亿";
		}

		// 飞升/渡劫/化圣
		var fly_status = "";
		if (this.raw_info["i3FlyLv"] && this.raw_info["i3FlyLv"] > 0){
			fly_status = "化圣" + CHINESE_NUM_CONFIG[this.raw_info["i3FlyLv"]];
		} else {
			if (this.raw_info["iZhuanZhi"] >= 0){
				fly_status = ROLE_ZHUAN_ZHI_CONFIG[this.raw_info["iZhuanZhi"]];
			}
		}
		
		var role_info = {
			"sum_exp"       : sum_exp,
			"icon"          : get_role_icon(this.raw_info["iIcon"]),
			"role_kind_name": this.get_role_kind_name(this.raw_info["iIcon"]),
			"role_level"    : this.raw_info["iGrade"],
			"nickname"      : this.raw_info["cName"],
			"is_fei_sheng"  : this.raw_info["iZhuanZhi"] >= 1 ? "是" : "否",
			"fly_status"    : fly_status,
			"pride"         : this.raw_info["iPride"],
			"org"           : this.raw_info["cOrg"],
			"org_offer"     : this.raw_info["iOrgOffer"],
			"school"        : school_name,
			"school_offer"  : this.raw_info["iSchOffer"],
			"hp_max"        : this.raw_info["iHp_Max"],
			"mp_max"        : this.raw_info["iMp_Max"],
			"att_all"       : this.raw_info["iAtt_All"],
			"cor_all"       : this.raw_info["iCor_All"],
			"damage_all"    : this.raw_info["iDamage_All"],
			"mag_all"       : this.raw_info["iMag_All"],

			"def_all"       : this.raw_info["iDef_All"],
			"str_all"       : this.raw_info["iStr_All"],
			"dex_all"       : this.raw_info["iDex_All"],
			"res_all"       : this.raw_info["iRes_All"],
			"dod_all"       : this.raw_info["iDod_All"],
			"spe_all"       : this.raw_info["iSpe_All"],
			
			
			"mag_def_all"   : this.raw_info["iMagDef_All"],
			"point"         : this.raw_info["iPoint"],
			"cash"          : this.raw_info["iCash"],
			"saving"        : this.raw_info["iSaving"],
			"learn_cash"    : this.raw_info["iLearnCash"],
			"upexp"         : this.get_real_upexp(),
			
			"badness"       : get_goodness(),
			"goodness_sav"  : this.safe_attr(this.raw_info["igoodness_sav"]),
			"qian_neng_guo" : this.raw_info["iNutsNum"],

			"is_married"    : marry_info[0],
			"partner_id"    : marry_info[1],
			"is_tongpao"	: tongpao_info[0],
			"community_info" : community_info,
			"fangwu_info"    : this.get_fangwu_info(relation, this.raw_info["rent_level"]),
			"tingyuan_info"  : this.get_tingyuan_info(relation, this.raw_info["outdoor_level"]),
			"muchang_info"   : this.get_muchang_info(relation, this.raw_info["farm_level"]),
			"qian_yuan_dan"  : this.get_qian_yuan_dan(),
			"is_du_jie"      : this.raw_info["iZhuanZhi"] == 2 ? "已完成" : "未完成",
			"caiguo"         : this.raw_info["iCGTotalAmount"],
			"body_caiguo"    : this.raw_info["iCGBodyAmount"],
			"box_caiguo"     : this.raw_info["iCGBoxAmount"],
			"chengjiu"       : this.safe_attr(this.raw_info["AchPointTotal"]),
			"xianyu"         : this.safe_attr(this.raw_info["xianyu"]),
			"energy"         : this.safe_attr(this.raw_info["energy"]),
			"add_point"      : this.safe_attr(this.raw_info["addPoint"]),
			"ji_yuan"        : this.safe_attr(this.raw_info["jiyuan"]),
			"changesch"      : this.get_change_school_list(this.raw_info["changesch"]),
			"hero_score"	 : this.safe_attr(this.raw_info["HeroScore"]),
			"sanjie_score"	 : this.safe_attr(this.raw_info["datang_feat"]),
			"sword_score"	 : this.safe_attr(this.raw_info["sword_score"]),
			"total_caiguo"	 : this.safe_attr(this.raw_info["iCGTotalAmount"]),
			"total_avatar"	 : this.raw_info["total_avatar"],
			"total_horse"	 : this.raw_info["total_horse"],
			"fa_shang"       : this.raw_info["iTotalMagDam_all"],
			"fa_fang"        : this.raw_info["iTotalMagDef_all"]

		};
		
		if (this.raw_info["bid"] == undefined){
			role_info["is_niceid"] = "未知";
		} else {
			role_info["is_niceid"] = this.raw_info["bid"] ? "是":"否";
		}
		
		if (this.raw_info["ori_race"] == undefined){
			role_info["ori_race"] = this.get_race_by_school(this.raw_info["iSchool"]);
		} else {
			var race_name = RACE_INFO[this.raw_info["ori_race"]];
			if (this.raw_info["ori_race"] != this.raw_info["iRace"]){
				race_name = '<span style="color:#FFCC00">' + race_name + '</span>';
			}
			role_info["ori_race"] = race_name;
		}
	
		if (this.raw_info["iPcktPage"] == undefined){
			/*
				For roles which are put on sale after 2014-07-17 10:00:00,
				show "unknown";
				For roles which are put on sale after 2014-07-29 10:00:00,
				show "unknown" too.
				Any other on-sale roles show "none"
			*/
			var time1 = parseDatetime("2014-07-22 10:00:00");
			var time2 = parseDatetime("2014-07-29 10:00:00");

			var agent_time = parseDatetime(EquipRequestTime);
			var cur_time = parseDatetime(ServerCurrentTime);
			var server_id = ServerInfo.server_id;

			if (server_id === "155" && agent_time > time1){
				role_info["package_num"] = "未知";
			}
			else if ((server_id === "462" || server_id === "2") 
					  && agent_time > time2){
				role_info["package_num"] = "未知";
			}
			else{
				role_info["package_num"] = "无";
			}
		}
		else{
			package_num = parseInt(this.raw_info["iPcktPage"]);
			if (package_num > 0 && package_num <= 3){
				role_info["package_num"] = package_num;
			}
			else if(package_num == 0){
				role_info["package_num"] = "无";
			}
			else{
				role_info["package_num"] = "未知";
			}
		}
	
		this.result["basic_info"] = role_info;


	}, // end

	get_qian_yuan_dan: function(){ 
		var agent_time = parseDatetime(EquipRequestTime);
		var check_time = parseDatetime("2015-03-24 08:00:00");
		var test_check_time = parseDatetime("2015-03-17 08:00:00");
		function judge_time(){
			if([95,155,82,104,2,669,9,459].contains(parseInt(ServerInfo.server_id))){
				if(agent_time < test_check_time){
					return true;
				}
			} else if(agent_time < check_time){
				return true;
			}
			return false;
		}
		
		function check_undefined(v){
			return v===undefined ? "未知": v;
		}

		var attrs = {};
		if(judge_time()){
			attrs.old_value = this.safe_attr(this.raw_info["TA_iAllPoint"], 0);
		} else {
			attrs.new_value = check_undefined(this.raw_info["TA_iAllNewPoint"]);
		}
		return attrs;
	},
	
	// parse pet ctrl skill
	parse_pet_ctrl_skill : function (){
		var result = [];
		result.push({"name" : "攻击控制力", "grade": this.raw_info["iBeastSki1"]});
		result.push({"name" : "防御控制力", "grade": this.raw_info["iBeastSki2"]});
		result.push({"name" : "法术控制力", "grade": this.raw_info["iBeastSki3"]});
		result.push({"name" : "抗法控制力", "grade": this.raw_info["iBeastSki4"]});
		
		this.result["pet_ctrl_skill"] = result;
	}, // end
	
	parse_role_xiulian : function(){
		var	result = [];
		result.push({"name" : "攻击修炼", "info": this.raw_info["iExptSki1"] 
					+ "/" + this.safe_attr(this.raw_info["iMaxExpt1"])});
		
		result.push({"name" : "防御修炼", "info": this.raw_info["iExptSki2"]
					+ "/" + this.safe_attr(this.raw_info["iMaxExpt2"])});
					
		result.push({"name" : "法术修炼", "info": this.raw_info["iExptSki3"]
					+ "/" + this.safe_attr(this.raw_info["iMaxExpt3"])});
					
		result.push({"name" : "抗法修炼", "info": this.raw_info["iExptSki4"]
					+ "/" + this.safe_attr(this.raw_info["iMaxExpt4"])});
					
		result.push({"name" : "猎术修炼", "info": this.raw_info["iExptSki5"]});

		this.result["role_xiulian"] = result;
	}, //end
	
	// parse equip info
	parse_equip_info : function(){
		var all_equips = this.raw_info["AllEquip"];
		var get_equip_small_icon = function(itype){
			return ResUrl + "/images/equip/small/" + itype + ".gif";
		};
		
		var using_equips     = [];
		var not_using_equips = [];
		
		for (var equip in all_equips){
			var equip_info = this.conf.get_equip_info(all_equips[equip]["iType"]);

			var info = {
				"pos"  : parseInt(equip),
				"type" : all_equips[equip]["iType"],
				"name" : equip_info["name"],
				"desc" : all_equips[equip]["cDesc"],
				"lock_type" : this.get_lock_types(all_equips[equip]),
				"static_desc": htmlEncode(equip_info["desc"]).replace(/#R/g, "<br />"),
				"small_icon" : get_equip_small_icon(all_equips[equip]["iType"])
			};
			var pos = parseInt(equip);
			if ((equip >=1 && equip <= 6) || [187,188,189,190].contains(pos)){
				using_equips.push(info);
			} else {
				not_using_equips.push(info);
			}
		}
		
		this.result["using_equips"]     = using_equips;
		this.result["not_using_equips"] = not_using_equips; 
	},

	parse_fabao_info : function(){
		var all_fabao = this.raw_info["fabao"];
		var get_fabao_icon = function(itype){
			return ResUrl + "/images/fabao/" + itype + ".gif";
		}

		var using_fabao   = [];
		var nousing_fabao = [];
		for (pos in all_fabao){
			var fabao_info = this.conf.get_fabao_info(all_fabao[pos]["iType"]);
			var info = {
				"pos"  : parseInt(pos),
				"type" : all_fabao[pos]["iType"],
				"name" : fabao_info["name"],
				"desc" : all_fabao[pos]["cDesc"],
				"icon" : get_fabao_icon( all_fabao[pos]["iType"] ),

				"static_desc" : fabao_info["desc"]
			}
			if (pos >=1 && pos <= 4){
				using_fabao.push(info);
			} else {
				nousing_fabao.push(info);
			}
		}
		nousing_fabao.sort(function(a,b){return a.pos-b.pos;});

		this.result["using_fabao"]   = using_fabao;
		this.result["nousing_fabao"] = nousing_fabao;
	},
	
	make_img_name : function(img_name){
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
	},
	
	get_empty_skill_icon : function(){
		return ResUrl + "/images/role_skills/empty_skill.gif";
	},
	// parse pet info
	parse_pet_info : function(){
		var all_pets = this.raw_info["AllSummon"];
		if (!all_pets){
			all_pets = [];
		}
		var that = this;
		// get pet icon
		var get_pet_icon = function(itype){
			return ResUrl + "/images/pets/small/" + itype + ".gif";
		}
		
		var wuxing_info = {0:"未知", 1:"金", 2:"木", 4:"土", 8:"水", 16:"火"};
		var max_equip_num = 3;

		// get pet skill icon
		var get_pet_skill_icon = function (skill_id){
			return ResUrl + "/images/pet_child_skill/" + that.make_img_name(skill_id) + ".gif";
		};
		// g11 equip icon
		var get_pet_equip_icon = function(typeid){
			return ResUrl + "/images/equip/small/" + typeid + ".gif";
		};

		var get_child_icon = function(child_id){
			return  ResUrl + "/images/child_icon/" + that.make_img_name(child_id) + ".gif";
		};
		var get_child_skill_icon = function(skill_id){
			return ResUrl + "/images/pet_child_skill/" + that.make_img_name(skill_id) + ".gif";
		};

		var get_pet_name = function(itype){
			return that.conf.pet_info[itype];
		};
		var get_child_name = function(itype){
			return that.conf.child_info[itype];
		};

		var get_neidan_icon = function(neidan_id){
			return ResUrl + "/images/neidan/"+neidan_id+'.jpg';
		};

		var get_yuanxiao = function(input_value){
			if(!input_value){
				return that.safe_attr(input_value);
			}
			var agent_time = parseDatetime(EquipRequestTime);
			var cur_time = parseDatetime(ServerCurrentTime);
			var fresh_time = new Date(cur_time.getFullYear(), 0, 1);
			if(agent_time > fresh_time){
				return input_value;
			} else {
				return 0;
			}
		};
		
		var get_ruyidan = get_yuanxiao;

		var get_lianshou = function(input_value){
			if(!input_value){
				return that.safe_attr(input_value);
			}
			var agent_time = parseDatetime(EquipRequestTime);
			var cur_time = parseDatetime(ServerCurrentTime);
			var fresh_time = new Date(cur_time.getFullYear(), 8, 1);
			if (cur_time < fresh_time){
				fresh_time.setFullYear(fresh_time.getFullYear()-1);
			}
			if(agent_time > fresh_time){
				return input_value;
			} else {
				return 0;
			}
		};

		var _this = this;

		// get pet info
		var get_pet_info = function(pet, is_child){
			var get_icon = get_pet_icon;
			var get_skill_icon = get_pet_skill_icon;
			var get_name = get_pet_name
			if (is_child){
				get_icon = get_child_icon;
				get_skill_icon = get_child_skill_icon;
				get_name = get_child_name
			}

			var info = {}
			info["type_id"]      = pet["iType"];
			info["pet_grade"]    = pet["iGrade"];
			info["is_baobao"]    = pet["iBaobao"] == 0 ? "否" : "是";
			info["icon"]         = get_icon(pet["iType"]);
			info["pet_name"]     = get_name(pet["iType"]);
			info["kind"]         = get_name(pet["iType"]);
			info["blood_max"]    = pet["iHp_max"];
			info["magic_max"]    = pet["iMp_max"];
			info["attack"]       = pet["iAtt_all"];
			info["defence"]      = pet["iDef_All"];
			info["speed"]        = pet["iDex_All"];
			info["ling_li"]      = pet["iMagDef_all"];
			info["lifetime"]     = pet["life"] >= 65432 ? "永生" : pet["life"];
			info["ti_zhi"]       = pet["iCor_all"];
			info["fa_li"]        = pet["iMag_all"];
			info["li_liang"]     = pet["iStr_all"];
			info["nai_li"]       = pet["iRes_all"];
			info["min_jie"]      = pet["iSpe_all"];
			info["qian_neng"]    = pet["iPoint"];
			info["cheng_zhang"]  = pet["grow"] / 1000;
			info["wu_xing"]      = wuxing_info[ pet["iAtt_F"] ];
			
			info["gong_ji_zz"]  = pet["att"];
			info["fang_yu_zz"]  = pet["def"];
			info["ti_li_zz"]    = pet["hp"];
			info["fa_li_zz"]    = pet["mp"];
			info["su_du_zz"]    = pet["spe"];
			info["duo_shan_zz"] = pet["dod"];
			info["used_yuanxiao"]  = get_yuanxiao(pet["yuanxiao"]);
			info["used_ruyidan"]   = get_ruyidan(pet["ruyidan"]);
			info["used_qianjinlu"] = that.safe_attr(pet["qianjinlu"]);
			info["used_lianshou"]  = get_lianshou(pet["lianshou"]);
			info["child_sixwx"]  = pet["child_sixwx"];
			info["is_child"]  = is_child;
			info["color"] = pet["iColor"];
			info['summon_color'] = pet['summon_color'];
			
			// genius skill
			info["genius"]      = pet["iGenius"];
			if (info["genius"] != 0){
				info["genius_skill"] = {
					"icon"       : get_skill_icon(pet["iGenius"]),
					"skill_type" : pet["iGenius"]
				};
			} else {
				info["genius_skill"] = {};
			}

			// parse skill info
			info["skill_list"] = [];
			var all_skills = pet["all_skills"];
			if (all_skills){
				for (typeid in all_skills){
					if (parseInt(typeid) == info["genius"]){
						continue;
					}

					info["skill_list"].push({
						"icon"       : get_skill_icon(typeid),
						"skill_type" : typeid, 
						"level"      : all_skills[typeid]
					});
				}
			}

			// parse equip info
			info["equip_list"] = [];
			for (var i=0; i < max_equip_num; i++){
				var item = pet["summon_equip" + (i + 1)];
				if (item){
					var equip_name_info = that.conf.get_equip_info( item["iType"] );
					info["equip_list"].push({
						"name" : equip_name_info["name"],
						"icon" : get_pet_equip_icon(item["iType"]),
						"type" : item["iType"],
						"desc" : item["cDesc"],
						"lock_type" : _this.get_lock_types(item),

						"static_desc" : equip_name_info["desc"].replace(/#R/g, "<br />")
					});
				}
			}

			// empty skill img
			info["empty_skill_img"] = ResUrl + "/images/role_skills/empty_skill.gif";

			// parse neidan info
			info["neidan"] = []
			if (pet["summon_core"] != undefined){
				for(var p in pet["summon_core"]){
					var p_core = pet["summon_core"][p];
					info["neidan"].push({
						"name": this.safe_attr(PetNeidanInfo[p]),
						"icon": get_neidan_icon(p),
						"level": p_core[0]
						});
				}
			}
			
			// jinjie
			info["jinjie"] = dict_get(pet, "jinjie", {});
		
			// lock_type	
			info["lock_type"] = _this.get_lock_types(pet);

			return info;
		}
		
		// parse pet info
		var pet_info = [];
		for(var i=0; i < all_pets.length; i++){
			var info = get_pet_info( all_pets[i] );
			pet_info.push(info);
		}
		
		this.result["pet_info"] = pet_info;
		

		// parse child info
		if (this.raw_info["child"] && this.raw_info["child"]["iType"]){
			this.result["child_info"] = [ get_pet_info(this.raw_info["child"], true) ];
		} else {
			this.result["child_info"] = [];
		}

		if (this.raw_info["child2"] && this.raw_info["child2"]["iType"]){
			this.result["child_info"].push(get_pet_info(this.raw_info["child2"], true));
		}

		// parse special pets
		this.result["special_pet_info"] = this.raw_info["pet"]		

	}, //parse_pet_info end
	
	parse_rider_info : function(){
		var rider_name_info = this.conf.rider_info;
		var get_rider_icon = function(itype){
			return ResUrl + "/images/riders/" + itype + ".gif";
		}
		var that = this;
		var get_skill_icon = function(typeid){
			return ResUrl + "/images/rider_skill/" + that.make_img_name(typeid) + ".gif";
		};
		
		var all_rider = this.raw_info["AllRider"];
		if (!all_rider){
			all_rider = {};
		}
		result = [];
		for (rider in all_rider){
			var rider_info = this.raw_info["AllRider"][rider];
			var info = {
				"type"      : rider_info["iType"],
				"grade"     : rider_info["iGrade"],
				"grow"      : rider_info["iGrow"] / 100,
				"exgrow"	: rider_info["exgrow"]?(rider_info["exgrow"] / 10000).toFixed(4):(rider_info["iGrow"] / 100),
				"ti_zhi"    : rider_info["iCor"],
				"magic"     : rider_info["iMag"],
				"li_liang"  : rider_info["iStr"],
				"nai_li"    : rider_info["iRes"],
				"min_jie"   : rider_info["iSpe"],
				"qian_neng" : rider_info["iPoint"], 
				"icon"      : get_rider_icon(rider_info["iType"]),
				"type_name" : safe_attr( rider_name_info[ rider_info["iType"] ] ),
				"mattrib"	: rider_info["mattrib"] ? rider_info["mattrib"]:"未选择",
				"empty_skill_icon" : this.get_empty_skill_icon()
			};

			info["all_skills"] = [];
			var all_skills = rider_info["all_skills"];
			for (typeid in all_skills){
				info["all_skills"].push({
					"type"  : typeid,
					"icon"  : get_skill_icon(typeid),
					"grade" : all_skills[typeid]
				});
			}
			result.push(info);
		}
		
		this.result["rider_info"] = result;
	}, // parse rider info end

	parse_clothes_info : function(){
		var all_clothes_info = this.conf.clothes_info;
		var get_clothes_icon = function(itype){
			return ResUrl + "/images/clothes/" + itype + "0000.gif";
		};
		var get_cloth_name_desc = function(itype){
			if(all_clothes_info[itype]){
				return all_clothes_info[itype];
			} else {
				return {"name":"", "desc": ""}
			}
		};

		var all_clothes = this.raw_info["ExAvt"];
    	if(all_clothes == undefined){
    		return;
		}
		
		result = [];
		for (var pos in all_clothes){
			var clothes_info = all_clothes[pos];
			var clothe_name = clothes_info.cName || safe_attr(all_clothes_info[clothes_info["iType"]]);
			var info = {
				"type" : clothes_info["iType"],
				"name" : clothe_name,
				"icon"      : get_clothes_icon(clothes_info["iType"]),
				"order" : clothes_info["order"],
				"static_desc" : ""
			};
			result.push(info);
		}
		
		var sort_func = function(a, b){
			if(a["order"] && b["order"]){
				return a["order"] - b["order"];
			}else{
				return a["type"] - b["type"];
			}
		}
		this.result["clothes"] = result.sort(sort_func);
	}, // parse clothes info end

	parse_xiangrui_info : function(){
		var all_xiangrui_info = this.conf.xiangrui_info;
		var all_skills = this.conf.xiangrui_skill;
		var nosale_xiangrui = this.conf.nosale_xiangrui;

		var get_xiangrui_icon = function(itype){
			return ResUrl + "/images/xiangrui/" + itype + ".gif";
		};
		var get_skill_icon = function(){
			return ResUrl + "/images/xiangrui_skills/1.gif";
		};
		var all_xiangrui = this.raw_info["HugeHorse"];
        if(all_xiangrui == undefined)
            return;
        result = [];
		nosale_result = [];
		for (pos in all_xiangrui){
			var xiangrui_info = all_xiangrui[pos];
			var type = xiangrui_info["iType"];
			var info = {
				"type" : type,
				"name" : xiangrui_info.cName || safe_attr(all_xiangrui_info[type]),
				"icon" : get_xiangrui_icon(type),
				"skill_name" : all_skills[xiangrui_info['iSkill']],
				"order" : xiangrui_info["order"]
			};
			if (xiangrui_info["iSkillLevel"] != undefined){
				info["skill_level"] = xiangrui_info["iSkillLevel"] + "级";
			} else {
				info["skill_level"] = "";
			}
			
			// 部分祥瑞由限量版专为非限量，需要提前处理
			if (this.conf.nosale_to_sale_xiangrui[pos]){
				var nosale = false;
			} else {
				var nosale = xiangrui_info["nosale"] && xiangrui_info["nosale"] == 1;
				if(!nosale){
					nosale = (nosale_xiangrui[pos] != undefined);
				}
			}

			if(nosale){
				nosale_result.push(info);
			}else{
				result.push(info);
			}
		}

		var sort_func = function(a, b){
			if(a["order"] && b["order"]){
				return a["order"] - b["order"];
			}else{
				return a["type"] - b["type"];
			}
		}

		this.result["xiangrui"] = result.sort(sort_func);

		nosale_result.sort(sort_func);
		if(nosale_result.length > 22){
			nosale_result.splice(22, nosale_result.length-22);
		}

		this.result["nosale_xiangrui"] = nosale_result;
		if(this.raw_info["normal_horse"]){
			this.result["normal_xiangrui_num"] = this.raw_info["normal_horse"];
		}
	} // parse xiangrui info end
});

function display_equip_tips(equip_info_id){
	$(equip_info_id + "_panel").style.display = "block";
	if ($(equip_info_id + "_panel").displayed){
		return;
	} else {
		$(equip_info_id + "_panel").displayed = true;
	}
	var content_height = $(equip_info_id + "_info").offsetHeight;
	if (content_height < 130)
	{
		content_height = 130;
	}
	$(equip_info_id + "_equip_layer1").style.height = content_height + 16 + "px";
	$(equip_info_id + "_equip_layer2").style.height = content_height + 10 + "px";
}

function hidden_equip_tips(equip_info_id){
	$(equip_info_id + "_panel").style.display = "none";
}

function gen_skill_html(templ_id, skill_info){
	var templ = new Template();
	var empty_skill_img = ResUrl + "/images/role_skills/empty_skill.gif";
	return templ.render(templ_id, {"skills" : skill_info, "empty_img" : empty_skill_img });
}

function get_summon_color_desc(value){
	if(value == undefined){
		return '未知';
	} else if(value == 1){
		return '是';
	} else {
		return '否';
	}
}
