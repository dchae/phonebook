const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

// mongoose.set("strictQuery", false);
// silently ignore queries with fields that don't exist in the schema (instead of throwing an error)

class DuplicateNameError extends Error {
  constructor(...args) {
    super(...args);
    this.name = "DuplicateNameError";
  }
}

console.log("Connecting to", url);
mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log("Error connecting to MongoDB:", e.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, "A name is required."],
  },
  number: {
    type: String,
    validate: {
      validator: (s) => /^\d{2,3}\-\d{6,}$/.test(s),
      message: ({ value }) => `${value} is not a valid phone number.`,
    },
    required: [true, "Phone number is required."],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

personSchema.pre("save", async function () {
  const nameRegex = new RegExp(`^${this.name}$`, "i");
  const exists = await mongoose.models["Person"].findOne({ name: nameRegex });
  if (exists) {
    // console.log("this:", JSON.stringify(this));
    throw new DuplicateNameError(
      `Person with name '${this.name}' already exists.`,
    );
  }
});

module.exports = mongoose.model("Person", personSchema);
