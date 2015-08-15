function getCurrentTabUrl(callback) 
{
  // Query filter to be passed to chrome.tabs.query 
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  var donationAmt = parseFloat(document.getElementById("donationAmt").value);

  if (isNaN(donationAmt))
  {
    setStatusText("donation value not a valid number");
    return;
  }

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url, donationAmt);
  });
}

function sendData(url, donation)
{
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange=function()
  {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
        setStatusText("Submitted donation");
    }
    else 
    {
        setStatusText("Error submitting donation");
    }
  }

  //building post data
  var data = "\"url=";
  data = data.concat(url);
  data = data.concat("&donation=");
  data = data.concat(donation)
  dat = data.concat("\"");

  xmlhttp.open("POST","http://giveback.cloudapp.net/test",true);
  //xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send(data);

}


//clears the text of the given element
//has to check the type of element to use proper method to set text
function clearText(elementID)
{
  docElement = document.getElementById(elementID);
  var currentText = docElement.value;
  if (docElement.tagName === "P")
  {
    document.getElementById(elementID).innerHTML = "";
  }
  else if (docElement.tagName === "INPUT")
  {
    if(currentText == "Enter donation amount")
    {
      document.getElementById(elementID).value = "";
    }
  }
}

//set the status text of the popup, then clears it after 3.5 seconds
function setStatusText(statusText)
{
  if (typeof statusText == 'string')
  {
    //if this function is called but a timer already exists, we want to clear it and set a new timer for this status message
    document.getElementById("statusInfo").innerHTML = statusText;
    if (myTimer != null)
    {
      clearTimeout(myTimer);
    }
    myTimer = setTimeout(function(){ clearText("statusInfo") }, 3500);
  }
}

//adds event listeners
document.addEventListener('DOMContentLoaded', function() 
{
  document.getElementById("donateButton").addEventListener("click", function () { getCurrentTabUrl(sendData) });
  document.getElementById("donationAmt").addEventListener("click",  function () { clearText("donationAmt") });
  document.getElementById("donationAmt").addEventListener("keypress",  function (e) 
  { 
    if(e.keyCode == 13) 
    {
      event.preventDefault();
      getCurrentTabUrl(sendData);
    }
  });
});

//initialize global timer
var myTimer = null;