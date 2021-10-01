const express = require('express');
const db = require('../db/db.js');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Retrieves all review for a product
app.get('/reviews/:productId', (req, res) => {
  const reviewsArray = db.getReviews(req.params.productId);
  res.send(reviewsArray);
});

// Retrieves all Review Metadata for a review
app.get('/reviews/:productId/meta', (req, res) => {
  const reviewMetaObj = db.getReviewsMeta(req.params.productId);
  res.send(reviewMetaObj);
});

// Write a review
app.post('/reviews/:productId', (req, res) => {
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