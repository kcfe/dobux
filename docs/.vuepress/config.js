module.exports = {
  // https://vuepress.vuejs.org/zh/guide/deploy.html#github-pages
  base: '/dox/',
  title: 'Dobux',
  description: '基于 React Context 和 React Hooks 的轻量级数据流管理方案',
  extraWatchFiles: ['.vuepress/nav-config.js'],
  head: [
    ['meta', { name: 'theme-color', content: '#61dafb' }],
    [
      'link',
      {
        rel: 'icon',
        href: '/dobux.ico',
      },
    ],
  ],
  locales: {
    '/': {
      lang: 'zh-CN',
    },
  },
  themeConfig: {
    nav: require('./nav-config'),
    sidebar: 'auto',
    search: true,
    searchMaxSuggestions: 10,
    // string | boolean
    lastUpdated: 'Last Updated',

    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    // repo: 'http://git.corp.xxx.com/ks-ad/ad-fe/dobux',
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    repoLabel: 'GitLab',

    // 以下为可选的编辑链接选项
    // 假如你的文档仓库和项目本身不在一个仓库：
    // docsRepo: 'http://git.corp.xxx.com/ks-ad/ad-fe/dobux',
    // 假如文档不是放在仓库的根目录下：
    docsDir: 'docs',
    // 假如文档放在一个特定的分支下：
    docsBranch: 'master',
    // 默认是 false, 设置为 true 来启用
    editLinks: true,
    // 默认为 "Edit this page"
    editLinkText: '帮助我们改善此页面！',

    locales: {
      '/': {
        sidebar: {
          '/guide/': getGuideSidebar('指南', '社区方案对比'),
          '/api/': [''],
          // '/changelog/': getChangelogSidebar('CHANGELOG'),
        },
      },
    },
  },
  evergreen: true,
}

function getGuideSidebar(groupA, groupB) {
  return [
    {
      title: groupA,
      collapsable: false,
      sidebarDepth: 2,
      children: [
        '',
        'getting-started',
        'best-practice',
        'example',
        'redux-dev-tools',
        'eslint',
        'faq',
      ],
    },
    // {
    //   title: groupB,
    //   collapsable: false,
    //   children: ['dobux', 'redux', 'dva'],
    // },
  ]
}

function getApiSidebar(groupA, groupB) {
  return {
    title: groupA,
    collapsable: false,
    sidebarDepth: 2,
  }
}

function getChangelogSidebar(groupA) {
  return [
    {
      title: groupA,
      collapsable: false,
      sidebarDepth: 0,
      children: ['store', 'hooks'],
    },
  ]
}
