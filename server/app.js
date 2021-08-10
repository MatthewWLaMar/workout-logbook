require("dotenv").config;
let express = require("express");
let app = express();
let sequelize = require("./db");


let user = require("./controllers/usercontroller")
let logbook = require("./controllers/logcontroller")


sequelize.sync();

app.use(require('./middleware/headers'));

app.use(express.json());
app.use("/logbook", logbook);

app.use("/user", user)

app.use(require('./middleware/validate-session.js'));

app.listen(3000, function(){
    console.log("app is running on port 3000");
});