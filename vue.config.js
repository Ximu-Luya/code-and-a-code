const { defineConfig } = require('@vue/cli-service')
const outputdir = process.env.outputdir || 'release'
module.exports = defineConfig({
  outputDir: outputdir,
  publicPath: './',
  transpileDependencies: true
})