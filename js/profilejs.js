$(document).ready(function() {
    
    var gender = "";
    var regEx = /^[a-zA-Z0-9_]{3,25}$/;
    var regEx2 = /^[a-zA-Z0-9_\.\/\-\:]{1,150}$/;
    var uN = document.getElementById("username");
    var pV = document.getElementById("pic");
    var male = document.getElementById("gender_Male");
    var female = document.getElementById("gender_Female");
    
    uN.onkeyup = function() {
        if (regEx.test(uN.value) == true) {
            uN.style.color = "#22EE22";
        } else {
            uN.style.color = "#EE2222";
        }
        
        if (regEx2.test(pV.value) == true && regEx.test(uN.value) == true) {
            document.getElementById("update").style.display = "block";
            document.getElementById("createUser").style.display = "inline";
            if (male.value = "Male") {
                gender = "#2222EE";
            } else {
                gender = "EE2222";
            }
        } else {
            document.getElementById("update").style.display = "none";
            document.getElementById("createUser").style.display = "none";
        }
    }
    
    document.getElementById("home").onclick = function() {
        location.href = "/";
    }

    pV.onkeyup = function() {
        if (regEx2.test(pV.value) == true) {
            pV.style.color = "#22EE22";
        } else {
            pV.style.color = "#EE2222";
        }
        
        if (regEx2.test(pV.value) == true && regEx.test(uN.value) == true) {
            document.getElementById("update").style.display = "block";
            document.getElementById("createUser").style.display = "inline";
            if (male.value = "Male") {
                gender = "#2222EE";
            } else {
                gender = "EE2222";
            }
        } else {
            document.getElementById("update").style.display = "none";
            document.getElementById("createUser").style.display = "none";
        }
    }
    
    male.addEventListener("click", function(){
        gender = "#2222EE";
    });
    
    female.addEventListener("click", function(){
        gender = "#EE2222";
    });
    
    document.getElementById("createUser").addEventListener("click", function() {
        document.getElementById("createUser").style.display = "none";
        document.getElementById("create").style.display = "inline";
        document.getElementById("password").style.display = "inline";     
        document.getElementById("create").onclick = function() {
            $.ajax({
                url: "/users/makeProfile",
                type: "post",
                data: {
                    user: uN.value,
                    pic: pV.value,
                    gender: gender,
                    password: document.getElementById("password").value
                },
                success: function() {
                    alert("Profile Created!");
                    location.href = "/";
                }
            });
        }
    });
    
    document.getElementById("update").addEventListener("click", function() {
        $.ajax({
            url: "/users/makeUser",
            type: "post",
            data: {
                user: uN.value,
                pic: pV.value,
                gender: gender
            },
            success: function() {
                alert("User Created");
                document.getElementById("picDisplay").style.backgroundImage = "url("+pV.value+")";
            }
        });
    });
});