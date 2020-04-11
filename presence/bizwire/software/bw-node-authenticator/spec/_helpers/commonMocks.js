'use strict';

const R          = require('ramda'),
      config     = require('config'),
      dbUtils = require('../../server/core/utils/db/DB')(null);

const VALIDATION_ERROR_KEY_ILLEGAL_PARAM               = 'VALUE',
      VALIDATION_ERROR_KEY_MISSING_PARAM               = 'REQUIRED',
      VALIDATION_ERROR_KEY_UNSUPPORTED_PARAM           = 'UNSUPPORTED',
      APPLICATION_ERROR_CODE_DB_DUPLICATE_ENTRY        = 6002,
      APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT = 6999,
      APPLICATION_ERROR_CODE_FLAGGED_ITEM              = R.path(['errors', 'FLAGGED_ITEM'], config);

const COMMON_TIMESTAMP = new Date('2016-02-01T17:23:30.000Z');

const _getRandomLetter = () => {
  const NUM_LETTERS_IN_ALPHABET  = 26,
        CHAR_CODE_LETTER_A_INDEX = 97;

  const randomLetterIndex              = Math.floor(Math.random() * NUM_LETTERS_IN_ALPHABET);
  const randomCharCodeIndexFromLetterA = randomLetterIndex + CHAR_CODE_LETTER_A_INDEX;

  const toCharCode = index => '0' + index;

  return String.fromCharCode(toCharCode(randomCharCodeIndexFromLetterA));
};

const transformDbColsToJsProps = dbUtils.transformQueryResponse;

const createFakeReferenceNumber = (length) => {
  return '*'.repeat(length).split('').map(_getRandomLetter).join('').toUpperCase();
};

const COMMON_REQUEST_BODY = {
  flash   : R.identity,
  session : {
    flash : {}
  }
};

const COMMON_EMPTY_REQUEST_ERROR = new TypeError('Cannot set property "flash" of undefined');

const COMMON_RESPONSE_BODY = {
  locals : {},
  set    : () => COMMON_RESPONSE_BODY,
  status : () => COMMON_RESPONSE_BODY,
  send   : R.identity,
  json   : R.identity
};

const COMMON_DB_UPDATE_OR_DELETE_RESPONSE = {
  affectedRows : 1,
  warningCount : 0,
  message      : '',
  changedRows  : 0
};

const COMMON_DB_NO_AFFECTED_ROWS_RESPONSE = {
  affectedRows : 0,
  warningCount : 0,
  message      : '',
  changedRows  : 0
};

const validationErr = R.curry((errorKey, namespace, param) => {
  const errorTemplate  = R.path(['errors', 'validation', errorKey], config),
        message        = '[' + R.toUpper(namespace) + '] : ' + errorTemplate.message + ': ' + param,
        displayMessage = errorTemplate.message + ': ' + param,
        property       = param;

  return R.mergeDeepRight(errorTemplate, {
    message,
    displayMessage,
    property
  });
});

const noResultsErr = R.path(['errors', 'db', 'NO_QUERY_RESULTS'], config);

/**
 * Mock a `duplicate record` error normally returned from MySQL when attempting
 * to insert a row that shares a primary key or unique field.
 *
 * @param {String|Boolean|Number} propVal
 * @param {String} propName
 * @returns {{code: number, message: string}}
 */
const duplicateRecordErr = (propVal, propName) => {
  return {
    code    : APPLICATION_ERROR_CODE_DB_DUPLICATE_ENTRY,
    message : 'ER_DUP_ENTRY: Duplicate entry \'' + propVal + '\' for key \'' + propName + '\''
  };
};

/**
 * Mock a `duplicate record` error normally returned from MySQL when attempting
 * to insert a row that shares a composite primary key.
 *
 * @param {String} a The first field in the composite key
 * @param {String} b The second field in the composite key
 * @returns {{code: number, message: string}}
 */
const duplicateRecordErrCompositePrimary = (a, b) => {
  return {
    code    : APPLICATION_ERROR_CODE_DB_DUPLICATE_ENTRY,
    message : 'ER_DUP_ENTRY: Duplicate entry \'' + a + '-' + b + '\' for key \'PRIMARY\''
  };
};

/**
 * Mock a `duplicate record` error normally returned from MySQL when attempting
 * to insert a row that shares a composite index.
 *
 * @param fieldA
 * @param fieldB
 * @param key
 * @returns {{code: number, message: string}}
 */
const duplicateRecordErrComposite = (fieldA, fieldB, key) => {
  return {
    code    : APPLICATION_ERROR_CODE_DB_DUPLICATE_ENTRY,
    message : 'ER_DUP_ENTRY: Duplicate entry \'' + fieldA + '-' + fieldB + '\' for key \'' + key + '\''
  };
};

/**
 * Mock a `duplicate record` error normally returned from MySQL when attempting
 * to insert a row that shares a composite index.
 *
 * @param {Array} fields
 * @param key
 * @returns {{code: number, message: string}}
 */
const duplicateRecordErrCompositeN = (fields, key) => {
  return {
    code    : APPLICATION_ERROR_CODE_DB_DUPLICATE_ENTRY,
    message : 'ER_DUP_ENTRY: Duplicate entry \'' + fields.join('-') + '\' for key \'' + key + '\''
  };
};

/**
 * Mock a `foreign key constraint fails` error normally returned from MySQL when attempting
 * to insert a row that provides an unknown value for a foreign key.
 *
 * @param constraintName
 * @param localTable
 * @param localField
 * @param foreignTable
 * @param foreignField
 * @returns {{code: number, message: string}}
 */
const foreignKeyConstraintErr = (constraintName, localTable, localField, foreignTable, foreignField) => {
  // TODO Make the db name injectable here so if the spec isn't using coreDb it'll still work
  return {
    code    : APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT,
    message : 'ER_NO_REFERENCED_ROW_2: Cannot add or update a child row: a foreign key constraint fails (`' + process.env.CORE_DB_NAME + '`.`' + localTable + '`, CONSTRAINT `' + constraintName + '` FOREIGN KEY (`' + localField + '`) REFERENCES `' + foreignTable + '` (`' + foreignField + '`) ON DELETE CASCADE)'
  };
};


const flaggedItemErr = {
  code    : APPLICATION_ERROR_CODE_FLAGGED_ITEM,
  message : 'This item has been flagged and can not be retrieved.'
};

/**
 * Return a new object that matches `originalObj` except with the new
 * key/val assignment provided by the overrides.
 *
 * @param {Object} originalObj The object used as the reference.
 * @param {String} overrideKey The property name we will be overriding.
 * @param {*}      overrideVal The new value
 * @returns {Object}
 */
const override = R.curry((originalObj, overrideKey, overrideVal) => {
  return R.mergeDeepRight(originalObj, R.objOf(overrideKey, overrideVal, {}));
});

const recursivelyOmitProps = R.curry((omittedPropsArr, v) => {
  if (!R.is(Object, v)) {
    return v;
  }
  if (!R.is(Array,v)) {
    v = R.omit(omittedPropsArr, v);
  }
  return R.map(recursivelyOmitProps(omittedPropsArr), v);
});

const ensureTrueNullInCsvData = R.map(R.when(R.identical('NULL'), R.always(null)));

module.exports = {
  illegalParamErr     : validationErr(VALIDATION_ERROR_KEY_ILLEGAL_PARAM),
  missingParamErr     : validationErr(VALIDATION_ERROR_KEY_MISSING_PARAM),
  unsupportedParamErr : validationErr(VALIDATION_ERROR_KEY_UNSUPPORTED_PARAM),
  APPLICATION_ERROR_CODE_DB_DUPLICATE_ENTRY,
  APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT,
  createFakeReferenceNumber,
  transformDbColsToJsProps,
  override,
  recursivelyOmitProps,
  ensureTrueNullInCsvData,
  COMMON_TIMESTAMP,
  COMMON_REQUEST_BODY,
  COMMON_EMPTY_REQUEST_ERROR,
  COMMON_RESPONSE_BODY,
  COMMON_DB_UPDATE_OR_DELETE_RESPONSE,
  COMMON_DB_NO_AFFECTED_ROWS_RESPONSE,
  noResultsErr,
  duplicateRecordErr,
  duplicateRecordErrCompositePrimary,
  duplicateRecordErrComposite,
  duplicateRecordErrCompositeN,
  foreignKeyConstraintErr,
  flaggedItemErr
};
