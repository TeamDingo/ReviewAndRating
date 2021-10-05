const mysql= require('mysql');
const config = require('./config');
const Promise = require('bluebird');

const connectionConfig = mysql.createConnection(config);
const db = Promise.promisifyAll(connectionConfig, { multiArgs: true });

const connection = db.connectAsync()
.then(() => console.log('Connected to database'))
.catch(() => console.log('Error connecting to database'));

//--------------Helper funcs---------------
function getPhotosForReview(reviewId) {
  let photosQueryString = 'SELECT * FROM reviews_photos WHERE review_id=' + reviewId;
  return db.queryAsync(photosQueryString).then(collectPhotosFromRows) ;
}

function collectPhotosFromRows(rows) {
  // return rows[0].map(row => {console.log(row.id)});
  return rows[0].map(row => ({ 'id': row.id, 'url': row.url }));
}


//---------------getReviewsOfProduct ----------------
const getReviews = async (productId, sortString, count = 5, page = 1) => {
  let queryString = 'SELECT * FROM reviews WHERE product_id=' + productId;
  let sortParts = sortString.split(":");
  if (sortParts[0] === 'newest' && sortParts[1] === "asc") {
    queryString = queryString + " ORDER BY date_field ASC ";
  }
  if (sortParts[0] === 'helpful' && sortParts[1] === "desc") {
    queryString = queryString + " ORDER BY helpfulness DESC ";
  }
  queryString = queryString + "LIMIT " + count + ";";
  let response = {};
  response.product = productId;
  response.page = page;
  response.count = count;
  response.results = [];
  let rows = await db.queryAsync(queryString);
  for (let i = 0; i < rows[0].length; i++) {
    review = {};
    review.review_id = rows[0][i].id;
    review.rating = rows[0][i].rating;
    review.summary = rows[0][i].summary;
    review.recommend = rows[0][i].recommend;
    review.response = rows[0][i].response;
    review.body = rows[0][i].body;
    review.helpfulness = rows[0][i].helpfulness;
    review.photos = await getPhotosForReview(review.review_id);
    response.results.push(review);
  }
  console.log(response);
  return response;
};

//-----------------------getReviewMetaData ------------------------
const getReviewMetaData = async (productId) => {
  let queryString = 'SELECT rating, COUNT(*) as count FROM reviews WHERE product_id=' + productId + ' GROUP BY rating';

  let response = {};

  // select rating, count(*) as count from reviews where product_id=2 group by rating;
  // select c.name, c.id as id, avg(cr.value) as value from characteristics c inner join characteristic_reviews cr on c.id=cr.characteristic_id where c.product_id=2 group by c.name, c.id;


  let rows = await db.queryAsync(queryString);
  response.ratings = {};
  for (let i = 0; i < rows[0].length; i++) {
    response.ratings[rows[0][i].rating.toString()] = rows[0][i].count;
  }

  queryString = "select c.name, c.id as id, avg(cr.value) as value from characteristics c inner join characteristic_reviews cr on c.id=cr.characteristic_id where c.product_id=" + productId + " group by c.name, c.id;"
  rows = await db.queryAsync(queryString);
  response.characteristics = {};
  for (let i = 0; i < rows[0].length; i++) {
    response.characteristics[rows[0][i].name] = {'id': rows[0][i].id, 'value': rows[0][i].value};
  }
  return response;
};

//--------------------postReview-----------------------
const postReview = async (product_id, rating, summary, body, recommend, name, email, photos, characteristics) => {
  let queryString = 'INSERT INTO reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email, date_field, reported, response, helpfulness) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ';
  const newReview = await db.queryAsync(queryString, [product_id, rating, summary, body, recommend, name, email, "2021-10-04", 'true', "response", 4]);
};

const reportReview = (reviewId) => {
  let queryString = 'UPDATE reviews SET reported = true WHERE id=' + reviewId +';';
  db.query(queryString);
  // const queryString = 'INSERT INTO reviews (product_id, rating, summary, body, recommend, name, email, photos, characteristic_id) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?);';
  // db.query(queryString, product_id, rating, summary, body, recommend, name, email, photos, characteristic_id)
};



// getReviews(2, "newest:asc", 5, 1, (err, results) => {
//   console.log(results);
// });
postReview(111111, 5, "summary", "body", 'true', 'name', 'email', null, null);
module.exports = {
  getReviews,
  getReviewMetaData,
  postReview,
  reportReview
};