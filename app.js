// Import the express module
import express from 'express';

//Import mysql
import mysql2 from 'mysql2';

//Import the .env
import dotenv from 'dotenv';
dotenv.config();

//import express-session
import session from 'express-session';


//Create a connection pool
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

// Create an instance of an 
// express application
const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60}
}));

function requireLogin(req,res, next) {
    if(req.session.loggedIn){
        next();
    } else {
        res.redirect('/login');
    }
}

//Define a port number for 
//our server to listen on

const PORT = 3000;

// Create an array to store orders
const orders = [];


//Enable static file serving 
app.use(express.static('public'));

// Allow "middleware" to allow the app to parse form data
// access form data through req.body
app.use(express.urlencoded({extended: true}));

//Set view engine to EJS
app.set('view engine', 'ejs');

//Define a default route ("/")
app.get('/', (req,res) => {
    res.render('home');
});

// //Create a route to test the database
// app.get('/db-test', async(req,res)=> {
//     try{
//         const orders = await 
//         pool.query('SELECT * FROM orders');
//         res.send(orders[0]);
//     } catch(err) {
//         console.error('Database error: ', err);
//         res.status(500).send('Database error occured.');
//     }
// });

// Add a contact route to display a contact view page
app.get('/contact-us', (req,res) => {
    res.render('contact');
});

//Add a menu 
app.get(`/menu`, (req, res) => {
    res.render('menu');
});

// // Add a confirm order route.
// app.get(`/confirm-order`, (req,res) => {
//     res.render('confirm');
// });

// Add an admin route
app.get('/admin', requireLogin, async(req,res) => {
    try {
        const [orders] = await
            pool.query('SELECT * FROM orders ORDER BY timestamp DESC');
            console.log(orders);
            res.render('admin', {orders});
    } catch(err) {
        console.error('Database error: ', err);
        res.status(500).send('Database error occured.');
    }
    
})

//add a route for log in page
app.get('/login', (req,res) => {
    res.render('login', {error: null});
})

app.post('/login', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username === process.env.ADMIN_USER && 
        password === process.env.ADMIN_PASSWORD) {
            
            req.session.loggedIn = true;

            res.redirect('/admin');
        } else {
            res.render('login', {error: 'Invalid username or password'});
        }
})

app.get('/logout', (req,res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

//new route to process pizza order
app.post(`/submit-order`, async(req, res) => {

    //create JSON object to store order data
    const order = req.body;
    order.timestamp = new Date();
    console.log(order);

    //convert toppings array to a comma-delimited string
    order.toppings = Array.isArray(order.toppings) ? 
        order.toppings.join(", ") : "";

    //define an sql query to insert the new order
    const sql = 'INSERT INTO orders (fname, lname, email, size, method, toppings, comment) VALUES(?, ?, ?, ?, ?, ?, ?)';

    const params = [
        order.fname,
        order.lname,
        order.email,
        order.size,
        order.method,
        order.toppings,
        order.comment
    ];

    // Execute the query
    const [result] = await pool.execute(sql, params);

    //Get the id from the newly inserted row
    order.id = result.insertId;
    console.log("A new row was inserted with ID: " + order.id);

    //Display the confirmation page. 
    res.render('confirm', {order});
});

//Start the server on the designated port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

