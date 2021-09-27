const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://Flo:0cqtyX8MHbpwlMqA@cluster0.egrws.mongodb.net/mern-project",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));
