-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

CREATE DATABASE IF NOT EXISTS ReviewAndRating;
USE ReviewAndRating;

-- -- ---
-- -- Table 'characteristic_reviews'
-- --
-- -- ---

DROP TABLE IF EXISTS characteristic_reviews;


CREATE TABLE characteristic_reviews (
  id INT NOT NULL AUTO_INCREMENT,
  characteristic_id INT NOT NULL,
  review_id INT NOT NULL,
  value INT NOT NULL,
  PRIMARY KEY (id)
);

LOAD DATA LOCAL INFILE 'csv/characteristic_reviews.csv'
INTO TABLE `characteristic_reviews`
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

CREATE INDEX idx_characteristic_reviews_by_review_id ON characteristic_reviews (review_id);


-- -- -- ---
-- -- -- Table 'characteristics'
-- -- --
-- -- -- ---

DROP TABLE IF EXISTS characteristics;

CREATE TABLE characteristics (
  id INT AUTO_INCREMENT NOT NULL,
  product_id INT NOT NULL,
  name VARCHAR(20) NOT NULL,
  PRIMARY KEY (id)
);



LOAD DATA LOCAL INFILE 'csv/characteristics.csv'
INTO TABLE characteristics
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, product_id, name);
CREATE INDEX idx_characteristics_by_product_id ON characteristics (product_id);



-- ---
-- Table 'reviews'
--
-- ---

DROP TABLE IF EXISTS reviews;

CREATE TABLE reviews (
  id INT AUTO_INCREMENT NOT NULL,
  product_id INT NOT NULL DEFAULT 0,
  rating INT NOT NULL DEFAULT 0,
  date_field DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  summary VARCHAR(500) NOT NULL DEFAULT '',
  body VARCHAR(1000) NOT NULL DEFAULT '',
  recommend VARCHAR(6) NOT NULL DEFAULT 'false',
  reported VARCHAR(6) NOT NULL DEFAULT 'false',
  reviewer_name VARCHAR(60) NOT NULL DEFAULT '',
  reviewer_email VARCHAR(60) NOT NULL DEFAULT '',
  response VARCHAR(1000) NOT NULL DEFAULT '',
  helpfulness INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
);

LOAD DATA LOCAL INFILE 'csv/reviews.csv'
INTO TABLE reviews
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, product_id, rating, @epochtime, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
set date_field = from_unixtime(@epochtime/1000);

CREATE INDEX idx_reviews_by_product_id ON reviews (product_id);


-- ---
-- Table 'reviews_photos'

-- ---

DROP TABLE IF EXISTS reviews_photos;

CREATE TABLE reviews_photos (
  id INT AUTO_INCREMENT NOT NULL,
  review_id INT NOT NULL,
  url VARCHAR(1000) NOT NULL DEFAULT '',
  PRIMARY KEY (id)
);

LOAD DATA LOCAL INFILE 'csv/reviews_photos.csv'
INTO TABLE reviews_photos
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, review_id, url);


CREATE INDEX idx_photos_by_review_id ON reviews_photos (review_id);
