const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: 'development',

    entry: './src/index.js',

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template.html',
        }),
        new Dotenv(),
    ],

    module: {
        rules: [
            {
                test: /\.js$/i,
                type: 'javascript/auto',
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },

    devServer: {
        static: './dist',
        watchFiles: ['./src'],
    },
};