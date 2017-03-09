const homeController = module.require('./../controllers/home');

module.exports = (app) => {
    app.get('/', homeController.loginGet);
};