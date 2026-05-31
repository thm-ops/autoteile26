export default () => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    database: {
      username: isProd
        ? process.env.POSTGRES_USER_PROD
        : process.env.POSTGRES_USER,
      password: isProd
        ? process.env.POSTGRES_PASSWORD_PROD
        : process.env.POSTGRES_PASSWORD,
      database: isProd ? process.env.POSTGRES_DB_PROD : process.env.POSTGRES_DB,
      port: isProd
        ? parseInt(process.env.POSTGRES_PORT_PROD ?? '5432', 10)
        : parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
      host: isProd ? process.env.POSTGRES_HOST_PROD : process.env.POSTGRES_HOST,
    },
  };
};
