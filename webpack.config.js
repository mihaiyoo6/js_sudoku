const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
module.exports = {
	entry: [
		"./src/js/main",
		"./src/js/game"],
	output: {
		path: __dirname,
		filename: "public/js/bundle.js"
	},
	module: {
		loaders: [
			{
				test: /\.es6$/,
				loader: 'babel-loader',
				exclude: [
					/node_modules/
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(['public'],
			{ root: __dirname, verbose: true, dry: false }
		),
		new CopyWebpackPlugin([
			{ from: './src/html/index.html', to: './public' }
		])
	]
};