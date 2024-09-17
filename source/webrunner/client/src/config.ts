const isProduction = import.meta.env.MODE === 'production';
export const API_HOST = isProduction ? import.meta.env.VITE_API_HOST : import.meta.env.VITE_API_HOST_DEV;