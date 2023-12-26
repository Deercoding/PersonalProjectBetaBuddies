-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bouldering
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `bouldering`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `bouldering` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `bouldering`;

--
-- Table structure for table `ad_location`
--

DROP TABLE IF EXISTS `ad_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ad_location` (
  `ad_location_id` int NOT NULL AUTO_INCREMENT,
  `ad_location` varchar(255) DEFAULT NULL,
  `ad_width` int DEFAULT NULL,
  `ad_length` int DEFAULT NULL,
  `ad_time_limit` int DEFAULT NULL,
  PRIMARY KEY (`ad_location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ad_location`
--

LOCK TABLES `ad_location` WRITE;
/*!40000 ALTER TABLE `ad_location` DISABLE KEYS */;
INSERT INTO `ad_location` VALUES (1,'首頁廣告',1920,500,1),(2,'挑戰賽頁面',560,750,2);
/*!40000 ALTER TABLE `ad_location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ad_status`
--

DROP TABLE IF EXISTS `ad_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ad_status` (
  `ad_status_id` int NOT NULL AUTO_INCREMENT,
  `ad_location_id` int DEFAULT NULL,
  `ad_status` tinyint(1) DEFAULT NULL,
  `game_id` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `ad_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ad_status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ad_status`
--

LOCK TABLES `ad_status` WRITE;
/*!40000 ALTER TABLE `ad_status` DISABLE KEYS */;
INSERT INTO `ad_status` VALUES (51,1,1,64,'2023-11-30','2023-12-01','ad-image-long.jpg_1701348284167.jpg'),(52,1,1,65,'2023-12-02','2023-12-03','ad-image-long.jpg_1701417203865.jpg'),(56,2,1,64,'2023-12-03','2023-12-04','ad-image-long.jpg'),(57,1,1,69,'2023-12-04','2023-12-05','ad-image-long.jpg_1701590754767.jpg'),(58,2,1,70,'2023-12-05','2023-12-07','ad-image-long.jpg_1701739279547.jpg');
/*!40000 ALTER TABLE `ad_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `betavideos`
--

DROP TABLE IF EXISTS `betavideos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `betavideos` (
  `video_id` int NOT NULL AUTO_INCREMENT,
  `wallroomId` int DEFAULT NULL,
  `video_link` varchar(255) DEFAULT NULL,
  `comments` varchar(3000) DEFAULT NULL,
  `user_level` varchar(255) DEFAULT NULL,
  `userId` varchar(255) DEFAULT NULL,
  `userName` varchar(255) DEFAULT NULL,
  `tag_room_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`video_id`),
  KEY `wallroomId` (`wallroomId`),
  CONSTRAINT `betavideos_ibfk_1` FOREIGN KEY (`wallroomId`) REFERENCES `wallrooms` (`wallroomId`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `betavideos`
--

LOCK TABLES `betavideos` WRITE;
/*!40000 ALTER TABLE `betavideos` DISABLE KEYS */;
INSERT INTO `betavideos` VALUES (11,4,'https://d23j097i06b1t0.cloudfront.net/production_id_4352405 (1080p).mp4_1700987942930','sss','sss','user1','anna',NULL),(12,4,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1700988077322','efef','2','user1','anna',NULL),(13,4,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1700988766854','推推','2','user1','anna',NULL),(14,19,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1700995669539','Beta 新鮮','4','user1','anna',NULL),(15,19,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1700995796936','vsvsv','3','user1','anna',NULL),(16,20,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1700995856520','vsvs','2','user1','anna',NULL),(17,24,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701053667062','r4r4','2','user1','anna',NULL),(18,24,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701053762304','fefe','2','user1','anna',NULL),(19,34,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701063920697','Hidwdwd','2','2','ann',NULL),(20,40,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701064661226','Beta :)','2','2','ann',NULL),(21,34,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701180580693','','','2','ann','65640bdf0ddf3ae3122b59ff'),(22,34,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701180626852','','','2','ann','65640bdf0ddf3ae3122b59ff'),(23,34,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701180667452','sds','sdsd','2','ann','65640bdf0ddf3ae3122b59ff'),(24,34,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701180924923','dasda','afsaf','2','ann','65640bdf0ddf3ae3122b59ff'),(25,34,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701181075973','aaaaaaa','aaaaaaa','3','ann3','65640bdf0ddf3ae3122b59ff'),(26,34,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701181220683','rrrr','rrrrrrr','3','ann3','65640bdf0ddf3ae3122b59ff'),(27,34,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701181286189','eeee','eeeeee','3','ann3','65640bdf0ddf3ae3122b59ff'),(28,34,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701181329991','ttttttt','tttttt','2','ann3','65640bdf0ddf3ae3122b59ff'),(29,35,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701185557990','yyyy','2','2','ann3','65640be30ddf3ae3122b5a08'),(30,43,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701185592866','uuuu','3','2','ann3','6565f7ba1ab18c01415e3876'),(31,36,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701186373897','ppppppp','3','2','ann3','65640c070ddf3ae3122b5a10'),(32,52,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701224193074','yyyy','5','1','ann3','65669db8b119df255098b27e'),(33,53,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701224233966','etete','7','1','ann3','65669db8b119df255098b288'),(34,54,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701229530542','ffwfewfew','7','2','ann3','6566b2f2b119df255098b304'),(35,55,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701241950212','rr','2','2','ann3','6566b2f3b119df255098b30e'),(36,24,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701352341191','偏硬','2','3','ann3','65632fcdd34ccada8196e449'),(37,24,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701352433357','偏硬','3','3','ann3','65632fcdd34ccada8196e449'),(38,24,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701673976977','首 beta','3','3','ann3','65632fcdd34ccada8196e449'),(39,23,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701674262619','新手友善','3','3','ann3','65632fc4d34ccada8196e441'),(40,60,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701694382881','test','1','3','ann3','656dc8b6d2d196f779f23bec'),(41,54,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701694788674','挑戰賽','2','3','ann3','6566b2f2b119df255098b304'),(42,54,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701694838420','competition','2','3','ann3','6566b2f2b119df255098b304'),(43,54,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701694934434','hhg','ghg','3','ann3','6566b2f2b119df255098b304'),(44,47,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701695033640','test','test','3','ann3','656609578a52559bd804b8d5'),(45,47,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701695053869','test','test','3','ann3','656609578a52559bd804b8d5'),(46,54,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701695200174','s','s','3','ann3','6566b2f2b119df255098b304'),(47,54,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701695223333','s','s','3','ann3','6566b2f2b119df255098b304'),(48,55,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701695250624','hyy6y','6y6','3','ann3','6566b2f3b119df255098b30e'),(49,54,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701695419342','r','r','3','ann3','6566b2f2b119df255098b304'),(50,54,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701695469521','y','y','3','ann3','6566b2f2b119df255098b304'),(51,54,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701695486672','u','u','3','ann3','6566b2f2b119df255098b304'),(52,55,'https://d23j097i06b1t0.cloudfront.net/pexels-ron-lach-6702513 (240p).mp4_1701695502935','i','i','3','ann3','6566b2f3b119df255098b30e');
/*!40000 ALTER TABLE `betavideos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_user_walls`
--

DROP TABLE IF EXISTS `game_user_walls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_user_walls` (
  `game_user_walls_id` int NOT NULL AUTO_INCREMENT,
  `game_user_id` int DEFAULT NULL,
  `wall_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`game_user_walls_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_user_walls`
--

LOCK TABLES `game_user_walls` WRITE;
/*!40000 ALTER TABLE `game_user_walls` DISABLE KEYS */;
INSERT INTO `game_user_walls` VALUES (13,29,'65640bdf0ddf3ae3122b59ff'),(14,29,'65640be30ddf3ae3122b5a08'),(15,28,'65640be30ddf3ae3122b5a08'),(16,33,'65640bdf0ddf3ae3122b59ff'),(17,32,'65640bdf0ddf3ae3122b59ff'),(18,34,'65640be30ddf3ae3122b5a08'),(19,34,'6565f7ba1ab18c01415e3876'),(20,35,'65640c070ddf3ae3122b5a10'),(21,37,'65669db8b119df255098b27e'),(22,37,'65669db8b119df255098b288'),(23,39,'6566b2f2b119df255098b304'),(24,39,'6566b2f3b119df255098b30e'),(25,63,'6566b2f2b119df255098b304'),(26,64,'6566b2f2b119df255098b304'),(27,66,'6566b2f2b119df255098b304'),(28,67,'6566b2f2b119df255098b304'),(29,68,'656609578a52559bd804b8d5'),(30,69,'6566b2f2b119df255098b304'),(31,69,'6566b2f3b119df255098b30e'),(33,70,'6566b2f2b119df255098b304'),(34,70,'6566b2f3b119df255098b30e');
/*!40000 ALTER TABLE `game_user_walls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_users`
--

DROP TABLE IF EXISTS `game_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_users` (
  `game_users_id` int NOT NULL AUTO_INCREMENT,
  `game_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `user_rank` int DEFAULT NULL,
  `complete_walls_count` int DEFAULT '0',
  `is_complete` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`game_users_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `game_users_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_users`
--

LOCK TABLES `game_users` WRITE;
/*!40000 ALTER TABLE `game_users` DISABLE KEYS */;
INSERT INTO `game_users` VALUES (73,66,2,NULL,0,0),(74,69,3,NULL,0,0);
/*!40000 ALTER TABLE `game_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_walls`
--

DROP TABLE IF EXISTS `game_walls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_walls` (
  `game_wallrooms_id` int NOT NULL AUTO_INCREMENT,
  `game_id` int DEFAULT NULL,
  `wallrooms_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`game_wallrooms_id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_walls`
--

LOCK TABLES `game_walls` WRITE;
/*!40000 ALTER TABLE `game_walls` DISABLE KEYS */;
INSERT INTO `game_walls` VALUES (1,12,'65640bdf0ddf3ae3122b59ff'),(2,12,'65640be30ddf3ae3122b5a08'),(3,12,'65640c070ddf3ae3122b5a10'),(4,17,'65640dd59c1738d9b0119cff'),(5,18,'65640dd59c1738d9b0119cff'),(6,19,'65640dd59c1738d9b0119cff'),(7,20,'65640dd59c1738d9b0119cff'),(8,21,'65640dd59c1738d9b0119cff'),(9,22,'65640dd59c1738d9b0119cff'),(10,23,'65640dd59c1738d9b0119cff'),(11,24,'65640dd59c1738d9b0119cff'),(12,26,'65640dd59c1738d9b0119cff'),(13,27,'65640dd59c1738d9b0119cff'),(14,28,'65640dd59c1738d9b0119cff'),(15,29,'65640dd59c1738d9b0119cff'),(16,30,'65640dd59c1738d9b0119cff'),(17,31,'65640dd59c1738d9b0119cff'),(18,32,'65640dd59c1738d9b0119cff'),(19,33,'65640dd59c1738d9b0119cff'),(20,34,'65640dd59c1738d9b0119cff'),(21,35,'65640dd59c1738d9b0119cff'),(22,36,'65640dd59c1738d9b0119cff'),(23,37,'65640dd59c1738d9b0119cff'),(24,38,'65640dd59c1738d9b0119cff'),(25,39,'65640dd59c1738d9b0119cff'),(26,40,'65640dd59c1738d9b0119cff'),(27,41,'65640dd59c1738d9b0119cff'),(28,42,'65640dd59c1738d9b0119cff'),(29,43,'65640dd59c1738d9b0119cff'),(30,44,'65640dd59c1738d9b0119cff'),(31,45,'65640dd59c1738d9b0119cff'),(32,46,'65640dd59c1738d9b0119cff'),(33,47,'65640dd59c1738d9b0119cff'),(34,48,'65640dd59c1738d9b0119cff'),(35,49,'65640dd59c1738d9b0119cff'),(36,50,'65640dd59c1738d9b0119cff'),(37,50,'65640e4b60ea8f07dc1f32b8'),(38,51,'65640dd59c1738d9b0119cff'),(39,51,'65640e4b60ea8f07dc1f32b8'),(40,51,'6563229f5a5158b0bd6b5f71'),(41,52,'65640dd59c1738d9b0119cff'),(42,52,'65640e4b60ea8f07dc1f32b8'),(43,53,'65640dd59c1738d9b0119cff'),(44,54,'65640bdf0ddf3ae3122b59ff'),(45,54,'65640be30ddf3ae3122b5a08'),(46,55,'65640bdf0ddf3ae3122b59ff'),(47,56,'6565f7ba1ab18c01415e3876'),(48,56,'65640be30ddf3ae3122b5a08'),(49,57,'6565f7ba1ab18c01415e3876'),(50,57,'65640c070ddf3ae3122b5a10'),(51,59,'6565f7ba1ab18c01415e3876'),(52,60,'6565f7ba1ab18c01415e3876'),(53,61,'65669db8b119df255098b27e'),(54,61,'65669db8b119df255098b288'),(55,62,'6566b2f2b119df255098b304'),(56,62,'6566b2f3b119df255098b30e'),(57,63,'65640c070ddf3ae3122b5a10'),(58,63,'656320380f57838cbd877bb9'),(59,64,'6566b2f2b119df255098b304'),(60,64,'6566b2f3b119df255098b30e'),(61,65,'65640dd59c1738d9b0119cff'),(62,65,'65640e4b60ea8f07dc1f32b8'),(63,66,'65696d808456105401c2bccc'),(64,66,'656609578a52559bd804b8d5'),(65,67,'6566b2f2b119df255098b304'),(66,67,'6566b2f3b119df255098b30e'),(67,68,'6566b2f2b119df255098b304'),(68,68,'6566b2f3b119df255098b30e'),(69,69,'6566b2f2b119df255098b304'),(70,69,'6566b2f3b119df255098b30e'),(71,70,'6566b2f2b119df255098b304');
/*!40000 ALTER TABLE `game_walls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `games` (
  `game_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `short_description` varchar(255) DEFAULT NULL,
  `long_description` varchar(255) DEFAULT NULL,
  `date_start` date DEFAULT NULL,
  `date_end` date DEFAULT NULL,
  `game_wallrooms_id` int DEFAULT NULL,
  `member_count` int DEFAULT NULL,
  `game_winners` int DEFAULT NULL,
  `game_award` varchar(255) DEFAULT NULL,
  `main_image` varchar(255) DEFAULT NULL,
  `second_image` varchar(255) DEFAULT NULL,
  `ad_location_id` int DEFAULT NULL,
  `ad_start_date` date DEFAULT NULL,
  `advertise_image` varchar(255) DEFAULT NULL,
  `game_status` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`game_id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (64,'平衡牆雙人線挑戰','平衡牆挑戰全新牆面!','平衡牆挑戰全新牆面!','2023-11-29','2023-12-22',NULL,1,10,'美味鬆餅一份','game-main-image.jpg_1701348284156.jpg','game-second-image.jpg_1701348284162.jpg',1,'2023-11-30','ad-image-long.jpg_1701348284167.jpg',1),(65,'萬聖節特別企劃','萬聖節特別企劃','萬聖節特別企劃','2023-12-13','2023-12-29',NULL,NULL,10,'美味鬆餅一份','game-main-image.jpg_1701417203841.jpg','game-second-image.jpg_1701417203857.jpg',1,'2023-12-02','ad-image-long.jpg_1701417203865.jpg',2),(66,'指力線限時比賽','指力線限時比賽','指力線限時比賽','2023-12-03','2023-12-08',NULL,NULL,10,'質感粉袋一個','game-main-image.jpg_1701575133643.jpg','game-second-image.jpg_1701575133650.jpg',2,'2023-12-02','ad-image-long.jpg_1701575133655.jpg',1),(67,'動態挑戰比賽','動態挑戰比賽','動態挑戰比賽','2023-11-30','2023-12-03',NULL,NULL,10,'質感粉袋一個','game-main-image.jpg_1701575847911.jpg','game-second-image.jpg_1701575847917.jpg',2,'2023-12-03','ad-image.jpg_1701575847921.jpg',0),(68,'平衡牆雙人線挑戰','平衡牆雙人線挑戰','平衡牆雙人線挑戰','2023-12-06','2023-12-08',NULL,NULL,10,'美味鬆餅一份','game-main-image.jpg_1701576457716.jpg','game-second-image.jpg_1701576457721.jpg',2,'2023-12-05','ad-image-long.jpg_1701576457724.jpg',2),(69,'萬聖節特別企劃','萬聖節特別企劃','萬聖節特別企劃','2023-12-03','2023-12-04',NULL,NULL,10,'質感粉袋一個','game-main-image.jpg_1701590754755.jpg','game-second-image.jpg_1701590754762.jpg',1,'2023-12-04','ad-image-long.jpg_1701590754767.jpg',1),(70,'平衡牆雙人線挑戰','平衡牆雙人線挑戰','平衡牆雙人線挑戰','2023-12-14','2023-12-29',NULL,NULL,10,'美味鬆餅一份','game-main-image.jpg_1701739279534.jpg','game-second-image.jpg_1701739279541.jpg',2,'2023-12-05','ad-image-long.jpg_1701739279547.jpg',2);
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'ann','test@gamil.com','$2b$12$06Fz/.n33hxDagJbZOktOOY2yQ1iTxPtvVXlOs17J5rGQlio9rMoa','user'),(2,'ann','test2@gamil.com','$2b$12$K7kUbs50OVpoOuqtmFhdD.UhV2gwwm7RPIakgk1wJOc.9/d8W.RvO','user'),(3,'ann3','test3@gmail.com','$2b$12$b3xFV.RO37Y1cHLG8S8C5eVzVKk.inKXi9Z/NtOcmk8yThEk1FL22','admin'),(4,'ann4','ann4@home.com','$2b$12$lJAQjPzzP4IF8o0bIvxjXekd4BurUnCqTygrpme.akLy8Jwjgk2Gi','user'),(5,'ann','ann7@home.com','$2b$12$SxLx/r58Uu0yt0vMrjsKwujGvg/awUEYlsJlGexplNxpYDfDxfni.','user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallrooms`
--

DROP TABLE IF EXISTS `wallrooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallrooms` (
  `wallroomId` int NOT NULL AUTO_INCREMENT,
  `wallimage` varchar(255) DEFAULT NULL,
  `official_level` varchar(255) DEFAULT NULL,
  `gym_id` varchar(255) DEFAULT NULL,
  `wall` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `tag_room_id` varchar(255) DEFAULT NULL,
  `wall_update_time` date DEFAULT NULL,
  `wall_change_time` date DEFAULT NULL,
  PRIMARY KEY (`wallroomId`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallrooms`
--

LOCK TABLES `wallrooms` WRITE;
/*!40000 ALTER TABLE `wallrooms` DISABLE KEYS */;
INSERT INTO `wallrooms` VALUES (1,'https://d3ebcb0pef2qqe.cloudfront.net/green_LM wall crop.jpg_1700748931781.jpg','','岩館一','AB牆','green',NULL,NULL,NULL),(2,'https://d3ebcb0pef2qqe.cloudfront.net/yellow_LM wall crop.jpg_1700748931781.jpg','','岩館一','AB牆','yellow',NULL,NULL,NULL),(3,'https://d3ebcb0pef2qqe.cloudfront.net/dark_blue_AB wall crop new.jpg_1700748617487.jpg','','岩館一','AB牆','dark','6560a3a828982eca22385caa',NULL,NULL),(4,'https://d3ebcb0pef2qqe.cloudfront.net/light_blue_LM wall crop.jpg_1700748931781.jpg','','岩館一','AB牆','light','6560a3e10af62270d916eeb4',NULL,NULL),(10,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','','岩館一','CD牆','green','65631a57de3613f8b239db11',NULL,NULL),(11,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','','岩館一','CD牆','green','65631b8041b7a7f4d9a63e58',NULL,NULL),(12,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','','岩館一','CD牆','green','65631b8f41b7a7f4d9a63e61',NULL,NULL),(13,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','','岩館一','AB牆','green','65631f2d3744a27bf63eac82',NULL,NULL),(14,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','','岩館一','AB牆','green','65631f343744a27bf63eac8a',NULL,NULL),(15,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','','岩館一','AB牆','green','65631f6a25040ae63af3340b',NULL,NULL),(16,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','','岩館一','AB牆','green','65631f6a25040ae63af33409',NULL,NULL),(17,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','','岩館一','AB牆','green','65631feab00021bea2584904',NULL,NULL),(18,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','','岩館一','AB牆','green','65631ffe0f57838cbd877bb0',NULL,NULL),(19,'https://d3ebcb0pef2qqe.cloudfront.net/yellow_LM wall crop.jpg_1700748931781.jpg','2','岩館一','AB牆','黃色','656320380f57838cbd877bb9',NULL,NULL),(20,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','5','store3','branch3','green','6563229f5a5158b0bd6b5f71',NULL,NULL),(21,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','5','store3','branch3','green','6563250e2bee1b27ee247056',NULL,NULL),(22,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','2','岩館一','AB牆','green','65632fc0d34ccada8196e439',NULL,NULL),(23,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','3','岩館一','AB牆','green','65632fc4d34ccada8196e441',NULL,NULL),(24,'https://d3ebcb0pef2qqe.cloudfront.net/dark_blue_AB wall crop new.jpg_1700748617487.jpg','4','岩館一','AB牆','dark','65632fcdd34ccada8196e449',NULL,NULL),(25,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','2','岩館一','AB牆','green','65632fcdd34ccada8196e451',NULL,NULL),(26,'https://d3ebcb0pef2qqe.cloudfront.net/dark_blue_AB wall crop new.jpg_1700748617487.jpg','4','岩館一','AB牆','dark','65633020b51c0793b9fd9c91',NULL,NULL),(27,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','2','岩館一','AB牆','green','65633020b51c0793b9fd9c93',NULL,NULL),(28,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','2','岩館一','AB牆','green','65633021b51c0793b9fd9c9f',NULL,NULL),(29,'https://d3ebcb0pef2qqe.cloudfront.net/dark_blue_AB wall crop new.jpg_1700748617487.jpg','2','store2','AB牆','dark','656330a3c332b0d7a83bdbe8',NULL,NULL),(30,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','2','store2','AB牆','green','656330a3c332b0d7a83bdbf0',NULL,NULL),(31,'https://d3ebcb0pef2qqe.cloudfront.net/dark_blue_AB wall crop new.jpg_1700748617487.jpg','2','store2','AB牆','dark','656330c941ec03d39f816922',NULL,NULL),(32,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','2','store2','AB牆','green','656330ca41ec03d39f81692b',NULL,NULL),(33,'https://d3ebcb0pef2qqe.cloudfront.net/yellow_LM wall crop.jpg_1700748931781.jpg','2','岩館一','AB牆','yellow','6563f530a3f0b9e0435b2061',NULL,NULL),(34,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','2','岩館一','AB牆','green','65640bdf0ddf3ae3122b59ff','2023-11-27','2023-12-11'),(35,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','2','岩館一','AB牆','green','65640be30ddf3ae3122b5a08','2023-11-27','2023-12-11'),(36,'https://d3ebcb0pef2qqe.cloudfront.net/dark_blue_AB wall crop new.jpg_1700748617487.jpg','2','岩館一','AB牆','dark','65640c070ddf3ae3122b5a10','2023-11-27','2023-12-11'),(37,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','2','岩館一','AB牆','green','65640c1a250c6c4fa2b2323d','2023-11-27','2023-12-11'),(38,'https://d3ebcb0pef2qqe.cloudfront.net/dark_blue_AB wall crop new.jpg_1700748617487.jpg','2','岩館一','AB牆','dark','65640c1a250c6c4fa2b2323f','2023-11-27','2023-12-11'),(39,'https://d3ebcb0pef2qqe.cloudfront.net/yellow_LM wall crop.jpg_1700748931781.jpg','5','岩館一','AB牆','yellow','65640dc59c1738d9b0119cf7','2023-11-27','2024-01-26'),(40,'https://d3ebcb0pef2qqe.cloudfront.net/yellow_LM wall crop.jpg_1700748931781.jpg','5','岩館一','AB牆','yellow','65640dd59c1738d9b0119cff','2023-11-30','2024-01-26'),(41,'https://d3ebcb0pef2qqe.cloudfront.net/yellow_LM wall crop.jpg_1700748931781.jpg','5','岩館一','AB牆','yellow','65640e4b60ea8f07dc1f32b8','2023-11-30','2024-01-26'),(42,'https://d3ebcb0pef2qqe.cloudfront.net/yellow_LM wall crop.jpg_1700748931781.jpg','5','岩館一','AB牆','yellow','65640e4b60ea8f07dc1f32ba','2023-11-27','2024-01-26'),(43,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','2','岩館一','AB牆','green','6565f7ba1ab18c01415e3876','2023-11-28','2024-01-27'),(44,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','6','岩館一','AB牆','green','6565f8771ab18c01415e387e','2023-11-28','2024-01-27'),(45,'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg','6','岩館一','AB牆','green','6565f8de1ab18c01415e3886','2023-11-28','2024-01-27'),(46,'https://d3ebcb0pef2qqe.cloudfront.net/yellow_LM wall crop.jpg_1700748931781.jpg','5','岩館一','CD牆','yellow','656609578a52559bd804b8cd','2023-11-27','2023-12-11'),(47,'https://d3ebcb0pef2qqe.cloudfront.net/green_LM wall crop.jpg_1700748931781.jpg','4','岩館一','CD牆','green','656609578a52559bd804b8d5','2023-11-27','2023-12-11'),(48,'https://d3ebcb0pef2qqe.cloudfront.net/yellow_LM wall crop.jpg_1700748931781.jpg','7','岩館一','CD牆','黃色','656609908a52559bd804b8e4','2023-11-28','2024-01-27'),(49,'https://d3ebcb0pef2qqe.cloudfront.net/green_LM wall crop.jpg_1700748931781.jpg','7','岩館一','CD牆','綠色','656609cd8a52559bd804b8fa','2023-11-28','2024-01-27'),(50,'https://d3ebcb0pef2qqe.cloudfront.net/green_LM wall crop.jpg_1700748931781.jpg','7','岩館一','CD牆','green','65660a0c8a52559bd804b906','2023-11-29','2024-01-27'),(51,'https://d3ebcb0pef2qqe.cloudfront.net/yellow_LM wall crop.jpg_1700748931781.jpg','7','岩館一','AB牆','yellow','65660a2c8a52559bd804b911','2023-11-30','2024-01-27'),(52,'https://d3ebcb0pef2qqe.cloudfront.net/light_blue_LM wall crop.jpg_1700748931781.jpg','8','岩館一','CD牆','light','65669db8b119df255098b27e','2023-12-15','2024-01-28'),(53,'https://d3ebcb0pef2qqe.cloudfront.net/dark_blue_AB wall crop new.jpg_1700748617487.jpg','8','岩館一','CD牆','dark','65669db8b119df255098b288','2023-12-15','2024-01-28'),(54,'https://d3ebcb0pef2qqe.cloudfront.net/yellow_LM wall crop.jpg_1700748931781.jpg','8','岩館一','CD牆','yellow','6566b2f2b119df255098b304','2023-12-18','2024-01-28'),(55,'https://d3ebcb0pef2qqe.cloudfront.net/dark_blue_AB wall crop new.jpg_1700748617487.jpg','8','岩館一','CD牆','dark','6566b2f3b119df255098b30e','2023-12-18','2024-01-28'),(56,'https://d3ebcb0pef2qqe.cloudfront.net/yellow_LM wall crop.jpg_1700748931781.jpg','2','岩館一','AB牆','yellow','65696d688456105401c2bcc4','2023-12-01','2024-01-30'),(57,'https://d3ebcb0pef2qqe.cloudfront.net/yellow_LM wall crop.jpg_1700748931781.jpg','4','快樂岩館','EF牆','yellow','65696d808456105401c2bccc','2023-12-01','2024-01-30'),(58,'https://d3ebcb0pef2qqe.cloudfront.net/yellow_LM wall crop.jpg_1700748931781.jpg','5','岩館一','AB牆','yellow','656c3b2bcf22f72960708239','2023-12-03','2024-02-01'),(59,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','0','岩館一','CD牆','咖啡色','656dc710e601c48a6e7d6a79','2023-12-04','2024-02-02'),(60,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','B','岩館一','AB牆','咖啡色','656dc8b6d2d196f779f23bec','2023-12-04','2024-02-02'),(61,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','B','岩館一','CD牆','粉紅色','656dcd014fcba9cf9514d392','2023-12-04','2024-02-02'),(62,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','9','快樂岩館','','咖啡色','656dd129d5398d8e002d6e10','2023-12-04','2024-02-02'),(63,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','9','岩館一','AB牆','黃色','656dd1b8d5398d8e002d6e18','2023-12-04','2024-02-02');
/*!40000 ALTER TABLE `wallrooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `walls`
--

DROP TABLE IF EXISTS `walls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `walls` (
  `wall_id` int NOT NULL AUTO_INCREMENT,
  `wallimage_original` varchar(255) DEFAULT NULL,
  `gym_id` varchar(255) DEFAULT NULL,
  `wall` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`wall_id`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `walls`
--

LOCK TABLES `walls` WRITE;
/*!40000 ALTER TABLE `walls` DISABLE KEYS */;
INSERT INTO `walls` VALUES (1,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg',NULL,NULL),(2,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(3,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(4,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(5,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(6,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(7,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(8,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg',NULL,NULL),(9,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg',NULL,NULL),(10,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg',NULL,NULL),(11,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg',NULL,NULL),(12,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg',NULL,NULL),(13,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg',NULL,NULL),(14,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','store2','branch3'),(15,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg',NULL,NULL),(16,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg',NULL,NULL),(17,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg',NULL,NULL),(18,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg',NULL,NULL),(19,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg',NULL,NULL),(20,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg',NULL,NULL),(21,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(22,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg',NULL,NULL),(23,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(24,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','CD牆'),(25,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','CD牆'),(26,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','CD牆'),(27,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','CD牆'),(28,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','CD牆'),(29,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','CD牆'),(30,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','CD牆'),(31,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','CD牆'),(32,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(33,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(34,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(35,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(36,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(37,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(38,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(39,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(40,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(41,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(42,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(43,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(44,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','store3','branch3'),(45,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','store3','branch3'),(46,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(47,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(48,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(49,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(50,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(51,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','store2','AB牆'),(52,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','store2','AB牆'),(53,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(54,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(55,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(56,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(57,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(58,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(59,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(60,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(61,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(62,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(63,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(64,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(65,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(66,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(67,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(68,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(69,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(70,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(71,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(72,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(73,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','CD牆'),(74,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','CD牆'),(75,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','CD牆'),(76,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(77,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','CD牆'),(78,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(79,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','CD牆'),(80,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','CD牆'),(81,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(82,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','快樂岩館','EF牆'),(83,'https://d2mh6uqojgaomb.cloudfront.net/LM wall crop.jpg_1700748931781.jpg','岩館一','AB牆'),(84,'https://d2mh6uqojgaomb.cloudfront.net/1700748931781.jpg','岩館一','CD牆'),(85,'https://d2mh6uqojgaomb.cloudfront.net/1700748931781.jpg','岩館一','AB牆');
/*!40000 ALTER TABLE `walls` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-05 14:59:50
