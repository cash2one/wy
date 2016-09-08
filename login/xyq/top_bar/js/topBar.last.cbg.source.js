var NieBarLoad = function(){
	var $=function(id){return document.getElementById(id);},
		//大网易product对应值,如果没有则返回域名
		regProduct={
			pet:"cwwg",
			mc:"jlmc",
			dt2:"dtws",
			sg:"sgtx_web",
			zg:"ch",
			ff:"newff",
			pk:"xyw",
			tx3:"tx2"
		},
		isDefined = function(){
			var args =arguments;
			for(var i=0,l=args.length;i<l;i++){
				if(typeof args[i]=="undefined") return false;
			}
			return true;
		},
		productName = typeof nie!="undefined"&&isDefined(nie.config,nie.config.site)?nie.config.site:window.location.href.replace(/^http:\/\/(.*)\.cbg\.163\.com.*$/,'$1'),
		regProductID = isDefined(regProduct[productName])?regProduct[productName]:productName,
		regUrl = encodeURIComponent("http://"+productName+".cbg.163.com"),
		regPage="http://reg.163.com/reg/reg.jsp?product="+regProductID+"&url="+regUrl+"&loginurl="+regUrl;	
			
	//layout	
	$("NIE-topBar").innerHTML = '<div style="display: none;" id="global_tbar_inner">'
		+'<h2><a target="_blank" href="http://nie.163.com/">网易游戏，N多游戏，N多快乐</a></h2>'
		+'<div id="global_game_panel">'
			+'<span id="NIE-topBar-mail">'
				+'<iframe frameborder="0" scrolling="no" id="ifrmNtesMailInfo" border="0" style="width: 123px; height: 30px; vertical-align: middle; margin-left: 5px; margin-top: -8px;" allowtransparency="true" src="http://p.mail.163.com/mailinfo/shownewmsg_forgame_1123.htm"></iframe>'
			+'</span>'
			+'<span id="NIE-plugin"></span>'
			+'<a target="_blank" id="global_gp_reg" href="'+regPage+'">注册帐号</a>'
			+'<a target="_blank" id="global_gp_card" href="http://pay.163.com/index.jsp">购卡充值</a>'
		+'</div>'
		+'<div id="global_game_index">'
			+'<h3>网易游戏全目录</h3>'
			+'<span id="global_game_index_bt">list</span>'
		+'</div>'
		+'<div id="global_gl">'
			+'<div id="global_gl_bg"></div>'
			+'<div class="global_gl_bd">'
				+'<div class="global_gl_box">'
					+'<div class="global_gl_mmo">'
						+'<h4>大型角色扮演游戏</h4>'
						+'<table border="0">'
							+'<tr>'
								+'<td><a style="background-position: 0pt 0pt;" target="_blank" href="http://xyq.163.com/">梦幻西游</a></td>'
								+'<td><a style="background-position: 0pt -682px;" target="_blank" href="http://tx3.163.com/">天下3</a></td>'
							+'</tr>'
							+'<tr>'
								+'<td><a style="background-position: 0pt -100px;" target="_blank" href="http://xy2.163.com/">大话西游Ⅱ</a></td>'
								+'<td><a style="background-position: 0pt -40px;" target="_blank" href="http://ff.163.com/">新飞飞</a></td>'
							+'</tr>'
							+'<tr>'
								+'<td><a style="background-position: 0pt -180px;" target="_blank" href="http://xy3.163.com/">大话西游3</a></td>'
								+'<td><a style="background-position: 0pt -320px;" target="_blank" href="http://qn.163.com/">倩女幽魂</a></td>'
							+'</tr>'
							+'<tr>'
								+'<td><a style="background-position: 0pt -260px;" target="_blank" href="http://pk.163.com/">战歌</a></td>'
								+'<td><a style="background-position: 0pt -560px;" target="_blank" href="http://jl.163.com/">精灵传说</a></td>'
							+'</tr>	'
							+'<tr>'
								+'<td><a style="background-position: 0pt -220px;" target="_blank" href="http://csxy.163.com/">创世西游</a></td>'
								+'<td><a style="background-position: 0pt -300px;" target="_blank" href="http://pet.163.com/">宠物王国</a></td>'
							+'</tr>	'						
							+'<tr>'
								+'<td><a style="background-position: 0pt -20px;" target="_blank" href="http://dt.163.com/">大唐豪侠</a></td>'
								+'<td><a style="background-position:0 -655px;" target="_blank" href="http://wh.163.com/">武魂</a></td>'
							+'</tr>'
							+'<tr>'
								+'<td><a style="background-position: 0pt -120px;" target="_blank" href="http://dtw.163.com/">大唐豪侠外传</a></td>'
								+'<td></td>'
							+'</tr>'					
							+'<tr>'
								+'<td><a style="background-position: 0pt -200px;" target="_blank" href="http://dt2.163.com/">大唐无双</a></td>'
								+'<td></td>'
							+'</tr>'						
						+'</table>'
					+'</div>'
					+'<div class="global_gl_fun">'
						+'<h4>休闲游戏</h4>'
						+'<table border="0">'
							+'<tr>'
								+'<td><a style="background-position: 0pt -580px;" target="_blank" href="http://tk.163.com/">iTown</a></td>'
							+'</tr>'
							+'<tr>'
								+'<td><a style="background-position: 0pt -360px;" target="_blank" href="http://st.163.com/">疯狂石头</a></td>'
							+'</tr>'
							+'<tr>'
								+'<td><a style="background-position: 0pt -160px;" target="_blank" href="http://fj.163.com/">富甲西游</a></td>'
							+'</tr>'
							+'<tr>'
								+'<td><a style="background-position: 0pt -480px;" target="_blank" href="http://ball.163.com/">篮球也疯狂</a></td>'
							+'</tr>'
							+'<tr>'
								+'<td><a style="background-position: 0pt -80px;" target="_blank" href="http://popogame.163.com/">泡泡游戏</a></td>'
							+'</tr>'
							+'<tr>'
								+'<td><a style="background-position: 0pt -280px;" target="_blank" href="http://xyc.163.com/">卡牌对决</a></td>'
							+'</tr>'
						+'</table>'
					+'</div>'
					+'<div class="global_gl_web">'
						+'<h4>网页游戏</h4>'
						+'<table border="0">'
							+'<tr><td><a style="background-position: 0pt -160px;" target="_blank" href="http://rich.163.com/">富甲西游</a></td></tr>'
							+'<tr><td><a style="background-position: 0pt -500px;" target="_blank" href="http://zg.163.com/">战国风云</a></td></tr>'             
							+'<tr><td><a style="background-position: 0pt -540px;" target="_blank" href="http://sg.163.com/">三国天下</a></td></tr>'
						+'</table>'
						+'<h4>战网平台</h4>'
						+'<table border="0">'
							+'<tr><td><a style="background-position: 0pt -340px;" target="_blank" href="http://www.warcraftchina.com/">魔兽世界</a></td></tr>'
							+'<tr><td><a style="background-position: 0pt -60px;" target="_blank" href="http://www.battlenet.com.cn/">战网</a></td></tr>'
						+'</table>'
					+'</div>'
					+'<div class="global_gl_tool">'
						+'<h4>游戏助手</h4>'
						+'<table border="0">'
							+'<tr><td><a class="tpb-tag" target="_blank" href="http://ekey.163.com/">将军令</a></td></tr>'
							+'<tr><td><a class="tpb-tag" target="_blank" href="http://nie.163.com/2007/mibaoka/">密保卡</a></td></tr>'
							+'<tr><td><a class="tpb-tag" target="_blank" href="http://sms.nie.163.com/">帐号通</a></td></tr>'
							+'<tr><td><a class="tpb-tag" target="_blank" href="http://cbg.163.com/">藏宝阁</a></td></tr>'
						+'</table>'
					+'</div>'
					+'<a id="NIE-allgame" target="_blank" href="http://nie.163.com/">了解更多网易游戏</a>'
					+'</div></div></div></div></div>';		
	//funs
	var toggleGameList=function(){
		var objHead = $("global_game_index");
		var btList = $("global_game_index_bt");
		var objList = $("global_gl");
		objHead.onmouseover = show;
		objList.onmouseover = show;
		btList.onclick = switchList;
		objHead.onmouseout = hide;
		objList.onmouseout = hide;
		function show(){
			objList.style.display = "block";
			objHead.style.backgroundPosition='-127px -80px';
			if(objHead.firstChild){objHead.firstChild.style.color='#999';}
		}
		function hide(){objList.style.display = "none"; objHead.style.backgroundPosition='-127px -40px';if(objHead.firstChild){objHead.firstChild.style.color='#3785e7';}}
		function switchList(){
			if(!objList.style.display||objList.style.display=="none") show();
			else hide();
		}
	}

	//action
	toggleGameList();
};
if(window.attachEvent){
	window.attachEvent("onclick", NieBarLoad);
} else {
	window.addEventListener("click", NieBarLoad, false);	
}