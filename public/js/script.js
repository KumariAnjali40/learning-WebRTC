var videoChatForm=document.getElementById('video-chat-form');
var videoChatRoom=document.getElementById('video-chat-rooms');
var joinBtn=document.getElementById('join');
var roomName=document.getElementById('roomName')
var userVideo=document.getElementById('user-video')//our video streaming.
var peerVideo=document.getElementById('peer-video');//another side user.

joinBtn.addEventListener("click",function(){
    if(roomName.value==""){
        alert("please enter a room name!")
    }else{
        navigator.getUserMedia=navigator.getUserMedia ||navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
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
    }
})
