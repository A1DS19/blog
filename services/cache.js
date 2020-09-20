const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const keys = require('../config/keys');

const redisUrl = keys.redisUrl;
const client = redis.createClient(redisUrl);

//Habilitar async/await en redis
client.hget = util.promisify(client.hget);

//Crear nueva instancia de exec
const exec = mongoose.Query.prototype.exec;

//Esta funcion hace que se puedan escojer los
//querys que hagan uso de cache o no
//retorna this para que sea chainable

//Al usar otro id como this.hashKey se puede
//usar el client.hget y el hset ya que guarda
//una colleccion de otra coleccion y muestra todos los datos
//del request
mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');
  return this;
};

mongoose.Query.prototype.exec = async function () {
  //Si es false se ejecuta query sin caching
  //de lo contrario hace uso de caching
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  //Esto extrae el query y el nombre de la coleccion
  // al momento de hacer un query para hacer unico
  //el key que se asigne a redis
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  //Pasar keyString a redis
  const cacheValue = await client.hget(this.hashKey, key);

  //preguntar si  el cacheValue ya existe
  //pasar a json(ya que es un string), convertir a modelo
  //y devolver datos

  if (cacheValue) {
    const doc = JSON.parse(cacheValue);

    if (Array.isArray(doc)) {
      return doc.map((d) => new this.model(d));
    }

    return new this.model(doc);
  }

  //si no existe hacer query,devolver, hacerlo un
  //string(porque es json) y pasar a redis
  const result = await exec.apply(this, arguments);

  //'EX':expira
  //10:segundos
  client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);
  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};
