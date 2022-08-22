const { response } = require('express');

const axios = require('axios').default;

axios({
    method: 'get',
    url: 'http://localhost:8080',
    responseType: 'stream'
  })
    .then(function (response) {
      console.log(response)
    });