
var connectionId;
var dbuf;
var receiveResponseStr;
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
  chrome.serial.send(connectionId, convertStringToArrayBuffer(str), function(){
    console.log("sent");} );}


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
   }
   display(receiveResponseStr);
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


    //function fil(responsemsg) {
  //var responsebytemsg=$("#res").val();
    //var responsearray=new Uint16Array (str2ab(responsemsg));
//display(responsearray);
function display (pack)
{
  var responsearray=new Uint16Array (str2ab(pack));
var arr=Pack(responsearray);
  var count=18;
  console.log (arr[count+2]);
  console.log (arr[count+3]);
  console.log (arr[count+4]);
  console.log (arr[count+5]);
  console.log (arr[count+6]);
  console.log (arr[count+7]);
var fvc =  ((arr[count+3] << 8 )+ arr[count+2]) / 100.0;
var fev1 = ((arr[count+5] << 8 )+ arr[count+4]) / 100.0;
var pef =  ((arr[count+7] << 8)+(arr[count+6])) / 100.0;
$("#enc").append("FVC :" + fvc);
$("#enc").append("FEV1 :" + fev1);
$("#enc").append("PEF :" + pef);
console.log(fvc);
console.log(fev1);
console.log(pef);
del();
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
        console.log("data deleted");});
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
