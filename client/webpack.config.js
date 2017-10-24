var webpack = require('webpack');
var path = require('path');

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
    }
}