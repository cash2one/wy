/*
 *
 */

var role_clicked=false;

function login_in_role(roleid)
{
	if (RoleList[roleid]["is_locked"]){
		alert("¸Ã½ÇÉ«²»ÔÊÐíµÇÂ¼²Ø±¦¸ó");
		return false;
	}
	url = CgiRootUrl + '/login.py?act=chose_role&roleid=' + roleid;
	window.location = url;

	Cookie.write("last_login_roleid", roleid, {"duration" : 30});
	Cookie.write("login_user_nickname", encodeURIComponent($("select_role_nickname").innerHTML), {"path":"/"});
}

function get_icon_path(icon)
{
	return ResUrl + '/images/bigface/'+ icon + '.gif';
}

function show_role(roleid)
{
	var role = RoleList[roleid];

/*
	if (LastRoleId == roleid){
		return login_in_role(roleid)
	}
*/

	if ( LastRoleId && $("role_el_" +  LastRoleId)){
		$("role_el_" +  LastRoleId).removeClass("on");
	}
	$("role_el_" + roleid).addClass("on");

	if (LastRoleId == roleid){
			login();
			return;
	}
	LastRoleId = roleid;
	$("select_role_icon").src = get_icon_path(role["icon"]);
	$("select_role_nickname").innerHTML = htmlEncode(role["nickname"]);
	$("select_role_racename").innerHTML = htmlEncode(role["racename"]);
	$("select_role_roleid").innerHTML = roleid;
}

function login()
{
	if ( LastRoleId)
	{
		login_in_role( LastRoleId);
	}
	else
	{
		login_in_role($("select_roleid").value);
	}
}

var PagerNum=6;
function get_page_roles(page_num)
{
	var result = [];
	var check_pos = (page_num - 1) * PagerNum;
	var i = 1;
	for (var roleid in RoleList){
		if ( i > check_pos){
			result.push(RoleList[roleid]);
			if (result.length == PagerNum){
				return result;
			}
		}
		i = i + 1;
	}

	return result;
}

function show_page(page_num)
{
	var role_list = get_page_roles(page_num);
	render_to_replace("role_list_panel", "role_list_templ", {"role_list":role_list, "pager_num": PagerNum});
}

function gen_pager_info()
{
	var ctx = {"item_num":Object.getLength(RoleList), "pager_num" : PagerNum};
	render_to_replace("pager_panel", "pager_templ", ctx);
}

function go_to_bind_phone(){
	location.href = CgiRootUrl + '/bind_phone.py?act=show_bind_phone';
}

//var LastRoleId = null;
function init_page()
{
	clear_old_cookie_var();

	if (Browser.name == "firefox"){
		window.onunload = function(){role_clicked = false;}
		window.onbeforeunload=function(){window.onunload = '';}
	}

	//gen_pager_info()

	show_page(1);

	if ($("role_el_" + LastRoleId)){
		$("role_el_" + LastRoleId).addClass("on");
	}

}

window.addEvent('domready', function() {
    init_page();
});
