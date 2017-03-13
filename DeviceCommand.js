

var cmd= new Uint8Array(100);

function command_requestData()
{
cmd=64;
}

function bytetostr(array)
{
  var result = "";
  for (var i = 0; i < array.length; i++) {
    result += String.fromCharCode(parseInt(array[i], 2));
  return result;
}
}
  
