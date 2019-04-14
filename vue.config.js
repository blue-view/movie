const path = require("path");
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/movie/" : "/",
  lintOnSave: true,
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-px-to-viewport")({
            viewportWidth: 320,
            viewportHeight: 568,
            unitPrecision: 3,
            viewportUnit: "vw",
            selectorBlackList: [".ignore", ".hairlines"],
            minPixelValue: 1,
            mediaQuery: false
          }),
          require("postcss-write-svg")({
            utf8: false
          })
        ]
      }
    }
  },
  devServer: {
    // port: 8071,
    proxy: {
      "/api": {
        target: "https://api.douban.com/v2",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
};
