CREATE DATABASE IF NOT EXISTS myspendings DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE myspendings;


CREATE TABLE IF NOT EXISTS spendings (
  'id' int(11) NOT NULL AUTO_INCREMENT
  --date date NOT NULL,
  --text varchar(255) DEFAULT NULL,
  --type bit(2) NOT NULL DEFAULT b'0',
  --amount float NOT NULL DEFAULT '0',
  --PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS user (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;