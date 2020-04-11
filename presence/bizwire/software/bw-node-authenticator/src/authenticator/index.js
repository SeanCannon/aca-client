'use strict';

module.exports = strategyName => require('./strategies/' + strategyName + '/strategy');
