const express = require('express');
const chats = require('./data/data');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');
const userRouter = require('./routes/userRouter');
const { notFound, handleError } = require('./middlewares/errorMiddlewares');

dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use('/api/v1/user/', userRouter);

app.use(notFound);
app.use(handleError);

connectDB()
  .then((conn) => {
    console.log(
      colors.bgWhite.bold(`Database connected successfully. Host: ${conn.connection.host}`)
    );
    app.listen(PORT, () => {
      console.log(colors.green(`Server started on port ${PORT}`));
    });
  })
  .catch((err) => {
    console.log(colors.red(`Database connection failed. Error ${err.message}`));
  });
