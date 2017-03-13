
var connectionId;
var dbuf;
var receiveResponseStr;
var fvc,fev1,pef;
$(document).ready(function() {
    chrome.serial.getDevices(function(devices) {

        for (var i = 0; i < devices.length; i++) {
            $('#portlist').append('<option value="' + devices[i].path + '">' + devices[i].path + '</option>');
        }
    });

    $('#btn').click(function() {
        var clicks = $(this).data('clicks');

        if (!clicks) {
            var port = $('#portlist').val();
            chrome.serial.connect(port, {bitrate: 115200}, function(info) {
                connectionId = info.connectionId;
                  console.log("connecting");
                $("#btn").html("Close Port");
                console.log('Connection opened with id: ' + connectionId + ', Bitrate: ' + info.bitrate);
            });
        } else {
            chrome.serial.disconnect(connectionId, function(result) {
                $("#btn").html("Open Port");
                console.log('Connection with id: ' + connectionId + ' closed');
            });
        }

        $(this).data("clicks", !clicks);
    });
});



$('#send').click(function() {
    var clicks = $(this).data('clicks');
    if (!clicks) {
        var req = $('#cmdreq').val();
      writeSerial(req);

    }});

function writeSerial(str)
 {
  chrome.serial.send(connectionId, convertStringToArrayBuffer(str),
  function(){
    console.log("sent");} );
  }


function convertStringToArrayBuffer(str) {
  var buf=new ArrayBuffer(str.length);
  var bufView=new Uint8Array(buf);
  for (var i=0; i<str.length; i++) {
    bufView[i]=str.charCodeAt(i);
  }

  return buf;
}

var stringReceived = '';

chrome.serial.onReceive.addListener(onReceive);

function onReceive(info) {

  if (info.connectionId == connectionId && info.data)
  {
    dbuf=info.data;
     receiveResponseStr = convertArrayBufferToString(info.data);
     display(receiveResponseStr);
   }

}

function convertArrayBufferToString(buf){
  var bufView = new Uint8Array(buf);
  var encodedString = String.fromCharCode.apply(null, bufView);
  return decodeURIComponent(encodedString);
}


function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}


  /*  function fil(responsemsg) {
  //var responsebytemsg=$("#res").val();
    //var responsearray=new Uint16Array (str2ab(responsemsg));
//display(responsearray);*/
function display (pack)
{
  var responsearray=new Uint16Array (str2ab(pack));
var pckarr=Pack(responsearray);
  var count=18;
  console.log("initially unpacked ");
  console.log ("20:"+pckarr[20]);
  console.log ("21:"+pckarr[21]);
  console.log ("22:"+pckarr[22]);
  console.log ("23:"+pckarr[23]);
  console.log ("24:"+pckarr[24]);
  console.log ("25:"+pckarr[25]);

check(pckarr,count);

}




//function check(arr,count){
  /*  if(((arr[21]==0 || arr[20]==0)) && ((arr[23]==0 || arr[22]==0)) && ((arr[25]==0 || arr[24]==0)))
    {
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
console.log("all are zeros");
console.log ("20:"+arr[20]);
console.log ("21:"+arr[21]);
console.log ("22:"+arr[22]);
console.log ("23:"+arr[23]);
console.log ("24:"+arr[24]);
console.log ("25:"+arr[25]);
}else if((((arr[21]==0 || arr[20]==0)) && ((arr[23]==0 || arr[22]==0))) && !(((arr[21]==0 || arr[20]==0)) && ((arr[23]==0 || arr[22]==0)) && ((arr[25]==0 || arr[24]==0))) )
{
  fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
  fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
  pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
  console.log ("2:"+arr[20]);
  console.log ("3:"+arr[21]);
  console.log ("4:"+arr[22]);
  console.log ("5:"+arr[23]);
  console.log ("6:"+arr[24]);
  console.log ("7:"+arr[25]);
  console.log("if else fvc & fev1 " );
  $("#enc").append("FVC :" + fvc +"\n");
  $("#enc").append("FEV1 :" + fev1+"\n");
  $("#enc").append("PEF :" + pef+"\n");
}else if(((arr[21]==0 || arr[20]==0)) && ((arr[25]==0 || arr[24]==0) )&& !(((arr[21]==0 || arr[20]==0)) && ((arr[23]==0 || arr[22]==0) ) && ((arr[25]==0 || arr[24]==0))))
{
  fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
  fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
  pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
  $("#enc").append("FVC :" + fvc +"\n");
  $("#enc").append("FEV1 :" + fev1+"\n");
  $("#enc").append("PEF :" + pef+"\n");
  console.log ("2:"+arr[20]);
  console.log ("3:"+arr[21]);
  console.log ("4:"+arr[22]);
  console.log ("5:"+arr[23]);
  console.log ("6:"+arr[24]);
  console.log ("7:"+arr[25]);
  console.log("if else fvc & pef " );
}else if((arr[21]==0 || arr[20]==0))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}
else if((arr[23]==0 || arr[22]==0))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}
else if((arr[25]==0 || arr[24]==0))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");

}


else {*/
function check(arr,count){
  if(((arr[21]==0 || arr[20]==0)) && ((arr[23]==0 || arr[22]==0)) && ((arr[25]==0 || arr[24]==0)))
    {
var fvc =  ((arr[21] << 8 )+ arr[20]) / 100.0;
var fev1 = ((arr[23] << 8 )+ arr[22]) / 100.0;
var pef =  ((arr[25] << 8 )+(arr[24])) / 100.0;
  $("#enc").append("FVC :" + fvc +"\n");
  $("#enc").append("FEV1 :" + fev1+"\n");
  $("#enc").append("PEF :" + pef+"\n");
  console.log ("2:"+arr[20]);
  console.log ("3:"+arr[21]);
  console.log ("4:"+arr[22]);
  console.log ("5:"+arr[23]);
  console.log ("6:"+arr[24]);
  console.log ("7:"+arr[25]);
  console.log(" else");
}
//}

/* fvc =  ((arr[21] << 8 )+ arr[20]) / 100.0;
 fev1 = ((arr[23] << 8 )+ arr[22]) / 100.0;
 pef =  ((arr[25] << 8 )+(arr[24])) / 100.0;*/
del();
console.log(fvc);
console.log(fev1);
console.log(pef);

}



function Pack(pack) {
        var n = pack.length;
        var i = 2;
        while (i < n) {
        //    var arrby = pack;
            var n2 = i;
            pack[n2] = (pack[n2] & (pack[1] << 9 - i | 127));
            ++i;
        }
        return pack;
    }

     function del() {
       var disconnectcmd ="B";
       chrome.serial.send(connectionId, convertStringToArrayBuffer(disconnectcmd), function(){
        console.log("data deleting");});
        chrome.serial.onReceive.addListener(clear);
        function clear(info) {
    console.log("data deleting");
        }
      chrome.serial.disconnect(connectionId, function(result) {
            $("#btn").html("Open Port");
            console.log('Connection with id: ' + connectionId + ' closed');
        });

    };


chrome.app.window.onClosed.addListener(function() {
   chrome.serial.disconnect(connectionId, function(result) {
      console.log('Connection with id: ' + connectionId + ' closed');
  });
});

  //  chrome.serial.send(connectionId, convertStringToArrayBuffer("B"), function(){
  //    console.log("data deleted");} );
