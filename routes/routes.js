module.exports = (app) => {
    const restaurants = require('../controllers/restaurant.controllers.js');
    const users = require('../controllers/user.controller.js');
    const comments = require('../controllers/comment.controller.js');
    const router = require('express').Router();

    // Restaurants
    router.get('/api/restaurant/list', restaurants.list);
    router.get('/api/restaurant/search', restaurants.search);
    router.get('/api/restaurant/:id/menu', restaurants.getMenu);
    router.post('/api/restaurant/:id/rate', restaurants.rate);
    router.get('/api/restaurant/:id', restaurants.findById);

    // Users
    router.post('/api/user/login', users.login);
    router.post('/api/user/register', users.register);
    //router.get('/api/user/:id', users.findById);

    // Comments
    router.get('/api/restaurant/:id/comments', comments.getComments);
    router.post('/api/restaurant/:id/add-comment', comments.addComment);
    router.post('/api/restaurant/:id/rate-comment/:commentsID', comments.rateComment);
    //router.delete('/api/restaurant/:id/delete-comment', comments.delete);

    // Finish by binding the Restaurant middleware
    app.use('/', router);
};
  