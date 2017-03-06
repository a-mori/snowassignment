$(document).ready(function(){
    document.getElementById("create").addEventListener("click", function(){
        $.ajax({
            url: "/createStuff",
            type: "post",
            data: {
                type: "read"
            },
            success: function(resp){
                
                if (resp.status == "success") {
                    location.href = "/create";
                }
            }
        })
    });
    
    document.getElementById("signIn").addEventListener("click", function() {
        document.getElementById("password").style.display = "inline";
        document.getElementById("login").style.display = "inline";
        document.getElementById("signIn").style.display = "none";
        document.getElementById("userName").style.display = "inline";
    });

    document.getElementById("login").addEventListener("click", function() {
        
        document.getElementById("userName").onkeyup = function() {
            if (regEx.test(document.getElementById("userName").value) == true) {
                document.getElementById("login").style.display = "none";
            } else {
                document.getElementById("login").style.display = "inline";
            }
        }
        
        $.ajax({
            url: "/checkUser",
            type: "get",
            success: function(resp) {
                var counter = 0;
                resp.forEach(function (i) {
                    if (i.password == document.getElementById("password").value && i.username == document.getElementById("userName").value) {
                        alert("Success");
                        $.ajax({
                            url: "/users/makeUser",
                            type: "post",
                            data: {
                                user: i.username,
                                pic: i.pic,
                                gender: i.gender
                            }
                        });
                    } else {
                        counter++;
                    }
                });
                if (counter == resp.length) {
                    alert("Failed");
                }
            }
        });
    });

    document.getElementById("profile").addEventListener("click", function(){
        $.ajax({
            url: "/createStuff",
            type: "post",
            data: {
                type: "read"
            },
            success: function(resp){
                
                if (resp.status == "success") {
                    location.href = "/edit";
                }
            }
        })
    });
});
