// rewrite method 'message'
var old_qrcode_login_message = QRCodeLogin.prototype.message;
QRCodeLogin.implement('message', function(msg){
	var $qrcode = $('qrcode');
	if (msg.indexOf('二维码过期') >= 0) {
    var $refresh = new Element('div', {
      html: '<div class="refreshBG"></div><div class="refreshCnt"><span class="text">二维码已失效</span><a href="javascript:qrcode_manual_update();" class="refreshBt">点击刷新</a></div>'
    });
		if ($qrcode.childNodes.length > 0 && $qrcode.childNodes[0].nodeType === 3) {
			$qrcode.set('html', '');
		}
		$qrcode.getChildren('div').destroy();
    $qrcode.appendChild($refresh);
	} else {
		$qrcode.set('html', msg);
	}
	this.has_qrcode = false;
});

function set_server_info() {
	var area_name   = htmlEncode(decodeURIComponent(getPara("area_name")));
	var server_name = htmlEncode(decodeURIComponent(getPara("server_name")));
	var server_id   = htmlEncode(getPara("server_id"));
	var area_id     = htmlEncode(getPara("area_id"));
	var equip_id    = htmlEncode(getPara("equip_id"));

	var server_name_info = '';
	if(area_name) {
		server_name_info = area_name + "&raquo;";
	}
	if(server_name) {
		server_name_info += server_name;
	}

	$("server_name_info").set('html', server_name_info);
	$("server_name").value     = server_name;
	$("server_id").value       = server_id;
	$("area_id").value         = area_id;
	$("area_name").value         = area_name;
	$("equip_id").value        = equip_id;
}

// 匿名访问
function anonymous_search() {
    Cookie.dispose("is_user_login");
    Cookie.dispose("login_user_nickname");

    var serverId = $("server_id").value;
    var serverName = $("server_name").value;
    var nextUrl = getPara('return_url');
    if (!nextUrl && StaticFileConfig["is_using"]) {
      nextUrl = StaticFileConfig["res_root"] + "/" + serverId + "/buy_equip_list/equip_list1.html";
    } else {
      nextUrl = decodeURIComponent(nextUrl);
    }

    var obj_form = document.anonymous_form;
    Cookie.write("cur_servername", encodeURIComponent(serverName));

    submit_by_form({
      url: obj_form.action,
      method: obj_form.method,
      data: {
        act: 'do_anon_auth',
        server_id: serverId,
        server_name: serverName,
        next_url: nextUrl
      }
    });
}

function submit_by_form(options) {
  options = Object.merge({ method: 'post', url: '/', data: {} }, options || {});

  var data = options.data;
  var form = document.createElement('form');
  var method = options.method.toLowerCase();
  form.setAttribute('method', method);
  form.setAttribute('action', options.url);
  options.target && form.setAttribute('target', options.target);

  Object.each(data, function(value, key) {
    var input = document.createElement('input');
    input.setAttribute('id', key);
    input.setAttribute('name', key);
    input.value = value;
    form.appendChild(input);
  });

  document.getElementsByTagName('body')[0].appendChild(form);

  form.submit();
}


function init_page() {
	set_server_info();
}

function login_tab_init() {
	qrcode_login_init(CgiRootUrl, HttpsCgiRootUrl, {size: [156, 156]});

	// tab 切换
  var tabTimer;
	$$('.loginTab .item').addEvent('mouseenter', function(e){
		var el = this;
    if (el.hasClass('active')) {
      return;
    }

    // 防止过于灵活
    clearTimeout(tabTimer);
    tabTimer = setTimeout(function() {
      el.addClass('active')
  			.getSiblings('.active')
  			.removeClass('active');

  		var index = el.get('data-tab');
  		$$('.loginTabContent .tabContent').each(function($el) {
  			$el.setStyle('display', $el.hasClass('tabContent' + index) ? '' : 'none');
  		});
			qrcode_set_polling_status(index == 1);

			var oneFnKey = 'data-event-active';
      var fn = el.get(oneFnKey);
  		fn && window[fn] && window[fn]();
			el.set(oneFnKey, '');
    }, 200);
	});
}
