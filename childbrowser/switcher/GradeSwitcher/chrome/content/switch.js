function restartApp1() {
  const nsIAppStartup = Components.interfaces.nsIAppStartup;

  // Notify all windows that an application quit has been requested.
  var os = Components.classes["@mozilla.org/observer-service;1"]
                     .getService(Components.interfaces.nsIObserverService);
  var cancelQuit = Components.classes["@mozilla.org/supports-PRBool;1"]
                             .createInstance(Components.interfaces.nsISupportsPRBool);
  os.notifyObservers(cancelQuit, "quit-application-requested", null);

  // Something aborted the quit process. 
  if (cancelQuit.data)
    return;

  // Notify all windows that an application quit has been granted.
  os.notifyObservers(null, "quit-application-granted", null);

  // Enumerate all windows and call shutdown handlers
  var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                     .getService(Components.interfaces.nsIWindowMediator);
  var windows = wm.getEnumerator(null);
  while (windows.hasMoreElements()) {
    var win = windows.getNext();
    if (("tryToClose" in win) && !win.tryToClose())
      return;
  }
  Components.classes["@mozilla.org/toolkit/app-startup;1"].getService(nsIAppStartup)
            .quit(nsIAppStartup.eRestart |nsIAppStartup.eAttemptQuit);
}

function eSwitchLocales_switch(locale, displayName) {
  var prefs = Components.classes["@mozilla.org/preferences-service;1"].
    getService(Components.interfaces.nsIPrefBranch);

  var curLocale = "en-US";

  try {
    curLocale = prefs.getCharPref("general.useragent.locale");
  }
  catch (e) { }

  if (locale != curLocale) {
    prefs.setCharPref("general.useragent.locale", locale);

    var sbs = Components.classes["@mozilla.org/intl/stringbundle;1"].
      getService(Components.interfaces.nsIStringBundleService);
    var brand_sb = sbs.createBundle("chrome://branding/locale/brand.properties");
    var ext_sb = sbs.createBundle("chrome://mozapps/locale/extensions/extensions.properties");
    var shortName = brand_sb.GetStringFromName("brandShortName");
  try {
	var promptStr = ext_sb.
	    formatStringFromName("restartBeforeEnableMessage",
				 [ locale, shortName ], 2);
    }
    catch (e) {
	promptStr = ext_sb.formatStringFromName("dssSwitchAfterRestart",
				[shortName], 1);
    }

    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].
      getService(Components.interfaces.nsIPromptService);
  }

  // Changing Interface
  prefs.getCharPref("general.useragent.locale", locale);

  if(locale == "ja" || locale == "el") {
    prefs.setCharPref("extensions.lastSelectedSkin", "theme12");
    prefs.setBoolPref("extensions.dss.switchPending", true);
  }
  else if(locale == "da" || locale == "sv"){
    prefs.setCharPref("extensions.lastSelectedSkin", "theme34");
    prefs.setBoolPref("extensions.dss.switchPending", true);
  }
  else if(locale == "pl" || locale == "sk"){
    prefs.setCharPref("extensions.lastSelectedSkin", "theme56");
    prefs.setBoolPref("extensions.dss.switchPending", true);
  }
  else if(locale == "et" || locale == "en"){
    prefs.setCharPref("extensions.lastSelectedSkin", "classic/1.0");
    prefs.setBoolPref("extensions.dss.switchPending", true);
  }
  else{
    prefs.setCharPref("extensions.lastSelectedSkin", "classic/1.0");
    prefs.setBoolPref("extensions.dss.switchPending", true);
  }

  // Setting Shortcut Key
  if(locale == "et" || locale=="ko" || locale=="ku" || locale=="en-US"){
    try{
      prefs.clearUserPref("keyconfig.main.bookmarkAllTabsKb");
      prefs.clearUserPref("keyconfig.main.addBookmarkAsKb");
      prefs.clearUserPref("keyconfig.main.focusURLBar");
      prefs.clearUserPref("keyconfig.main.focusURLBar2");
      prefs.clearUserPref("keyconfig.main.goBackKb");
      prefs.clearUserPref("keyconfig.main.goBackKb2");
      prefs.clearUserPref("keyconfig.main.goForwardKb");
      prefs.clearUserPref("keyconfig.main.goForwardKb2");
      prefs.clearUserPref("keyconfig.main.goHome");
      prefs.clearUserPref("keyconfig.main.key_close");
      prefs.clearUserPref("keyconfig.main.key_closeWindow");
      prefs.clearUserPref("keyconfig.main.key_copy");
      prefs.clearUserPref("keyconfig.main.key_cut");
      prefs.clearUserPref("keyconfig.main.key_delete");
      prefs.clearUserPref("keyconfig.main.key_find");
      prefs.clearUserPref("keyconfig.main.key_findAgain");
      prefs.clearUserPref("keyconfig.main.key_findPrevious");
      prefs.clearUserPref("keyconfig.main.key_fullScreen");
      prefs.clearUserPref("keyconfig.main.key_gotoHistory");
      prefs.clearUserPref("keyconfig.main.key_keyconfig");
      prefs.clearUserPref("keyconfig.main.key_newNavigator");
      prefs.clearUserPref("keyconfig.main.key_newNavigatorTab");
      prefs.clearUserPref("keyconfig.main.key_openDownloads");
      prefs.clearUserPref("keyconfig.main.key_openHelp");
      prefs.clearUserPref("keyconfig.main.key_paste");
      prefs.clearUserPref("keyconfig.main.key_redo");
      prefs.clearUserPref("keyconfig.main.key_reload");
      prefs.clearUserPref("keyconfig.main.key_sanitize");
      prefs.clearUserPref("keyconfig.main.key_savePage");
      prefs.clearUserPref("keyconfig.main.key_search");
      prefs.clearUserPref("keyconfig.main.key_search2");
      prefs.clearUserPref("keyconfig.main.key_selectAll");
      prefs.clearUserPref("keyconfig.main.key_stop");
      prefs.clearUserPref("keyconfig.main.key_switchTextDirection");
      prefs.clearUserPref("keyconfig.main.key_textZoomEnlarge");
      prefs.clearUserPref("keyconfig.main.key_textZoomReduce");
      prefs.clearUserPref("keyconfig.main.key_textZoomReset");
      prefs.clearUserPref("keyconfig.main.key_undo");
      prefs.clearUserPref("keyconfig.main.key_undoCloseTab");
      prefs.clearUserPref("keyconfig.main.key_viewInfo");
      prefs.clearUserPref("keyconfig.main.key_viewSource");
      prefs.clearUserPref("keyconfig.main.openFileKb");
      prefs.clearUserPref("keyconfig.main.printKb");
      prefs.clearUserPref("keyconfig.main.viewBookmarksSidebarKb");
      prefs.clearUserPref("keyconfig.main.xxx_key19_cmd_handleBackspace");
      prefs.clearUserPref("keyconfig.main.xxx_key20_cmd_handleShiftBackspace");
      prefs.clearUserPref("keyconfig.main.xxx_key26_Browser:Reload");
      prefs.clearUserPref("keyconfig.main.xxx_key27_Browser:ReloadSkipCache");
      prefs.clearUserPref("keyconfig.main.xxx_key30_Browser:ReloadSkipCache");
      prefs.clearUserPref("keyconfig.main.xxx_key36_cmd_findAgain");
      prefs.clearUserPref("keyconfig.main.xxx_key37_cmd_findPrevious");
      prefs.clearUserPref("keyconfig.main.xxx_key44_cmd_textZoomEnlarge");
    }catch (e) { }
  }
  else if(locale == "ja" || locale == "el" || locale == "da" || locale == "sv"){
      prefs.setCharPref("keyconfig.main.bookmarkAllTabsKb", "!][][");
      prefs.setCharPref("keyconfig.main.addBookmarkAsKb", "!][][");
      prefs.setCharPref("keyconfig.main.focusURLBar", "!][][");
      prefs.setCharPref("keyconfig.main.focusURLBar2", "!][][");
      prefs.setCharPref("keyconfig.main.goBackKb", "!][][");
      prefs.setCharPref("keyconfig.main.goBackKb2", "!][][");
      prefs.setCharPref("keyconfig.main.goForwardKb", "!][][");
      prefs.setCharPref("keyconfig.main.goForwardKb2", "!][][");
      prefs.setCharPref("keyconfig.main.goHome", "!][][");
      prefs.setCharPref("keyconfig.main.key_close", "!][][");
      prefs.setCharPref("keyconfig.main.key_closeWindow", "!][][");
      prefs.setCharPref("keyconfig.main.key_copy", "!][][");
      prefs.setCharPref("keyconfig.main.key_cut", "!][][");
      prefs.setCharPref("keyconfig.main.key_delete", "!][][");
      prefs.setCharPref("keyconfig.main.key_find", "!][][");
      prefs.setCharPref("keyconfig.main.key_findAgain", "!][][");
      prefs.setCharPref("keyconfig.main.key_findPrevious", "!][][");
      prefs.setCharPref("keyconfig.main.key_fullScreen", "!][][");
      prefs.setCharPref("keyconfig.main.key_gotoHistory", "!][][");
      prefs.setCharPref("keyconfig.main.key_keyconfig", "!][][");
      prefs.setCharPref("keyconfig.main.key_newNavigator", "!][][");
      prefs.setCharPref("keyconfig.main.key_newNavigatorTab", "!][][");
      prefs.setCharPref("keyconfig.main.key_openDownloads", "!][][");
      prefs.setCharPref("keyconfig.main.key_openHelp", "!][][");
      prefs.setCharPref("keyconfig.main.key_paste", "!][][");
      prefs.setCharPref("keyconfig.main.key_redo", "!][][");
      prefs.setCharPref("keyconfig.main.key_reload", "!][][");
      prefs.setCharPref("keyconfig.main.key_sanitize", "!][][");
      prefs.setCharPref("keyconfig.main.key_savePage", "!][][");
      prefs.setCharPref("keyconfig.main.key_search", "!][][");
      prefs.setCharPref("keyconfig.main.key_search2", "!][][");
      prefs.setCharPref("keyconfig.main.key_selectAll", "!][][");
      prefs.setCharPref("keyconfig.main.key_stop", "!][][");
      prefs.setCharPref("keyconfig.main.key_switchTextDirection", "!][][");
      prefs.setCharPref("keyconfig.main.key_textZoomEnlarge", "!][][");
      prefs.setCharPref("keyconfig.main.key_textZoomReduce", "!][][");
      prefs.setCharPref("keyconfig.main.key_textZoomReset", "!][][");
      prefs.setCharPref("keyconfig.main.key_undo", "!][][");
      prefs.setCharPref("keyconfig.main.key_undoCloseTab", "!][][");
      prefs.setCharPref("keyconfig.main.key_viewInfo", "!][][");
      prefs.setCharPref("keyconfig.main.key_viewSource", "!][][");
      prefs.setCharPref("keyconfig.main.openFileKb", "!][][");
      prefs.setCharPref("keyconfig.main.printKb", "!][][");
      prefs.setCharPref("keyconfig.main.viewBookmarksSidebarKb", "!][][");
      prefs.setCharPref("keyconfig.main.xxx_key19_cmd_handleBackspace", "!][][");
      prefs.setCharPref("keyconfig.main.xxx_key20_cmd_handleShiftBackspace", "!][][");
      prefs.setCharPref("keyconfig.main.xxx_key26_Browser:Reload", "!][][");
      prefs.setCharPref("keyconfig.main.xxx_key27_Browser:ReloadSkipCache", "!][][");
      prefs.setCharPref("keyconfig.main.xxx_key30_Browser:ReloadSkipCache", "!][][");
      prefs.setCharPref("keyconfig.main.xxx_key36_cmd_findAgain", "!][][");
      prefs.setCharPref("keyconfig.main.xxx_key37_cmd_findPrevious", "!][][");
      prefs.setCharPref("keyconfig.main.xxx_key44_cmd_textZoomEnlarge", "!][][");
    }
  else{}

  restartApp1();

}

function eSwitchLocales_load(menu) {
  var prefs = Components.classes["@mozilla.org/preferences-service;1"].
    getService(Components.interfaces.nsIPrefBranch);
  var curLocale = "en-US";
  try {
    curLocale = prefs.getCharPref("general.useragent.locale");
  }
  catch (e) { }

  var cr = Components.classes["@mozilla.org/chrome/chrome-registry;1"]
    .getService(Components.interfaces.nsIToolkitChromeRegistry);

  var sbs = Components.classes["@mozilla.org/intl/stringbundle;1"].
    getService(Components.interfaces.nsIStringBundleService);
  var langNames = sbs.createBundle("chrome://global/locale/languageNames.properties");
  var regNames  = sbs.createBundle("chrome://global/locale/regionNames.properties");

  /* clear the existing children */
  var children = menu.childNodes;
  for (var i = children.length; i > 0; --i) {
    menu.removeChild(children[i - 1]);
  }

  var locales = cr.getLocalesForPackage("global");
  
/*tsuika*/
var zl = new Array(50);
var zd = new Array(50);
var i = 0;

  while (locales.hasMore()) {
    var locale = locales.getNext();

    var parts = locale.split(/-/);

    var displayName;
    try {
      displayName = langNames.GetStringFromName(parts[0]);
      if (parts.length > 1) {
        try {
          displayName += " (" + regNames.GetStringFromName(parts[1].toLowerCase()) + ")";
        }
        catch (e) {
          displayName += " (" + parts[1] + ")";
        }
      }
    }
    catch (e) {
      displayName = locale;
    }
/*tsuika*/
zl[i] = locale;
zd[i] = displayName;
i++;
}
for(var t=0;t<i-1;t++){
for(var k=0;k<i-t-1;k++){
if(zd[k]<zd[k+1]){
var u =zd[k+1];
zd[k+1]=zd[k];
zd[k]=u;
u=zl[k+1];
zl[k+1]=zl[k];
zl[k]=u;
}
}
}

/*tsuika*/
while(i > 0){
i--;
locale=zl[i];
    var item = document.createElement("menuitem");
    item.setAttribute("value", zl[i]);
    item.setAttribute("label", zd[i]);
    item.setAttribute("name", "eLocaleSwitch");
    item.setAttribute("type", "radio");
    if (curLocale == locale) {
      item.setAttribute("checked", "true");
    }
    item.setAttribute("oncommand", "eSwitchLocales_switch(\"" + zl[i] + "\", \"" + zd[i] + "\")");

    menu.appendChild(item);
  }
}
