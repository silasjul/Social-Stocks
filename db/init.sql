CREATE DATABASE IF NOT EXISTS social_stocks CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE social_stocks;

CREATE TABLE IF NOT EXISTS truths (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255),
    content VARCHAR(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    timestamp DATETIME,
    UNIQUE (url, timestamp)
);


CREATE TABLE IF NOT EXISTS scraper_state (
  id INT PRIMARY KEY,
  last_href VARCHAR(255),
  last_scraped_time DATETIME
);

INSERT INTO scraper_state (id, last_href, last_scraped_time)
VALUES (1, 'https://trumpstruth.org/statuses/30666', '2025-04-16 07:06:00')
ON DUPLICATE KEY UPDATE id=id;
