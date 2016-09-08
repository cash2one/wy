function auction_detail_init() {
	set_auction_status_remain_time();
	if (window.IsLogin || (window.LoginInfo && LoginInfo.login)) {
		btn_auction_logged_in();
	} else {
		btn_auction_not_logged_in();
	}

	update_bid_history(1);
}

function set_auction_status_remain_time() {
	var el = $('auction_status_remain_time');
	if (!el)
		return;
	var seconds = el.getAttribute('data-seconds');
	if (!/^-?\d+$/.test(seconds))
		return;

	seconds = +seconds;
	if (seconds <= 0) {
		// 状态更新可能延迟了，尝试自动刷新
		setTimeout(function() {
			window.location.reload();
		}, (-seconds / 2 + 1) * 1000);
		return;
	}

	setInterval(function() {
		if (seconds == 0) {
			window.location.reload();
			return;
		}
		el.innerHTML = get_exact_remain_time_desc(seconds);
		--seconds;
	}, 1000);
}

function hide_btn_buy() {
	['btn_buy', 'buy_btn'].each(function(id) {
		var btn = $(id);
		if (btn) {
			btn.setStyle('display', 'none');
			if (btn.nextSibling && btn.nextSibling.nodeType == 3/*TEXT_NODE*/ && /^\s+$/.test(btn.nextSibling.nodeValue))
				btn.parentNode.removeChild(btn.nextSibling);
		}
	});
}

function btn_auction_not_logged_in() {
	['pay_deposit_btn', 'bid_btn', 'pay_full_order_btn', 'auction_open_buy_btn'].each(function(id) {

		var el = $(id);
		if (!el)
			return;

		if (LoginServerId == EquipServerId) {
			el.addEvent("click", function(){
				var login_url = get_login_url({
					"equip_id" : EquipId,
					"return_url" : window.location.href
				});
				window.location.href = login_url;
				el.href = login_url;
				return false;
			});
		} else {
			if (!AllowCrossBuy || CrossBuyServerids.length <= 1 || !CrossBuyKindids.contains(EquipInfo["kindid"])){
				// 不能跨服买
				el.addEvent("click", function(){
					try_login_to_buy(EquipInfo["equipid"],
							EquipInfo["server_id"], EquipInfo["server_name"], EquipInfo["area_id"], EquipInfo["area_name"]);
					return false;
				});
			} else {
				el.addEvent("click", function(){
					window.alert_login();
					return false;
				});
			}

		}

		// 只要找到一个上述按钮，就把默认的btn_buy隐掉
		hide_btn_buy();

	});
}

function btn_auction_logged_in() {
	if (AuctionIsEquipOwner) {
		['pay_deposit_btn', 'bid_btn', 'pay_full_order_btn', 'auction_open_buy_btn'].each(function(id) {
			var btn = $(id);
			if (btn) {
				btn.addClass('disabled');
				btn.href = 'javascript:;';
			}
		});
		return;
	}

	if ($('pay_deposit_btn'))
		handle_pay_deposit();
	else if ($('bid_btn'))
		handle_bid();
	else if ($('pay_full_order_btn'))
		handle_auction_pay_full();
	else if ($('auction_open_buy_btn'))
		handle_auction_open_buy();
	$('fairshow_buy_info') && $('fairshow_buy_info').setStyle('display', 'none');
	hide_btn_buy();
}

function popup_pay_deposit() {
	popupModal.show({
		"title": "支付保证金",
		"bodyWidth": 350,
		"body": $("popup_body_pay_deposit").get("html")
	});

	var goPayDeposit = $('go_pay_deposit');
	var agreeGoPayDeposit = $('agree_go_pay_deposit');

	goPayDeposit.addEvent("click", function(e) {
		if (agreeGoPayDeposit.checked) {
			popupModal.show({
				"title": "网上支付提示",
				"bodyWidth": 400,
				"body": $("popup_body_pay_tips").get("html")
			})
		} else {
			e.stop();
			agreeGoPayDeposit.getParent().setStyle('color', 'red');
			return false;
		}
	})

	agreeGoPayDeposit.addEvent("change", function(e) {
		if (this.checked) {
			goPayDeposit.removeClass("disabled");
		} else {
			goPayDeposit.addClass("disabled");
		}
	})
	if (AuctionLicenseAccepted) {
		agreeGoPayDeposit.checked = true;
		goPayDeposit.removeClass("disabled");
	}
}

function handle_pay_deposit() {
	$('pay_deposit_btn').addEvent('click', function() {
		popup_pay_deposit();
		return false;
	});
}

function add_bid_result_callback(result, txt) {
	if (result.status == 1) {
		alert('操作成功');
		window.location.reload();
	} else {
		alert(result.msg);
	}
}

function add_bid(auto, price_yuan) {
	var Ajax = new Request.JSON({
		url: CgiRootUrl + '/auction.py',
		onSuccess: add_bid_result_callback
	});
	Ajax.post({
		act: 'bid',
		equip_serverid: EquipServerId,
		game_ordersn: GameOrdersn,
		auto: auto ? '1' : '0',
		price_yuan: price_yuan,
		safe_code: SafeCode
	});
}

function popup_bid_confirm() {
	var bid_price = $('input_bid_price').value;
	var auto = $('checkbox_auto_bid').checked;

	if (!/^\d+(\.\d?\d?)?$/.test(bid_price)) {
		popupGrowl.show({"message": "请正确输入价格"});
		return;
	}

	if (bid_price < (auto ? AuctionMinAutoBidPrice : AuctionMinBidPrice)) {
		popupGrowl.show({"message": "请输入大于最低出价的数额"});
		return;
	}

	popupModal.show({
		"title": "出价确认",
		"bodyWidth": 300,
		"body": render("popup_body_bid_confirm", {bid_price: bid_price, auto: auto}),
		closeCallback: function() { $('bid_btn').click(); }
	});

	var dom_auction_poundage = $('bid_info_buyer_auction_poundage');
	var dom_cross_poundage = $('bid_info_cross_server_poundage');
	var dom_total = $('bid_info_total_price');
	new Request.JSON({
		url: CgiRootUrl + '/auction.py',
		noCache: true,
		onSuccess: function(json) {
			if (dom_auction_poundage != $('bid_info_buyer_auction_poundage')) {
				return;
			}
			if (json.status == 1) {
				if (json.price_too_low) {
					popupModal.hide();
					popupGrowl.show({message: "竞价已被其他用户提高<br>请输入大于最低出价的数额"});
					AuctionMinPriceGrowth = +json.min_bid_price_growth;
					AuctionMinBidPrice = +json.min_bid_price;
					AuctionMinAutoBidPrice = +json.min_auto_bid_price;
					$$('.j_auction_min_price_growth').each(function(el) { el.innerHTML = json.min_bid_price_growth; });
					$('bid_btn').click();
				} else {
					dom_auction_poundage.innerHTML = '￥' + json.buyer_auction_poundage;
					dom_cross_poundage.innerHTML = '￥' + json.cross_server_poundage;
					dom_total.innerHTML = '￥' + json.total;
				}
			} else {
				popupModal.hide();
				popupGrowl.show({message: json.msg});
				$('bid_btn').click();
			}
		}
	}).get({
		act: 'get_bid_poundage',
		equip_serverid: EquipServerId,
		game_ordersn: GameOrdersn,
		auto: auto ? 1 : 0,
		bid_price: bid_price
	});

	var goBid = $('go_bid');
	var agreeGoBid = $('agree_go_bid');

	goBid.addEvent("click", function(e) {
		if (agreeGoBid.checked) {
			add_bid(auto, bid_price);
			popupModal.hide();
		} else {
			agreeGoBid.getParent().setStyle('color', 'red')
		}
	})

	agreeGoBid.addEvent("change", function(e) {
		if (this.checked) {
			goBid.removeClass("disabled");
		} else {
			goBid.addClass("disabled");
		}
	})

	if (AuctionLicenseAccepted) {
		agreeGoBid.checked = true;
		goBid.removeClass("disabled");
	}
}

function handle_bid() {
	$('bid_btn').addEvent('click', function(e) {
		e.stop();
		popupModal.show({
			"title": "出价",
			"bodyWidth": 330,
			"body": render("popup_body_bid")
		})

		$('input_bid_price').value = '';

		function toggle_auto_bid() {
			var a = $$('#popup .js-autobid');
			var m = $$('#popup .js-manualbid');
			var min_price;
			if (this.checked) {
				a.removeClass("hidden");
				m.addClass("hidden");
				min_price = AuctionMinAutoBidPrice;
			} else {
				a.addClass("hidden");
				m.removeClass("hidden");
				min_price = AuctionMinBidPrice;
			}
			var input_value = +$('input_bid_price').value;
			if (!input_value || input_value < min_price)
				$('input_bid_price').value = min_price;
		}
		$('checkbox_auto_bid').addEvent('change', toggle_auto_bid);
		$('checkbox_auto_bid').addEvent('click', toggle_auto_bid);
		toggle_auto_bid();

		return false;
	});
}

function handle_auction_pay_full() {
	var link = $('pay_full_order_btn');
	link.target = '_blank';
	link.href = CgiRootUrl + '/auction.py?' + Object.toQueryString({
		act: 'pay_auction_order',
		equip_serverid: EquipServerId,
		game_ordersn: GameOrdersn
	});

	link.addEvent('click', function() {
		popupModal.show({
			"title": "网上支付提示",
			"bodyWidth": 400,
			"body": $("popup_body_pay_tips").get("html")
		})
	});
}

function handle_auction_open_buy() {
	var link = $('auction_open_buy_btn');

	if (!link.hasClass('disabled')) {
		link.target = '_blank';
		link.href = CgiRootUrl + '/auction.py?' + Object.toQueryString({
			act: 'pay_auction_order',
			equip_serverid: EquipServerId,
			game_ordersn: GameOrdersn
		});
		link.addEvent('click', function() {
			popupModal.show({
				"title": "网上支付提示",
				"bodyWidth": 400,
				"body": $("popup_body_pay_tips").get("html")
			})
		});
	}
}

function update_bid_history(page) {
	if (!$('bid_history'))
		return;
	var Ajax = new Request.JSON({
		url: CgiRootUrl + '/auction.py',
		noCache: true,
		onSuccess: show_bid_history
	});
	Ajax.get({
		act: 'get_bid_history',
		equip_serverid: EquipServerId,
		game_ordersn: GameOrdersn,
		page: page
	});

	function show_bid_history(result, txt) {
		if (result.status != 1) {
			alert(result.msg);
			return;
		}

		render_to_replace('bid_history', 'bid_history_templ', {
			count: result.total_count,
			list: result.list,
			pager: result.pager,
			init_price_info: result.init_price_info
		});
	}
}

function put_offsale_from_auction(equip_id)
{
	if (!confirm("请确认：\n---------------------\n确认将此商品下架？\n将终止拍卖过程。")) {
		return false;
	}
	var url = CgiRootUrl + "/usertrade.py?act=offsale&equipid=" + equip_id;
	url += "&safe_code=" + SafeCode;
	window.location = url;
}

function show_pay_error_panel(elem) {
	$(elem).setStyle("display", "none");
	$("pay_error_panel").setStyle("display", "block");
	$$("#pay_error_panel input[type=radio]").addEvent('change', function() {
		if (this.checked) {
			$$('#pay_error_panel .j_pay_error_help').each(function(el) { el.style.display = 'none'; });
			$(this.value).style.display = '';
		}
	});
}
