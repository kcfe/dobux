const NODE_ENV = process.env.NODE_ENV

export const isDev = NODE_ENV === 'development'
export const isProd = NODE_ENV === 'production'
