const homeController = module.require('./../controllers/home');
const adsController = module.require('./../controllers/ads');

module.exports = (app) => {
    app.get('/', homeController.loginGet);
    app.post('/', homeController.loginPost);

    app.get('/home/profile', adsController.Advertisements);
};