/*
  This file is named as such and located in project
  root to support react-app-rewired. It lets us add
  webpack config overrides without ejecting CRA.
*/
const R       = require('ramda');
const webpack = require('webpack');

module.exports = (config, env) => {
  return R.compose(
    R.over(R.lensProp('plugins'), R.append(
      new webpack.DefinePlugin({
      'process.env.GTAG_ID': JSON.stringify(process.env.GTAG_ID),
      })
    ))
  )(config);
};
