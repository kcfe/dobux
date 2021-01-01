export default {
  base: '/dobux',
  publicPath: '/dobux/',
  locales: [['zh-CN', '中文'], ['en-US', 'English']],
  exportStatic: {},
  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },
  mode: 'site',
  title: 'Dobux',
  favicon: '/dobux/simple-logo.png',
  logo: '/dobux/logo.png',
  dynamicImport: {},
  manifest: {},
  hash: true,
  links: [
    { rel: 'manifest', href: '/dobux/asset-manifest.json' },
    { rel: 'stylesheet', href: '/dobux/style.css' },
  ],
  navs: [
    { title: '指南', path: '/guide' },
    { title: 'API', path: '/api' },
    { title: 'GitHub', path: 'https://github.com/kcfe/dobux' },
    { title: '更新日志', path: 'https://github.com/kcfe/dobux/releases' },
  ],
};
