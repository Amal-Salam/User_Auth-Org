require('dotenv').config({ debug: true });

const express = require('express');
const userRoutes = require('./routes/UserRoutes');
const organisationsRoute = require('./routes/OrgRoutes');
const bodyParser = require('body-parser');



const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

app.use('/auth', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organisations', organisationsRoute);

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});

module.exports = app;
