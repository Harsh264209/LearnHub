

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug:{type:String,lowercase:true},
  description: { type: String, required: true },
  price: { type: Number, required: true },
  img: { data: Buffer, contentType:String },
  ratings:{type:Number,required:true},
  category: { type:mongoose.ObjectId, ref:'Category',required:true },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
