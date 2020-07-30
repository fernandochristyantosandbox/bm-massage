const db = require('../models');
const ObjectId = require('mongodb').ObjectId;

/**
 * Get currently going orders
 * @param {string} memberid 
 */
exports.getOngoingOrders = async function (req, res, next) {
    try {
        const orders = await db.TrOrder.find({ member: new ObjectId(req.params.memberid) })
            .populate(
                {
                    path: "massage",
                    select: {
                        'orders': 0,
                        'orderHistories': 0
                    },
                    populate: [
                        {
                            path: "massagePlace",
                            select: {
                                'admins': 0,
                                'massages': 0,
                                'massagers': 0
                            },
                            populate: [
                                {
                                    path: "city",
                                    select: {
                                        'massagePlaces': 0
                                    }
                                }
                            ]
                        }
                    ]
                })
            .then(res => res)
            .catch(err => next(err))

        return res.status(200).json(orders);
    }
    catch (err) {
        return next(err);
    }
}

/**
 * Get order histories
 * @param {string} memberid 
 */
exports.getOrderHistory = async function (req, res, next) {
    try {
        const member = await db.TrMember.findById(req.params.memberid)
            .populate({
                path: "orderHistories",
                populate: [
                    {
                        path: "massage",
                        select: {
                            orderHistories: 0,
                            orders: 0
                        }
                    }
                ]
            })
            .then(res => {
                return res;
            })
            .catch(err => next(err));

        return res.status(200).json(member);
    }
    catch (err) {
        return next(err);
    }
}