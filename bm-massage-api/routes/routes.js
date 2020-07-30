const db = require('../models/index');

//IMPORT HANDLERS
const authHandler = require('./../handlers/auth');
const seedHandler = require('./../handlers/seed');
const msCityHandler = require('./../handlers/msCityHandler');
const msMassageTypeHandler = require('./../handlers/msMassageTypeHandler');
const trAdminHandler = require('./../handlers/trAdminHandler');
const trMassagePlaceHandlers = require('./../handlers/trMassagePlaceHandler');
const trMemberHandler = require('./../handlers/trMemberHandler');
const trMassageHandler = require('./../handlers/trMassageHandler');
const trOrderHandler = require('./../handlers/trOrderHandler');
const trBanHandler = require('./../handlers/trBanHandler');
const dataHandler = require('./../handlers/dataHandler');

module.exports.registerRoutes = function (app) {
  /**
   * Register your routes here
   * app.use(prefix, routes_arr)
   * app.use(prefix, middlewares_arr, routes_arr)
   */
  app.use('/api/auth',
    Route.routes([
      Route.post('/owner/signin', authHandler.ownerSignIn), //OK
      Route.post('/member/signin', authHandler.memberSignin), //OK
      Route.post('/member/signup', authHandler.memberSignup), //OK 
      Route.post('/admin/signin', authHandler.adminSignin) //OK 
    ])
  );

  app.use('/api/seed',
    Route.routes([
      Route.post('/seedcities', seedHandler.seedCities), //OK
      Route.post('/seedmassagetype', seedHandler.seedMassageTypes) //OK
    ])
  )

  app.use('/api/city',
    Route.routes([
      Route.get('/getall', msCityHandler.getAllCities), //OK
      Route.get('/:id/getallmassageplaces', msCityHandler.getAllMassagePlaces), //OK
    ])
  );

  app.use('/api/massagetype',
    Route.routes([
      Route.get('/getall', msMassageTypeHandler.getallMassageTypes) //OK
    ])
  );

  app.use('/api/admin',
    Route.routes([
      Route.get('/getall', trAdminHandler.getAll),
      Route.get('/:id', trAdminHandler.getByID),
      Route.post('/:id/update', trAdminHandler.update), //OK
      Route.delete('/:id/delete', trAdminHandler.delete) //OK
    ])
  );

  app.use('/api/massageplace',
    Route.routes([
      Route.post('/:cityid/insert', trMassagePlaceHandlers.insert), //OK
      Route.post('/:massageplaceid/addadmin', trMassagePlaceHandlers.addAdmin), //OK
      Route.get('/:massageplaceid/getadmins', trMassagePlaceHandlers.getAdmins), //OK
      Route.get('/:massageplaceid/getdetail', trMassagePlaceHandlers.getDetail), //OK
      Route.patch('/:massageplaceid/update', trMassagePlaceHandlers.update), //OK
      Route.get('/getallwithdetail', trMassagePlaceHandlers.getAllWithDetail), //OK
      Route.get('/:massageplaceid/getongoingorders', trMassagePlaceHandlers.getOngoingOrders), //OK
      Route.get('/:massageplaceid/getorderlog', trMassagePlaceHandlers.getOrderLog), //OK
      Route.get('/:massageplaceid/getmembercontrols', trMassagePlaceHandlers.getMemberControlList) //OK
    ])
  );

  app.use('/api/massage',
    Route.routes([
      Route.post('/:massageplaceid/insert', trMassageHandler.insert) //OK
    ])
  );

  app.use('/api/order',
    Route.routes([
      Route.post('/:memberid/:massageid/insert', trOrderHandler.addOrder), //OK
      Route.patch('/:orderid/makehistory', trOrderHandler.moveOrderToHistory) //OK
    ])
  );

  app.use('/api/member',
    Route.routes([
      Route.get('/:memberid/getongoingorders', trMemberHandler.getOngoingOrders),
      Route.get('/:memberid/getorderhistory', trMemberHandler.getOrderHistory)
    ])
  );

  app.use('/api/ban',
    Route.routes([
      Route.post('/', trBanHandler.createBanRequest),
      Route.get('/getbanrequests', trBanHandler.getBanRequests),
      Route.post('/:banid/revokeban', trBanHandler.revokeBanRequest),
      Route.post('/:banid/banmember', trBanHandler.banMember)
    ])
  );

  app.use('/api/data',
    Route.routes([
      Route.get('/rangeddate/:startDate/:endDate', dataHandler.rangedDateDatas)
    ]));
}

class Route {
  constructor() {

  }
}

Route.post = function (endpoint, handler) {
  return function (router) {
    router.post(endpoint, handler);
  }
}

Route.get = function (endpoint, handler) {
  return function (router) {
    router.get(endpoint, handler);
  }
}

Route.put = function (endpoint, handler) {
  return function (router) {
    router.put(endpoint, handler);
  }
}

Route.patch = function (endpoint, handler) {
  return function (router) {
    router.patch(endpoint, handler);
  }
}

Route.delete = function (endpoint, handler) {
  return function (router) {
    router.delete(endpoint, handler);
  }
}

/**
 * @param {*} methodHandlers -> Array filled with callbacks to be attached to router
 * e.g : 
 * [
 *  post(endpoint, handler),
 *  get(endpoint, handler)
 * ]    
 */
Route.routes = function (methodHandlers) {
  const express = require('express')
  const router = express.Router({
    mergeParams: true
  });
  methodHandlers.forEach((callback) => {
    callback(router);
  });
  return router;
}