'use strict';

const failed = report => err => [report, { status : 1, err }];

module.exports = report => {

  try {

    const DB = require('../../../utils/db');

    return new Promise(resolve => {
      DB.querySafe(['SELECT version()', []])
        .then(() => resolve([report, { status : 0 }]))
        .catch(({ message })=> resolve(failed(report)(message)));
    });

  } catch (err) {
    return Promise.resolve(failed(report)(err));
  }

};
