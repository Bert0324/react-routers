import { Configuration } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { cpus } from 'os';

const isBuilding = process.env.preview !== 'true';
const threadLoader = {
    loader: 'thread-loader',
    options: {
        workers: cpus().length - 1,
        workerParallelJobs: 50,
        workerNodeArgs: ['--max-old-space-size=1024'],
        poolTimeout: 2000,
        poolParallelJobs: 300,
        name: "thread-loader-pool"
    }
};
export default {
    mode: isBuilding ? 'production' : 'development',
    externals : isBuilding ? {
        'react': 'react',
        'react-dom': 'react-dom',
        'react-router-dom': 'react-router-dom',
        'react-router': 'react-router'
    } : undefined,
    devtool: 'source-map',
    entry: `${__dirname}/${isBuilding ? 'src' : 'test'}/index.ts${isBuilding ? '' : 'x'}`,
    output: {
        path: `${__dirname}/dist`,
        filename: `[name].min.js`,
        ...(isBuilding ? {
            libraryTarget: 'umd',
            library: 'react-routers'
        } : undefined)
    },
    target: 'web',
    module: {
        rules: [
            {
                test: /\.(tsx|ts|js)?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            "presets": [
                                [
                                    "@babel/preset-env",
                                    {
                                        "targets": {
                                            "esmodules": true
                                        },
                                        "useBuiltIns": "entry",
                                        "corejs": 3
                                    }
                                ],
                                ["@babel/preset-typescript"],
                                ["@babel/preset-react"]
                            ],
                            "plugins": [
                                "@babel/plugin-proposal-class-properties",
                                "@babel/plugin-proposal-object-rest-spread",
                                "@babel/plugin-proposal-optional-chaining",
                                [
                                    "import",
                                    {
                                        "libraryName": "antd",
                                        "libraryDirectory": "es",
                                        "style": "css"
                                    }
                                ]
                            ]
                        },
                    }
                ].filter(Boolean),
                exclude: [/node_modules/, /\.min\.js$/],
            },
            {
                test: /\.less$/,
                use: [
                    threadLoader,
                    'style-loader',
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                    },
                    'less-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    threadLoader,
                    'style-loader',
                    {
                        loader: 'css-loader',
                    }
                ],
                exclude: /\.min\.css$/
            }
        ].filter(Boolean),
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.less'],
        mainFields: ['jsnext:main', 'browser', 'module', 'main'],
    },
    plugins: [
        !isBuilding &&
        new HtmlWebpackPlugin({
            inject: true,
            template: `${__dirname}/test/index.html`,
            minify: false,
        }),
        new CleanWebpackPlugin(),
    ].filter(Boolean),
    optimization: {
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin({
                extractComments: false,
                sourceMap: !isBuilding,
                terserOptions: {
                    compress: {
                        drop_debugger: isBuilding,
                        drop_console: false,
                    },
                    keep_classnames: false,
                    keep_fnames: false,
                    ie8: false,
                    module: false,
                    safari10: false,
                    toplevel: true,
                },
                
            }),
        ]
    },
    devServer: {
        contentBase: `${__dirname}/dist`,
        compress: true,
        port: 8082,
        open: true,
        disableHostCheck: true,
        proxy: {},
    },
} as Configuration;
