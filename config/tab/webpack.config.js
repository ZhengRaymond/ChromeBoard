const path = require('path');

module.exports = {

  entry: [
    './tab/src/index.js'
  ],

  output: {
    filename: 'tab.js',
    path: path.join(__dirname, '../../', 'build'),
    publicPath: '/'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss', '.json'],
    modules: ['node_modules']
  },

  module: {
    loaders: [
      {
        test: /\.(jsx|js)?$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        include: path.join(__dirname, '../../tab/src'),
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: './config/tab/postcss.config.js'
              }
            }
          }
        ]
      }
      // {
      //     test: /\.css$/,
      //     loaders: [
      //         'style-loader?sourceMap',
      //         'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
      //     ]
      // }
    ]
  }
};
