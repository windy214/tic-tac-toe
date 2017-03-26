module.exports = {
  entry:__dirname + '/dev/index.jsx',
  output: {
    path: __dirname + '/lib',
    filename: 'bundle.js',
  },
  module:{
    loaders:[
        {
            test:/.jsx$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'react']
            }
        }
    ]
  },
};