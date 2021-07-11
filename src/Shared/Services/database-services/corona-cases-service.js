import config from "./configure-service.js";
import configData from "../../../config.json";

 function getRoot () {
    return configData.API_PROTOCOL + "//" + configData.API_IP +":"  + configData.API_PORT
     +"/" + configData.API_PATH ;
  }; 

export const coronaCases = (body) => {
    const API = getRoot();
    return fetch({
      method: 'GET',
      url: `${API}/corona-cases`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  };

  export const regions = (body) => {
    const API = getRoot();
    return fetch({
      method: 'GET',
      url: `${API}/corona-cases/regions`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  };