const db = require('../models');

/**
 * @param {string} startDate 
 * @param {string} endDate 
 */
exports.rangedDateDatas = async function (req, res, next) {
  try {
    const { startDate, endDate } = req.params;

    const orderHistoriesBetweenDates = await db.HrOrder.find({
      // $and: [{ createdAt: { $lte: new Date(startDate) } }, { createdAt: { $gte: new Date(endDate) } }]

      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })
    .populate({
      path: "massage",
      select: {
        massageName: 1,
        price: 1
      }
    })
    .populate({
      path: "member",
      select: {
        username: 1
      }
    });

    let retDatas = new Array();
    let currDate = -1;
    let index = -1;
    orderHistoriesBetweenDates.forEach(order => {
      let createdAt = new Date(order.createdAt).setHours(0,0,0,0);
      if(currDate !== createdAt){
        currDate = createdAt;
        retDatas.push({date: currDate, profit: 0})
        index++;
      }
      retDatas[index].profit += order.massage.price;
    }); 

    return res.status(200).json(retDatas);
  }
  catch (err) {
    return next(err);
  }
}