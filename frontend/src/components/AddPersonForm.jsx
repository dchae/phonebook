const AddPersonForm = ({
  onSubmit,
  nameValue,
  onNameChange,
  phoneValue,
  onPhoneChange,
}) => {
  return (
    <>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">name: </label>
          <input
            id="name"
            name="name"
            value={nameValue}
            onChange={onNameChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phone">number: </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={phoneValue}
            onChange={onPhoneChange}
            required
          />
        </div>

        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

export default AddPersonForm;
