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
var lastSelectedElem;
// global request and XML document objects
//var request;


window.onload = function(){
    var i;
    var categoryList = document.getElementsByClassName("category");

    for (i = 0; i < categoryList.length; i++) {

        categoryList[i].onclick = function(e) {
            loadDoc(e);
            changeSelectedElem(e.target);
            return false;
        };
    }

//    fireEvent(categoryList[0].childNodes[0], "click");
    fireEvent(categoryList[0], "click");

}


// retrieve XML document (reusable generic function);
// parameter is URL string (relative or complete) to
// an .xml file whose Content-Type is a valid XML
// type, such as text/xml; XML source must be from
// same domain as HTML file
function loadXMLDoc(url) {
        // Send the Ajax request to load the new feed content
        ajaxSendRequest("GET", "itunesxml?rssurl="+encodeURIComponent(url), processReqChange, 'application/xml');
//        return false;

//	request =null;
//	try
//  	{
//  	// Firefox, Opera 8.0+, Safari
//  		request = new XMLHttpRequest();
//  	}
//	catch (e)
//  	{
//  		// Internet Explorer
//  		try
//    		{
//    			request = new ActiveXObject("Msxml2.XMLHTTP");
//			isIE = true;
//      	}
//		catch (e)
//      	{
//    			request = new ActiveXObject("Microsoft.XMLHTTP");
//			if( request ) isIE = true;
//   		}
//  	}
//	if( request ) {
//            request.onreadystatechange = processReqChange;
//            request.open("GET", url, true);
//            isFF ? request.send(null) : request.send();
//     } else alert( "No XMLHttp object!" );
}

// handle onreadystatechange event of request object
function processReqChange() {
    // only if request shows "loaded"
    if (request.readyState == 4) {
        // only if "OK"
        if (request.status == 200) {
            clearTopicList();
            buildTopicList();

         } else {
            alert("There was a problem retrieving the XML data:\n" +
                request.statusText);
         }
    }
    ajaxUpdateState();
}

function changeSelectedElem(selectedElem){
    if (lastSelectedElem){
         lastSelectedElem.className = lastSelectedElem.className.replace(/ selected/, "");
    }
    selectedElem.className = selectedElem.className + ' selected';
    lastSelectedElem = selectedElem;

}

// invoked by "Category" select element change;
// loads chosen XML document, clears Topics select
// element, loads new items into Topics select element
function loadDoc(evt) {
    document.getElementById("details").innerHTML = "Loading...";

    // equalize W3C/IE event models to get event object
    evt = (evt) ? evt : ((window.event) ? window.event : null);
    if (evt) {
        // equalize W3C/IE models to get event target reference
        var elem = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
        if (elem) {
            try {
                elem.href = elem.getAttribute('href');
                loadXMLDoc(elem.href);
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
    var items = request.responseXML.getElementsByTagName("entry");
    if (items.length == 0){
         items = request.responseXML.getElementsByTagName("item");
    }
    // loop through <item> elements, and add each nested
    // <title> element to Topics select element
    for (var i = 0; i < items.length; i++) {
        appendToSelect(select, i,
            document.createTextNode(getElementTextNS("", "title", items[i], 0)));
        if (i == 0){
            select.options[i].selected = true;
            showDetailsContent(select.options[i].value);
        }
    }

    // clear detail display
//    document.getElementById("details").innerHTML = "";

}



// display details retrieved from XML document
function showDetailsContent(selectValue) {
    var item, content, div;

    item = request.responseXML.getElementsByTagName("entry")[selectValue];
    content = getElementTextNS("", "content", item, 0);

    if (!item) {
        item = request.responseXML.getElementsByTagName("item")[selectValue];
        content = getElementTextNS("content", "encoded", item, 0);

    }

    div = document.getElementById("details");
    div.innerHTML = "";
    // blast new HTML content into "details" <div>
    div.innerHTML = content;
}
function showDetail(evt) {
    evt = (evt) ? evt : ((window.event) ? window.event : null);
    if (evt) {
        var select = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
        if (select && select.options.length > 0) {
            // copy <content:encoded> element text for
            // the selected item
            showDetailsContent(select.value);
        }
    }
}



function fireEvent(element, event) {
        if (document.createEvent) {
            // dispatch for firefox + others
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent(event, true, false); // event type,bubbling,cancelable
            return !element.dispatchEvent(evt);
        } else {
            // dispatch for IE
            var evt = document.createEventObject();
            return element.fireEvent('on' + event, evt)
        }
    }





