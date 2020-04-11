import * as R     from 'ramda';
import changeCase from 'change-case';

import { store, history } from '../../store';

const globalErrors                     = window.WINSTON.errors;
const codeValues                       = R.compose(R.pluck('code'), R.values);

const validationCodes                  = codeValues(globalErrors.validation);
const authCodes                        = codeValues(globalErrors.auth);

const isMissingRequiredField           = R.pathEq(['data', 'code'], globalErrors.validation.REQUIRED.code);
const isUnsupportedFieldValue          = R.pathEq(['data', 'code'], globalErrors.validation.UNSUPPORTED.code);
const isValidationError                = R.compose(R.contains(R.__, validationCodes), R.path(['data', 'code']));
const isAuthError                      = R.compose(R.contains(R.__, authCodes),       R.path(['data', 'code']));

const decorateForMissingRequiredField  = R.compose(R.concat(R.__, ' is required'),    changeCase.titleCase, R.path(['data', 'property']));
const decorateForUnsupportedFieldValue = R.compose(R.concat('Unsupported property '), changeCase.titleCase, R.path(['data', 'property']));

const findFirstServerErrorMessage = err => R.find(R.identity, [
  R.pathOr('', ['data', 'displayMessage'], err),
  R.pathOr('', ['data', 'message'],        err),
  'Server error'
]);

const getAppropriateErrorMessage = R.cond([
  [isMissingRequiredField,  decorateForMissingRequiredField],
  [isUnsupportedFieldValue, decorateForUnsupportedFieldValue],
  [R.T,                     findFirstServerErrorMessage]
]);

const maybeDisplayValidationError = err => {
  if (R.either(isAuthError, isValidationError)(err)) {
    store.dispatch({
      type : 'app.notify',
      data : {
        message  : getAppropriateErrorMessage(err),
        severity : 'error'
      }
    });
  }
};

const handleError = err => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }


  if (err.raw) {
    err.raw.json().then(JSON.parse).then(err => {
      console.log('err = ', err);
      maybeDisplayValidationError(err);

    })
  }

};

export default handleError;
