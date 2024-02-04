var videoChatForm=document.getElementById('video-chat-form');
var videoChatRoom=document.getElementById('video-chat-rooms');
var joinBtn=document.getElementById('join');
var roomName=document.getElementById('roomName')
var userVideo=document.getElementById('user-video')
var peerVideo=document.getElementById('peer-video');

joinBtn.addEventListener("click",function(){
    if(roomName.value==""){
        alert("please enter a room name!")
    }else{
        navigator.getUserMedia=navigator.getUserMedia;
        
    }
})
