/// <reference types="vite/client" />

declare global {
  export interface ViteTypeOptions {}

  export interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
