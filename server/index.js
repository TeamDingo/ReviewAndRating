const express = require('express');
const db = require('../db/db.js');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Retrieves all review for a product
app.get('/reviews/:productId', async (req, res) => {
  const count = req.query.count;
  const sortString = 'newest:asc';
  const productId = req.params.productId;
  try {
    const reviews = await db.getReviews(productId, sortString, count, 1);
    res.status(200).send(reviews);
  } catch (err) {
    console.log(err.stack);
    res.status(404).send();
  }
});

// Retrieves all Review Metadata for a review
app.get('/reviews/:productId/meta', async (req, res) => {
  const productId = req.params.productId;
  try {
    const reviewsMetadata = await db.getReviewMetaData(productId);
    res.status(200).send(reviewsMetadata);
  } catch (err) {
    console.log(err.stack);
    res.status(404).send();
  }
});

// Write a review
app.post('/reviews/:productId', (req, res) => {
  try {
    const success = await db.postReview(
      req.params.productId,
      req.body.rating,
      req.body.summary,
      req.body.body,
      req.body.recommend,
      req.body.name,
      req.body.email,
      req.body.photos,
      req.body.characteristics
    );
    if (success) {
      res.status(200).send();
    } else {
      res.status(400).send();
    }
  } catch (err) {
    console.log('error posting question');
    res.status(400).send();
  }

  const postReview = async (product_id, rating, summary, body, recommend, name, email, photos, characteristics) => {

  // db.writeReview(product_id, rating, summary, body, recommend, name, email, photos, characteristic_id);
  // res.send("added");
});

app.put('/reviews/:review_id/helpful', (req, res) => {

});

app.put('/reviews/:review_id/report', (req, res) => {

});


app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});