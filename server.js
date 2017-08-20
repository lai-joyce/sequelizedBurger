var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var path = require("path");

//set up Express server
var app = express();
var port = process.env.PORT || 3000;

var db = require(path.join(__dirname, "/models"));

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(process.cwd() + "/public"));

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes to allow server to access
require('./controllers/burgers_controller.js')(app);

// Sync our sequelize models and then start express app
// Include the {force: true} parameter to drop previous database

db.sequelize.sync({force:true}).then(function() {
	app.listen(port, function() {
		console.log("Listening on port %s", port);
	});
});
