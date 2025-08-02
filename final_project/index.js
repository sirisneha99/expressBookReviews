const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    // Check if access token exists in session
    if(req.session.authorization) {
        // Get the access token from session
        let token = req.session.authorization['accessToken'];
        
        // Verify the JWT token
        jwt.verify(token, "access", (err, user) => {
            if(!err) {
                // Token is valid, attach user info to request and proceed
                req.user = user;
                next(); // Proceed to the next middleware/route
            } else {
                // Token is invalid
                return res.status(403).json({message: "User not authenticated"});
            }
        });
    } else {
        // No authorization session found
        return res.status(403).json({message: "User not logged in"});
    }
});
 
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));