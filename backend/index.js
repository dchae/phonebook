require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person.js");

// App init
const app = express();
app.use(express.json());
app.use(express.static("dist"));

// init logging
morgan.token("json", (request) => "\n" + JSON.stringify(request.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :json"),
);

// HELPERS
const nameExists = async (name) => {
  try {
    const nameRegex = new RegExp(`^${name}$`, "i");
    const existing = await Person.findOne({ name: nameRegex });
    return !!existing;
  } catch (e) {
    console.log("Error checking for existing name", error);
    throw error;
  }
};

// const personError = async (name, number) => {
//   if (!name) return "Name cannot be empty";
//   if (await nameExists(name)) return "That person already exists";
//   if (typeof number !== "string" || !number.match(/^[0-9\-\(\)]+$/)) {
//     return "Phone number must be a non-empty string. Allowed chars are digits, hyphens and parentheses.";
//   }
//   return null;
// };
//
// ROUTES

app.get("/info", (request, response) => {
  const count = Person.countDocuments();
  const body = `<p>Phonebook has info for ${count} people</p>\n${new Date()}`;
  response.send(body);
});

app.get("/api/persons", async (request, response) => {
  const persons = await Person.find({});
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = Person.findById(id);
  if (!person) return response.status(404).end();

  response.json(person);
});

app.post("/api/persons", async (request, response) => {
  const name = request.body.name.trim();
  const number = request.body.number.trim();

  // const error = await personError(name, number);
  // if (error) return response.status(400).json({ error });

  if (await nameExists(name)) {
    return response.status(400).json({ error: "That person already exists" });
  }

  try {
    const newPerson = await Person.insertOne({ name, number });
    response.json(newPerson);
  } catch (e) {
    console.error(`Error caught: ${e.name}: ${e.message}`);
    response.status(400).json({ error: e.message });
  }
});

app.put("/api/persons/:id", async (request, response) => {
  const id = request.params.id;
  const name = request.body.name.trim();
  const number = request.body.number.trim();

  const opts = { new: true, runValidators: true };
  try {
    const updated = await Person.findByIdAndUpdate(id, { name, number }, opts);
    response.json(updated);
  } catch (e) {
    console.error(`Error caught: ${e.name}: ${e.message}`);
    response.status(400).json({ error: e.message });
  }
});

app.delete("/api/persons/:id", async (request, response) => {
  const id = request.params.id;
  try {
    const deleted = await Person.findByIdAndDelete(id);
    let code = deleted ? 204 : 404;
    response.status(code).end();
  } catch {
    response.status(500).end();
  }
});

// start app
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Phonebook API server running on port ${PORT}`);
});
