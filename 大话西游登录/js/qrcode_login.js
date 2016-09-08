
var QRCodeLogin = new Class({
    timeout: 30000,
    poll_interval: 2000,
    auto_update_limit: 3,
    size: [128, 128],
    color: ["#000000", "#ffffff"],
    initialize: function(httpurl, httpsurl, other_params) {
        this.qrcode_json = '';
        this.httpurl = httpurl;
        this.httpsurl = httpsurl;
        if (other_params) {
            if ("size" in other_params)
                this.size = other_params.size;
        }
        this.ajax = null ;
        this.timeout_id = null ;
        this.auto_update_counter = 0;
        this.has_qrcode = false;
        this.poll_enabled = false;
    },
    update: function() {
        if (this.auto_update_counter >= this.auto_update_limit) {
            this.message("二维码过期，请刷新");
            return;
        }
        this.auto_update_counter++;
        this.message("正在加载二维码……");
        var success_handler = this.update_success_handler.bind(this);
        var failure_handler = this.update_failure_handler.bind(this);
        var query_url = "/qrcode.json";
        this.ajax = new Request.JSON({
            url: query_url,
            timeout: this.timeout,
            onSuccess: success_handler,
            onException: failure_handler,
            onFailure: failure_handler,
            onError: failure_handler,
            onTimeout: failure_handler
        });
        this.ajax.get();
    },
    manual_update: function() {
        if (this.ajax !== null  && this.ajax.isRunning()) {
            this.ajax.cancel();
            this.ajax = null ;
        }
        if (this.timeout_id !== null ) {
            clearTimeout(this.timeout_id);
            this.timeout_id = null ;
        }
        this.auto_update_counter = 0;
        this.update();
    },
    set_polling_status: function(enabled) {
        if (enabled && !this.has_qrcode) {
            this.update();
        }
        this.poll_enabled = enabled;
    },
    update_success_handler: function(json) {
        if (json.status != "1") {
            this.update_failure_handler();
            return;
        }
        this.qrcode_json = json.qrcode_json;
        this.poll_url = json.poll_url;
        $("qrcode").innerHTML = "";
        new QRCode($("qrcode"),{
            text: this.qrcode_json,
            width: this.size[0],
            height: this.size[1],
            colorDark: this.color[0],
            colorLight: this.color[1],
            correctLevel: QRCode.CorrectLevel.L
        });
        $("qrcode").title = "";
        var children = $('qrcode').childNodes;
        for (var i = 0; i < children.length; ++i) {
            var child = children[i];
            if (child.nodeName.toLowerCase() == "table")
                child.style.margin = '0px';
        }
        this.schedule_poll();
        this.has_qrcode = true;
    },
    update_failure_handler: function() {
        this.error();
    },
    schedule_poll: function(poll_interval) {
        if (!poll_interval)
            poll_interval = this.poll_interval;
        this.timeout_id = setTimeout(this.poll.bind(this), poll_interval);
    },
    poll: function() {
        if (!this.poll_enabled || !this.has_qrcode) {
            this.schedule_poll(500);
            return;
        }
        var success_handler = this.poll_success_handler.bind(this);
        var failure_handler = this.poll_failure_handler.bind(this);
        this.ajax = new Request.JSONP({
            url: this.poll_url,
            callbackKey: 'callback',
            noCache: true,
            timeout: this.timeout,
            onComplete: success_handler,
            onCancel: failure_handler,
            onTimeout: failure_handler
        });
        this.ajax.send();
    },
    poll_success_handler: function(json) {
        switch (parseInt(json.retCode)) {
        case 200:
            this.login();
            break;
        case 404:
            this.update();
            break;
        case 408:
        case 409:
            this.schedule_poll();
            break;
        default:
            this.error();
            break;
        }
    },
    poll_failure_handler: function() {
        this.error();
    },
    get_login_params: function() {
        var login_params = {
            server_name: $("server_name").value,
            server_id: $("server_id").value,
            area_id: $("area_id").value,
            area_name: $("area_name").value
        };
        if ($("equip_id")) {
            login_params.equip_id = $("equip_id").value;
        }
        return login_params;
    },
    login: function() {
        var success_handler = this.login_success_handler.bind(this);
        var failure_handler = this.login_failure_handler.bind(this);
        var url = this.httpurl + "/login_check.py?act=qrcode_login";
        this.ajax = new Request.JSON({
            url: url,
            noCache: true,
            timeout: this.timeout,
            onSuccess: success_handler,
            onException: failure_handler,
            onFailure: failure_handler,
            onError: failure_handler,
            onTimeout: failure_handler
        });
        login_params = this.get_login_params();
        if (login_params["server_id"].length == 0) {
            alert("请选择要登录的服务器");
            return;
        }
        this.ajax.post(login_params);
    },
    login_success_handler: function(json) {
        if (parseInt(json.status) == 1) {
            Cookie.write("cur_servername", encodeURIComponent($("server_name").value));
            window.location = json.msg;
        } else {
            this.error(json.msg);
        }
    },
    login_failure_handler: function() {
        this.error();
    },
    message: function(msg) {
        $('qrcode').innerHTML = "";
        $('qrcode').appendChild(document.createTextNode(msg));
        this.has_qrcode = false;
    },
    error: function(msg) {
        if (msg == null ) {
            msg = "二维码出错 请刷新";
        }
        this.message(msg);
    }
});
var qrcode_login;
function qrcode_login_init(httpurl, httpsurl, other_params) {
    qrcode_login = new QRCodeLogin(httpurl,httpsurl,other_params);
}
function qrcode_manual_update() {
    qrcode_login.manual_update();
}
function qrcode_set_polling_status(enabled) {
    qrcode_login.set_polling_status(enabled);
}
