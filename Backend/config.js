

module.exports = {
  port: process.env.PORT || 3001,
  secretKey: 'your-secret-key',
  db: {
    url: 'mongodb://localhost:27017/mern_auth',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    expiresIn: '1h',
  },
};

  