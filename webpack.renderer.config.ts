import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import path from 'path'

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, {loader: 'postcss-loader'}],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      "@":path.resolve(__dirname, 'src'),
      "react": require('path').resolve(__dirname, 'node_modules/react'),
      "react-dom": require('path').resolve(__dirname, 'node_modules/react-dom')
    }
  },
};
