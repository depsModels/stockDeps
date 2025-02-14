<?php
// Definição de todas as constantes do sistema
// Esse script consta no composer.json para ser incluido automaticamente

// DATABASE
define("CONF_DB_HOST", "127.0.0.1");
define("CONF_DB_USER", "u181504957_depsModels");
define("CONF_DB_PASS", "M18,E25@deps");
define("CONF_DB_NAME", "u181504957_stockDeps");  // aqui deve ser alterado para o nome do banco de dados

// PROJECT URLs
define("CONF_URL_BASE", "https://stockdeps.com"); // depois da / deve vir o nome da pasta do trabalho

// SSL Configuration
define("CONF_SSL", true); // Enable SSL/HTTPS

// VIEW

define("CONF_VIEW_WEB", __DIR__ . "/../../themes/web");
define("CONF_VIEW_APP", __DIR__ . "/../../themes/app");
define("CONF_VIEW_ADM", __DIR__ . "/../../themes/adm");

// SITE PATH
define("CONF_SITE_PATH", __DIR__ . "/../..");

// SITE

define("CONF_SITE_NAME", "Stock Deps");

// FILES

define("CONF_UPLOAD_DIR", "storage");
define("CONF_UPLOAD_IMAGE_DIR", "images");
