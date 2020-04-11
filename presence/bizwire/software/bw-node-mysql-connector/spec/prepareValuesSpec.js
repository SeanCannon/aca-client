'use strict';

const prepareValues = require('../../../../server/core/utils/db/methods/prepareValues');

const FAKE_LOCATION_ID = 1,
      FAKE_FIRST_NAME  = 'Sean',
      FAKE_LAST_NAME   = 'Cannon',
      FAKE_EMAIL       = 'alienwebguy@gmailz.com',
      FAKE_PHONE       = '763-807-9338',
      FAKE_ADDRESS     = '2304 DeMartini Lane',
      FAKE_CITY        = 'Brentwood',
      FAKE_STATE       = 'CA',
      FAKE_ZIP         = '94513',
      FAKE_COUNTRY     = 'US';

const FAKE_UNSORTED_VALUES_OBJECT = {
  locationId : 1,
  firstName  : FAKE_FIRST_NAME,
  lastName   : FAKE_LAST_NAME,
  email      : FAKE_EMAIL,
  phone      : FAKE_PHONE,
  address1   : FAKE_ADDRESS,
  city       : FAKE_CITY,
  state      : FAKE_STATE,
  zip        : FAKE_ZIP,
  country    : FAKE_COUNTRY
};

const FAKE_SORTED_VALUES_ARRAY = [
  FAKE_ADDRESS,
  FAKE_CITY,
  FAKE_COUNTRY,
  FAKE_EMAIL,
  FAKE_FIRST_NAME,
  FAKE_LAST_NAME,
  FAKE_LOCATION_ID,
  FAKE_PHONE,
  FAKE_STATE,
  FAKE_ZIP
];

describe('prepareValues', () => {
  it('ensures provided data is prepped for DB insertion', () => {
    expect(prepareValues(FAKE_UNSORTED_VALUES_OBJECT)).toEqual(FAKE_SORTED_VALUES_ARRAY);
  });
});

