

// require the Burger model
var express = require("express");
var app = express();

var db = require("../models");
// var router = express.Router();

var log = require("loglevel").getLogger("burgers_controller");

// Create all our routes and set up logic within those routes where required.

module.exports = function(app) {

  app.get('/', function (req, res) {
  res.redirect('/index');
});
  // Retrieve the list of all burgers in the database
  app.get("/index", function(req, res) {
    log.debug("___ENTER GET /___");

    db.Burger.findAll({
        order: [
            ["name", "ASC"]
        ],
        include: [{
            model: db.Customer,
            attributes: ["name"]
        }]

    // db.Burger.findAll({
    //   include: [ db.Customer ],
    //   order: ["name", "ASC"]
    })
    .then(function(data) {
      log.debug("data = " + JSON.stringify(data));

      var hbsObject = {
        burgers: data
      };
      console.log(hbsObject);
      res.render('index', hbsObject);
    })
    .catch(function(err) {
      log.error("ERR = " + err);
      res.json({status: "ERROR", message: err});
    });
  });
//=========================================

app.post("/burger/create", function(req, res) {
    db.Burger.create({
        name: req.body.burger_name
    }).then(function(dbPost) {
        res.redirect("/index");
    });
});

app.post("/burger/eat/:id", function(req, res) {
    return db.Customer.update({
        name: req.body.name
    }).then(function(newCustomer) {
        return db.Burger.update({
            devoured: req.body.devoured,
            CustomerId: newCustomer.id
        }, {
            where: {
                id: req.params.id
            },
            include: [db.Customer]
        });
    }).then(function() {
        res.redirect("/");
    });
});

app.post("/burgers/eat/:id", function(req, res) {
    return db.Burger.update({
        devoured: req.body.devoured
    }, {
        where: {
            id: req.params.id
        }
    }).then(function() {
        res.redirect("/index");
    });
});


}