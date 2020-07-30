const moment = require('moment-timezone');
const zone = 'Asia/Bangkok';

export function convertZone(date, targetZone = zone) {
    moment.locale('id');
    return moment.tz(date, targetZone).format();
}

export function formatDate(date, format = 'LL HH:mm:ss') {
    return moment(date).format(format);
}

export function addMinutesToDate(date, minutes, format = 'LL HH:mm:ss') {
    return moment(date)
        .add(minutes, 'minutes')
        .format(format);
}

export function minuteDiffFromNow(timestamp) {
    const today = new Date();
    const target = new Date(timestamp);
    const diffMs = (target - today); // milliseconds between now & target
    const diffDays = Math.floor(diffMs / 86400000); // days
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

    return diffMins;
}