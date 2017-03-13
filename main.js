
var connectionId;
var dbuf;
var receiveResponseStr;
var fvc,fev1,pef;
var exec=false;
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
                console.log(connectionId)
                  console.log("connecting");
                $("#btn").html("Close Port");
                console.log('Connection opened with id: ' + connectionId + ', Bitrate: ' + info.bitrate);
            });
        } else {
            chrome.serial.disconnect(connectionId, function(result) {
                $("#btn").html("Open Port");
                connectionId=undefined;
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
    if(info.data)
     receiveResponseStr = convertArrayBufferToString(info.data);
     //infounp(receiveResponseStr);
       //infounpy(receiveResponseStr);
     console.log(receiveResponseStr);
     console.log(dbuf);
   
     console.log(x);
    // display(receiveResponseStr);
       if(info.data)
    {
        var x=new Uint8Array(dbuf);
         lay(x);
           var disconnectcmd ="B";
      chrome.serial.send(connectionId, convertStringToArrayBuffer(disconnectcmd), function(){
        console.log("data deleting");});
        chrome.serial.onReceive.addListener(clear);
        function clear(info) {
    console.log("data deleting");
        }
      chrome.serial.disconnect(connectionId, function(result) {
        if(result==true){
         console.log('Connection with id: ' + connectionId + ' closed');
connectionId="";
            $("#btn").html("Open Port");}
            else {
              console.log('filed to disconnect');
            }

        });
}
}
   function lay(x)
   {
    var trim=MytrimPack(x);
    var pack=Myack(trim); 
    var count= $.inArray(3,pack);
      var mFVC = (((pack[count+2] & 255 | (pack[count+3] & 255) << 8) & 65535) / 100.0);
            /* 26 */     var mFEV1 = (((pack[count+4] & 255 | (pack[count+5] & 255) << 8) & 65535) / 100.0);
            /* 27 */     var mPEF = (((pack[count+6] & 255 | (pack[count+7] & 255) << 8) & 65535) / 100.0);
            console.log(mFVC);
            console.log(mFEV1);
            console.log(mPEF);
        
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


//   function fil(responsemsg) {
//   var responsebytemsg=$("#res").val();
//     var responsearray=new Uint16Array (str2ab(responsemsg));
// display(responsearray);


var trim;
function display (pack)
{
  if(exec==false){
  var responsearray=new Uint16Array (str2ab(pack));
  console.log(responsearray);
  trim=trimPack(responsearray);
  console.log(trim)
var pckarr=Pack(trim);
console.log(Pack(responsearray));
console.log(pckarr);
var count= $.inArray(3,pckarr);

  console.log("initially unpacked ");
  console.log ("20:"+pckarr[20]);
  console.log ("21:"+pckarr[21]);
  console.log ("22:"+pckarr[22]);
  console.log ("23:"+pckarr[23]);
  console.log ("24:"+pckarr[24]);
  console.log ("25:"+pckarr[25]);

check(pckarr,count);

}
}



//function check(arr,count){
  /* if(((arr[21]==0 || arr[20]==0)) && ((arr[23]==0 || arr[22]==0)) && ((arr[25]==0 || arr[24]==0)))
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
  if(((arr[21]>0 && arr[20]>0)) && ((arr[23]>0 && arr[22]>0)) && ((arr[25]>0 && arr[24]>0)))
    {
var fvc =  ((arr[21] << 8 )+ arr[20]) / 100.0;
var fev1 = ((arr[23] << 8 )+ arr[22]) / 100.0;
var pef =  ((arr[25] << 8 )+(arr[24])) / 100.0;
  $("#enc").append("FVC :" + fvc +"\n");
  $("#enc").append("FEV1 :" + fev1+"\n");
  $("#enc").append("PEF :" + pef+"\n");
    console.log(" alright   none");
  console.log ("2:"+arr[20]);
  console.log ("3:"+arr[21]);
  console.log ("4:"+arr[22]);
  console.log ("5:"+arr[23]);
  console.log ("6:"+arr[24]);
  console.log ("7:"+arr[25]);

}
else if(((arr[25]==0) && ((arr[24]<50)&&(arr[24]>0)))&& (((arr[21]<50)&&(arr[21]>0)) && ((arr[20]<50)&&(arr[20]>0))) && ((arr[23]==0) && ((arr[22]<50)&&(arr[22]>0))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
  console.log("25||24 ! all      3");
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");

}





else if(((arr[25]==0) && ((arr[24]<50)&&(arr[24]>0)))&& ((arr[21]==0) && ((arr[20]<50)&&(arr[20]>0))) && ((arr[23]==0) && ((arr[22]<50)&&(arr[22]>0))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
  console.log("25||24 ! all      3");
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");

}




else if(((arr[25]==0) && ((arr[24]>50)&&(arr[24]<99)))&& ((arr[21]==0) && ((arr[20]<50)&&(arr[20]>0))) && ((arr[23]==0) && ((arr[22]<50)&&(arr[22]>0))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
  console.log("25||24 ! all      3");
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");

}






else if(((arr[21]>0) && (arr[20]==0))&& (((arr[25]>0) && (arr[24]>99)) && ((arr[23]>0) && (arr[22]>99))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
  console.log(" 21 || 20 !all       1");
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");del();
}else if(((arr[23]==0) && (arr[22]==0))&& ((arr[25]>0) && (arr[24]>0)) && ((arr[21]>0) && ((arr[20]>0))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
console.log(" 23 || 22 !all     2");
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}else if(((arr[21]>0) && (arr[20]==0)) && ((arr[23]>0) && (arr[22]==0)) && ((arr[25]>0) && (arr[24]==0)))
{
  fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
  fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
  pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
  console.log ("2:"+arr[20]);
  console.log ("3:"+arr[21]);
  console.log ("4:"+arr[22]);
  console.log ("5:"+arr[23]);
  console.log ("6:"+arr[24]);
  console.log ("7:"+arr[25]);
  console.log("21 23 25 all 0      1+2+3" );
  $("#enc").append("FVC :" + fvc +"\n");
  $("#enc").append("FEV1 :" + fev1+"\n");
  $("#enc").append("PEF :" + pef+"\n");del();
}


else if((((arr[21]==0) && (arr[20]>99)) && ((arr[23]>99) && (arr[22]==0))) && ((arr[25]>99) && (arr[24]>0)))
{
  fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
  fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
  pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
  console.log ("2:"+arr[20]);
  console.log ("3:"+arr[21]);
  console.log ("4:"+arr[22]);
  console.log ("5:"+arr[23]);
  console.log ("6:"+arr[24]);
  console.log ("7:"+arr[25]);
  console.log("25 || 24 !0 all 0     20,23,25 >99 24>0" );
  $("#enc").append("FVC :" + fvc +"\n");
  $("#enc").append("FEV1 :" + fev1+"\n");
  $("#enc").append("PEF :" + pef+"\n");del();
}
else if((((arr[21]==0) && ((arr[20]<99)&&(arr[20]>50))) && (((arr[23]<99)&&arr[23]>50) && (arr[22]==0))) && (((arr[25]<99)&&(arr[25]>50)) && ((arr[24]>0)&&(arr[24]<50))))
{
  fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
  fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
  pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
  console.log ("2:"+arr[20]);
  console.log ("3:"+arr[21]);
  console.log ("4:"+arr[22]);
  console.log ("5:"+arr[23]);
  console.log ("6:"+arr[24]);
  console.log ("7:"+arr[25]);
  console.log("25 || 24 !0 all 0     20,23,25 >99 24>0" );
  $("#enc").append("FVC :" + fvc +"\n");
  $("#enc").append("FEV1 :" + fev1+"\n");
  $("#enc").append("PEF :" + pef+"\n");del();
}

else if((((arr[21]==0) && ((arr[20]<99)&&(arr[20]>50))) && ((arr[23]==0) && ((arr[22]>0)&&(arr[22]<50))) && (((arr[25]<50)&&(arr[25]>0)) && ((arr[24]>0)&&(arr[24]<50)))))
{
  fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
  fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
  pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
  console.log ("2:"+arr[20]);
  console.log ("3:"+arr[21]);
  console.log ("4:"+arr[22]);
  console.log ("5:"+arr[23]);
  console.log ("6:"+arr[24]);
  console.log ("7:"+arr[25]);
  console.log("25 || 24 !0 all 0     20,23,25 >99 24>0" );
  $("#enc").append("FVC :" + fvc +"\n");
  $("#enc").append("FEV1 :" + fev1+"\n");
  $("#enc").append("PEF :" + pef+"\n");del();
}

else if(((arr[23]==0) && (arr[22]<50))&& ((arr[25]==0) && (arr[24]<50)) && ((arr[21]==0) && ((arr[20]<50))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,23,25==0 && 20 22 24<99" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}else if(((arr[23]==0) && ((arr[22]<99)&&(arr[22]>50)))&& ((arr[25]==0) && ((arr[24]<99)&&(arr[24]>50))) && ((arr[21]==0) && ((arr[20]<99)&&(arr[20]>60))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
console.log("alternate 21,23,25==0 && 20 22 24<99" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}






else if(((arr[23]==0) && ((arr[22]<99)&&(arr[22]>50)))&& ((arr[25]==0) && ((arr[24]<60)&&(arr[24]>50))) && ((arr[21]==0) && ((arr[20]<60)&&(arr[20]>50))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,23,25==0 && 20 22 24<99" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}









/*else if(((arr[23]==0) && ((arr[22]<99)&&(arr[23]>40)))&& ((arr[25]==0) && ((arr[24]<99)&&(arr[24]>40)) && ((arr[21]==0) && ((arr[20]<99)&&(arr[20]>50)))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,23,25==0 && 20 22 24<99 && > 40" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}else if(((arr[23]==0) && (arr[22]>50))&& ((arr[25]==0) && ((arr[24]>50)&& (arr[24]<99))) && ((arr[21]==0) && ((arr[20]>50)&&(arr[20]<99))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
console.log("alternate 21,23,25==0 && 20 22 24 >" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}



else if(((arr[23]==0) && ((arr[22]>50)&&(arr[22]<99)))&& ((arr[25]==0) && ((arr[24]>50)&& (arr[24]<99))) && ((arr[21]==0) && ((arr[20]>50)&&(arr[20]<99))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,23,25==0 && 20 22 24 >" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}

*/






else if(((arr[23]==0) && ((arr[22]>50)&&(arr[22]<99)))&& ((arr[25]==0) && (arr[24]>99)) && ((arr[21]==0) && (arr[20]>50)&&(arr[20]<99)))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
console.log("alternate 21,23,25==0 && 20 22 24 >99" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}




else if(((arr[23]==0) && ((arr[22]>99)))&& ((arr[25]==0) && (arr[24]>99)) && ((arr[21]==0) && (arr[20]>99)))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,23,25==0 && 20 22 24 >99" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}






else if(((arr[23]==0) && (arr[22]<50))&& ((arr[25]==0) && (arr[24]<50)) && ((arr[21]==0) && (arr[20]>99)))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,23,25==0 && 20 >99" );
}



else if(((arr[23]==0) && (arr[22]<50))&& ((arr[25]==0) && ((arr[24]<99)&&arr[24]>50)) && ((arr[21]==0) && (arr[20]>99)))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,23,25==0 && 20 >99" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}else if(((arr[23]==0) && (arr[22]>99))&& ((arr[25]==0) && (arr[24]>99)) && ((arr[21]==0) && ((arr[20]<99)&&(arr[20]>0))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
console.log("alternate 21,23,25==0 && 20 <99 22,24 >" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}



else if(((arr[23]==0) && (arr[22]>99))&& ((arr[25]==0) && (arr[24]>99)) && ((arr[21]==0) && ((arr[20]==0))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,23,25==0 && 20 <99 22,24 >" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}



else if(((arr[23]==0) && (arr[22]>99))&& ((arr[25]==0) && (arr[24]<50)) && ((arr[21]==0) && (arr[20]<50)))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,23,25==0 && 20<50,24<50 ,22> 9" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}




/*else if(((arr[23]==0) && (arr[22]>99))&& ((arr[25]==0) && (arr[24]<50)) && ((arr[21]==0) && (arr[20]<50)))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,23,25==0 && 20,24 <50 22>99" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}

*/







else if(((arr[23]==0) && (arr[22]>99))&& ((arr[25]==0) && (arr[24]<99)) && ((arr[21]==0) && (arr[20]>99)))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,23,25==0 && 20,22 >99 24 <99" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}else if(((arr[23]==0) && (arr[22]>50))&& ((arr[25]==0) && (arr[24]>99)) && ((arr[21]==0) && (arr[20]>50)))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,23,25==0 && 20 <99  22<99 24>99" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}
else if(((arr[23]==0) && (arr[22]>0)&&(arr[22]<50))&& ((arr[25]>0) && ((arr[24]>0)&&(arr[24]<50))) && ((arr[21]==0) && ((arr[20]>0)&&(arr[20]<50))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
console.log("alternate 21,23,25==0 && 20 <99  22<99 24>99" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}




else if(((arr[23]==0) && (arr[22]<99))&& ((arr[25]>0) && (arr[24]>99)) && ((arr[21]==0) && (arr[20]<99)))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
console.log("alternate 21,23,25==0 && 20 <99  22<99 24 && 25 >0" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}

else if(((arr[23]==0) && (arr[22]<99))&& ((arr[25]>0) && (arr[24]>0)) && ((arr[21]==0) && ((arr[20]<99)&&(arr[20]<50))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
console.log("alternate 21,23,25==0 && 20 <99  22<99 24 && 25 >0" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}
else if(((arr[23]==0) && (arr[22]>99))&& ((arr[25]>0) && (arr[24]>0)) && ((arr[21]==0) && (arr[20]>0)))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
console.log("alternate 21,23,25==0 && 20 >99  22>99 24 && 25 >0" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}




else if(((arr[23]==0) && (arr[22]>99))&& ((arr[25]>0) && (arr[24]>0)) && ((arr[21]==0) && (arr[20]<50)))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
console.log("alternate 21,23==0,25>0 && 20 <50  22>99 24 && 25 >0" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}



else if(((arr[23]==0) && (arr[22]>99))&& ((arr[25]==0) && (arr[24]>0)) && ((arr[21]>0)&&((arr[20]>0)&&(arr[20]<50))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,23==0,25>0 && 20 <50  22>99 24 && 25 >0" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}

else if(((arr[23]==0) && (arr[22]>99))&& ((arr[25]==0) && ((arr[24]>0)&&(arr[24]<50))) && ((arr[21]>0)&&(arr[20]>50)))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,23==0,25>0 && 20 <50  22>99 24 && 25 >0" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}




else if(((arr[23]==0) && (arr[22]>99))&& ((arr[25]==0) &&(arr[24]>99)) && ((arr[21]>0)&&(arr[20]>50)))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
console.log("alternate 21,23==0,25>0 && 20 <50  22>99 24 && 25 >0" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}








else if(((arr[23]==0) && (arr[22]<50))&& ((arr[25]==0) && (arr[24]>50)) && ((arr[21]>0) && (arr[20]<50)))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 25,23==0,21>0 && 20 <50  22>99 24 && 25 >0" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
del();
}




else if(((arr[23]==0) && ((arr[22]>50)&&(arr[22]<99))&& ((arr[25]==0) && (arr[24]>50)) && ((arr[21]==0) && (arr[20]<50))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
console.log("alternate 25,23,21 ==0,22>50 && 20 <50   24 > 50" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}





else if((((arr[23]==0)&&(arr[25]==0)&&(arr[21]==0)) && ((arr[20]<50)&&(arr[22]>99 || arr[24]>50&&(arr[24]<=99)))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 25,23,21 ==0,22>50 && 20 <50   24 > 50" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}




else if(((arr[23]==0) && (arr[22]<50))&& ((arr[25]==0) && (arr[24]>50)) && ((arr[21]>0) && (arr[20]<50)))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 25,23==0,21>0 && 20 <50  22>99 24 && 25 >0" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}


else if((arr[23]==0&&arr[21]==0&&arr[25]==0)&&((arr[20]>50)&&(arr[20]<99) &&((arr[22]>50)&&(arr[22]<99)))&&((arr[24]>0)&&(arr[24]<50)))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,25,23==0,24<50 && 22 > 50  24<11 && 25 >0" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}


else if(((arr[23]==0) && ((arr[22]>50)&&(arr[22]<90)))&& ((arr[25]==0) && ((arr[24]<50)&&(arr[24]>0))) && ((arr[21]==0) && (arr[20]>95)))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,25,23==0,24<50 && 22 > 50  24<11 && 25 >0" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}





else if((arr[21]==0)&&(arr[23]==0)&&(arr[25]==0)&&((arr[20]>99)||(arr[22]>90))&&((arr(24)>0) &&(arr(24)<50)))
{

  fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
  fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
  pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
  console.log("alternate 21,25,23==0,24<50 && 22 > 50  24<11 && 25 >0" );
  $("#enc").append("FVC :" + fvc +"\n");
  $("#enc").append("FEV1 :" + fev1+"\n");
  $("#enc").append("PEF :" + pef+"\n");

}




else if((arr[21]==0)&&(arr[23]==0)&&(arr[25]==0)&&((arr[20]>99)||(arr[24]>90))&&((arr(22)>0) &&(arr(22)<50)))
{

  fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
  fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
  pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
  console.log("alternate 21,25,23==0,24<50 && 22 > 50  24<11 && 25 >0" );
  $("#enc").append("FVC :" + fvc +"\n");
  $("#enc").append("FEV1 :" + fev1+"\n");
  $("#enc").append("PEF :" + pef+"\n");

}




else if((arr[21]==0)&&(arr[23]==0)&&(arr[25]==0)&&((arr[22]>99)||(arr[24]>90))&&((arr(20)>0) &&(arr(20)<50)))
{

  fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
  fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
  pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
  console.log("alternate 21,25,23==0,24<50 && 22 > 50  24<11 && 25 >0" );
  $("#enc").append("FVC :" + fvc +"\n");
  $("#enc").append("FEV1 :" + fev1+"\n");
  $("#enc").append("PEF :" + pef+"\n");

}




else if(((arr[23]==0) && (arr[22]>50))&& ((arr[25]>0) && (arr[24]<50)) && ((arr[21]==0) && (arr[20]>50)))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
console.log("alternate 21,25,23==0,24<50 && 22 > 50  24<11 && 25 >0" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}



else if(((arr[23]==0) && (arr[22]>50))&& ((arr[25]>0) && (arr[24]<50)) && ((arr[21]>0) && (arr[20]>50)))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,25,23==0,24<50 && 22 > 50  24<11 && 25 >0" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}





else if(((arr[23]==0) && (arr[22]>50))&& ((arr[25]==0) && (arr[24]>99)) && ((arr[21]>0) && (arr[20]>50)))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,25,23==0,24<50 && 22 > 50  24<11 && 25 >0" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}

else if(((arr[23]==0) && ((arr[22]>0)&&(arr[22]<50) ))&& ((arr[25]==0) && (arr[24]>99)) && ((arr[21]==0) && ((arr[20]>0)&&(arr[20]<50))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
console.log("alternate 21,25,23==0,24<50 && 22 > 50  24<11 && 25 >0" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}









else if(((arr[23]==0) && ((arr[22]>99) ))&& ((arr[25]==0) && (arr[24]>0)&&(arr[24]<50)) && ((arr[21]==0) && ((arr[20]>0)&&(arr[20]<50))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,25,23==0,24<50 && 22 > 50  24<11 && 25 >0" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}





else if(((arr[23]==0)&& ((arr[22]>0)&&(arr[22]<50) ))&&  ((arr[25]==0) && (arr[24]>0)&&(arr[24]<50)) && ((arr[21]==0) && ((arr[20]>99))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,25,23==0,24<50 && 22 > 50  24<11 && 25 >0" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}



else if(((arr[23]==0)&& ((arr[22]<99)&&(arr[22]>50) ))&&  ((arr[25]>0) && (arr[24]>0)&&(arr[24]<50)) && ((arr[21]>0) && ((arr[20]>0))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
console.log("alternate 21,25,23==0,24<50 && 22 > 50  24<11 && 25 >0" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}





else if(((arr[21]==0)&& ((arr[20]<99)&&(arr[20]>50) ))&&  ((arr[25]>0) && (arr[24]>0)&&(arr[24]<50)) && ((arr[23]>0) && ((arr[22]>0))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0);
console.log("alternate 21,25,23==0,24<50 && 22 > 50  24<11 && 25 >0" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}


else if(((arr[25]==0)&& ((arr[24]<99)&&(arr[24]>50) ))&&  ((arr[21]>0) && (arr[20]>0)&&(arr[24]<50)) && ((arr[23]>0) && ((arr[22]>0))))
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0);
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0);
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("alternate 21,25,23==0,24<50 && 22 > 50  24<11 && 25 >0" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}



else
{
fvc=(((arr[21] << 8 )+ arr[20]) / 100.0)+1.28;
fev1=(((arr[23] << 8 )+ arr[22]) / 100.0)+1.28;
pef= (((arr[25] << 8 )+ arr[24]) / 100.0)+1.28;
console.log("else" );
$("#enc").append("FVC :" + fvc +"\n");
$("#enc").append("FEV1 :" + fev1+"\n");
$("#enc").append("PEF :" + pef+"\n");
}

exec=true;


del();


}



/* fvc =  ((arr[21] << 8 )+ arr[20]) / 100.0;
 fev1 = ((arr[23] << 8 )+ arr[22]) / 100.0;
 pef =  ((arr[25] << 8 )+(arr[24])) / 100.0;*/












function trimPack(pack) {
       var count = 0;
       var i = 0;
       while (i < pack.length) {
           if (pack[i] == 0) break;
           ++count;
           ++i;
       }
        var trimedPack = new Uint16Array(count);
        console.log(trimedPack);
       i = 0;
       while(i < trimedPack.length)
       {
        trimedPack[i]=pack[i];
        ++i;
      }
       return trimedPack;
   }




   function unp(pack) {
           var n = pack.length;
             for(i=2;i<n;++i){
           //    var arrby = pack;
               pack[i] &= (pack[1] << 9 - i | 0x7f);
           }
           return pack;
       }




               function unpy(pack) {
                       var n = pack.length;
                         for(i=2;i<n;++i){
                       //    var arrby = pack;
                           var tmp10_9 = i;
                           var tmp10_8=pack;
                           tmp10_8[tmp10_9] = (tmp10_8[tmp10_9] & (pack[1] << 9 - i | 127));
                       }
                       return pack;

                   }






                   function infounp(xx) {
                     var cc=new Uint16Array (str2ab(xx));
                     var pack=unp(cc);
                     var count= $.inArray(3,pack);
                       console.log(count);
                       console.log("unp ");
                       console.log ("20:"+pack[count+2]);
                       console.log ("21:"+pack[count+3]);
                       console.log ("22:"+pack[count+4]);
                       console.log ("23:"+pack[count+5]);
                       console.log ("24:"+pack[count+6]);
                       console.log ("25:"+pack[count+7]);

                     var mFVC = (((pack[count+2] & 0xFF | (pack[count+3] & 0xFF) << 8) & 0xFFFF) / 100.0);
                   /* 26 */     var mFEV1 = (((pack[count+4] & 0xFF | (pack[count+5] & 0xFF) << 8) & 0xFFFF) / 100.0);
                   /* 27 */     var mPEF = (((pack[count+6] & 0xFF | (pack[count+7] & 0xFF) << 8) & 0xFFFF) / 100.0);
                   console.log(mFVC);
                   console.log(mFEV1);
                   console.log(mPEF);

                       }









       function infounpy(xx) {
     var cc=new Uint16Array (str2ab(xx));
         var pack=unpy(cc);
         var count= $.inArray(3,pack);
           console.log(count);
           console.log("unpy ");
           console.log ("20:"+pack[count+2]);
           console.log ("21:"+pack[count+3]);
           console.log ("22:"+pack[count+4]);
           console.log ("23:"+pack[count+5]);
           console.log ("24:"+pack[count+6]);
           console.log ("25:"+pack[count+7]);

         var mFVC = (((pack[count+2] & 0xFF | (pack[count+3] & 0xFF) << 8) & 0xFFFF) / 100.0);
       /* 26 */     var mFEV1 = (((pack[count+4] & 0xFF | (pack[count+5] & 0xFF) << 8) & 0xFFFF) / 100.0);
       /* 27 */     var mPEF = (((pack[count+6] & 0xFF | (pack[count+7] & 0xFF) << 8) & 0xFFFF) / 100.0);
       console.log(mFVC);
       console.log(mFEV1);
       console.log(mPEF);

           }

function MytrimPack(pack) {
       var _count = 0;
       var i = 0;
       while (i < pack.length) {
           if (pack[i] == 0) break;
           ++_count;
           ++i;
       }
        var _trimedPack = new Uint16Array(_count);
       i = 0;
       while(i < _trimedPack.length)
       {
        _trimedPack[i]=pack[i];
        ++i;
      }
       return _trimedPack;
   }


function Myack(pack) {
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
        if(result==true){
         console.log('Connection with id: ' + connectionId + ' closed');
connectionId="";
            $("#btn").html("Open Port");}
            else {
              console.log('filed to disconnect');
            }

        });

    };


chrome.app.window.onClosed.addListener(function() {
   chrome.serial.disconnect(connectionId, function(result) {
     if(result==true){
       connectionId="";
      console.log('Connection with id: ' + connectionId + ' closed');
  }});
});

  //  chrome.serial.send(connectionId, convertStringToArrayBuffer("B"), function(){
  //    console.log("data deleted");} );
