//import axios
import axios from "axios";

export const Api = axios.create({
  //set default endpoint API
  baseURL: "https://backend-simakad.azurewebsites.net/api/v1",
});
