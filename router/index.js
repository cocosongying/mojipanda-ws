const Notice = require('../controller/notice');

const notice = [
    ["/broadcast", Notice.broadcast],
    ["/direct", Notice.direct],
];

module.exports = [
    [notice, "/notice"],
];