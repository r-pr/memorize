var webpack = require('webpack');
var path = require('path');
process.env.NODE_ENV = 'production';

module.exports = {
    entry: "./source/index.js",
    output: {
        path: path.join(__dirname, './../public/'),
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: "babel",
                exclude: [/node_modules/]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin()
    ]
}