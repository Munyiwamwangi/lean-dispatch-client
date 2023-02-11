module.exports = {
  transpileDependencies: ['vuetify'],

  pwa: {
    name: 'MM Grupp Bonuses',
    themeColor: '#536878',
    msTileColor: '#536878',
    appleMobileWebAppCache: 'yes',
  },

  devServer: {
    disableHostCheck: true,
  },

  configureWebpack: {
    resolve: {
      alias: {
        "@": require("path").resolve(__dirname, "src"),
        "@langSelector": require("path").resolve(__dirname, "src/components/language"),
        "@languages": require("path").resolve(__dirname, "src/plugins/translations"),
        "@components": require("path").resolve(__dirname, "src/components"),

      }
    }
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
      includeLocales: false,
      enableBridge: true
    }
  }
};
