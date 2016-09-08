window.addEvent('domready', function() {
	var countdown_seconds;
	var countdown = function() {
		if (countdown_seconds <= 0) {
			$('btnSubmit').disabled = false;
			$('btnSubmit').setStyle('color', '');
			$('btnSubmit').value = 'ÒÑ·¢ËÍ';
		} else {
			$('btnSubmit').disabled = true;
			$('btnSubmit').setStyle('color', 'gray');
			$('btnSubmit').value = 'ÒÑ·¢ËÍ (' + countdown_seconds + ')';
			countdown_seconds--;
			setTimeout(countdown, 1000);
		}
	};

	var start_countdown = function(sec) {
		countdown_seconds = sec;
		countdown();
	};

	start_countdown(30);

	var popup = new PopupManager("mobileChangePriceLayer");
	var show_popup = function(msg) {
		$('mobileChangePriceMessage').innerHTML = htmlEncode(msg);
		popup.show();
		return false;
	};
	var hide_popup = function() {
		popup.hide();
		return false;
	};
	$('btnCloseMobileChangePriceLayer').addEvent('click', hide_popup);
	$('btnCloseMobileChangePriceLayer2').addEvent('click', hide_popup);
	$('btnMobileChangePriceHelp').addEvent('click', function() { return show_popup(""); });

	var ajax = null;
	var failure_handler = function() {
		if (ajax != null) {
			show_popup("ÍøÂçÒì³££¬ÇëÖØÊÔ");
			start_countdown(10);
			ajax = null;
		}
	};
	var success_handler = function(json) {
		if (ajax != null) {
			if (parseInt(json.status) == 1) {
				window.location = json.msg;
			} else {
				show_popup(json.msg);
				start_countdown(10);
			}
			ajax = null;
		}
	};

	$('btnSubmit').addEvent('click', function() {
		if (ajax != null)
			return;
		ajax = new Request.JSON({
			url: CgiRootUrl + "/bind_phone.py",
			timeout: 30000,
			noCache: true,
			onSuccess: success_handler,
			onException: failure_handler,
			onFailure: failure_handler,
			onError: failure_handler,
			onTimeout: failure_handler
		});
		ajax.post($('formChangePrice').toQueryString());
		$('btnSubmit').disabled = true;
		$('btnSubmit').value = 'ÇëÉÔºò¡­¡­';
	});
});
