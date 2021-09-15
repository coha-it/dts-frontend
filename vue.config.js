// vue.config.js
module.exports = {
  devServer: {
     //proxy: 'http://127.0.0.1:8000',
    compress: true,
    disableHostCheck: true,
  },
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass')
      },
    }
  }
}
