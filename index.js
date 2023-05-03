require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;

const cors = require('cors');
var corsOptions = {
    origin: "http://localhost:3000"
};
  
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to cs222-team46 application." });
});

// Import routes and give the server access to them.
const routes = require('./routes/routes');
routes(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
