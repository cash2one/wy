function to_login()
{
	if (confirm("登录后才能进行该项操作!\n您要登录吗？") == true)
	{
		window.location = login_url;
		return false;	
	}	
	return false;
}

function redirect_query_page()
{
	window.location = query_page_url;	
	return false;
}

function redirect_fair_show_page()
{
	window.location = fair_show_query_url;	
	return false;
}

function deal_no_login()
{
	if ($("top_menu_2").attachEvent)
	{
		if (!use_static_file){
			$("top_menu_1").onclick = ""
			$("top_menu_1").attachEvent("onclick", redirect_query_page);
		}
		$("top_menu_2").onclick = ""
		$("top_menu_2").attachEvent("onclick", to_login);
		$("top_menu_4").onclick = ""
		$("top_menu_4").attachEvent("onclick", to_login);
		$("top_menu_6").onclick = ""
		$("top_menu_6").attachEvent("onclick", redirect_fair_show_page);
        if($('show_my_wtb_link')){
            $('show_my_wtb_link').onclick = "";
            $('show_my_wtb_link').attachEvent("onclick", to_login);
        }
        if($('show_create_wtb_link')){
            $('show_create_wtb_link').onclick = "";
            $('show_create_wtb_link').attachEvent("onclick", to_login);
        }
        if($('show_collect_panel_link')){
            $('show_collect_panel_link').onclick = "";
            $('show_collect_panel_link').attachEvent("onclick", to_login);
        }
	}
	else
	{
		if (!use_static_file){
			$("top_menu_1").onclick = null;
			$("top_menu_1").addEventListener("click", redirect_query_page, false);
		}
		$("top_menu_2").onclick = null;
		$("top_menu_2").addEventListener("click", to_login, false);
		$("top_menu_4").onclick = null;
		$("top_menu_4").addEventListener("click", to_login, false);
		$("top_menu_6").onclick = null;
		$("top_menu_6").addEventListener("click", redirect_fair_show_page, false);	
        if($('show_my_wtb_link')){
            $('show_my_wtb_link').onclick = null;
            $('show_my_wtb_link').addEventListener("click", to_login, false);
        }
        if($('show_create_wtb_link')){
            $('show_create_wtb_link').onclick = null;
            $('show_create_wtb_link').addEventListener("click", to_login, false);
        }
        if($('show_collect_panel_link')){
            $('show_collect_panel_link').onclick = null;
            $('show_collect_panel_link').addEventListener("click", to_login, false);
        }
	}
}

