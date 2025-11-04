/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 忽略不存在的 .vue.js 文件
declare module '*.vue.js' {
  const component: never
  export default component
}
