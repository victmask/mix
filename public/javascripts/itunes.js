/*
 Viktoryia Maskevich
vmaskevi@my.smccd.edu
CIS 114
itunes.js
Assign 6
04/21/2011*/
// global flags
var isIE = (new RegExp('internet explorer','gi')).test(navigator.appName);
var isO = (new RegExp('opera','gi')).test(navigator.appName);
var isFF = (new RegExp('netscape|firefox','gi')).test(navigator.appName);
var isSF = (new RegExp('safari','gi')).test(navigator.appVersion);

// global request and XML document objects
var req;

// retrieve XML document (reusable generic function);
// parameter is URL string (relative or complete) to
// an .xml file whose Content-Type is a valid XML
// type, such as text/xml; XML source must be from
// same domain as HTML file
function loadXMLDoc(url) {
	req =null;
	try
  	{
  	// Firefox, Opera 8.0+, Safari
  		req = new XMLHttpRequest();
  	}
	catch (e)
  	{
  		// Internet Explorer
  		try
    		{
    			req = new ActiveXObject("Msxml2.XMLHTTP");
			isIE = true;
      	}
		catch (e)
      	{
    			req = new ActiveXObject("Microsoft.XMLHTTP");
			if( req ) isIE = true;
   		}
  	}
	if( req ) {
            req.onreadystatechange = processReqChange;
            req.open("GET", url, true);
            isFF ? req.send(null) : req.send();
     } else alert( "No XMLHttp object!" );
}

// handle onreadystatechange event of req object
function processReqChange() {
    // only if req shows "loaded"
    if (req.readyState == 4) {
        // only if "OK"
        if (req.status == 200) {
            clearTopicList();
            buildTopicList();
         } else {
            alert("There was a problem retrieving the XML data:\n" +
                req.statusText);
         }
    }
}

// invoked by "Category" select element change;
// loads chosen XML document, clears Topics select
// element, loads new items into Topics select element
function loadDoc(evt) {
    // equalize W3C/IE event models to get event object
    evt = (evt) ? evt : ((window.event) ? window.event : null);
    if (evt) {
        // equalize W3C/IE models to get event target reference
        var elem = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
        if (elem) {
            try {
                if (elem.selectedIndex > 0) {
                    loadXMLDoc(elem.options[elem.selectedIndex].value);
                }	
            }
            catch(e) {
                var msg = (typeof e == "string") ? e : ((e.message) ? e.message : "Unknown Error");
                alert("Unable to get XML data:\n" + msg);
                return;
            }
        }
    }
}

// retrieve text of an XML document element, including
// elements using namespaces
function getElementTextNS(prefix, local, parentElem, index) {

     var result = "";
     if (prefix && isO) { // Opera's way of handling namespaces
        result = parentElem.getElementsByTagName(local)[index];
     }
     else if (prefix && isSF) {
        // Safari's way of handling namespaces
        result = parentElem.getElementsByTagName(local)[index];
     }
     else if (prefix && (isIE || isFF)) {
        // IE/Firefox way of handling namespaces
        result = parentElem.getElementsByTagName(prefix + ":" + local)[index];
     } 
     else if (prefix) {  // prefix not covered above
        result = parentElem.getElementsByTagName(local)[index];

     }  else  {
        // the namespace versions of this method 
        // (getElementsByTagNameNS()) operate
        // differently in Safari and Mozilla, but both
        // return value with just local name, provided 
        // there aren't conflicts with non-namespace element
        // names
        result = parentElem.getElementsByTagName(local)[index];
     }
     if (result) {
        // get text, accounting for possible
        // whitespace (carriage return) text nodes 
        if (result.childNodes.length > 1) {
            return result.childNodes[1].nodeValue;
        } else {
            return result.firstChild.nodeValue;    		
        }
     } else return "n/a";
}

// empty Topics select list content
function clearTopicList() {
    var select = document.getElementById("topics");
    while (select.length > 0) {
        select.remove(0);
    }
}

// add item to select element the less
// elegant, but compatible way.
function appendToSelect(select, value, content) {
    var opt;
    opt = document.createElement("option");
    opt.value = value;
    opt.appendChild(content);
    select.appendChild(opt);
}

// fill Topics select list with items from
// the current XML document
function buildTopicList() {
    var select = document.getElementById("topics");
    var items = req.responseXML.getElementsByTagName("item");
    // loop through <item> elements, and add each nested
    // <title> element to Topics select element
    for (var i = 0; i < items.length; i++) {
        appendToSelect(select, i,
            document.createTextNode(getElementTextNS("", "title", items[i], 0)));
    }
    // clear detail display
    document.getElementById("details").innerHTML = "";
}

// display details retrieved from XML document
function showDetail(evt) {
    evt = (evt) ? evt : ((window.event) ? window.event : null);
    var item, content, div;
    if (evt) {
        var select = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
        if (select && select.options.length > 1) {
            // copy <content:encoded> element text for
            // the selected item
            item = req.responseXML.getElementsByTagName("item")[select.value];
            content = getElementTextNS("content", "encoded", item, 0);
            div = document.getElementById("details");
            div.innerHTML = "";
            // blast new HTML content into "details" <div>
            div.innerHTML = content;
        }
    }
}