require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const {errorHandler} = require('./handlers/error');
const {registerRoutes} = require('./routes/routes');
const {registerCheckOrderValidity} = require('./workers/orderValidityCheckWorker');

app.use(cors());
app.use(bodyParser.json());

registerRoutes(app);

//IF NO ROUTE MATCH, THEN
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(errorHandler); //Takes any incoming middleware with error (next)

//Workers
registerCheckOrderValidity();

const PORT = process.env.PORT || 8081;
app.listen(PORT, function(){
  console.log(`Server starting on port ${PORT}`);
})