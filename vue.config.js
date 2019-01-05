const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

const BASE_URL = '/'
module.exports = {
  baseUrl: BASE_URL,
  pages: {
    todos: 'src/todos/main.js',
    login: {
      entry: 'src/thymeleaf.js',
      template: 'public/login.html'
    },
    error: {
      entry: 'src/thymeleaf.js',
      template: 'public/error.html'
    }
  },
  assetsDir: 'assets',
  filenameHashing: false,
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([{
        from: path.resolve(__dirname, `./node_modules/todomvc-app-css/index.css`),
        to: path.resolve(__dirname, `./public/assets/css/todomvc-app-css.css`)
      }])
    ]
  },
  chainWebpack: config => {
    // thymeleaf ${} 평가식이 lodash.template에게 평가되는 것을 회피하기 위해 html, ejs 로더를 활용한다.
    // ejs-loader 가 아닌, ejs-html-loader를 사용하는건 include 기능을 사용하기 위해서다.
    // https://github.com/lodash/lodash/issues/1009, .set('query', { interpolate: /<%=([\s\S]+?)%>/g })
    config.module
          .rule('html')
          .test(/\.html$/)
          .use('html-loader')
            .loader('html-loader')
            .end()
          .use('ejs-html-loader')
            .loader('ejs-html-loader')
            .options({
              'BASE_URL': BASE_URL,
              'TITLE': 'TodoApp templates for Server-side'
            })
            .end()
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      },
      "/stream": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    }
  }
}