// // Node Dependencies
// var express = require('express');
// var router = express.Router();
// var models = require('../models'); // Pulls out the Burger Models


// // Extracts the sequelize connection from the models object
// var sequelizeConnection = models.sequelize;

// // Sync the tables
// sequelizeConnection.sync({force:true});


// // Create routes
// // ----------------------------------------------------

// // Index Redirect
// router.get('/', function (req, res) {
//   res.redirect('/index');
// });



// // Index Page (render all burgers to DOM)
// router.get('/index', function (req, res) {

//   // Sequelize Query to get all burgers from database (and join them to their devourers, if applicable)
//   models.Burger.findAll({
//    include: [{model: models.Customer}]
//   }).then(function(data){

//     // Pass the returned data into a Handlebars object and then render it
//     var hbsObject = { burger: data };
//     // console.log(data);
//     res.render('index', hbsObject);

//   })

// });



// // Create a New Burger
// router.post('/burger/create', function (req, res) {
//   console.log(res);

//   // Sequelize Query to add new burger to database
//   models.Burger.create(
//     {
//       name: req.body.name,
//       devoured: false
//       // CustomerID: req.params.CustomerID
//     }
//   ).then(function(){
//     // After the burger is added to the database, refresh the page
//     res.redirect('/index');
//   });

// });



// // Devour a Burger
// router.post('/burger/eat/:id', function (req, res) {

//   // If not name was added, make it "Anonymous"
//   if(req.body.burgerEater == "" || req.body.burgerEater == null){
//     req.body.burgerEater = "Anonymous";
//   }

//   // Create a new burger devourer (and also associate it to the eaten burger's id)
//   models.Customer.create({
//     name: req.body.burgerEater,
//     // burgerId: req.params.id
//   })

//   // Then, select the eaten burger by its id
//   .then(function(newDevourer){

//     models.Burger.findOne( {where: {id: req.params.id} } )

//     // Then, use the returned burger object to...
//     .then(function(eatenBurger){
//       // ... Update the burger's status to devoured
//       eatenBurger.update({
//         devoured: true,
//       })

//       // Then, the burger is devoured, so refresh the page
//       .then(function(){
//         res.redirect('/index');
//       });

//     });

//   });

// });

// // ----------------------------------------------------


// // Export routes
// module.exports = router;

// require the Burger model
var express = require("express");
var app = express();

var db = require("../models");
// var router = express.Router();

var log = require("loglevel").getLogger("burgers_controller");

// Create all our routes and set up logic within those routes where required.

module.exports = function(app) {
  // Retrieve the list of all burgers in the database
  app.get("/", function(req, res) {
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
    return db.Burger.create({
        name: req.body.burger_name
    }).then(function() {
        res.redirect("/");
    });
});

app.put("/burger/update/devour/:id", function(req, res) {
    return db.Customer.create({
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

app.put("/burgers/update/return/:id", function(req, res) {
    return db.Burger.update({
        devoured: req.body.devoured
    }, {
        where: {
            id: req.params.id
        }
    }).then(function() {
        res.redirect("/burgers");
    });
});


}
  // // Create a new burger entry
  // app.post("/burger/create", function(req, res) {
  //   log.debug("___ENTER POST /burgers___");

  //   db.Burger.create(req.body)
  //   .then(function(burger) {
  //     res.redirect("/");
  //   })
  //   .catch(function(err) {
  //     log.error("ERR = " + err);
  //     res.json({status: "ERROR", message: err});
  //   });
  // });

  // // Update an existing burger entry
  // app.put("/burgers/:id", function(req, res) {
  //   log.debug("___ENTER PUT /burgers:id___");

  //   log.debug("id = " + req.params.id);
  //   log.debug("customer = " + JSON.stringify(req.body.customerName));

  //   var burgerID = req.params.id;
  //   var customerName = req.body.customerName;

  //   db.Customer.findAll({
  //     where: {
  //       name: customerName
  //     }
  //   })
  //   .then(function(customer) {
  //     // Check if customer exists
  //     if (customer.length === 0) {
  //       log.debug("customer does not exist!");

  //       // Create new customer
  //       db.Customer.create({
  //         name: customerName
  //       })
  //       .then(function(newCustomer) {
  //         log.debug("customer created = " + JSON.stringify(newCustomer));

  //         // Add customer reference to burger
  //         db.Burger.update(
  //           {
  //             devoured: true,
  //             CustomerId: newCustomer.id
  //           },
  //           {
  //             where: {
  //               id: req.params.id
  //             }
  //           }
  //         ).then(function(burger) {
  //           res.redirect('/');
  //         })
  //         .catch(function (err) {
  //           log.error("ERR = " + err);
  //           res.json({status: "ERROR", message: err});
  //         });
  //       })
  //       .catch(function(error) {
  //         log.debug("ERROR: Error on customer create -- " + JSON.stringify(error));
  //         res.json({status: "ERROR", message: error});
  //       })
  //     } else { // customer exists
  //       log.debug("customer exists = " + JSON.stringify(customer));

  //       // Add customer reference to burger
  //       db.Burger.update(
  //         {
  //           devoured: true,
  //           CustomerId: customer[0].id
  //         },
  //         {
  //           where: {
  //             id: req.params.id
  //           }
  //         }
  //       ).then(function(burger) {
  //         res.redirect('/');
  //       })
  //       .catch(function (err) {
  //         log.error("ERR = " + err);
  //         res.json({status: "ERROR", message: err});
  //       });
  //     } // end customer exists
  //   })
  //   .catch(function(error) {
  //     if(error) {
  //       log.debug("ERROR: Error on customer query -- " + JSON.stringify(error));
  //       res.json({status: "ERROR", message: error});
  //     }
  //   });
  // });
