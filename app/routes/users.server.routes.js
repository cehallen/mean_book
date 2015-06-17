var users = require('../../app/controllers/users.server.controller');

module.exports = function(app) {
    app.route('/users')
        .post(users.create)
        .get(users.list);

    app.route('/users/:userID')
        .get(users.read);

    app.param('userID', users.userByID);
};

