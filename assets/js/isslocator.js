(function () {
  axios
    .get('http://api.open-notify.org/iss-now.json')
    .then((res) =>
      console.log(
        res.data.iss_position.latitude,
        res.data.iss_position.longitude
      )
    );
})();
