export default () => {
  return {
    database: {
      username: process.env.POSTGRES_USER || 'autoteile26',
      password: process.env.POSTGRES_PASSWORD || 'changeme_in_local_env',
      database: process.env.POSTGRES_DB || 'autoteile26',
      port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
      host: process.env.POSTGRES_HOST || '127.0.0.1'
    },
  };
};
