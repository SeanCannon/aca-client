'use strict';

const R = require('ramda');

const maybeTranslateInterpolation = ({ i18n, locale }) => R.map(R.when(
  R.has('translate'),
  ({ translate : phrase }) => i18n.__({ phrase, locale })
));

const translateSingular = ({ i18n, locale }) => R.over(
  R.lensProp('singular'),
  R.mapObjIndexed((interpolations, phrase) => R.apply(
    i18n.__.bind(i18n),
    R.prepend(
      { phrase, locale },
      maybeTranslateInterpolation({ i18n, locale })(interpolations)
    )
  ))
);

const translatePlural = ({ i18n, locale }) => R.over(
  R.lensProp('plural'),
  R.mapObjIndexed((interpolations, singular) => R.apply(
    i18n.__n.bind(i18n),
    R.prepend(
      { locale, singular, plural : R.head(interpolations) },
      maybeTranslateInterpolation({ i18n, locale })(R.tail(interpolations))
    )
  ))
);

const _translate = ({ i18n, locale }) => R.compose(
  translateSingular({ i18n, locale }),
  translatePlural({ i18n, locale })
);

const translate = ({ i18n, locale }) => strings => Promise.resolve(strings)
  .then(_translate({ i18n, locale }));

module.exports = translate;
