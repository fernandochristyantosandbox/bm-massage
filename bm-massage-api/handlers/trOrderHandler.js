const db = require('../models');
const ObjectId = require('mongodb').ObjectId;

async function getOngoingOrderCount(massageplaceid) {
    const massagePlace = await db.TrMassagePlace.findById(massageplaceid)
        .populate({ 
            "path" : "massages",
            "populate": [
                { "path": "orders" }
            ]
        })
        .then(res => res)
        .catch(err => err);
    let currentOrderCount = 0;
    massagePlace.massages.forEach(massage => {
        currentOrderCount += massage.orders.length;
    })
    return currentOrderCount;
}

/**
 * 
 * @param {string} memberid
 * @param {string} massageid 
 */
exports.addOrder = async function (req, res, next) {
    try {
        const massage = await db.TrMassage.findById(req.params.massageid)
            .then(res => res)
            .catch(err => next(err));
        
        const currentOrderCount = await getOngoingOrderCount(massage.massagePlace._id);
        const massagePlace = await db.TrMassagePlace.findById(massage.massagePlace._id)
            .then(res => res)
            .catch(err => err);
        if(massagePlace.capacity <= currentOrderCount)
            return next({status: 400, message: 'Capacity for this massage place is no longer available'});

        const order = await db.TrOrder.create({
            member: req.params.memberid,
            massage: req.params.massageid
        })
            .then(res => res)
            .catch(err => next(err));


        massage.orders.push(order.id);
        await massage.save()
        const member = await db.TrMember.findById(req.params.memberid)
            .then(res => res)
            .catch(err => next(err));
        member.orders.push(order.id);
        await member.save();

        return res.status(200).json(order);
    }
    catch (ex) {
        return next(ex);
    }
}

/**
 * 
 * @param {string} orderid
 * @param {bool} iscomplete
 */
exports.moveOrderToHistory = async function (req, res, next) {
    try {
        const isComplete = req.query.isComplete;
        if (isComplete !== 'true' && isComplete !== 'false')
            return next({ status: 400, message: 'isComplete must be true or false' });

        const order = await db.TrOrder.findById(req.params.orderid)
            .then(res => res)
            .catch(err => next(err));

        //put to history
        const insertedHistory = await db.HrOrder.create({
            ...order,
            _id: new ObjectId(order._id),
            member: order.member._id,
            massage: order.massage._id,
            isComplete: (isComplete === 'true')
        })
            .then(res => res)
            .catch(err => next(err));

        await db.TrOrder.findByIdAndRemove(req.params.orderid);

        //remove from trmassage and user
        const massage = await db.TrMassage.findById(order.massage);

        massage.orders.remove(req.params.orderid);
        massage.orderHistories.push(req.params.orderid);
        await massage.save();

        const member = await db.TrMember.findById(order.member);
        member.orders.remove(req.params.orderid);
        member.orderHistories.push(req.params.orderid);
        await member.save();

        return res.status(200).json(insertedHistory);
    }
    catch (err) {
        return next(err);
    }
}   