const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = new Schema({
  //Solo el nombre del archivo, no todo el url
  //Es mala practica agregar todo el url
  imageUrl: String,
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
});

mongoose.model('Blog', blogSchema);
