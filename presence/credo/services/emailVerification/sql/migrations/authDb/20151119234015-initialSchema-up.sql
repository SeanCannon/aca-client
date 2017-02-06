SET SQL_MODE           = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone          = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;

--
-- Database: `*-credo-email-verification`
--

-- --------------------------------------------------------

--
-- Table structure for table `emails`
--

CREATE TABLE IF NOT EXISTS `__DB_PREFIX__credo-email-verification`.`emails` (
  `id`        INT(10) UNSIGNED        NOT NULL AUTO_INCREMENT,
  `email`     VARCHAR(100)
              COLLATE utf8_unicode_ci NOT NULL,
  `status`    TINYINT(4)              NOT NULL DEFAULT '1'
              COMMENT '0:inactive, 1:valid, 2:rejected',
  `timestamp` TIMESTAMP               NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
)
  ENGINE          = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE         = utf8_unicode_ci
  AUTO_INCREMENT  = 1;

-- --------------------------------------------------------

SET FOREIGN_KEY_CHECKS = 1;
