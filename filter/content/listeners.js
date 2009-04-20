/*
Copyright 2007 E. Dywayne Johnson All Rights Reserved
Email: djohnson@inspiredeffect.com
*/

const STATE_START = Components.interfaces.nsIWebProgressListener.STATE_START;
const STATE_STOP = Components.interfaces.nsIWebProgressListener.STATE_STOP;

var myListener =
{
  QueryInterface: function(aIID)
  {
   if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
       aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
       aIID.equals(Components.interfaces.nsISupports))
     return this;
   throw Components.results.NS_NOINTERFACE;
  },

  onStateChange: function(aProgress, aRequest, aFlag, aStatus)
  {

   if(aFlag & STATE_START)
   {
     // This fires when the load event is initiated
   }
   if(aFlag & STATE_STOP)
   {
     // This fires when the load finishes
   }
   return 0;
  },

  onLocationChange: function(aProgress, aRequest, aURI)
  {
   // This fires when the location bar changes i.e load event is confirmed
   // or when the user switches tabs  
   return 0;
  },

  // For definitions of the remaining functions see XulPlanet.com
  onProgressChange: function() {return 0;},
  onStatusChange: function() {return 0;},
  onSecurityChange: function() {return 0;},
  onLinkIconAvailable: function() {return 0;}
}


var myExt_urlBarListener = {
  QueryInterface: function(aIID)
  {
   if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
       aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
       aIID.equals(Components.interfaces.nsISupports))
     return this;
   throw Components.results.NS_NOINTERFACE;
  },

  onLocationChange: function(aProgress, aRequest, aURI)
  {
      myExtension.processNewURL(aURI);
  },

  onStateChange: function() {},
  onProgressChange: function() {},
  onStatusChange: function() {},
  onSecurityChange: function() {},
  onLinkIconAvailable: function() {}
};

var myExtension = {
  oldURL: null,
  
  init: function() {
  
    // Listen for webpage loads
    gBrowser.addProgressListener(myExt_urlBarListener,
        Components.interfaces.nsIWebProgress.NOTIFY_STATE_DOCUMENT);
  },
  
  uninit: function() {
    gBrowser.removeProgressListener(myExt_urlBarListener);
    
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefBranch);

    //3-30-07 - let user have full control
    //set these when the app closes    
    //if specified then make sure that filtering, at least, is enabled
    //if(prefs.getBoolPref("FoxFilter.autoEnable"))
    //{
    //    prefs.setBoolPref("FoxFilter.enabled", true);
    //    prefs.setBoolPref("FoxFilter.whitelistEnabled", false);
    //}    
    //prefs.setBoolPref("FoxFilter.addonsEnabled", false);
    //prefs.setBoolPref("FoxFilter.aboutConfigEnabled", false);
  },

  processNewURL: function(aURI) {

    if(aURI == null)
        return;
    
    //don't hide page if within FoxFilter mgmt pages
    if(aURI.spec.indexOf("chrome://foxfilter") != -1)
        return;

    //same url
    if (aURI.spec == this.oldURL)
    {
      return;
    }
    
    //if just changing bookmark link on same page - event not triggered in appcontent object
    //http://www.regent.edu:80/acad/schedu/faculty_staff/bios/baker/#contact
    // url changed
    var nURL = aURI.spec;
    var oURL = this.oldURL;
    if(nURL.indexOf("#") != -1)
        nURL = nURL.substring(0, nURL.indexOf("#"));
    if(oURL != null && oURL.indexOf("#") != -1)        
        oURL = oURL.substring(0, oURL.indexOf("#")); 
    if( nURL == oURL)
        return;
           

    //if FoxFilter is enabled, then hide the content on URL change
    //var ffPanel = document.getElementById('FoxFilterPanel');
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefBranch);
                
    var filterEnabled = prefs.getBoolPref("FoxFilter.enabled");
    var whitelistEnabled = prefs.getBoolPref("FoxFilter.whitelistEnabled");
    
    if(filterEnabled || whitelistEnabled)
    {
        //IF URL IS CHANGING, HIDE THE CONTENT. foxfilter_examineContent() will reset to visible  
        foxfilter_setVisible(false);  
    }

    
    
    this.oldURL = aURI.spec;
  }
};


// Edit: for me on Firefox 2.0, I had to change "document" to "window"
// for the following lines to work
window.addEventListener("load", function() {myExtension.init()}, false);
window.addEventListener("unload", function() {myExtension.uninit()}, false);

