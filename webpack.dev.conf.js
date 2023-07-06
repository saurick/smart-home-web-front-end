const { merge } = require('webpack-merge')
const common = require('./webpack.base.conf.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  infrastructureLogging: {
    colors: true,
    appendOnly: true,
    level: 'info',
  },
  devServer: {
    allowedHosts: 'all',
    historyApiFallback: true,
    open: true, // 自动打开浏览器
    compress: true, // gzip 压缩
    port: 9000, // 端口号,
    devMiddleware: {
      stats: 'minimal',
    },
    client: {
      logging: 'info',
      overlay: true,
      progress: true,
    },
    proxy: {
      '/rpc': {
        target: 'http://192.168.0.214:80',
        secure: false,
        pathRewrite: { '^/rpc': '/rpc' },
      },
    },
  },
})
