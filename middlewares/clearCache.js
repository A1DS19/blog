const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
  //Espero a que se complete el post request
  //y luego limpio el cache para aceptar el nuevo
  await next();

  clearHash(req.user.id);
};
