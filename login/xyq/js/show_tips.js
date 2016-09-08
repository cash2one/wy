if (!String._FORMAT_SEPARATOR){
	String._FORMAT_SEPARATOR = String.fromCharCode(0x1f);
	String._FORMAT_ARGS_PATTERN = new RegExp('^[^' + String._FORMAT_SEPARATOR + ']*'
			+ new Array(100).join('(?:.([^' + String._FORMAT_SEPARATOR + ']*))?'));
}
if (!String.format){
	String.format = function (s) {
		return Array.prototype.join.call(arguments, String._FORMAT_SEPARATOR).
			replace(String._FORMAT_ARGS_PATTERN, s);
	}
}
if (!''.format){
	String.prototype.format = function () {
	return (String._FORMAT_SEPARATOR +
			Array.prototype.join.call(arguments, String._FORMAT_SEPARATOR)).
			replace(String._FORMAT_ARGS_PATTERN, this);
	}
}

function execJS(node)
{
  var bSaf = (navigator.userAgent.indexOf('Safari') != -1);
  var bOpera = (navigator.userAgent.indexOf('Opera') != -1);
  var bMoz = (navigator.appName == 'Netscape');

  if (!node) return;

  // IE wants it uppercase 
  var st = node.getElementsByTagName('script');
  
  var strExec;
	    
  for(var i=0;i<st.length; i++)
  {
    if (bSaf) {
      strExec = st[i].innerHTML;
      st[i].innerHTML = "";
    } else if (bOpera) {
      strExec = st[i].text;
      st[i].text = "";
    } else if (bMoz) {
      strExec = st[i].textContent;
      st[i].textContent = "";
    } else {
      strExec = st[i].text;
      st[i].text = "";
    }


    try {
      var x = document.createElement("script");
      x.type = "text/javascript";

      // In IE we must use .text! 
      if ((bSaf) || (bOpera) || (bMoz))
        x.innerHTML = strExec;
      else x.text = strExec;

      document.getElementsByTagName("head")[0].appendChild(x);
    } catch(e) {
      alert(e);
    }
  }
};

// put the simple setting here for convenient
// just for load less js file
function show_tips(tips_el_id, storage_type, equipid)
{
	var tips = $(tips_el_id);
	tips.style.display = "block";
	if (storage_type == StorageTypeEquip || storage_type == StorageTypeMoney)
	{
		var content_height = $("div_window1_" + equipid).offsetHeight;
		if (content_height < 130)
		{
			content_height = 130;
		}
		$("div_show_window1_" + equipid).style.height = content_height + 36 + "px";
		$("div_show_window_in1_" + equipid).style.height = content_height + 30 + "px";
	}
	var tips_position = getAbsolutePos(tips);
	var tips_y = tips_position.y + tips.offsetHeight;
	
	if (!tips.origin_top)
	{
		tips.origin_top  = tips_position.y;
		tips.origin_left = tips_position.x;
	}
	
	var windowHeight;
	if (self.innerHeight) 
	{ 
		windowHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) 
	{ 
		windowHeight = document.documentElement.clientHeight;
	} else if (document.body) 
	{
		windowHeight = document.body.clientHeight;
	}
	var test_position = tips.origin_top - 65 - document.getScroll().y - (windowHeight/2); 
	var tips_offset_down = tips.origin_top + 40 + tips.offsetHeight - document.getScroll().y - windowHeight;

	var tips_offset_up = document.getScroll().y - (tips.origin_top - tips.offsetHeight -130);
	if (test_position > 0) // down of winHeight/2
	{
		if (tips_offset_up > 0)
		{
			tips.style.top = tips.origin_top - tips.offsetHeight - 130 + tips_offset_up + 20 + "px";
		}
		else
		{
			tips.style.top = tips.origin_top - tips.offsetHeight - 130 + "px"; 
		}
	}
	else
	{
		if (tips_offset_down > 0)
		{
			tips.style.top = tips.origin_top - tips_offset_down + "px"; 
		}
		else
		{
			tips.style.top = tips.origin_top + "px";
		}
	}

	if (document.all == undefined)
	{
		tips.style.left = tips.origin_left + "px";
	}
	
}

function hidden_tips(tips_el_id)
{
	$(tips_el_id).style.display = "none";	
}
 
function get_pet_attrs_info(pet_desc){
	pet_desc = correct_pet_desc(pet_desc);
	var attrs = pet_desc.split(";");
	
	var attrs_info = {

		pet_name           : attrs[0],
		pet_grade          : attrs[2],
		blood              : attrs[3],
		magic              : attrs[4],
		attack             : attrs[5],
		defence            : attrs[6],
		speed              : attrs[7],
		soma               : attrs[9],
		magic_powner       : attrs[10],
		strength           : attrs[11],
		endurance          : attrs[12],
		smartness          : attrs[13],
		potential          : attrs[14],
		wakan              : attrs[15],
		max_blood          : attrs[16],
		max_magic          : attrs[17],
		lifetime           : parseInt(attrs[18], 10) >= 65432 ? "永生" : attrs[18],
		five_aptitude      : attrs[19],
		attack_aptitude    : attrs[20],
		defence_aptitude   : attrs[21],
		physical_aptitude  : attrs[22],
		magic_aptitude     : attrs[23],
		speed_aptitude     : attrs[24],
		avoid_aptitude     : attrs[25],
		growth             : parseInt(attrs[26], 10)/1000,
		all_skill          : attrs[27],
		sp_skill           : attrs[28]
	};	
	return attrs_info;

};

function get_tips_template(template_source){
	return template_source.replace("<!--", "").replace("-->", "");
}

// gen pet tips html
function gen_pet_tips_html(equipid, big_img_root,  equip_face_img, pet_skill_url, pet_desc, pet_name){
var pet_attrs = get_pet_attrs_info(pet_desc);
var template  = get_tips_template($("pet_tips_template").innerHTML);  

var result = template.format(equipid, big_img_root,equip_face_img, pet_name, pet_attrs.pet_grade, pet_attrs.attack_aptitude, 

pet_attrs.defence_aptitude, pet_attrs.physical_aptitude, pet_attrs.magic_aptitude, pet_attrs.speed_aptitude, pet_attrs.avoid_aptitude, pet_attrs.lifetime, pet_attrs.growth, equipid, equipid, pet_attrs.blood,pet_attrs.max_blood, 

pet_attrs.soma, pet_attrs.magic, pet_attrs.max_magic, pet_attrs.magic_powner, pet_attrs.attack, pet_attrs.strength, pet_attrs.defence, pet_attrs.endurance, pet_attrs.speed, pet_attrs.smartness, pet_attrs.wakan, pet_attrs.potential, equipid, equipid, 

pet_attrs.five_aptitude, equipid, equipid,equipid, pet_attrs.all_skill, pet_attrs.sp_skill, pet_skill_url, equipid);

return result;
}

// gen equip tips html
function gen_equip_tips_html(equipid, equip_name, equip_desc, equip_type_desc, big_img_root, equip_face_img, pet_skill_url){	
	var template = get_tips_template($("equip_tips_template").innerHTML);
	var result = template.format(equipid, big_img_root, equip_face_img, equip_name, equip_type_desc, equip_desc);
	return result;
}

function get_role_kind(role_kind_id){
	var role_kind_id = parseInt(role_kind_id);
	return get_role_iconid(role_kind_id); 
}
function gen_role_tips_html(equipid, prefix){
	if(prefix == undefined)
		prefix = '';
	var raw_info = $("large_equip_desc_" + equipid + prefix).value.trim();
	var role_info = js_eval( lpc_2_js(raw_info) );
	

	var school_name = school_name_info[ parseInt(role_info["iSchool"]) ];
	if (!school_name){
		school_name = "";
	}

	var role_icon_value = get_role_kind(role_info["iIcon"]);
	role_kind = role_icon_value % 12;
	role_kind = role_kind == 0 ? 12:role_kind;
	var role_kind_name = role_kind_info[role_kind];

	var icon_src = "http://res.xyq.cbg.163.com/images/bigface/" + role_icon_value + ".gif";

	var context = {
			"equipid"    : equipid,
			"nickname"   : role_info["cName"],
			"role_id"    : role_info["usernum"],
			"kind"       : role_kind_name,
			"school"     : school_name,
			"role_icon"  : icon_src,
			"role_level" : role_info["iGrade"] 
	}
	var role_tips_template = new Template();
	var panel_id = "tips_container_" + equipid + prefix;
	var templ_id = "role_tips_template";
	return role_tips_template.render(templ_id, context);
}

// gen tips 
function generate_tips(equipid, equip_name, equip_type_desc, equip_face_img, big_img_root, pet_skill_url, storage_type, prefix){
	if(prefix == undefined)
		prefix = '';
	var tips_panel_id = "tips_panel_" + equipid;
	var panel_obj     = $( tips_panel_id );
	if (panel_obj){		
		show_tips(tips_panel_id, storage_type, equipid)
		return;
	}
	
	var tips_container = "tips_container_" + equipid + prefix;
	var equip_desc = $("large_equip_desc_" + equipid + prefix).value.trim();
	var maker = equip_desc.lastIndexOf('#W制造者：');
	if(maker != -1){
		end = equip_desc.indexOf('#', maker+1);
		equip_desc = equip_desc.substring(0, maker) + equip_desc.substring(end+4);
	}
	// is pet
	if (storage_type == StorageTypePet){
		$(tips_container).innerHTML = gen_pet_tips_html(equipid, big_img_root,  equip_face_img, pet_skill_url, equip_desc, equip_name);
		execJS($(tips_container));
	}
	// is normal equip or money
	else if (storage_type == StorageTypeEquip || storage_type == StorageTypeMoney){
		$(tips_container).innerHTML = gen_equip_tips_html(equipid, equip_name, parse_style_info(equip_desc), equip_type_desc, big_img_root, equip_face_img, pet_skill_url);
		show_tips(tips_panel_id, storage_type, equipid);
		return;
	}
	else if (storage_type == StorageTypeRole){
		$(tips_container).innerHTML = gen_role_tips_html(equipid, prefix);
	}
	
	show_tips(tips_panel_id, storage_type, equipid);
	return;
}


function set_role_icon(equipid, storage_type, prefix){
	if (storage_type != StorageTypeRole){
		return;
	}
	if(prefix == undefined)
		prefix = '';
	var raw_info = $("large_equip_desc_" + equipid + prefix).value.trim();
	var role_info = js_eval( lpc_2_js(raw_info) );
	$("equip_small_img_" + equipid + prefix).src = "http://res.xyq.cbg.163.com/images/role_icon/small/" + get_role_kind(role_info["iIcon"]) + ".gif";
}

