const { Schema,model } = require("mongoose")
const mongoose = require("mongoose")


const articleSchema = new Schema(
  {
    headLine: {
      type: String,
      required: true,
    },
    subHead: {
      type: String
    },
    content: {
      type: String,
      required: true
    },
    category:{
      name:{
      type: String},
      img:{
        type: String}
      } ,
    cover: {
      type: String },
      reviews: [
        {
          text: String,
          user: String
        },
      ],
      authors: [{ type: Schema.Types.ObjectId, ref: "Author" }]
    },
    
    {timestamps:true}
    
)
articleSchema.static("findarticleWithAuthors", async function (id) {
  const article = await articleModel.findById(id).populate("authors")
  return article
})

const articleModel = model("article", articleSchema)
module.exports = mongoose.model("article", articleSchema)
