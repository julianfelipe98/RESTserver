const express=require('express');
const app=express();
/* -------------------------------------------------------------------------- */
/*                                   ROUTES                                   */
/* -------------------------------------------------------------------------- */
app.use(require('./user'));
app.use(require('./login'));

module.exports=app;