/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_HOST: string;
    readonly VITE_API_HOST_DEV: string;
    // Add other environment variables here...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}