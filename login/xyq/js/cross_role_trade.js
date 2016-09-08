var CrossRoleTradeOperator = new Class({
    initialize : function(){
    	var btn = $("btn_buy");
    	var self = this;
    	
    	if (!equip["is_selling"]){
    		btn.setStyle("display", "none");
    		return;
    	}
    	
		// 登陆状态，可以直接用当前角色进行购买
		if (LoginInfo && LoginInfo.login){
			btn.addEvent("click", function(){
				var buy_hook = $("btn_buy").getAttribute("data_buy_hook");
				if (buy_hook){
					if (!eval(buy_hook + "()")){
						return false;
					}
				}

				var serverid = LoginInfo["server_id"];
				if (!serverid){
					serverid = LoginInfo["serverid"];
				}
				window.location.href = self.get_add_order_url(serverid);
				return false;
			});
			//btn.set("value", "下单购买");
			this.set_button_txt(btn, "下单购买");
		
		// 弹出登陆界面，让玩家选择服务器进行登陆
		} else {
			btn.addEvent("click", function(){
				self.show_popup_select_server_box();
				return false;
    		});
			//btn.set("value", "登陆购买");
			this.set_button_txt(btn, "登陆购买");		
		}
		
		$("btn_close_server_popup").addEvent("click", function(){
			$("pageCover").setStyle("display", "none");
			$("select_server_popup").setStyle("display", "none");    		
    	});	
		
	},
	
	set_button_txt : function(btn, btn_txt){
		btn.set("value", btn_txt);			
	},
	
	get_add_order_url : function(login_serverid){
		// 如果登陆服和物品服一样，走本服下单流程
		if (login_serverid == equip["server_id"]){
			return CgiRootUrl + "/usertrade.py?act=buy&equipid=" + equip["equipid"] + "&device_id=" + get_fingerprint();
		} else {		
			var arg = {
				"obj_serverid" : equip["server_id"],
				"obj_equipid" : equip["equipid"],
				"device_id" : get_fingerprint(),
				"act" : "add_cross_buy_role_order"
			};
			return CgiRootUrl + "/usertrade.py?" + Object.toQueryString(arg);
		}
	},
	
	chose_server : function(args){
		if (args["server_id"] == equip["server_id"]){
			var arg = {
				"serverid" : equip["server_id"],
				"ordersn" : equip["game_ordersn"],
				"act" : "buy_show_by_ordersn"
			};		
		} else {
			var arg = {
				"serverid" : equip["server_id"],
				"equip_id" : equip["equipid"],
				"act" : "overall_search_show_detail"
			};
    	}
		var equip_detail_url = CgiRootUrl + "/equipquery.py?" + Object.toQueryString(arg);		
    	
    	var login_arg = {
    		"server_id" : args["server_id"],
    		"server_name" : args["server_name"],
    		"area_id" : args["area_id"],
    		"area_name" : args["area_name"],
    		"return_url" : equip_detail_url,
    		"act" : "show_login"
		};
		var url = CgiRootUrl + "/show_login.py?" + Object.toQueryString(login_arg);
    	window.location.href = url;
	},
	
	show_popup_select_server_box : function(){
		var self = this;
		var chose_server = function(args){
			self.chose_server(args);
		};
				
    	var obj = new SelectServer(chose_server, null);
		obj.show();
		
		$("not_allow_buy_tips").setStyle("display", "");
		$("not_allow_buy_tips").set("html", "请选择任意有角色的服务器登陆购买");

    	// show popup
  		var cover = $("pageCover");
    	var popup = $("select_server_popup");
		show_layer_center(cover, popup);	
	}
});
