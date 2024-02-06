var socket=io();

var videoChatForm=document.getElementById('video-chat-form');
var videoChatRoom=document.getElementById('video-chat-rooms');
var joinBtn=document.getElementById('join');
var roomInput=document.getElementById('roomName')
var userVideo=document.getElementById('user-video')//our video streaming.
var peerVideo=document.getElementById('peer-video');//another side user.


//upgrading work
var divBtnGroup=document.getElementById('btn-group');
var muteButton=document.getElementById('muteButton');

var muteFlag=false;



var roomName=roomInput.value


navigator.getUserMedia=navigator.getUserMedia ||navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var creator=false;

var rtcPeerConnection;

var userStream;
//public IP connection accessible using RTCpeerConnection.
//we have STUN Server in our browser and from that we can know IP address 
var iceServers = {
    iceServers:[
       { urls: "stun:stun.services.mozilla.com" },
       { urls: "stun:stun1.l.google.com:19302" }
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


muteButton.addEventListener("click",function(){
   muteFlag=!muteFlag;
   if(muteFlag){
    userStream.getTracks()[0].enabled=false;
     muteButton.textContent='Unmute'
   }else{
    userStream.getTracks()[0].enabled=true;
        muteButton.textContent='Mute'
   }
});

// Setting up client side Events(Created,Joined,Full);
socket.on("created",function(){

    creator=true;
    navigator.getUserMedia(
        {
           //in this object here audio and video.
           audio:true,
           video:{width:500,height:500}
        },
        function(stream){

            userStream=stream;
         //in this function video streaming 
         videoChatForm.style="display:none";
         divBtnGroup.style="display:flex"
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
           video:{width:500,height:500}
        },
        function(stream){
         //in this function video streaming 
         userStream=stream;
         videoChatForm.style="display:none";
         divBtnGroup.style="display:flex"
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
        rtcPeerConnection =new RTCPeerConnection(iceServers);

       //exchange the IceCandidate.
       rtcPeerConnection.onicecandidate=OnIceCandidateFunction;
       rtcPeerConnection.ontrack = OntrackFunction;
       rtcPeerConnection.addTrack(userStream.getTracks()[0],userStream);   //for getting the peerVideo audio.
       //getTrack is an array in which 0th index contains audio and first index contain video.
       rtcPeerConnection.addTrack(userStream.getTracks()[1],userStream);   //for getting the peerVideo video.

       rtcPeerConnection.createOffer(
        function(offer){

          rtcPeerConnection.setLocalDescription(offer);
          socket.emit('offer',offer,roomName);
        },
        function(error){
            console.log(error);
        }
       )
    }
});


socket.on("candidate",function(candidate){
   var IceCandidate= new RTCIceCandidate(candidate);
   rtcPeerConnection.addIceCandidate(IceCandidate);
});

socket.on("offer",function(offer){
    if(!creator){
         rtcPeerConnection =new RTCPeerConnection(iceServers);
 
        //exchange the IceCandidate.
        rtcPeerConnection.onicecandidate=OnIceCandidateFunction;
        rtcPeerConnection.ontrack = OntrackFunction;
        rtcPeerConnection.addTrack(userStream.getTracks()[0],userStream);   //for getting the peerVideo audio.
        //getTrack is an array in which 0th index contains audio and first index contain video.
        rtcPeerConnection.addTrack(userStream.getTracks()[1],userStream);   //for getting the peerVideo video.
        rtcPeerConnection.setRemoteDescription(offer); //sending description to peer user.
 
        rtcPeerConnection.createAnswer(
         function(answer){
            rtcPeerConnection.setLocalDescription(answer);
           socket.emit('answer',answer,roomName);
         },
         function(error){
             console.log(error);
         }
        )
     }
});


//after offer peerVideo will send the answer.

//answer is remote for creator but local for peer user.
socket.on("answer",function(answer){
     rtcPeerConnection.setRemoteDescription(answer);
});


function OnIceCandidateFunction(event){
 
    if(event.candidate){
        socket.emit("candidate",event.candidate,roomName);
    }


}

function OntrackFunction(event){ //in this event there is stream array
    peerVideo.srcObject=event.streams[0];
    peerVideo.onloadedmetadata=function(e){
       peerVideo.play();
    }
}
