const port = process.env.PORT || 10000;
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

var app = express();
var pFolder = path.resolve(__dirname, "public");

var roomContext = [];
var users = [];
var savedUsers = [];

const server = require("http").createServer(app);
var io = require("socket.io")(server);

app.use("/scripts", express.static("build"));
app.use("/css", express.static("css"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(session({
    secret: "no one will ever figure out this secret message",
    resave: true, 
    saveUninitialized: true
}));

app.get("/room/:index", function(req, resp){
    console.log("index "+req.params.index);
    var index = req.params.index;
    req.session.roomID = index;
    resp.sendFile(pFolder+"/room.html");
    console.log("Session RoomID: "+req.session.roomID);
});

app.post("/room/roomID", function(req, resp){
    var obj = {
        roomID: req.session.roomID,
        roomName: req.session.name,
        userInfo: req.session.user,
        arr: roomContext[search(req.session.roomID)][1]
    }
    resp.send(obj);
});

app.get("/getComment", function(req, resp){
    var obj = {
        arr1: users,
        arr2: roomContext[search(req.session.roomID)]
    }
    console.log("LoadRoom obj: "+obj.arr1+": "+JSON.stringify(obj.arr2));  
    resp.send(obj);
});

app.post("/users/makeUser", function(req, resp){
    
    var user = {
        username: req.body.user,
        pic: req.body.pic,
        gender: req.body.gender,
        id: users.length
    }
    
    users.push(user);
    req.session.user = user;
    
    console.log("session var: "+req.session.user.username+" "+req.session.user.pic+" "+req.session.user.gender);
    resp.send(user);
});

app.post("/users/makeProfile", function(req, resp){
    
    var user = {
        username: req.body.user,
        pic: req.body.pic,
        gender: req.body.gender,
        id: users.length,
        password: req.body.password
    }
    
    savedUsers.push(user);
    users.push(user);
    req.session.user = user;
    
    console.log("session var: "+req.session.user.username+" "+req.session.user.pic+" "+req.session.user.gender);
    resp.send(user);
});

app.get("/edit", function(req, resp){
    resp.sendFile(pFolder+"/profile.html");
});

app.get("/create", function(req, resp){
    resp.sendFile(pFolder+"/create.html");
});

app.post("/createStuff", function(req, resp){
    if (req.body.type == "create") {
        var roomStuff = {
            room: req.body.room,
            desc: req.body.desc,
            img: req.body.pic
        }
        
        req.session.name = roomStuff.room;
        
        var comments = [];
        var newStuff = [roomContext.length, comments, roomStuff];
        
        roomContext.push(newStuff);
        
        resp.send({
            status: "success",
            name: req.body.room,
            desc: req.body.desc,
            index: roomContext.length-1
        });        
    } else if (req.body.type == "read") {
        resp.send({
            status: "success",
            arr: roomContext
        });
    }
});

app.get("/checkUser", function(req, resp) {
    resp.send(savedUsers);
});

app.get("/", function(req, resp){
    resp.sendFile(pFolder+"/main.html");
});

io.on("connection", function(socket){
    
    socket.on("join room", function(roomID){        
        socket.roomID = "room"+roomID;
        socket.join(socket.roomID);
    });
    
    socket.on("send message", function(obj){
        var newObj = {
            obj: obj,
            userArr: users
        }
        
        io.to(socket.roomID).emit("create message", newObj);
        console.log(newObj);
        roomContext[search(obj.room)][1].push(obj);
    });
    
    socket.on("disconnect", function(){});
    
});

server.listen(port, function(err) {
    if(err){
        console.log("There was an error. Error: "+err);
        return false;
    }
    
    console.log("Server is running on port "+port);
});

function search(nameKey) {
    
    for (var i = 0; i < roomContext.length; i++) {
        if (roomContext[i][0] == nameKey) {
            return i;
        }
    }
}