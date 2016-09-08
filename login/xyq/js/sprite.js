
var default_val;

function toggle_sprite(){//切换精灵显示函数
	if($("spriteDia").getStyle("display") != "none"){
		$("sprite_btn").removeClass("on");
		$("spriteDia").setStyle('display', 'none');
		Cookie.write('sprite_open', '');
	}else{
		$("sprite_btn").addClass("on");
		$("spriteDia").setStyle('display', 'block');
		Cookie.write('sprite_open', 1, {'duration':30});
	}
	return false;
}


function showQAList(){//显示问答列表函数
	$$("#sprList li")[0].removeClass("on");
	$$("#sprList li")[1].addClass("on");
	$("chat_div").setStyle('display', 'block');
	$("hot_questions").setStyle('display', 'none');
}

function showHot(){//显示热门问题函数
	$$("#sprList li")[0].addClass("on");
	$$("#sprList li")[1].removeClass("on");
	$("chat_div").setStyle('display', 'none');
	$("hot_questions").setStyle('display', 'block');
}

window.addEvent('domready', function(){
	if(!$('sprite_btn'))
		return;

	$("sprite_link").addEvent('click', toggle_sprite);
	$("sprClose").addEvent('click', toggle_sprite);

	$("qaHandler").addEvent('click', function(){showQAList();return false;});//切换问答列表标签
	$("hotHandler").addEvent('click', function(){showHot();return false;});//切换热门问题标签

	$('hot_questions').set('html', '<dl>'+sprite_hotq+'</dl>');
	//输入框事件
	default_val = $("type_box").get("value");
	$("type_box").addEvents({
		focus: function(){
			if(this.get("value") == default_val){
				this.set('value', '');
				this.setStyle('color', "#000000");
			}
		},
		blur: function(){
			if(this.get("value")==""){
				this.set('value', default_val);
				this.setStyle("color","#999999");
			}
		}
	});
	$('idependent_sprite').href = sprite_url;
	if(Cookie.read('sprite_open'))
		toggle_sprite();

	$$('#hot_questions a').each(function(el){
		el.href = "javascript:ask('" + el.get('text') + "')";
	});
		
	close_eval();

	var ask_tips = new AutoComplete($('type_box'),{
        "startPoint" : 1,
        "promptNum" : 20,
        "handle_func" : function(keyword){
			var __this = this;
			var url = 'http://tip.chatbot.nie.163.com/cgi-bin/good_evaluate_question_tip.py'
			new Request.JSONP({
				url: url,
				callbackKey: 'callback',
				data: {
					game: 1,
					prefix: keyword,
					max_num: 10
				},
				onComplete: function(result){
					if(result.success){
						var data = result.data.map(function(v){return '·'+v});
						__this.set_result(data);
					}
				}
			}).send();
		},
        "callback": function(){
			ask();
		}
    });
});

function get_now_time_str(){
	var now = new Date();
	return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.toLocaleTimeString();
}

function ask_for_eval(){
	$('evaluate_panel').setStyle('display', 'block');
	$('ask_eval_mm').setStyle('display', 'block');
	$('eval_good_mm').setStyle('display', 'none');
	$('eval_bad_mm').setStyle('display', 'none');
	//var scroll_size = $('dialog_scroll').getScrollSize();
	//$('dialog_scroll').scrollTo(scroll_size.x, scroll_size.y);
}

function close_eval(){
	$('evaluate_panel').setStyle('display', 'none');
}

function show_eval_good(){
	$('ask_eval_mm').setStyle('display', 'none');
	$('eval_good_mm').setStyle('display', 'block');
	$('eval_bad_mm').setStyle('display', 'none');
}

function show_eval_bad(){
	$('ask_eval_mm').setStyle('display', 'none');
	$('eval_good_mm').setStyle('display', 'none');
	$('eval_bad_mm').setStyle('display', 'block');
}

var all_answer = '';
function add_chat_question(question, is_question, original_size){
	if(is_question){
		tip = '我说';
		question = htmlEncode(question);
	} else
		tip = '精灵回复';
	all_answer += '<dt>'+ tip + '：(' + get_now_time_str() + ')</dt>';
	all_answer += '<dd>' + question + '</dd>';
	$('chat_dialog').set('html', all_answer + '<dd class="my"></dd>');
	if(!is_question){
		scroll_y = original_size.y-90;
		if(scroll_y <= 170)
			scroll_y = 0;
		$('dialog_scroll').scrollTo(original_size.x, scroll_y);
	}
	$$('dd a[name="ask"]').each(function(el){
		el.href = "javascript:ask('" + el.get('text') + "')";
	});
}

// This is a magic number from chatbot system, used in evaluate sprite.
var gameid = 25;

var default_answer = '您好，可能是因为您的问题描述的不够详细';
var max_ques_len = 64;

var ques = '';
var answer = '';
var user = '';

var head = document.head || document.getElementsByTagName('head')[0] || document.documentHead;
function getScript(url, callback){
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.async = 'async';
	script.charset = 'gbk'
	script.src = url;
	script.onload = script.onreadystatechange = function(_, isAbort){
		if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState)){
			script.onload = script.onreadystatechange = null;
			if(head && script.parentNode)
				head.removeChild(script);
			script = undefined;
			if(!isAbort)
				callback(200, 'success');
		}
	};
	head.insertBefore(script, head.firstChild);
}

function ask(question, eval, nolog){
	if(question === undefined)
		question = $('type_box').get('value').trim();
	if(eval === undefined)
		eval = 1;
	ques = question;
	$('type_box').set('value', '');
	$('type_box').setStyle('color', 'black');
	if(ques == '' || ques == default_val)
		alert('问题不能为空！');
	else if(ques.length > max_ques_len)
		alert('问题太长！');
	else{
		showQAList();
		var scroll_size = $('dialog_scroll').getScrollSize();
		add_chat_question(ques, true, scroll_size);
		$('type_box').disabled = true;

		if(user == ''){
			P_INFO = Cookie.read('P_INFO');
			user += 'urs=';
			if(P_INFO)
				user += P_INFO.substring(0, P_INFO.indexOf('|'));
			var roleid = Cookie.read('login_user_roleid') || '';
			roleid = (roleid == null) ? '' : roleid;
			var level = Cookie.read('login_user_level');
			level = (level == null) ? '' : level;
			var server_name = Cookie.read('cur_servername') || '';
			server_name = decodeURIComponent(server_name);
			user += ',hostnum=' + server_name + ',id=' + roleid + ',level=' + level;
		}

		var ask_url = 'http://cbg.chatbot.nie.163.com/cgi-bin/bot.cgi?output=js&user=' + user + '&ques='+ques;
		if(nolog)
			ask_url += '&nolog=1';
		getScript(ask_url, function(response, status){
					$('type_box').disabled = false;
					if(status != 'success'){
						alert('请求出错');
						return;
					}
					if(ROBOT_ANSWER.substring(0, 2) != 'A:'){
						alert('请求出错');
						return;
					}
					answer = ROBOT_ANSWER.substring(2);
					add_chat_question(answer, false, scroll_size);
					if(answer.indexOf(default_answer) != 0 && eval)
						ask_for_eval();
					else
						close_eval();
			});
	}
}

function evaluate_sprite(eval_value){
	if(eval_value == 1)
		show_eval_good();
	else if(eval_value == 0)
		show_eval_bad();
	var request = new Request({
		url : '/cgi-bin/sprite.py',
		onSuccess : function(text, html){
			var res;
			try{
				res = eval('(' + text + ')');
				if(res['status'] != 1)
					alert(res['msg']);
			}catch(e){
				alert(e);
			}
		}
	});
	request.post({question:ques, gameid:gameid, act:'eval', evaluate:eval_value, answer:answer, remarks:user});
}
