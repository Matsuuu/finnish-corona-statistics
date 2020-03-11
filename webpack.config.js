const path = require('path');
const glob = require('glob');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: { main: './src/index.js' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
    resolve: {
        modules: [
            path.resolve(__dirname),
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'src/app'),
            path.resolve(__dirname, 'src/components'),
            path.resolve(__dirname, 'src/services'),
        ],
        extensions: ['.js', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            verbose: true,
            cleanAfterEveryBuildPatterns: ['!*.png', '!*.json'],
        }),
        new HtmlWebPackPlugin({
            template: './src/index.html',
            inject: false,
        }),
        new CopyWebpackPlugin([
            {
                context: 'node_modules/@webcomponents/webcomponentsjs',
                from: '**/*.js',
                to: 'webcomponents',
            },
            {
                context: './src/assets/images',
                from: '*',
                to: '.',
            },
            {
                context: '.',
                from: 'corona-data.json',
                to: '.',
            },
        ]),
    ],
};
