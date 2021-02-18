const express = require("express")
const q2m = require("query-to-mongo")

const reviewModel = require("./schema")

const reviewsRouter = express.Router()

reviewsRouter.post("/", async (req, res, next) => {
  try {
    const newreview = new reviewModel(req.body)

    const { _id } = await newreview.save()
    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query)
    const total = await reviewModel.countDocuments(query.criteria)

    const reviews = await reviewModel.find(query.criteria, query.options.fields)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort)
    res.send({ links: query.links("/reviews", total), reviews })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

reviewsRouter.get("/:id", async (req, res, next) => {
  try {
    const review = await reviewModel.findById(req.params.id)
    res.send(review)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

reviewsRouter.put("/:id", async (req, res, next) => {
  try {
    const modifiedreview = await reviewModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    )
    if (modifiedreview) {
      res.send(modifiedreview)
    } else {
      next()
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

reviewsRouter.delete("/:id", async (req, res, next) => {
  try {
    const review = await reviewModel.findByIdAndDelete(req.params.id)
    if (review) {
      res.send(review)
    } else {
      next()
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

module.exports = reviewsRouter