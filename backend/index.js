const express = require("express");
const morgan = require("morgan");

// App init
const app = express();
app.use(express.json());
app.use(express.static("dist"));

morgan.token("json", (request) => "\n" + JSON.stringify(request.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :json"),
);

// "Database"
let persons = [
  {
    id: "48482",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "50517",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "20567",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "97845",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// HELPERS

const generateId = ((existing) => {
  const pool = new Set(existing.map((x) => x.id));
  return () => {
    let id;
    do {
      id = String(Math.floor(Math.random() * 10 ** 5));
    } while (id && pool.has(id));
    return id;
  };
})(persons);

const personError = (name, number) => {
  if (!name) return "Name cannot be empty";
  if (
    persons.some((p) => p.name.toLocaleLowerCase() === name.toLocaleLowerCase())
  )
    return "That person already exists";
  if (typeof number !== "string" || !number.match(/^[0-9\-\(\)]+$/)) {
    return "Phone number must be a non-empty string. Allowed chars are digits, hyphens and parentheses.";
  }
  return null;
};

const getPerson = (id) => persons.find((person) => person.id === id);

// ROUTES

app.get("/info", (request, response) => {
  const body = `<p>Phonebook has info for ${persons.length} people</p>\n${new Date()}`;
  response.send(body);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = getPerson(id);
  if (!person) return response.status(404).end();

  response.json(person);
});

app.post("/api/persons", (request, response) => {
  const name = request.body.name.trim();
  const number = request.body.number.trim();

  const error = personError(name, number);
  if (error) return response.status(400).json({ error });

  const person = {
    id: generateId(),
    name,
    number,
  };
  persons = persons.concat(person);
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Phonebook API server running on port ${PORT}`);
});
