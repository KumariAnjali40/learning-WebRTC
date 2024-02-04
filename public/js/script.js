var socket=io();

var videoChatForm=document.getElementById('video-chat-form');
var videoChatRoom=document.getElementById('video-chat-rooms');
var joinBtn=document.getElementById('join');
var roomInput=document.getElementById('roomName')
var userVideo=document.getElementById('user-video')//our video streaming.
var peerVideo=document.getElementById('peer-video');//another side user.

var roomName=roomInput.value


navigator.getUserMedia=navigator.getUserMedia ||navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var creator=false;

var rtcPeerConnection;
//public IP connection accessible using RTCpeerConnection.
//we have STUN Server in our browser and from that we can know IP address 
var iceServers = {
    iceServers:[
       { urls: "stun:stun.services.mozilla.com" },
       { urls: "stun1.l.google.com:19302" }
    ]
}

joinBtn.addEventListener("click",function(){
    if(roomInput.value==""){
        alert("please enter a room name!")
    }else{
 
        //here i am going to create an event
         socket.emit("join",roomName);
        
    }
});

// Setting up client side Events(Created,Joined,Full);
socket.on("created",function(){

    creator=true;
    navigator.getUserMedia(
        {
           //in this object here audio and video.
           audio:true,
           video:{width:1280,height:720}
        },
        function(stream){
         //in this function video streaming 
         videoChatForm.style="display:none";
         userVideo.srcObject=stream;
         userVideo.onloadedmetadata=function(e){
            userVideo.play();
         }
        },
        function(error){
           alert("You can't access Media")
        }
    )
});

socket.on("joined",function(){
    creator=false;
    navigator.getUserMedia(
        {
           //in this object here audio and video.
           audio:true,
           video:{width:1280,height:720}
        },
        function(stream){
         //in this function video streaming 
         videoChatForm.style="display:none";
         userVideo.srcObject=stream;
         userVideo.onloadedmetadata=function(e){
            userVideo.play();
         }

          //catch the event.
          socket.emit("ready",(roomName)) 
        },
        function(error){
           alert("You can't access Media")
        }
    )
});

socket.on("full",function(){
     alert("Room is full, You can't join room!");
});






socket.on("ready",function(){
    //we have STUN Server in our browser and from that we can know IP address 

    if(creator){
       var rtcPeerConnection =new RTCPeerConnection(iceServers);

       //exchange the IceCandidate.
       rtcPeerConnection.onicecandidate=OnIceCandidateFunction;
    }
});


socket.on("candidate",function(){
    
});

socket.on("offer",function(){
    
});

socket.on("answer",function(){
    
});


function OnIceCandidateFunction(event){
 
    if(event.candidate){
        socket.emit("candidate",event.candidate,roomName);
    }


}
