const ContactInfo = ({ person, deletePerson }) => {
  return (
    <li>
      {person.name}: {person.number}
      <button onClick={() => deletePerson(person)}>delete</button>
    </li>
  );
};

const Phonebook = ({ persons, deletePerson }) => {
  return (
    <>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => (
          <ContactInfo
            key={person.id}
            person={person}
            deletePerson={deletePerson}
          />
        ))}
      </ul>
    </>
  );
};

export default Phonebook;
