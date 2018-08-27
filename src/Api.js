import axios from 'axios';

const API = {
  getFleetData: () => {
    return axios.get(`http://gps.veritrans.ca:8200/GetFleetWT.asp?ClientID=2222`, {
      params: {
        Token: localStorage.getItem('token')
      }
    })
      .then((res) => {
        // console.log('res', res);
        return res.data;
      });
  },
  getUnitData: (unit) => {
    return axios.get(`http://gps.veritrans.ca:8200/GetUnitWT.asp?ClientID=2222&Unit=${unit}`, {
      params: {
        Token: localStorage.getItem('token')
      }
    })
      .then((res) => {
        return res.data;
      });
  },
  getEventData: (unit) => {
    return axios.get(`http://gps.veritrans.ca:8200/GetEventWT.asp?ClientID=2222&Unit=${unit}`, {
      params: {
        Token: localStorage.getItem('token')
      }
    })
      .then((res) => {
        return res.data;
      });
  },
  getTiresData: (unit) => {
    return axios.get(`http://gps.veritrans.ca:8200/GetTiresWT.asp?ClientID=2222&Unit=${unit}`, {
      params: {
        Token: localStorage.getItem('token')
      }
    })
      .then((res) => {
        return res.data;
      });
  },
  snapToRoad: (pathValues) => {
    return axios.get(`https://roads.googleapis.com/v1/snapToRoads`, {
      params: {
        interpolate: true,
        key: 'AIzaSyC9OQ-oCal7GyzO9xtOjH8dQ_ddhltT59g',
        path: pathValues.join('|')
      }
    })
      .then((res) => {
        return res.data;
      });
  },
  login: (userID, pass, ClientID) => {
    return axios.get(`http://gps.veritrans.ca:8200/LoginWT.asp`, {
      params: {
      	ClientID:ClientID,
      	UserID: userID,
      	Password: pass
      }
    })
      .then((res) => {
        return res;
      });
  }
};

export default API;