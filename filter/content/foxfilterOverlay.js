/*
Copyright 2007 E. Dywayne Johnson All Rights Reserved
Email: djohnson@inspiredeffect.com
*/

var foxfilter = {

    //**************************************************************
    //* Init
    //**************************************************************
    init: function() {

        // initialization code
        this.initialized = true;
        document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", function(e) { this.showContextMenu(e); }, false);

        // add event listener for document load event	
        var appcontent = document.getElementById("appcontent");   // browser
        if(appcontent)
        {
          //appcontent.addEventListener("load", this.onPageLoad, true);
          //DOMContentLoaded (undocumented feature) fires before images are loaded	
          //appcontent.addEventListener("DOMContentLoaded", this.onPageLoad, false);   
          //NEW: pageshow allows page back/forward to work correctly  
          appcontent.addEventListener("pageshow", this.onPageLoad, false);     
          
          //IMPORTANT NOTE: listen for DOMContentLoaded AND pageshow so that when user uses back arrow, they don't briefly see blocked content
          //However, the side effect is that the notificationBox is show twice, but works fine
                 
        }	
    
        //add listener for tab events       
        window.getBrowser().addEventListener("TabOpen", this.onTabEvent, false);
        window.getBrowser().addEventListener("TabSelect", this.onTabEvent, false);
       
        //3-30-07 allow user to control
        var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
        var addonsEnabled = prefs.getBoolPref("FoxFilter.addonsEnabled");
        var addonsName = "Add-ons"; 
        var addonsText = "Add-ons (DISABLED by FoxFilter)"; 
        //always insert fake menu item. The menu_disableAddons() function will show/hide as needed
        menu_insertItemBefore(addonsName, addonsText, "color:#b6b6b6;");
        if(addonsEnabled)
            menu_disableAddons(false);
        else    
            menu_disableAddons(true);

      
        var foxfilterEnabled = prefs.getBoolPref("FoxFilter.enabled");
        var whitelistEnabled = prefs.getBoolPref("FoxFilter.whitelistEnabled");
        var ffPanel = document.getElementById('FoxFilterPanel'); 

        //9-3-2007 - using image now for status indicator
        var ffImgStatus = document.getElementById('img-status-foxfilter');        
        if(foxfilterEnabled || whitelistEnabled)
        {
            ffImgStatus.src = "chrome://foxfilter/content/on.gif";
        }
        else
        {
            ffImgStatus.src = "chrome://foxfilter/content/off.gif";
        }
             
    
    },

    //**************************************************************
    //* Init
    //**************************************************************
    showContextMenu: function(event) {
        // show or hide the menuitem based on what the context menu is on
        // see http://kb.mozillazine.org/Adding_items_to_menus
        document.getElementById("context-foxfilter").hidden = gContextMenu.onImage;
    },


    //**************************************************************
    //* Init
    //**************************************************************
    onMenuItemCommand: function(e) {        
        gBrowser.selectedBrowser.contentDocument.location.href='chrome://foxfilter/content/Login.htm';
    },
    
    
    //**************************************************************
    //* Tool bar
    //**************************************************************
    onToolbarButtonCommand: function(e) {
        foxfilter.onMenuItemCommand(e);
    },

    //**************************************************************
    //* Page Load
    //**************************************************************
    onPageLoad: function(aEvent) {    	    
        foxfilter_examineContent(aEvent);	    
    },

    //**************************************************************
    //* Tab Open or Select
    //**************************************************************
    onTabEvent: function(aEvent) {   
        foxfilter_examineContent(aEvent); 
    }
    



};


window.addEventListener("load", function(e) { foxfilter.init(e); }, false);

