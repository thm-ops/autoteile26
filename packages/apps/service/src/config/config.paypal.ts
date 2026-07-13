export default () => {
  return {
    paypal: {
      baseUrl: process.env.PAYPAL_BASE_URL,
      clientId: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    },
  };
};
