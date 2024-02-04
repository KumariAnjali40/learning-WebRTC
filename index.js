const express=require('express');

const app=express();

const socket=require('socket.io');

const server=app.listen(3000,()=>{
    console.log("Server is running")
})

const bodyParser=require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine','ejs');
app.set('views','./views');

app.use(express.static('public'));

const userRoute=require('./routes/userRoute');

app.use('/',userRoute);

//socket io working with signaling server

var io=socket(server);
io.on('connection',function(socket){
    console.log("user connected: "+socket.id);

    socket.on('join',function(roomname){
        var rooms=io.sockets.adapter.rooms; //create default room.


       var room= rooms.get(roomname);
       console.log(room);

       if(room==undefined){
        socket.join(roomname);
        console.log("Room Joined");
       }else if(room.size==1){
           socket.join(roomname);
       }else{
         console.log("Room full for now");
       }
       console.log(rooms);
    })
})