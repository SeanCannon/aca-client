'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const lookupOrder = require('../../../../server/core/controllers/api/translate/translate');

const {
        SUPPORTED_LOOKUP_TYPES : {
          LOOKUP_TYPE_ACCOUNT_NUMBER,
          LOOKUP_TYPE_CONFIRMATION_NUMBER,
          LOOKUP_TYPE_ESHEET_ID,
          LOOKUP_TYPE_MEDIA_GROUP_ID,
          LOOKUP_TYPE_SALES_ORDER_ID
        }
      } = require('../../../../server/core/services/order/helpers/constants');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      ORDER_PRIVATE_FIELDS  = R.path(['api', 'ORDER_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, ORDER_PRIVATE_FIELDS);

const FAKE_UNKNOWN_ID                        = 999,
      FAKE_UNKNOWN_TYPE                      = 'foo',
      KNOWN_TEST_ACCOUNT_NUMBER_WITH_11_ROWS = 212121;

let KNOWN_ORDER_DATA,
    KNOWN_TEST_ESHEET_ID,
    KNOWN_TEST_ACCOUNT_NUMBER,
    KNOWN_TEST_MEDIA_GROUP_ID,
    KNOWN_TEST_CONFIRMATION_NUMBER,
    KNOWN_TEST_SALES_ORDER_ID;

describe('orderCtrl.lookupOrder', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, `../../../../run/env/test/seedData/coreDb/orders.csv`), (err, data) => {

      KNOWN_ORDER_DATA = R.compose(R.omit(privateFields), R.head, commonMocks.transformDbColsToJsProps)(data);

      KNOWN_TEST_ESHEET_ID           = KNOWN_ORDER_DATA[LOOKUP_TYPE_ESHEET_ID][0];
      KNOWN_TEST_ACCOUNT_NUMBER      = KNOWN_ORDER_DATA[LOOKUP_TYPE_ACCOUNT_NUMBER];
      KNOWN_TEST_MEDIA_GROUP_ID      = KNOWN_ORDER_DATA[LOOKUP_TYPE_MEDIA_GROUP_ID][0];
      KNOWN_TEST_CONFIRMATION_NUMBER = KNOWN_ORDER_DATA[LOOKUP_TYPE_CONFIRMATION_NUMBER];
      KNOWN_TEST_SALES_ORDER_ID      = KNOWN_ORDER_DATA[LOOKUP_TYPE_SALES_ORDER_ID];

      done();
    });
  });


  it('responds with data when looking up order by known esheet id', done => {
    lookupOrder({ id : KNOWN_TEST_ESHEET_ID, type : LOOKUP_TYPE_ESHEET_ID })
      .then(res => {
        commonMocks.recursivelyOmitProps(['timestamp', 'created'], res.orderList)
          .map(row => expect(row[LOOKUP_TYPE_ESHEET_ID]).toContain(KNOWN_TEST_ESHEET_ID));
        done();
      });
  });

  it('responds with data when looking up order by known account number', done => {
    lookupOrder({ id : KNOWN_TEST_ACCOUNT_NUMBER, type : LOOKUP_TYPE_ACCOUNT_NUMBER })
      .then(res => {
        commonMocks.recursivelyOmitProps(['timestamp', 'created'], res.orderList)
          .map(row => expect(row[LOOKUP_TYPE_ACCOUNT_NUMBER]).toBe(KNOWN_TEST_ACCOUNT_NUMBER));
        done();
      });
  });

  it('responds with data when looking up order by known order confirmation id', done => {
    lookupOrder({ id : KNOWN_TEST_CONFIRMATION_NUMBER, type : LOOKUP_TYPE_CONFIRMATION_NUMBER })
      .then(res => {
        commonMocks.recursivelyOmitProps(['timestamp', 'created'], res.orderList)
          .map(row => expect(row[LOOKUP_TYPE_CONFIRMATION_NUMBER]).toBe(KNOWN_TEST_CONFIRMATION_NUMBER));
        done();
      });
  });

  it('responds with data when looking up order by known media group id', done => {
    lookupOrder({ id : KNOWN_TEST_MEDIA_GROUP_ID, type : LOOKUP_TYPE_MEDIA_GROUP_ID })
      .then(res => {
        commonMocks.recursivelyOmitProps(['timestamp', 'created'], res.orderList)
          .map(row => expect(row[LOOKUP_TYPE_MEDIA_GROUP_ID]).toContain(KNOWN_TEST_MEDIA_GROUP_ID));
        done();
      });
  });

  it('responds with data when looking up order by known sales order id', done => {
    lookupOrder({ id : KNOWN_TEST_SALES_ORDER_ID, type : LOOKUP_TYPE_SALES_ORDER_ID })
      .then(res => {
        commonMocks.recursivelyOmitProps(['timestamp', 'created'], res.orderList)
          .map(row => expect(row[LOOKUP_TYPE_SALES_ORDER_ID]).toBe(KNOWN_TEST_SALES_ORDER_ID));
        done();
      });
  });

  it('responds with first page data when looking up order by known account number without giving pagination', done => {
    lookupOrder({ id : KNOWN_TEST_ACCOUNT_NUMBER_WITH_11_ROWS, type : LOOKUP_TYPE_ACCOUNT_NUMBER, pagination : null })
      .then(res => {
        expect(res.pagination).toEqual({ page : 1, size : 10 });
        expect(res.totalInDB).toBe(11);
        expect(R.length(res.orderList)).toBe(10);
        done();
      });
  });

  it('responds with 4th page data when looking up order by known account number by giving a pagination', done => {
    const pagination = { page : 4, size : 3 };
    lookupOrder({
      id   : KNOWN_TEST_ACCOUNT_NUMBER_WITH_11_ROWS,
      type : LOOKUP_TYPE_ACCOUNT_NUMBER,
      pagination
    })
      .then(res => {
        expect(res.pagination).toEqual(pagination);
        expect(res.totalInDB).toBe(11);
        expect(R.length(res.orderList)).toBe(2);
        done();
      });
  });

  it('responds with no data when looking up order by known account number by giving an invalid page of pagination', done => {
    const pagination = { page : 3, size : 10 };
    lookupOrder({
      id   : KNOWN_TEST_ACCOUNT_NUMBER_WITH_11_ROWS,
      type : LOOKUP_TYPE_ACCOUNT_NUMBER,
      pagination
    })
      .then(res => {
        expect(res.pagination).toEqual(pagination);
        expect(res.totalInDB).toBe(11);
        expect(R.length(res.orderList)).toBe(0);
        done();
      });
  });

  it('fails gracefully if order does not exist', done => {
    lookupOrder({ id : FAKE_UNKNOWN_ID, type : LOOKUP_TYPE_ESHEET_ID })
      .then(res => {
        expect(res.orderList).toEqual([]);
        done();
      });
  });

  it('throws an error when given an unknown lookup type', done => {
    lookupOrder({ id : KNOWN_TEST_ESHEET_ID, type : FAKE_UNKNOWN_TYPE })
      .catch(err => {
        expect(err).toEqual(commonMocks.illegalParamErr('orderData', 'type'));
        done();
      });
  });

  it('throws an error when looking for an order with illegal page in pagination payload', done => {
    lookupOrder({ id : KNOWN_TEST_ESHEET_ID, type : LOOKUP_TYPE_ESHEET_ID, pagination : { page : 0, size : 10 } })
      .catch(err => {
        expect(err).toEqual(commonMocks.illegalParamErr('orderData', 'page'));
        done();
      });
  });

  it('throws an error when looking for an order without data', done => {
    lookupOrder()
      .catch(err => {
        expect(err).toEqual(commonMocks.missingParamErr('orderData', 'type'));
        done();
      });
  });

  it('throws an error when given null params', done => {
    lookupOrder(null)
      .catch(err => {
        expect(err).toEqual(commonMocks.missingParamErr('orderData', 'type'));
        done();
      });
  });
});
