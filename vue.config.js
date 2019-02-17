module.exports = {
  // 基本路径
  baseUrl: './',
  // 输出文件目录
  outputDir: 'dist',
  // webpack-dev-serer 相关配置
  devServer: {
    port: 8888
  },
  transpileDependencies: ['vuex-persist']
}
