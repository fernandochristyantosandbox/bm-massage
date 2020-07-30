const moment = require('moment-timezone');
const db = require('../models');

exports.registerCheckOrderValidity = async function (delay = 300000) {
    const workerDelay = delay;
    let orderCheckerTimeout = setTimeout(async function check() {
        //Check if orders are still valid 
        const allOngoingOrders = await fetchAllOngoingOrders();
        allOngoingOrders.forEach(order => {
            if (!isOrderValid(order, 120)) {
                //Order expired
                moveOrderToHistory(order);
            }
        })
        orderCheckerTimeout = setTimeout(check, workerDelay);
    }, workerDelay)
}

async function moveOrderToHistory(order) {
    const orderId = order._id;

    //put to history
    const insertedHistory = await db.HrOrder.create({
        ...order,
        member: order.member._id,
        massage: order.massage._id,
        isComplete: false
    })
        .then(res => res)
        .catch(err => next(err));

    await db.TrOrder.findByIdAndRemove(orderId);

    //remove from trmassage and user
    const massage = await db.TrMassage.findById(order.massage._id);

    massage.orders.remove(orderId);
    massage.orderHistories.push(orderId);
    await massage.save();

    const member = await db.TrMember.findById(order.member._id);
    member.orders.remove(orderId);
    member.orderHistories.push(orderId);
    await member.save();
}

async function fetchAllOngoingOrders() {
    return await db.TrOrder.find({})
        .then(res => res)
        .catch(err => err);
}

function isOrderValid(order, minutesUntilNotValid) {
    let createdAt = order.createdAt;
    createdAt = moment.tz(createdAt, 'GMT').format();

    const today = new Date();
    const target = new Date(createdAt);
    const diffMs = (target - today); // milliseconds between now & target
    const diffMins = Math.abs((diffMs / 1000) / 60);

    if (diffMins > minutesUntilNotValid)
        return false;
    return true;
}