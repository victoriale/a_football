var webpack = require('webpack');
var path = require('path');
var clone = require('js.clone');
var webpackMerge = require('webpack-merge');
var cssLoader = require("css-loader");
var lessLoader = require("less-loader");
var styleLoader = require("style-loader");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var uglifyJS = require('webpack-uglify-js-plugin');

export var commonPlugins = [
  new webpack.ContextReplacementPlugin(
    // The (\\|\/) piece accounts for path separators in *nix and Windows
    /angular(\\|\/)core(\\|\/)src(\\|\/)linker/,
    root('./src'),
    {
      // your Angular Async Route paths relative to this root directory
    }
  ),
  // Loader options
  new webpack.LoaderOptionsPlugin({}),

  //Compiled .less file
  new ExtractTextPlugin({
    filename: 'stylesheets/[name].css',
    allChunks: true
  }),

  //minify JS
  new webpack.optimize.UglifyJsPlugin({
    compressor: { warnings: false }
  }),

  //provide third pary plugins
  new webpack.ProvidePlugin({
    moment: "moment-timezone",
    jQuery: "jQuery",
    "window.stButtons": "stButtons",
  }),

  //takes source files in node_modules and copies them into directory for use.
  new CopyWebpackPlugin([
    {from: './node_modules/moment/min/moment.min.js', to:  root('src/lib/moment.min.js')},
    {from: './node_modules/moment-timezone/builds/moment-timezone-with-data-2010-2020.min.js', to: root('src/lib/moment-timezone-with-data-2010-2020.min.js')}
  ])
];
export var commonConfig = {
  // https://webpack.github.io/docs/configuration.html#devtool
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js', '.json', '.less'],
    modules: [ root('node_modules') ]
  },
  output: {
    publicPath: '',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      // TypeScript
      { test: /\.ts$/,   use: ['awesome-typescript-loader', 'angular2-template-loader'] },
      { test: /\.html$/, use: 'raw-loader' },
      { test: /\.json$/, use: 'json-loader' },
      { test: /\.css$/, loader: ExtractTextPlugin.extract({ loader: "css-loader" }) },
      { test: /\.less$/, loader: ExtractTextPlugin.extract({ loader: "css-loader!less-loader" }) },
      { test: /\.(png|jpg)$/, loader: 'file-loader' }
    ]
  }
};

// Client.
export var clientPlugins = [];

export var clientConfig = {
  target: 'web',
  entry: './src/client',
  output: {
    path: root('dist/client')
  },
  node: {
    global: true,
    crypto: 'empty',
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: false
  }
};


// Server.
export var serverPlugins = [

];
export var serverConfig = {
  target: 'node',
  entry: [
    './src/server', // use the entry file of the node server if everything is ts rather than es5
  ],
  output: {
    filename: 'index.js',
    path: root('dist/server'),
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      { test: /@angular(\\|\/)material/, use: "imports-loader?window=>global" }
    ]
  },
  externals: includeClientPackages(
    /@angularclass|@angular|angular2-|ng2-|ng-|@ng-|angular-|@ngrx|ngrx-|@angular2|ionic|@ionic|-angular2|-ng2|-ng|moment|moment-timezone-with-data-2010-2020/
  ),
  node: {
    global: true,
    crypto: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: true
  }
};

export default [
  // Client
  webpackMerge(clone(commonConfig), clientConfig, { plugins: clientPlugins.concat(commonPlugins) }),

  // Server
  webpackMerge(clone(commonConfig), serverConfig, { plugins: serverPlugins.concat(commonPlugins) })
];




// Helpers
export function includeClientPackages(packages, localModule?: string[]) {
  return function(context, request, cb) {
    if (localModule instanceof RegExp && localModule.test(request)) {
      return cb();
    }
    if (packages instanceof RegExp && packages.test(request)) {
      return cb();
    }
    if (Array.isArray(packages) && packages.indexOf(request) !== -1) {
      return cb();
    }
    if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
      return cb(null, 'commonjs ' + request);
    }
    return cb();
  };
}

export function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
