module.exports = function (app, passport, db) {
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });

  // PROFILE SECTION =========================
  // once the user logs in the'll be able to see the orders here

  //we will get the barista's name from this database
  app.get("/profile", isLoggedIn, function (req, res) {
    db.collection("orders")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("profile.ejs", {
          user: req.user,
          incompleteOrders: result.filter((order) => order.completed === false),
          completedOrders: result.filter((order) => order.completed === true)
          //result is an array of orders
        });
      });
  });

  // LOGOUT ==============================
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // message board routes ===============================================================

  // customers name and order to be sent to the collection
  app.post("/orders", (req, res) => {
    console.log("customername", req.body.customerName)
    db.collection("orders").insertOne(
      { customerName: req.body.customerName, customerOrder: req.body.customerOrder, completed:false, assigned: null},
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.status(200)
        res.send('ok') // this will send a 200 status message of it being ok
        //it should go down the 'thanks for the order' path
      }
    );
  });

// once the order is completed, it will be added to another list that only the barista
// that completed it  can see
// have the orders show up on a list on the barista's profile page
const mongoose = require("mongoose");
app.put("/orders", (req, res) => {
    db.collection("orders").findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.body.orderId) },
      {
        $set: {
          completed: true,
          assigned: req.body.barista
        },
      },
      {
        sort: { _id: -1 },
        upsert: true,
      },
      (err, result) => {
        console.log(result)
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });

// the barista is deleting the completed orders here
  app.delete("/orders", (req, res) => {
    db.collection("orders").findOneAndDelete(
      { _id: new mongoose.Types.ObjectId(req.body.orderId)  },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send("Message deleted!");
      }
    );
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}