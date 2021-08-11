const path = require('path');
const express = require('express');
const routes = require('./controllers/');
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3001;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// turn on routes
app.use(routes);

app.listen(PORT, () => console.log('Now listening'));
