/*
Copyright 2007 E. Dywayne Johnson All Rights Reserved
Email: djohnson@inspiredeffect.com
*/

function maskPhrases(CONTENT, goodwords) {

//alert("CONTENT"+CONTENT);
//alert("goodwords"+goodwords);
CONTENT = CONTENT.toLowerCase();
var ndx=0; 
var phrase = "";
	while (ndx < goodwords.length){
       	phrase = goodwords[ndx].toLowerCase();
       	CONTENT = CONTENT.replace( eval("/" + phrase + "/gi") , "***");  
//	alert("kaiten_phrase"+goodwords[0]);       	
//	alert("kaiten_CONTENT"+CONTENT);
	ndx++;
	} 
    return CONTENT; 
}

function foxfilter_examineContent(aEvent)
{

//get prefs
var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

var BAD_WORDS = prefs.getCharPref("FoxFilter.keywords");
	var dot=BAD_WORDS.indexOf(",", 0); 
	var badwords = BAD_WORDS.split(",");
	
var dot2=0;
	for(dot=1;dot<=BAD_WORDS.length;dot++){
	if(BAD_WORDS[dot]==",")
	dot2++;
	}
/*
alert("BADWE:"+BAD_WORDS);
alert("count:"+dot2);
alert("BAD_URL:"+badwords[0]);
*/

var BD_WORDS = "error.html";
var bdwords = BD_WORDS.split(",");


//	alert("badwords_is:"bawords);
var AD_WORDS = "」に関する情報は見つかりませんでした。";
var adwords = AD_WORDS.split(",");

var BA_WORDS = "http://sp.askkids.com//i/askforkids/a10f/reply/e_submit.png";
var bawords = BA_WORDS.split(",");


var PHRASES = prefs.getCharPref("FoxFilter.keywordPhrases");
var phrases = PHRASES.split(",");
    
//var doc = aEvent.originalTarget; // doc is document that triggered "onload" event
//this works for tabs too	これはタブにも働いています。
var doc = gBrowser.selectedBrowser.contentDocument;   
       

//convert to lower case	小文字に変えてください。
	
var url = maskPhrases(doc.location.href.toLowerCase(), phrases);    
    
 
//var BA_WORDS = "<strong>"+url+"</strong>";
//	var bawords = BA_WORDS.split(",");



//parse out http://www.google.com/ and grab the 3rd element as the domain
//出ている http://www.google.com/ を分析してください、そして、ドメインとして3番目の要素をつかんでください。
var urlArray = url.split("/");
var lastDomain = url;
	if(urlArray.length >= 2)
        lastDomain = urlArray[2];
//save as preference for use on Settings page	設定ページにおける使用のための好みを保存
prefs.setCharPref("FoxFilter.lastDomain", lastDomain);
        
    
var filterEnabled = prefs.getBoolPref("FoxFilter.enabled");
var whitelistEnabled = prefs.getBoolPref("FoxFilter.whitelistEnabled");
var examineUrl = prefs.getBoolPref("FoxFilter.examineUrl");
var examineTitle = prefs.getBoolPref("FoxFilter.examineTitle");
var examineMeta = prefs.getBoolPref("FoxFilter.examineMeta");
var examineBody = prefs.getBoolPref("FoxFilter.examineBody");
      
    
var fkey = "";

//if nothing enabled, then jump out		可能にされなかった無さであるなら、飛び出てください
//フィルタリングを無効にする
	if(filterEnabled == false && whitelistEnabled == false)
	{
        foxfilter_setVisible(true);        
        return false;    
	}
	
//ホワイトリストをチェック時
	if(whitelistEnabled)					
	{
		if(url.indexOf("chrome://foxfilter") != -1)
		{
		//if FoxFilter page, then ignore, but set back to visible
		//FoxFilterページであるなら、目に見えることへの後部を無視しますが、設定してください。
		//e.g. in case editing preferences	e.g. ケース編集
		foxfilter_setVisible(true);
		return false;
     	   	}		else		{
			if(isAllowedUrl(url) == false)
			{
	                showAlert(doc, url, "White List", url);
	                return false;
			} 
        	}        
	}
  

//フィルタをONにしているか否か
	if(filterEnabled){
        
        	if(url.indexOf("chrome://foxfilter") != -1){
    	    	//if alert page, then ignore, but set back to visible	
		//ページを警告してください、次に、目に見えることへの後部を無視か設定しなさい
        	foxfilter_setVisible(true);
		return false;
        	}
        //if about:config, check if user has added as URL Exception
	//コンフィグに関して、ユーザがURL Exceptionとして加えたかどうかチェックしてくださいなら
        	else if(url.indexOf("about:config") != -1) {
            		if(prefs.getBoolPref("FoxFilter.aboutConfigEnabled") == false){   
                	fkey = processSection(doc, "URL", url, "about:config");
                		if(fkey != ""){
                    		showAlert(doc, "about:config", "URL", url);
                    		return false;
                		}
            		} 
        	}
        //added 8/7/07
		else if(url.indexOf("chrome://global/content/config.xul") != -1){
			if(prefs.getBoolPref("FoxFilter.aboutConfigEnabled") == false){   
               		fkey = processSection(doc, "URL", url, "chrome://global/content/config.xul");
                		if(fkey != ""){
                    		showAlert(doc, "chrome://global/content/config.xul", "URL", url);
                    		return false;
                		}
			} 
		}




//以下からが作成部分
//examineTitle ORフィルタリングのチェック
//examineMeta Yahoo!きっずのフィルタ
//examineBody キッズgooのフィルタ
//examineUrl Ask kidsのフィルタ

	var home_view=url.indexOf("http://",0);//既存の設定でホームに指定されているホームページを参照出来るようにした
		if(home_view!=0){
		foxfilter_setVisible(true);
		return false;    
		}	

	var and_filter=0;
		if(examineTitle==false){
			if(examineMeta&&examineBody){
			and_filter=1;				//ANDフィルタが有効のときand_filterは1
			}
		}
		if(examineMeta)
		document.cookie="start,"+document.cookie;	//Yahoo!きっずのフィルタがオンのとき

		if(examineUrl)	
		document.cookie="start,"+document.cookie;

		if(badwords[0].length>0)
		document.cookie="start,"+document.cookie;



	var nin=-1;			//ANDとORフィルタ用のフラグ
	var deta_flag=0;
	var u_flag=0;

		if(examineTitle || and_filter==1){
		nin=document.cookie.indexOf("<search\end>",0);	
//フラグが存在すれば−1以外の数字を返す（ANDもしくはORフィルタのときにyahoo!きっずを通ったかのフラグ）
		}							//URLに使えない文字をURLに挿入してあるか問う
	
	
		if(examineMeta)
		var split_word = document.cookie.split(",");		
//Yahoo!きっずのフィルタがオンのときdocument.cookieの内容を「,」で区切る
	
		if(examineUrl)
		var split_word = document.cookie.split(",");		

	

		if(badwords[0].length>0){
		document.cookie="start,"+document.cookie;
		var split_word = document.cookie.split(",");
		}

//alert("kazu;"+badwords.length);
	
	//Yahoo!きっずのフィルタを利用したフィルタリング

		//alert(badwords[0].length);

		if(badwords[0].length==0){		//追加フィルタが入力されているとき
		if(nin==-1){				
//ANDとORフィルタを使用時に一度検索が済んでOKのときもう一度入らないようにしている（次のキッズgooにいくようにしている）
			if(doc.body != null && examineMeta){
			url=doc.location.href;			//ロケーションバーのURLを取得
				if(split_word[1]==url){
				document.cookie="undefined,"+document.cookie;
					if(and_filter==1){			//ANDフィルタ使用時
					document.cookie="<search\end>,"+document.cookie;
					}
					else{	
					foxfilter_setVisible(true);		//表示
					document.cookie="undefined";
					return;				//終わる
					}
				}
				else{
				var url7=split_word[1];
				document.cookie=url+","+document.cookie;
		
				
				url = doc.location.href;
				var gkids1 = new Array("http://search.kids.yahoo.co.jp/bin/search?ei=UTF-8&p=inurl%3A%22");	//表示
				var gkids2 = new Array("%22");									//表示
				var count=0;											//文字列カウント
				var count2=0;											//文字列カウント
				var mBody = maskPhrases(doc.body.innerHTML.toLowerCase(), phrases);				//ソースコード取得
				var url2= new Array();
					var flag3=0;
				
				var url_kensaku=url.indexOf("http://search.kids.yahoo.co.jp/bin/search?ei=UTF-8&p=inurl%3A%22");
					if(url_kensaku != -1){
					var n2=url.indexOf("ei=UTF-8&p=inurl%3A%22",0);
						if(n2==-1){
						foxfilter_setVisible(true);
						document.cookie="defined";
						return;
						}
					var n3=url.indexOf("http://kids.yahoo.co.jp/",0);
						if(n3!=-1){
						foxfilter_setVisible(true);
						document.cookie="defined";
						return;
						}
			
					document.cookie=url+","+document.cookie;
					var mBody = maskPhrases(doc.body.innerHTML.toLowerCase(), phrases);
					var n1 = mBody.indexOf(adwords, 0); 
						if(n1!=-1){	
						//  alert("Yahoo!kids_end");	
						//alert("badwordsあった");
							if(examineTitle){
							document.cookie=url7+","+url7+",<search\end>,"+document.cookie;
							deta_flag=1;
							}	
							else{
							doc.location="chrome://foxfilter/content/Alert.htm";	
							document.cookie="undefined";
							//alert("Yahoo!kids_end");
							return false;
							}        		    	
						}
						else{ 
						//alert("健全サイト");
						document.cookie=url7+","+document.cookie;
						doc.location.href=url7;
						foxfilter_setVisible(true);
						return false;    			
						}					}
					else{
					var split_url = document.cookie.split("/");
					var gkids3 = gkids1.concat(split_url[2]);
					var gkids4 = gkids3.concat(gkids2)
					var gkids5 = gkids4.join("");
						url = gkids5;
   					doc.location.href=gkids5;
					return false;    
					}
					if(examineTitle){
						if(deta_flag==1){
						doc.location.href=url7;
						return false;
						}
					}
				}	
			}		
		}
		
	
	//キッズgooのフィルタを通すフィルタリング
		if(doc.body != null && examineBody){
		//  alert("doc"+document.cookie);
		var url=doc.location.href;
		var split_word;
			if(examineTitle || and_filter==1){
			split_word = document.cookie.split(",");
			}
			if(and_filter==1){
				if(split_word[13]==url){
				document.cookie="undefined";
				foxfilter_setVisible(true);
				return;	
				}
			}
			else if(examineTitle){
				if(split_word[6]==url){
				document.cookie="undefined";
				foxfilter_setVisible(true);
				return;
				}
			}
			else{
				if(document.cookie==url){
				document.cookie="undefined";
				foxfilter_setVisible(true);
				return;
				}
			}		
		
			if(and_filter==1){
			var url7=split_word[3];
			}
			else if(examineTitle){
			var url7=split_word[2];
			}
			else{
			var url7=document.cookie;
			document.cookie=url;
			}
		url = doc.location.href;
		var gkids1 = new Array("http://kids.goo.ne.jp/tool/kgframe.php?BL=0&FM=0&SY=2&MD=2&TP=");	//表示
		var count=0;
		var count2=0;
		var mBody = maskPhrases(doc.body.innerHTML.toLowerCase(), phrases);
		var url2= new Array();
		var flag3=0;
	
			if(url[7] == "k" && url[8] == "i" && url[9] == "d"){
				
			var n2=url.indexOf("?BL=0&FM=0&SY=2&MD=2&TP=",0);
				if(n2==-1){
				foxfilter_setVisible(true);
				document.cookie="defined";
				return;
				}
			var n3=url.indexOf("http://kids.yahoo.co.jp/",0);
				if(n3!=-1){
				foxfilter_setVisible(true);
				document.cookie="defined";
				return;
				}
			
			
			document.cookie=url+","+document.cookie;
			var mBody = maskPhrases(doc.body.innerHTML.toLowerCase(), phrases);	
			var n1 = mBody.indexOf(bdwords, 0); 
						
				if(n1!=-1){	
				document.cookie="undefined";
				doc.location="chrome://foxfilter/content/Alert.htm";
				//  alert("kids_goo_end");
				return false;
				}
				else{ 
					if(and_filter==1){
					document.cookie=url7+","+document.cookie;
					var split_word = document.cookie.split(",");
					var url7=split_word[6];
					doc.location.href=split_word[6];
					}
					else if(examineTitle){
					document.cookie=url7+","+document.cookie;
	
					var kon_url = document.cookie.split("start,");
							
					var kon_url = document.cookie.split(",");
					var url7 = kon_url[0];
					document.cookie=url7+","+document.cookie;
					doc.location.href=url7;
					foxfilter_setVisible(true);　
					return false;
	
	
					}
					else{
					document.cookie=url7;
					u_flag=1;
					}
				}
			}
			else if(url[13] == "k" && url[14] == "i" && url[15] == "d"){}
			else{
				while(count < url.length){
					if(url[count]==":"){
					url2[count2]="%";
					url2[count2+1]="3";
					url2[count2+2]="A";
					count2=count2+2;
					}
					else if(url[count]=="/"){
					url2[count2]="%";
					url2[count2+1]="2";
					url2[count2+2]="F";
					count2=count2+2;
					}
					else{
					url2[count2]=url[count];
					}
				count++;
				count2++;
				}
		
			var url3 = url2.join("");
			var gkids3 = gkids1.concat(url3);
			var gkids5 = gkids3.join("");
				   		
			url = gkids5;
			doc.location.href=gkids5;
			return false;    
			}
		
			if(u_flag==1){
			doc.location.href=url7;
					
			return false;    
			}	
		}







			if(doc.body != null && examineUrl){		//Ask kidsのフィルタ
			url=doc.location.href;			//ロケーションバーのURLを取得
				if(split_word[1]==url){
				document.cookie="undefined,"+document.cookie;
					if(and_filter==1){			//ANDフィルタ使用時
					document.cookie="<search\end>,"+document.cookie;
					}
					else{	
					foxfilter_setVisible(true);		//表示
					document.cookie="undefined";
					return;				//終わる
					}
				}
				else{
				var url7=split_word[1];
				document.cookie=url+","+document.cookie;
		
				
				url = doc.location.href;
				var gkids1 = new Array("http://www.askkids.com/web?q=inurl%3A%22");	//表示
				var gkids2 = new Array("%22");									//表示
				var count=0;											//文字列カウント
				var count2=0;											//文字列カウント
				var mBody = maskPhrases(doc.body.innerHTML.toLowerCase(), phrases);				//ソースコード取得
				var url2= new Array();
					var flag3=0;
				var url_kensaku=url.indexOf("http://www.askkids.com/web?q=");
				
					if(url_kensaku != -1){
					var n2=url.indexOf("web?q=",0);
						if(n2==-1){
						foxfilter_setVisible(true);
						
						//document.cookie="defined";
						return;
						}
					/*var n3=url.indexOf("http://www.askkids.com/",0);
						if(n3!=-1){
						foxfilter_setVisible(true);
						document.cookie="defined";
						return;
						}*/
			
					document.cookie=url+","+document.cookie;
					
					var mBody = maskPhrases(doc.body.innerHTML.toLowerCase(), phrases);
					
					var n1 = mBody.indexOf(bawords, 0); 
						if(n1!=-1){	
							if(examineTitle){
							document.cookie=url7+","+url7+",<search\end>,"+document.cookie;
							deta_flag=1;
							}	
							else{
							doc.location="chrome://foxfilter/content/Alert.htm";	
							document.cookie="undefined";
							return false;
							}        		    	
						}
						else{ 
						document.cookie=url7+","+document.cookie;
						doc.location.href=url7;
						foxfilter_setVisible(true);
						return false;    			
						}					}
					else{
					var split_url = document.cookie.split("/");
					var gkids3 = gkids1.concat(split_url[2]);
					var gkids4 = gkids3.concat(gkids2)
					var gkids5 = gkids4.join("");
						url = gkids5;
   					doc.location.href=gkids5;
					return false;    
					}
					if(examineTitle){
						if(deta_flag==1){
						doc.location.href=url7;
						return false;
						}
					}
				}	
			}		
		}	//追加フィルタ分





	
		

		if(badwords[0].length>0){	//追加フィルタリング
		//alert("ok");
		//return;
		//return false;
		//return 0;
		var flag3=0;
		
		url=doc.location.href;			//ロケーションバーのURLを取得
		//alert("sakakunin:"+split_word);
		//alert(url+",koreto,"+split_word[3]);
			//alert("ok3");
			if(split_word[2]==url){
			//return 0;  
			foxfilter_setVisible(true);		//表示
			document.cookie="undefined";
			//alert("mouowari");
			flag3=1;	//終わる	
			}
			else{
			var url7=split_word[0];
			document.cookie=url+","+document.cookie;
			//alert("document.cookie:"+document.cookie);
			var split_word = document.cookie.split(",");
			//alert("split_word:"+split_word[0]);

			
			var nino=0;
			    for (var i=0; i<document.cookie.length;i++ ) { // 一致しなくなるまで繰り返し。
			     i = document.cookie.indexOf(",", i);    // 検索。
			     	if (i == -1) {
      				break;  // 検索文字がなければループを抜ける。
     				}
     				else {
      				nino++;    // 検索文字があれば一致数を増やす。
     				}
    		             }
			//alert("nino"+nino);
			var kaiketsu=split_word[0].indexOf(url,0);
			
				
			if(kaiketsu!=-1){
			//alert("kire");
				if(nino>5){
			foxfilter_setVisible(true);　
			document.cookie="undefined";
			return false;
			}	
			}
			//alert("kita");
			var nyuryoku=split_word[0].indexOf("http://www.kids-dream.ne.jp/cgi/kids_search/search.cgi?mode=search&page=",0);	
			if(nyuryoku!=-1){			
			var split_word = split_word[0].split("1&sort=mark&word=");
			var split_word = split_word[1].split("%2F");
			
			//alert("haitta"+split_word[0]);
			//alert("tenaoshi"+"href=http://\""+split_word[0]);
			}

			url = doc.location.href;
			var gkids1 = new Array(badwords[0]);	//表示
			var gkids2 = new Array("%2F");									//表示
			var count=0;											//文字列カウント
			var count2=0;											//文字列カウント
			var mBody = maskPhrases(doc.body.innerHTML.toLowerCase(), phrases);				//ソースコード取得
			var url2= new Array();
			var flag3=0;
			var url_kensaku=url.indexOf(badwords[0],0);
			//alert("URL_kensaku"+url_kensaku);
				if(url_kensaku != -1){
				//alert("kakunin:"+"href=\""+url7+"\"");
				var n1 = mBody.indexOf("href=\"http://"+split_word[0], 0); 
					//alert("hantei_n1:"+n1);					
					if(n1==-1){
					//alert("owari");	
					doc.location="chrome://foxfilter/content/Alert.htm";	
					document.cookie="undefined";
					return false;       		    	
					}
					else{ 
					//alert("健全サイト");
					document.cookie="undefined,"+url7+","+document.cookie;
					//alert("健全サイト");
					split_word[0]="http://"+split_word[0]+"/";
					//alert("url"+split_word[0]);
					doc.location.href=split_word[0];
					//alert("健全サイト");
					foxfilter_setVisible(true);
					//alert("健全サイト");
					return 0;    			
					}				}
				else{
				//alert("change");
				var split_url = document.cookie.split("/");
				var gkids3 = gkids1.concat(split_url[2]);
				var gkids4 = gkids3.concat(gkids2)
				var gkids5 = gkids4.join("");
				url = gkids5;
				//alert("gkids5:"+gkids5);
   				doc.location.href=gkids5;
				return false;    	
				}
			} 
		}
	foxfilter_setVisible(true);　
	return false;    
	} //end if filterEnabled	filterEnabledであるなら、終わってください。	
//if it makes it this far, set to visible	それが遠くにそれをこれにするなら、目に見えるのにセットしてください。
foxfilter_setVisible(true);
//otherwise, return true	さもなければ、本当に戻ってください。
return false;    
}



function foxfilter_setVisible(visible)
{	if(visible)
	{
	    gBrowser.selectedBrowser.style.visibility = "visible"; 
	}
	else
    {
    	gBrowser.selectedBrowser.style.visibility = "hidden"; 
    }
    
}


