const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);
const mongoose=require('mongoose');
var nodemailer = require('nodemailer');
const visitor=require('./models/visitor/visitor_model');
const bodyParser =require('body-parser');


const { ExpressPeerServer } = require("peer");
const { json } = require("body-parser");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer);
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
let peoples={};
app.get("/location", (req, res) => {
  res.render("location");
});
app.get("/map", (req, res) => {
  res.render("map");
});

app.get('/home',(req,res)=>{
  res.render('home');
})
app.get("/", (req, rsp) => {
  rsp.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
  });
});
peoples={
  0: { lat: 21.125631691458818, lng: 79.04795631287351 },
  1: { lat: 21.125997475313877, lng: 79.05154242632642 },
  2: { lat: 21.129260516292298, lng: 79.05624389648438 },
  3: { lat: 21.137470657325252, lng: 79.05793492726134 },
  4: { lat: 21.135149020369163, lng: 79.04540364674376 },
  5: { lat: 21.17834166131974, lng: 79.11576098632075 },
  6: { lat: 21.12618250416157, lng: 79.20759982299067 },
  7: { lat: 21.25294626122408, lng: 79.00469607543208 },
  8: { lat: 21.114589091480273, lng: 78.90581912230708 },
  9: { lat: 21.146548868132726, lng: 79.0555078430102 },
  10: { lat: 21.119008794713395, lng: 79.08434695433833 }
};
visitors=[];
function calcDist(lat1, lon1, lat2, lon2) 
    {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }
    
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    };
app.post('/sendMail',async (req,res)=>{
    console.log(req.body);
    const v=await visitor.find();
    let id=req.body.id;
    let mail_pro=req.body.provider_mail;
    let mail=v[id].mail
    var maillist=`${mail},${mail_pro}`
    console.log(mail)

    try{
      //let testAccount =nodemailer.createTestAccount();
    var transporter = nodemailer.createTransport({
      service:'gmail',
      auth: {
        user: 'project2rahulverma@gmail.com',
        pass : 'xsplvscgbhnryurj'
      }
    })

    var mailOptions = {
      from : 'project2rahulverma@gmail.com',
      to :maillist,
      subject: 'Here is your Link',
      html: `<a href=http://localhost:3030/${uuidv4()}>Link</a>`
    }

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        
      }
    });
      const _id=v[id]._id;
      visitor.findByIdAndDelete(_id).then((r)=>res.status(200).json({'message':'in send mail'})).catch((err)=>res.status(400).json({'message':'error'}));

      
    }
  catch(e){
    console.log(e)
    res.status(400)
  }
});

app.post('/findReq',async (req,res)=>{
  console.log(req.body)
  l=req.body.location
  try {
    let v=await visitor.find();
  console.log(v);
  let result=[];
    for(let i=0;i<v.length;i++){
      let lat=v[i].location.lat;
      let long=v[i].location.lng;
      let d=calcDist(lat,long,l.lat,l.lng);
      console.log(d)
      if(d<=1){
        result.push(i);
        //console.log(i)
      }
      
    }
    console.log(result)
  res.status(200).json({'message':'in findReq','data':result});
  } catch (error) {
    res.status(400).json({err:error});
  }
  
});

app.post('/addReq',async (req,res)=>{
    let l=req.body;
    console.log(l);
    const item=new visitor(l);
    item.save((err,res)=>{
      if(!err){
        console.log("doc saved");
      }
      else{
        console.log("doc not saved: ",err);
      }
    });
    //const key=JSON.parse(l);
    // let result=[];
    // for(let i=0;i<11;i++){
    //   let lat=peoples[i].lat;
    //   let long=peoples[i].lng;
    //   let d=calcDist(lat,long,l.lat,l.lng);
    //   if(d<=1){
    //     result.push(i);
    //   }
      
    // }
    //console.log(result);
    res.status(200).json({'message':'req added'});
})

const connectionParams={
  useNewUrlParser: true,
  useUnifiedTopology: true 
}
//connect to db
//mongodb+srv://LiveVisit:<password>@cluster0.emz9cjj.mongodb.net/?retryWrites=true&w=majority
const db_uri="mongodb+srv://LiveVisit:Atharv25@cluster0.emz9cjj.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(db_uri,connectionParams)
    .then( () => {
        console.log('Connected to the database ')
        server.listen(process.env.PORT || 3030);
      })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    });
//server.listen(process.env.PORT || 3030);
//extra
//database();
//initializeRoutes(app);
//webpush();