$(document).ready(function(){
    
    var regEx = /^[a-zA-Z0-9\?\.\! ]{1,70}$/;
    var regEx2 = /^[a-zA-Z0-9_\.\/\-\:]{0,80}$/;
    
    var topic = document.getElementById("topic");
    var dropDown = document.getElementById("dropDown");
    
    var description = document.getElementById("description");
    var customInput = document.getElementById("cus");
    var picValue = "";
    
    $.ajax({
        url: "createStuff",
        type: "post",
        data: {
            type: "read"
        },
        success: function(resp){
            
            if(resp.status == "success"){
                
                var rooms = resp.arr;
                console.log(rooms);
                
                for(var i = 0; i < rooms.length; i++){                   
                    
                    var ndiv = document.createElement("div");
                    var pic = document.createElement("div");
                    
                    pic.className = 'col-lg-4 col-md-4 col-sm-4 col-xs-4 pic';
                    pic.style.backgroundImage = rooms[i][2].img;
                    
                    ndiv.innerHTML = "Room Name: "+rooms[i][2].room+"<br>"+"Room Description: "+rooms[i][2].desc;
                    ndiv.className = "col-lg-8 col-md-8 col-sm-8 col-xs-8 inside";
                    document.getElementById("display").appendChild(pic);
                    document.getElementById("display").appendChild(ndiv);
                    ndiv.myindex = i;
                    ndiv.addEventListener("click", function(){
                        location.href = "/room/"+this.myindex;
                    });
                }
            }
        }
    });
    
    document.getElementById("home").onclick = function() {
        location.href = "/";
    }
    
    dropDown.addEventListener("click", function() {
        
        if (dropDown.value == "Custom") {
            customInput.style.display = "block";
        } else {
            customInput.style.display = "none";
        }
        
        customInput.onkeyup = function() {
            if (regEx2.test(customInput.value) == true) {
                customInput.style.color = "#22EE22";
            } else {
                customInput.style.color = "#EE2222";
            }
        }
    });
    
    topic.onkeyup = function() {
        if (regEx.test(topic.value) == true) {
            topic.style.color = "#22EE22";
        } else {
            topic.style.color = "#EE2222";
        }
    }
    
    description.onkeyup = function() {
        if (regEx.test(description.value) == true) {
            description.style.color = "#22EE22";
        } else {
            description.style.color = "#EE2222";
        }
    }
    
    onkeyup = function() {
        if (regEx.test(description.value) == true && regEx.test(topic.value) == true && regEx2.test(customInput.value) == true) {
            document.getElementById("createTopic").style.display = "block";
        } else {
            document.getElementById("createTopic").style.display = "none";
        }
    }
    
    document.getElementById("createTopic").addEventListener("click", function(){
        
        if (dropDown.value == "Help") {
            picValue = "url(https://earthschooling.info/thebearthinstitute/wp-content/uploads/2015/07/AskForHelp_Logo_2.png)";
            console.log("Help");
        } 

        if (dropDown.value == "Opinions") {
            picValue = "url(https://ppuglobe.com/wp-content/uploads/2016/06/F_16_OPINIONS-475x475.png)";
            console.log("Opinions");
        } 

        if (dropDown.value == "Questions") {
            picValue = "url(http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-question-icon.png)";
            console.log("Questions");
        }

        if (dropDown.value == "Custom") {
            picValue = "url("+customInput.value+")";
            console.log("Custom", customInput.value, " PicValue: "+picValue);
        }
        
        $.ajax({
            url: "/createStuff",
            type: "post",
            data: {
                room: topic.value,
                desc: description.value,
                pic: picValue,
                type: "create"
            },
            success: function(resp){
                console.log(resp);
                
                if(resp.status == "success"){
                    var ndiv = document.createElement("div");
                    var pic = document.createElement("div");
                    
                    pic.className = 'col-lg-4 col-md-4 col-sm-4 col-xs-4 pic';
                    pic.style.backgroundImage = picValue;
                    
                    ndiv.innerHTML = "Room Name: "+resp.name+"<br>"+"Room Description: "+resp.desc;
                    ndiv.className = "col-lg-8 col-md-8 col-sm-8 col-xs-8 inside";
                    
                    document.getElementById("display").appendChild(pic);
                    document.getElementById("display").appendChild(ndiv);
                    ndiv.myindex = resp.index;
                    ndiv.addEventListener("click", function(){
                        location.href = "/room/"+this.myindex;
                    });
                }
            }
        });
    });
});