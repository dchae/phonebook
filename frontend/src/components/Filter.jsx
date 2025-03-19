const Filter = ({ filterValue, onFilterChange }) => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label>
        filter shown with:{" "}
        <input value={filterValue} onChange={onFilterChange} />
      </label>
    </form>
  );
};

export default Filter;
