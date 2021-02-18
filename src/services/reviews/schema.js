const { Schema, model } = require("mongoose")

const reviewSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: { type: String, required: true },
   
  },
  {
    timestamps: true,
  }
)

module.exports = model("review", reviewSchema)