export default () => {
  return {
    database: {
      username: process.env.POSTGRES_USER || 'user',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DB || 'db',
      port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
      host: process.env.POSTGRES_HOST || 'pgdata'
    },
  };
};
