const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/[ITDivBootcamp]BM-Massage", {
  keepAlive: true,
  useNewUrlParser: true
});

module.exports = {
  TrAdmin: require('./trAdmin'),
  MsCity: require('./msCity'),
  MsMassageType: require('./msMassageType'),
  TrMassagePlace: require('./trMassagePlace'),
  TrOrder: require('./trOrder'),
  HrOrder: require('./hrOrder'),
  TrMember: require('./trMember'),
  TrMassage: require('./trMassage'),
  TrActiveBan: require('./trActiveBan'),
  TrBanRequest: require('./trBanRequest')
}