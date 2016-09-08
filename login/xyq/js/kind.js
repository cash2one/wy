function show_child(node)
{        
	if(node.collapsed)
	{
		node.panel.style.display = "block";;
		node.tree_ctrl.src = "http://res.xyq.cbg.163.com/images/reduce_item.gif";
		node.collapsed = false;
	}
	else
	{
		node.panel.style.display = "none";
		node.tree_ctrl.src = "http://res.xyq.cbg.163.com/images/add_item.gif";
		node.collapsed = true;
	}   
}

function get_el_class(tree_depth)
{
	if (tree_depth <= 1)
	{
		return "first_item";
	}
	else if (tree_depth == 2)
	{
		return "sec_item";
	}
	else if (tree_depth == 3)
	{
		return "third_item";
	}
	else
	{
		return "four_item";
	}
}

function get_el_selected_class(tree_depth)
{
	if (tree_depth <= 1)
	{
		return "first_v_item";
	}
	else if (tree_depth == 2)
	{
		return "sec_v_item";
	}
	else if (tree_depth == 3)
	{
		return "third_v_item";
	}
	else
	{
		return "four_v_item";
	}
}

function append_child_el(obj, tag, attrs)
{
	
	tag = tag || 'DIV';
	var node = document.createElement(tag);
	
	if(attrs) for(var an in attrs)
	{
		node[an] = attrs[an];
	}
	obj.appendChild(node, obj.firstChild);
	return node;
}	


function gen_node(panel, has_child, kind_id, kind_name, func, depth)
{
	var node = append_child_el(panel, "div", {"class" : get_el_class(depth)});
	node.name = append_child_el(node, "p", {"id":("k" + kind_id)}); 

	node.has_child = has_child;
	if(node.has_child)
	{
		node.tree_ctrl = append_child_el(node.name, 'img', {src: 'http://res.xyq.cbg.163.com/images/reduce_item.gif'});
		if (node.tree_ctrl.attachEvent)
		{
			node.tree_ctrl.attachEvent('onclick', function() { show_child(node); } );
		}
		else
		{
			node.tree_ctrl.addEventListener('click', function() { show_child(node); }, false );
		}
		node.collapsed = false;
	}


	node.name.className = get_el_class(depth);
	kind_link = append_child_el(node.name, "a", {"href":'javascript:{' + func + '(' + kind_id +','+ depth +');}'});
	if (depth >= 3)
	{
		kind_link.className = "blue_a_other";
	}

	if (node.tree_ctrl)
	{
		kind_link.innerHTML =  kind_name;
	}
	else
	{
		kind_link.innerHTML =  "&nbsp;" + kind_name;
	}

	node.panel =  append_child_el(node);
	node.panel.style.display = "block";
	
	return node
}
function gen_kind_tree(panel, kind_tree, func, tree_depth)
{
	
	for (var i=0; i< kind_tree.length; i++)
	{
		var childs = kind_tree[i][1];
		var kind_node = gen_node(panel, childs.length, kind_tree[i][0][0], kind_tree[i][0][1], func, tree_depth);

		// gen child kind
		if (childs.length != 0)
		{
			gen_kind_tree(kind_node.panel, childs, func, tree_depth + 1);
		}
	}
	
}
