const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
console.log(process.env);

// mongoose.set("strictQuery", false);
// silently ignore queries with fields that don't exist in the schema (instead of throwing an error)

console.log("Connecting to", url);
mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log("Error connecting to MongoDB:", e.message));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
