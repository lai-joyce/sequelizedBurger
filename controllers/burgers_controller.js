// require the Burger model
var express = require("express");
var app = express();

var db = require("../models");
// var router = express.Router();

// Create all our routes and set up logic within those routes where required.

module.exports = function(app) {

  app.get('/', function (req, res) {
  res.redirect('/index');
});
  // Retrieve the list of all burgers in the database
  app.get("/index", function(req, res) {

    db.Burger.findAll({
        order: [
            ["name", "ASC"]
        ],
        include: [{
            model: db.Customer,
            attributes: ["name"]
        }]
    })
    .then(function(data) {

      var hbsObject = {
        burgers: data
      };
      console.log(hbsObject);
      res.render('index', hbsObject);
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
    db.Customer.create({
        name: req.body.burgerEater
    }).then(function(newCustomer) {
        db.Burger.update({
            devoured: true,
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




}