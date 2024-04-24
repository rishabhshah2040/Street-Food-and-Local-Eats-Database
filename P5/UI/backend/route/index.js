const dishRoute = require('./dishRoute');
const userRoute = require('./userRoute');

module.exports = (app) => {
    app.use('/dish',dishRoute);
    app.use('/user',userRoute);
};
