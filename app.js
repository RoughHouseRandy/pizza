// Import the express module
import express from 'express';

// Create an instance of an 
// express application
const app = express();

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
app.get('/admin',(req,res) => {
    res.render('admin', {orders});
})

//new route to process pizza order
app.post(`/submit-order`, (req, res) => {

    //create JSON object to store order data
    const order = req.body;
    order['timestamp'] = new Date();
    console.log(order);
    // Add order object to orders array
    orders.push(order);
    console.log(orders);

    //Display the confirmation page. 
    res.render('confirm', {order});
});

//Start the server on the designated port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

