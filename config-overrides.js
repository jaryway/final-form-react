/* eslint-disable */

const path = require("path");
// const fs = require("fs");
const { name } = require("./package");
// const AntDesignThemePlugin = require('antd-theme-webpack-plugin');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
// const appDirectory = fs.realpathSync(process.cwd());
// const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const paths = require("react-scripts/config/paths");
// const { alias, configPaths: configPaths1 } = require("react-app-rewire-alias")
const { aliasDangerous, configPaths } = require("react-app-rewire-alias/lib/aliasDangerous");


const {
  override,
  useBabelRc,
  addLessLoader,
  // addBabelPlugin,
  fixBabelImports,
  addWebpackAlias,
  // addWebpackPlugin,
} = require("customize-cra");

module.exports = {
  webpack: override(
    // aliasDangerous(configPaths('./tsconfig.paths.json')),
    useBabelRc(),
    // // yarn link 的时候会导致 Error: Invalid hook call.,通 Alias 可以解决这个问题
    addWebpackAlias({
      'final-form': require.resolve('./src/final-form/final-form.es.js'),
      // 'react-final-form': require.resolve('./src/final-form/react-final-form.es.js'),
      // 'react-final-form-arrays': require.resolve('./src/final-form/react-final-form-arrays.js'),
      // "react/jsx-runtime": require.resolve("./node_modules/react/jsx-runtime"),
      // "react/jsx-dev-runtime": require.resolve(
      //   "./node_modules/react/jsx-dev-runtime"
      // ),
      // react: require.resolve("./node_modules/react"),
    }),
    // aliasDangerous({
    //   // "@fregata-form/shared": path.resolve(__dirname, "../shared/src"),
    //   // "@fregata-form/core": path.resolve(__dirname, "../core/src"),
    //   // "@fregata-form/antd": path.resolve(__dirname, "../antd/src"),
    //   // "@fregata-form/path": path.resolve(__dirname, "../path/src"),
    //   // "@fregata-form/validator": path.resolve(__dirname, "../validator/src"),
    //   // "@fregata-form/json-schema": path.resolve(__dirname, "../json-schema/src"),
    //   // ...configPaths('tsconfig.paths.json')
    // }),
    // aliasDangerous(configPaths(path.resolve(__dirname, '../../tsconfig.paths.json'))),
    // customize-cra plugins here
    // isEnvProduction && addBabelPlugin(['transform-remove-console']),

    fixBabelImports("antd", { style: true }),

    addLessLoader({
      sourceMap: true,
      lessOptions: {
        javascriptEnabled: true,
        modifyVars: {
          'root-entry-name': 'default',
          // "@primary-color": "#1DA57A", // for example, you use Ant Design to change theme color.
          "@primary-color": "#1b62b7",
          "@layout-header-background": "#1b62b7",
          "@layout-header-height": "48px",
          "@layout-header-padding": "0 12px",
          "@menu-collapsed-width": "49px",
        },
      },
    }),
    (config) => {
      config.output.library = `${name}-[name]`;
      config.output.libraryTarget = "umd";
      config.output.jsonpFunction = `webpackJsonp_${name}`;
      config.output.globalObject = "window";
      config.entry = {
        polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
        main: [paths.appIndexJs].filter(Boolean),
      };
      // config.optimization.minimize = false;

      return config;
    }
  ),
  // paths: function (paths, env) {
  //   // ...add your paths config
  //   paths.appTemplate = resolveApp('src/index.ejs');
  //   return paths;
  // },
  // devServer: (configFunction) => (proxy, allowedHost) => {
  //   const config = configFunction(proxy, allowedHost);
  //   return config;
  // },
};
