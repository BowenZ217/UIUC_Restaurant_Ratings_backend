module.exports = (app) => {
    const restaurants = require('../controllers/restaurant.controllers.js');
    //const users = require('../controllers/user.controller.js');
    //const comments = require('../controllers/comment.controller.js');
    const router = require('express').Router();

    // Restaurants
    router.get('/api/restaurant/list', restaurants.list);
    router.get('/api/restaurant/:id', restaurants.findById);
    //router.get('/api/restaurant/:id/menu', restaurants.getMenu);
    //router.get('/api/restaurant/search', restaurants.search);

    // Users
    //router.post('/api/user/login', users.login);
    //router.get('/api/user/:id', users.findById);

    // Comments
    //router.get('/api/restaurant/:id/comments', comments.list);
    //router.post('/api/restaurant/:id/add-comment', comments.create);
    //router.post('/api/restaurant/:id/rate', restaurants.rate);
    //router.delete('/api/restaurant/:id/delete-comment', comments.delete);

    // Finish by binding the Restaurant middleware
    app.use('/', router);
};
  