CREATE DATABASE  IF NOT EXISTS `stock-deps` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `stock-deps`;
-- MySQL dump 10.13  Distrib 5.7.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bd-mocitec-manha-tarde
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.24-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categorias` (
                         `id` int(11) NOT NULL AUTO_INCREMENT,
                         `nome` varchar(255) NOT NULL,
                         `descricao` text NOT NULL,
                         `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
                         `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
                         PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO `categorias`(`id`, `nome`, `descricao`) VALUES 
('10', 'Lava Roupas', 'Categoria indicada especialmente para produtos de limpeza nas etapas de lavagem de roupas e tecidos em geral.'),
('20', 'Lava Louças', 'Categoria indicada especialmente para produtos de limpeza nas etapas de lavagem de louças e objetos de cozinha em geral.'),
('30', 'Lava Carro', 'Categoria indicada especialmente para produtos de limpeza nas etapas de lavagem de carrosem geral.'),
('40', 'Limpeza de Ambiente', 'Categoria indicada especialmente para produtos de limpeza nas etapas de higienização e aromatização de ambientes.'),
('50', 'Outros', 'Categoria indicada para produtos de limpeza em geral entre outros.');




--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `produtos` (
                             `id` int(11) NOT NULL AUTO_INCREMENT,
                             `idCategoria` int(11) NOT NULL,
                             `nome` varchar(255) NOT NULL,
                             `preco` varchar(11) NOT NULL,
                             `descricao` text NOT NULL,
                             `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
                             `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
                             PRIMARY KEY (`id`),
                             KEY `fk_produtos_categorias_idx` (`idCategoria`),
                             CONSTRAINT `fk_produtos_categorias` FOREIGN KEY (`idCategoria`) REFERENCES `categorias` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clientes` (
                         `id` int(11) NOT NULL AUTO_INCREMENT,
                         `nome` varchar(255) NOT NULL,
                         `cpf` varchar(14) NOT NULL,
                         `email` varchar(255) NOT NULL,
                         `celular` varchar(14) NOT NULL,
                         `cidade` varchar(50) NOT NULL,
                         `bairro` varchar(50) NOT NULL,
                         `uf` varchar(2) NOT NULL,
                         `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
                         `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
                         PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `entradas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `entradas` (
                             `id` int(11) NOT NULL AUTO_INCREMENT,
                             `idCategoria` int(11) NOT NULL,
                             `idProdutos` int(11) NOT NULL,
                             `quantidade` int(11) NOT NULL,
                             `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
                             `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
                             PRIMARY KEY (`id`),
                             KEY `fk_entradas_categoria_idx` (`idCategoria`),
                             CONSTRAINT `fk_entradas_categoria` FOREIGN KEY (`idCategoria`) REFERENCES `categorias` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
                             KEY `fk_entradas_produtos_idx` (`idProdutos`),
                             CONSTRAINT `fk_entradas_produtos` FOREIGN KEY (`idProdutos`) REFERENCES `produtos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entradas`
--

LOCK TABLES `entradas` WRITE;
/*!40000 ALTER TABLE `entradas` DISABLE KEYS */;
/*!40000 ALTER TABLE `entradas` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `saidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `saidas` (
                             `id` int(11) NOT NULL AUTO_INCREMENT,
                             `idCategoria` int(11) NOT NULL,
                             `idClientes` int(11) NOT NULL,
                             `idProdutos` int(11) NOT NULL,
                             `quantidade` int(11) NOT NULL,
                             `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
                             `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
                             PRIMARY KEY (`id`),
                             KEY `fk_saidas_categorias_idx` (`idCategoria`),
                             CONSTRAINT `fk_saidas_categorias` FOREIGN KEY (`idCategoria`) REFERENCES `categorias` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
                             KEY `fk_saidas_clientes_idx` (`idClientes`),
                             CONSTRAINT `fk_saidas_clientes` FOREIGN KEY (`idClientes`) REFERENCES `clientes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
                             KEY `fk_saidas_produtos_idx` (`idProdutos`),
                             CONSTRAINT `fk_saidas_produtos` FOREIGN KEY (`idProdutos`) REFERENCES `produtos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saidas`
--

LOCK TABLES `saidas` WRITE;
/*!40000 ALTER TABLE `saidas` DISABLE KEYS */;
/*!40000 ALTER TABLE `saidas` ENABLE KEYS */;
UNLOCK TABLES;