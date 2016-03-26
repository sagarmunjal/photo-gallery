var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function(options) {
  var entry, plugins, cssLoaders;
  // Define configuration if production
  if (options.prod) {
    // Define entry file
    entry = [
      path.join(__dirname, 'public/js/app.js') // Start with js/app.js
    ];
    cssLoaders = ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader');
    // Define plugins we want to use
    plugins = [
      new webpack.optimize.UglifyJsPlugin({ // Optimize the JavaScript
        compress: {
          warnings: false // Do not show warnings in the console
        }
      }),
      new HtmlWebpackPlugin({
        template: 'index.html', // Move the index.html file...
        minify: { // Minifying it while it is parsed
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        },
        inject: true // inject all files that are generated by webpack, e.g. bundle.js, main.css with the correct HTML tags
      }),
      new ExtractTextPlugin("public/css/main.css"),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production")
        }
      })
    ];

  // Define development configuration
  } else {
    // Entry
    entry = [
      "webpack-dev-server/client?http://localhost:3000", // Needed for hot reloading
      path.join(__dirname, 'public/js/app.js') // Start with js/app.js
    ];
    cssLoaders = 'style-loader!css-loader!postcss-loader';
    // Hot module replacement plugin
    plugins = [
      new webpack.HotModuleReplacementPlugin(), // Make hot loading work
      new webpack.optimize.OccurenceOrderPlugin(),
      new HtmlWebpackPlugin({
        template: 'index.html', // Move the index.html file
        inject: true // inject all files that are generated by webpack, e.g. bundle.js, main.css with the correct HTML tags
      })
    ]
  }

  return {
    entry: entry,
    output: { // Compile into js/build.js
      path: path.join(__dirname, 'build'),
      filename: "js/bundle.js",
      publicPath: '/static/',
    },
    module: {
      preLoaders: [{ test: /\.js$/, loaders: ['eslint-loader'], exclude: path.join(__dirname, '/node_modules/') }],
      loaders: [
        { test: /\.js$/,  loader: 'babel', exclude: path.join(__dirname, '/node_modules/') },
        { test:   /\.css$/, loader: cssLoaders },
        { test: /\.jpe?g$|\.gif$|\.png$/i, loader: "url-loader?limit=10000" },
        { test: /\.json$/, loader: 'json' },
      ]
    },
    plugins: plugins,
    target: "web", // Make web variables accessible to webpack, e.g. window
    stats: false, // Don't show stats in the console
    progress: true
  }
}

// postcss: function() {
//   return [
//     require('postcss-import')({ // Import all the css files...
//       glob: true,
//       onImport: function (files) {
//           files.forEach(this.addDependency); // ...and add dependecies from the main.css files to the other css files...
//       }.bind(this) // ...so they get hot–reloaded when something changes...
//     }),
//     require('postcss-simple-vars')(), // ...then replace the variables...
//     require('postcss-focus')(), // ...add a :focus to ever :hover...
//     require('autoprefixer')({ // ...and add vendor prefixes...
//       browsers: ['last 2 versions', 'IE > 8'] // ...supporting the last 2 major browser versions and IE 8 and up...
//     }),
//     require('postcss-reporter')({ // This plugin makes sure we get warnings in the console
//       clearMessages: true
//     })
//   ];
// },
