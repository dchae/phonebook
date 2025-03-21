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

// ROUTES

app.get("/info", async (request, response) => {
  const count = await Person.where({}).countDocuments();
  const body = `<p>Phonebook has info for ${count} people</p>\n${new Date()}`;
  response.send(body);
});

app.get("/api/persons", async (request, response) => {
  const persons = await Person.find({});
  response.json(persons);
});

app.get("/api/persons/:id", async (request, response, next) => {
  const id = request.params.id;
  try {
    const person = await Person.findById(id);
    if (!person) return response.status(404).end();
    response.json(person);
  } catch (error) {
    next(error);
  }
});

app.post("/api/persons", async (request, response, next) => {
  const name = request.body.name?.trim();
  const number = request.body.number?.trim();

  try {
    const opts = { validateBeforeSave: true };
    const newPerson = await Person.insertOne({ name, number }, opts);
    response.json(newPerson);
  } catch (error) {
    next(error);
  }
});

app.put("/api/persons/:id", async (request, response, next) => {
  const id = request.params.id;
  const name = request.body.name?.trim();
  const number = request.body.number?.trim();

  try {
    const opts = { new: true, runValidators: true };
    const updated = await Person.findByIdAndUpdate(id, { name, number }, opts);
    if (!updated)
      return response
        .status(404)
        .json({ error: "That person could not be found" });
    response.json(updated);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/persons/:id", async (request, response, next) => {
  const id = request.params.id;
  try {
    const deleted = await Person.findByIdAndDelete(id);
    let code = deleted ? 204 : 404;
    response.status(code).end();
  } catch (error) {
    next(error);
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown Endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  switch (error.name) {
    case "CastError":
      return response.status(400).send({ error: "malformatted id" });
    case "ValidationError":
      return response.status(400).send({ error: error.message });
    case "DuplicateNameError":
      return response.status(400).send({ error: error.message });
    default:
      next(error);
  }
};

// must be last loaded middleware, all routes should be registered before this
app.use(errorHandler);
// start app
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Phonebook API server running on port ${PORT}`);
});
