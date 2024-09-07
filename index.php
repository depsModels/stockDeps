<?php

ob_start();

session_start();

require __DIR__ . "/vendor/autoload.php";

use CoffeeCode\Router\Router;

$route = new Router(CONF_URL_BASE, ":");

/**
 * Web Routes
 */

$route->namespace("Source\App");

/**
 * App Routs
 */

$route->group("/"); // agrupa em /app

$route->get("/", "App:inicio");

$route->get("/estoque", "App:estoque");
$route->post("/estoque-cadastro", "App:estoqueCadastro");
$route->post("/estoque-entrada", "App:estoqueEntrada");
$route->post("/estoque-saidas", "App:estoqueSaidas");
$route->post("/estoque-deletar", "App:estoqueDeletar");
$route->post("/estoque-atualizar", "App:estoqueAtualizar");

$route->get("/relatorio", "App:relatorio");

$route->get("/pdf-r-g", "App:relatorioClientes");
$route->get("/pdf-r-p", "App:relatorioProdutos");
$route->get("/pdf-r-c", "App:relatorioClientes");
$route->get("/pdf-r-v", "App:relatorioClientes");

$route->get("/cadastro", "App:cadastro");
$route->post("/cadastro", "App:cadastro");

$route->get("/clientes", "App:clientes");
$route->post("/historico-cliente", "App:getHistoricoCliente");


$route->group(null); // desagrupo do /app

/*
 * Erros Routes
 */

$route->group("error")->namespace("Source\App");
$route->get("/{errcode}", "Web:error");

$route->dispatch();

/*
 * Error Redirect
 */

if ($route->error()) {
    $route->redirect("/error/{$route->error()}");
}

ob_end_flush();
