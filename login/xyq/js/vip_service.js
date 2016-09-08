var ServiceSellNotify = 1;
var ServiceSearchMonthly = 2;

var ServiceNameInfo = {
	1 : "售出商品通知服务",
	2 : "全服装备搜索包月"
};

var NotifyEquipType = {
	1 : "道具",
	2 : "召唤兽",
	3 : "游戏币",
	4 : "角色"
};

var ServiceOrderStatus = {
	"unpaid" : {"name":"未付款", "value":0},
	"paid" : {"name":"已付款", "value":1},
	"suc" : {"name":"已作废", "value":2},
	"refundment" : {"name":"退款中", "value":3},
	"refundment_finish" : {"name":"退款完成", "value":4}
};

var ServiceStatus = {
	"valid" : {"name":"正常", "value":0},
	"expire" : {"name":"已过期", "value":1},
	"cancel" : {"name":"已取消", "value":2}
};

function get_service_order_status_desc(status_value)
{
	for (var status_name in ServiceOrderStatus){
		if (ServiceOrderStatus[status_name]["value"] == status_value){
			return ServiceOrderStatus[status_name]["name"];
		}
	}
	return "";
}
function add_sell_notify_order()
{
	// get notify type
	var notify_type_list = [];
	var notify_type_box_list = $$("input[name='notify_equip_type']");
	for (var i=0; i < notify_type_box_list.length; i++){
		if (notify_type_box_list[i].checked){
			notify_type_list.push(notify_type_box_list[i].value);
		}
	}
	if (notify_type_list.length == 0){
		alert("请选择需要发送短信的商品类型");
		return;
	}
	$("other").value = "notify_equip_type=" + notify_type_list.join(",");
	
	// get charge type
	var has_selected_charge = false;
	var charge_box_list = $$("input[name='charge_id']");
	for (var i=0; i < charge_box_list.length; i++){
		if (charge_box_list[i].checked){
			has_selected_charge = true;
		}
	}
	if (!has_selected_charge){
		alert("请选择购买服务的类型");
		return;
	}
	
	document.magic.submit();
}

function add_search_monthly_order()
{
	if (!$("charge_id").checked){
		alert("请确认套餐类型");
		return;
	}
	
	document.magic.submit();
}

function add_order()
{
	if (!$("accept_license").checked){
		alert('请选择"同意收费规则并购买该服务"');
		return false;	
	}
	
	if (ServiceInfo["id"] == ServiceSellNotify){
		add_sell_notify_order();
		return;	
	} else if(ServiceInfo["id"] == ServiceSearchMonthly){
		add_search_monthly_order();
		return;
	}
}

