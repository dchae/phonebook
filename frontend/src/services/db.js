import axios from "axios";

const baseURL = "/api/persons";

const fetchAll = () => {
  return axios.get(baseURL).then((response) => response.data);
};

const addPerson = (personObj) => {
  return axios.post(baseURL, personObj).then((response) => response.data);
};

const updatePerson = (id, person) => {
  const url = [baseURL, id].join("/");
  return axios.put(url, person).then((response) => response.data);
};

const deletePerson = (id) => {
  const url = [baseURL, id].join("/");
  return axios.delete(url).then((response) => response.data);
};

export default { fetchAll, addPerson, updatePerson, deletePerson };
