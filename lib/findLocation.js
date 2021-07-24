const axios = require("axios");

exports.findLocation = async function (query) {
  // url not accessible to anonymous users
  const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=pjson&outFields=Addr_type&forStorage=false&SingleLine=${query}`;

  const { data } = await axios.get(url);
  const { candidates } = data;
  if (!candidates || candidates.length === 0) {
    throw new Error("Error, Result not Found!");
  }
  return candidates[0];
};
