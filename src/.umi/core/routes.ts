// @ts-nocheck
import React from 'react';
import { ApplyPluginsType, dynamic } from '/Users/ender/learning/github/dobux/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": (props) => require('react').createElement(require('../../../node_modules/@umijs/preset-dumi/lib/themes/default/layout.js').default, {
      ...{"menus":{"*":{"*":[{"path":"/","title":"Dobux - React State Management Library","meta":{}}],"/api":[{"path":"/api","title":"API","meta":{"order":1}}],"/guide":[{"path":"/guide","title":"介绍","meta":{}},{"path":"/guide/getting-started","title":"快速上手","meta":{}}]}},"locales":[],"navs":{"*":[{"title":"指南","path":"/guide"},{"title":"API","path":"/api"},{"title":"GitHub","path":"https://github.com/kcfe/dobux"},{"title":"更新日志","path":"https://github.com/kcfe/dobux/releases"}]},"title":"Dobux","logo":"/logo.png","mode":"site","repoUrl":"https://github.com/kwai-efe/dobux"},
      ...props,
    }),
    "routes": [
      {
        "path": "/",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__index.md' */'../../../docs/index.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/index.md",
          "updatedTime": 1607052884180,
          "title": "Dobux - React State Management Library",
          "hero": {
            "title": "Dobux",
            "desc": "<div class=\"markdown\"><p>轻量级响应式数据流框架</p></div>",
            "actions": [
              {
                "text": "快速上手",
                "link": "/guide/getting-started"
              }
            ]
          },
          "features": [
            {
              "icon": "https://static.yximgs.com/udata/pkg/ks-ad-fe/kcfe/dobux-feature-simple.png",
              "title": "简单易用",
              "desc": "<div class=\"markdown\"><p>仅有 3 个核心 API，无需额外的学习成本，只需要了解 React Hooks</p></div>"
            },
            {
              "icon": "https://static.yximgs.com/udata/pkg/ks-ad-fe/kcfe/dobux-feature-immutable.png",
              "title": "不可变数据源",
              "desc": "<div class=\"markdown\"><p>通过简单地修改数据与视图进行交互，生成不可变数据源，保证依赖的正确性</p></div>"
            },
            {
              "icon": "https://static.yximgs.com/udata/pkg/ks-ad-fe/kcfe/dobux-feature-ts.png",
              "title": "TypeScript 支持",
              "desc": "<div class=\"markdown\"><p>提供完整的 TypeScript 类型定义，在编辑器中能获得完整的类型检查和类型推断</p></div>"
            }
          ],
          "footer": "<div class=\"markdown\"><p>Open-source MIT Licensed | Copyright © 2019-present<br />Powered by <a href=\"https://github.com/kcfe\" target=\"_blank\" rel=\"noopener noreferrer\">kcfe<svg xmlns=\"http://www.w3.org/2000/svg\" aria-hidden x=\"0px\" y=\"0px\" viewBox=\"0 0 100 100\" width=\"15\" height=\"15\" class=\"__dumi-default-external-link-icon\"><path fill=\"currentColor\" d=\"M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z\"></path><polygon fill=\"currentColor\" points=\"45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9\"></polygon></svg></a></p></div>",
          "slugs": [
            {
              "depth": 2,
              "value": "轻松上手",
              "heading": "轻松上手"
            }
          ]
        },
        "title": "Dobux - React State Management Library"
      },
      {
        "path": "/api",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__api__index.md' */'../../../docs/api/index.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/api/index.md",
          "updatedTime": 1607053756729,
          "order": 1,
          "nav": {
            "order": 2,
            "title": "API",
            "path": "/api"
          },
          "toc": "menu",
          "slugs": [
            {
              "depth": 1,
              "value": "API",
              "heading": "api"
            },
            {
              "depth": 2,
              "value": "createModel(model)",
              "heading": "createmodelmodel"
            },
            {
              "depth": 3,
              "value": "model.state",
              "heading": "modelstate"
            },
            {
              "depth": 3,
              "value": "model.reducers",
              "heading": "modelreducers"
            },
            {
              "depth": 3,
              "value": "model.effects",
              "heading": "modeleffects"
            },
            {
              "depth": 2,
              "value": "store = createStore(models)",
              "heading": "store--createstoremodels"
            },
            {
              "depth": 3,
              "value": "store.Provider",
              "heading": "storeprovider"
            },
            {
              "depth": 3,
              "value": "store.withProvider",
              "heading": "storewithprovider"
            },
            {
              "depth": 3,
              "value": "store.useModel",
              "heading": "storeusemodel"
            },
            {
              "depth": 4,
              "value": "基本用法",
              "heading": "基本用法"
            },
            {
              "depth": 4,
              "value": "性能优化",
              "heading": "性能优化"
            },
            {
              "depth": 3,
              "value": "store.withModel",
              "heading": "storewithmodel"
            },
            {
              "depth": 4,
              "value": "基本用法",
              "heading": "基本用法-1"
            },
            {
              "depth": 4,
              "value": "性能优化",
              "heading": "性能优化-1"
            }
          ],
          "title": "API"
        },
        "title": "API"
      },
      {
        "path": "/guide",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__README.md' */'../../../docs/guide/README.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/README.md",
          "updatedTime": 1605683134000,
          "sidebarDepth": 2,
          "slugs": [
            {
              "depth": 1,
              "value": "介绍",
              "heading": "介绍"
            },
            {
              "depth": 2,
              "value": "特性",
              "heading": "特性"
            },
            {
              "depth": 2,
              "value": "数据流向",
              "heading": "数据流向"
            },
            {
              "depth": 2,
              "value": "核心概念",
              "heading": "核心概念"
            },
            {
              "depth": 3,
              "value": "Store",
              "heading": "store"
            },
            {
              "depth": 3,
              "value": "Model",
              "heading": "model"
            },
            {
              "depth": 4,
              "value": "State",
              "heading": "state"
            },
            {
              "depth": 4,
              "value": "Reducer",
              "heading": "reducer"
            },
            {
              "depth": 4,
              "value": "Effect",
              "heading": "effect"
            }
          ],
          "title": "介绍",
          "nav": {
            "path": "/guide",
            "title": "Guide"
          }
        },
        "title": "介绍"
      },
      {
        "path": "/guide/getting-started",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__guide__getting-started.md' */'../../../docs/guide/getting-started.md')}),
        "exact": true,
        "meta": {
          "filePath": "docs/guide/getting-started.md",
          "updatedTime": 1605683134000,
          "slugs": [
            {
              "depth": 1,
              "value": "快速上手",
              "heading": "快速上手"
            },
            {
              "depth": 2,
              "value": "安装",
              "heading": "安装"
            },
            {
              "depth": 2,
              "value": "目录结构",
              "heading": "目录结构"
            },
            {
              "depth": 2,
              "value": "定义模型",
              "heading": "定义模型"
            },
            {
              "depth": 2,
              "value": "消费模型",
              "heading": "消费模型"
            }
          ],
          "title": "快速上手",
          "nav": {
            "path": "/guide",
            "title": "Guide"
          }
        },
        "title": "快速上手"
      }
    ],
    "title": "Dobux"
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
