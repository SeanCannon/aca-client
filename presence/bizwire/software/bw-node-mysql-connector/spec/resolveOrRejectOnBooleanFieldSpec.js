'use strict';

const Q = require('q');

const resolveOrRejectOnBooleanField = require('../../../../server/core/utils/db/methods/resolveOrRejectOnBooleanField');

describe('resolveOrRejectOnBooleanField', () => {
  it('resolves when given a true field', (done) => {
    const deferred = Q.defer();

    resolveOrRejectOnBooleanField(deferred, 'foo', { foo : true }).then((bool) => {
      expect(bool).toBe(true);
      done();
    });
  });

  it('rejects when given a false field', (done) => {
    const deferred = Q.defer();

    resolveOrRejectOnBooleanField(deferred, 'foo', { foo : false }).catch((bool) => {
      expect(bool).toBe(false);
      done();
    });
  });

  it('rejects when given an unrecognized field', () => {
    const deferred = Q.defer();

    expect(() => {
      resolveOrRejectOnBooleanField(deferred, 'bar', { foo : true });
    }).toThrow(new Error('No field found matching "bar"'));
  });
});
