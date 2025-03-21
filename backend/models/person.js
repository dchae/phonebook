const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

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

personSchema.path("name").validate((s) => s.length > 0, "Name cannot be empty");
personSchema
  .path("number")
  .validate(
    (s) => /^[0-9\-\(\)]+$/.test(s),
    "Phone number must be a non-empty string. Allowed chars are digits, hyphens and parentheses.",
  );

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
