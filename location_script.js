var x = document.getElementById("location_button");
function getLocation() {
  console.log('hesac');
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}
function sendMail(ind){
  mail=document.getElementById('provider_id').value;
  fetch('/sendMail',{
    method:"POST",
    headers: {"Content-type": "application/json;charset=UTF-8"},
    body:JSON.stringify({provider_mail:mail,id:ind})
})
.then((d)=>d.json())
.then((data)=>{
  window.location.reload();
  console.log(data)})
.catch((err)=>console.log(err));
}
function showPosition(position) {
  myLatlng={"lat": position.coords.latitude,
  "lng": position.coords.longitude
}
let result=null;
  fetch('/findReq',{
    method:"POST",
    headers: {"Content-type": "application/json;charset=UTF-8"},
    //body:JSON.stringify({'location':myLatlng,'mail':'asssaz'})
    body:JSON.stringify({'location':{ lat: 21.1310142, lng: 79.0531951 },'mail':'asssaz'})
})
.then((d)=>d.json())
.then((data)=>{
  result=data;
  console.log(result)
if(result){
  console.log(result)
  s=''
  for(let i=0;i<result.data.length;i++){
    s+='<li>'+`<button onclick=sendMail(${result.data[i]})>Accept Request</button>`+'</li>';
    console.log(s);
  }
  document.getElementById('list').innerHTML=s;
}
})
.catch((err)=>console.log(err));


  x.innerHTML = "Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude;
}