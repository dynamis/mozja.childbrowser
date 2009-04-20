/*
Copyright 2007 E. Dywayne Johnson All Rights Reserved
Email: djohnson@inspiredeffect.com
*/



function menu_show(menuName, mode)
{
  
	var menu = Components.classes["@mozilla.org/appshell/window-mediator;1"].
		getService(Components.interfaces.nsIWindowMediator).
		getMostRecentWindow("navigator:browser").
		document.getElementById("sanitizeItem").parentNode;

	var node;
	

	
	for (var i = 0; i < menu.childNodes.length; i++) 
	{
		node = menu.childNodes.item(i);			
		if(node.getAttribute("label") == menuName) //e.g. "Add-ons"
		{
            //REF: These are the node object's properties   		
		    //node.tagName
		    //node.getAttribute("label")
		    //node.id		

		    node.setAttribute("hidden", !mode)	    	    		
  		        
		    
		    break;
		}			
	}

}

function menu_insertItemBefore(node_name, new_node_name, style)
{  
	var menu = Components.classes["@mozilla.org/appshell/window-mediator;1"].
		getService(Components.interfaces.nsIWindowMediator).
		getMostRecentWindow("navigator:browser").
		document.getElementById("sanitizeItem").parentNode;

	var node;
	var addonNode;
	
    //find the Add-Ons menuitem
	for (var i = 0; i < menu.childNodes.length; i++) 
	{	
     	node = menu.childNodes.item(i);			

		if(node.getAttribute("label") == node_name) //e.g. "Add-ons"
		{
    		addonNode = menu.childNodes.item(i);		
        }
    }
    
    // create new menuitem
    var newNode = document.createElement("menuitem");
    //menu.appendChild(mitem); //appends to end of list

    //insert a FAKE Add-ons link
    menu.insertBefore(newNode, addonNode);

    newNode.setAttribute("label", new_node_name);    		
    newNode.setAttribute("style", style);	
    
}



function menu_disableAddons(mode)
{  
	var menu = Components.classes["@mozilla.org/appshell/window-mediator;1"].
		getService(Components.interfaces.nsIWindowMediator).
		getMostRecentWindow("navigator:browser").
		document.getElementById("sanitizeItem").parentNode;

	var node;
	var addonNode;
	var fakeNode;
	
    var addonsName = "Add-ons"; //document.getElementById("foxfilter-strings").getString("addonsName");
    var addonsText = "Add-ons (DISABLED by FoxFilter)"; //document.getElementById("foxfilter-strings").getString("addonsText");

	
    //find the Add-Ons menuitem
	for (var i = 0; i < menu.childNodes.length; i++) 
	{	
     	node = menu.childNodes.item(i);			
     	
     	//alert(node.getAttribute("label"));

		if(node.getAttribute("label") == addonsName) //e.g. "Add-ons"
		{
    		addonNode = menu.childNodes.item(i);		
        }
        if(node.getAttribute("label") == addonsText) //"Add-ons (DISABLED by FoxFilter)") 
		{
    		fakeNode = menu.childNodes.item(i);		
        }
    }
    
   
   
    // THIS DOES NOT WORK    
	//node.setAttribute("disabled", true);
    //turn off, but may reset below
    addonNode.setAttribute("hidden", mode);
    fakeNode.setAttribute("hidden", !mode);		    		


    //alert(fakeNode.getAttribute("label"));

    
}


