SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS `test-credo-email-verification`;
CREATE DATABASE `test-credo-email-verification`
  CHARACTER SET 'utf8'
  COLLATE 'utf8_unicode_ci';
GRANT ALL ON `test-credo-email-verification`.* TO 'root'@'localhost'
IDENTIFIED BY 'root';
SET FOREIGN_KEY_CHECKS = 1;
