const path = require('path');
const glob = require('glob');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
        extensions: ['.js', '.json', '.scss'],
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg|ttf|woff|eot|woff2)$/i,
                use: [
                    {
                        loader: 'file-loader?name=[name].[ext]',
                    },
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    // Compiles Sass to CSS
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                includePaths: glob.sync('node_modules').map(d => path.join(__dirname, d)),
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        require('autoprefixer'),
        new CleanWebpackPlugin({
            verbose: true,
            cleanAfterEveryBuildPatterns: ['!*.png', '!*.json', '!*.svg', '!*.ico', '!*.txt'],
        }),
        new HtmlWebPackPlugin({
            template: './src/index.html',
            inject: false,
        }),
        new MiniCssExtractPlugin({
            filename: '/style.css',
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
                from: '*-data.json',
                to: '.',
            },
            {
                context: './src',
                from: 'robots.txt',
                to: '.',
            },
        ]),
    ],
};
