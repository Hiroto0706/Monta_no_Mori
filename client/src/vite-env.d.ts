/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_API: string;
  readonly VITE_IMAGE_FETCH_LIMIT: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
