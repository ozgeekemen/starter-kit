const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const paths = {
    entry: `./src`,
    output: `./dist`
};

module.exports = (env, argv) => {
    return {
        mode: argv.mode, // "production" | "development" | "none"
        // Chosen mode tells webpack to use its built-in optimizations accordingly.
        entry: {
            app: path.resolve(__dirname, paths.entry, 'index.tsx'),
        },
        // Here the application starts executing and webpack starts bundling
        output: {
            path: path.resolve(__dirname, paths.output)
        },
        // Configuration regarding modules
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader'
                },
                {
                    test: /\.ts$/,
                    enforce: 'pre',
                    loader: 'tslint-loader'
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {}
                        },
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                options: {}
                            }
                        },
                        'sass-loader'
                    ]
                },
            ],
        },
        // Options for resolving module requests
        resolve: {
            modules: [
                path.resolve(__dirname, 'node_modules'),
            ],
            extensions: ['.ts', '.js', '.tsx', '.json'],
        },
        // Lets you provide options for webpack-serve
        devServer: {
            open: true,
            port: 9000,
            contentBase: path.resolve(__dirname, paths.output),
            hot: true,
            disableHostCheck: true
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Starter kit',
                template: path.resolve(__dirname, paths.entry, 'index.html'),
                inject: 'head'
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css',
            }),
        ],
    };
};

