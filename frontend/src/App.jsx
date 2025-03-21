import { useState, useEffect } from "react";
import AddPersonForm from "./components/AddPersonForm.jsx";
import Phonebook from "./components/Phonebook.jsx";
import Filter from "./components/Filter.jsx";
import Notification from "./components/Notification.jsx";
import db from "./services/db.js";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filterQuery, setFilterQuery] = useState("");
  const filteredPersons = filterQuery
    ? persons.filter(({ name }) => name.toLowerCase().includes(filterQuery))
    : persons;
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [notification, setNotification] = useState(null);
  const resetFormFields = () => {
    setFilterQuery("");
    setNewName("");
    setNewPhone("");
  };

  const addNotification = (message, className = "success") => {
    setNotification({ message, className });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  useEffect(() => {
    db.fetchAll().then((data) => {
      setPersons(data);
    });
  }, []);

  const findPerson = (name) =>
    persons.find((person) => person.name.toLowerCase() === name.toLowerCase());

  const addNewPersonHandler = (e) => {
    e.preventDefault();

    const newPerson = {
      name: newName,
      number: newPhone,
    };

    const existing = findPerson(newName);
    if (existing) {
      const replace = window.confirm(
        `${existing.name} already exists. Replace the old contact?`,
      );
      if (replace) updatePerson(existing.id, newPerson);
      return;
    }

    addPerson(newPerson);
  };

  const addPerson = (person) => {
    db.addPerson(person)
      .then((added) => {
        setPersons(persons.concat(added));
        addNotification(`Added ${added.name}`);
      })
      .catch(() => {
        addNotification(`The person could not be added`, "error");
      });
  };

  const updatePerson = (id, person) => {
    db.updatePerson(id, person)
      .then((updated) => {
        setPersons(persons.map((p) => (p.id === id ? updated : p)));
        addNotification(`Updated ${updated.name}`);
        resetFormFields();
      })
      .catch(() => {
        addNotification(`The person could not be found`, "error");
      });
  };

  const deletePerson = ({ name, id }) => {
    if (!window.confirm(`Delete ${name}?`)) return;

    db.deletePerson(id)
      .then((deleted) => {
        setPersons(persons.filter((person) => person.id !== id));
        addNotification(`Deleted ${deleted.name}`);
      })
      .catch(() => {
        addNotification(`The person could not be found`, "error");
      })
      .finally(() => resetFormFields());
  };

  const nameInputChangeHandler = (e) => setNewName(e.target.value);
  const phoneInputChangeHandler = (e) => setNewPhone(e.target.value);
  const filterInputChangeHandler = (e) => {
    const query = e.target.value.trim().toLowerCase();
    setFilterQuery(query);
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification notification={notification} />
      <Filter
        filterValue={filterQuery}
        onFilterChange={filterInputChangeHandler}
      />
      <AddPersonForm
        onSubmit={addNewPersonHandler}
        nameValue={newName}
        onNameChange={nameInputChangeHandler}
        phoneValue={newPhone}
        onPhoneChange={phoneInputChangeHandler}
      />
      <Phonebook persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
