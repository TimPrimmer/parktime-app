const path = require('path');
const express = require('express');
const routes = require('./controllers/');
<<<<<<< HEAD
const exphbs = require('express-handlebars');
=======
const sequelize = require('./config/connection');
const cors = require('cors');
>>>>>>> develop

const app = express();
const PORT = process.env.PORT || 3001;

<<<<<<< HEAD
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
=======
app.use(cors());
>>>>>>> develop

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// turn on routes
app.use(routes);

// turn on connection to database and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});