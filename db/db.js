// when reading epoch number, mysql> select from_unixtime(floor(1389422614485/1000));

const db = require('./index.js');

const getReviews = async productId => {

    // const queryString = 'SELECT * FROM reviews WHERE product_id = ?;';

};

const getReviewsMeta = async questionId => {
  //
};

const writeReview = (product_id, rating, summary, body, recommend, name, email, photos, characteristic_id) => {

    // const queryString = 'INSERT INTO reviews (product_id, rating, summary, body, recommend, name, email, photos, characteristic_id) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?);';
    // db.query(queryString, product_id, rating, summary, body, recommend, name, email, photos, characteristic_id)

};


module.exports = {
  getReviews,
  getReviewsMeta,
  writeReview
};