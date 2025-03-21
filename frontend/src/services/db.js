import axios from "axios";

const baseURL = "/api/persons";

const fetchAll = () => {
  return axios.get(baseURL).then((response) => response.data);
};

const addPerson = (personObj) => {
  return axios
    .post(baseURL, personObj)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(error.response.data.error);
    });
};

const updatePerson = (id, person) => {
  const url = [baseURL, id].join("/");
  return axios
    .put(url, person)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(error.response.data.error);
    });
};

const deletePerson = (id) => {
  const url = [baseURL, id].join("/");
  return axios
    .delete(url)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(error.response.data.error);
    });
};

export default { fetchAll, addPerson, updatePerson, deletePerson };
