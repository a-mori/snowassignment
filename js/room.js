$(document).ready(function(){
    $.ajax({
        url: "/getComment",
        type: "get",
        success: function(resp){
            console.log(resp.arr1);
            console.log(resp.arr2);
            
            var userArr = resp.arr1;
            var comments = resp.arr2;
            
            comments[1].forEach(function (i) {
                
                var d = document.createElement("div");
                var imgDiv = document.createElement("div");
                var stuff = document.createElement("div");
                
                if (i.user == null) {
                    imgDiv.innerHTML = "unknown: "+i.msg;
                    
                    imgDiv.className = "ndiv col-lg-8 col-md-8 col-sm-8 col-xs-8";
                    stuff.className = "stuff col-lg-2 col-md-2 col-sm-2 col-xs-2";
                    
                    d.appendChild(stuff);
                    d.appendChild(imgDiv);
                } else {
                    var sender = {};
                    var imgDiv = document.createElement("div");

                    userArr.forEach(function (j) {
                        console.log(JSON.stringify(j));
                        if (j.id == i.user.id) {
                            sender = i;
                        }
                    });
                    
                    console.log(JSON.stringify(sender));
                    
                    imgDiv.innerHTML = sender.user.username+": "+sender.msg;
                    imgDiv.style.color = sender.user.gender;
                    
                    stuff.className = "stuff col-lg-2 col-md-2 col-sm-2 col-xs-2";
                    imgDiv.className = "ndiv col-lg-8 col-md-8 col-sm-8 col-xs-8";
                    
                    stuff.style.backgroundImage = "url("+sender.user.pic+")";
                    d.appendChild(stuff);
                    d.appendChild(imgDiv);
                }
                
                document.getElementById("display").appendChild(d);

            });
        }
    });
});

$(document).ready(function(){
    $.ajax({
        url: "/room/roomID",
        type: "post",
        success: function(resp){
            var regEx = /^[a-zA-Z0-9\?\.\!\'\" ]{1,40}$/;
            var msg = document.getElementById("msg");
            console.log(resp);
            
            document.getElementById("status").innerHTML = "You are in room "+resp.roomID+": "+resp.roomName;
            
            msg.onkeyup = function() {
                if (regEx.test(msg.value) == false) {
                    document.getElementById("sendMsg").style.display = "none";
                } else {
                    document.getElementById("sendMsg").style.display = "inline";
                }
            }
            
            document.getElementById("back").onclick = function() {
                location.href = "/create";
            }
            
            initSockets(resp.roomID, resp.userInfo);
        }
    });
});

function initSockets(roomID, user=null){
    var socket = io();
    
    socket.emit("join room", roomID);
            
    document.getElementById("sendMsg").addEventListener("click", function(){
        var obj = {
            msg: document.getElementById("msg").value,
            room: roomID,
            user: user
        };

        socket.emit("send message", obj);
    });

    socket.on("create message", function(obj){
        console.log("What is sent:"+JSON.stringify(obj));

        var d = document.createElement("div");
        var imgDiv = document.createElement("div");
        var stuff = document.createElement("div");
        
        if (obj.obj.user == null) {
            imgDiv.innerHTML = "unknown: "+obj.obj.msg;
            imgDiv.className = "ndiv col-lg-8 col-md-8 col-sm-8 col-xs-8";
            stuff.className = "stuff col-lg-2 col-md-2 col-sm-2 col-xs-2";
            d.appendChild(stuff);
            d.appendChild(imgDiv);
        } else {
            var sender = {};
            var imgDiv = document.createElement("div");
            
            obj.userArr.forEach(function (i) {
                if (i.id == obj.obj.user.id) {
                    sender = i;
                }
            });
            
            imgDiv.innerHTML = sender.username+": "+obj.obj.msg;
            imgDiv.style.color = sender.gender;
            stuff.className = "stuff col-lg-2 col-md-2 col-sm-2 col-xs-2";
            imgDiv.className = "ndiv col-lg-8 col-md-8 col-sm-8 col-xs-8";
            stuff.style.backgroundImage = "url("+sender.pic+")";
            d.appendChild(stuff);
            d.appendChild(imgDiv);
        }
        
        document.getElementById("display").appendChild(d);
    });
}