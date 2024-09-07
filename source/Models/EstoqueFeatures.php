<?php 
namespace Source\Models;

use Source\Core\Connect;

class EstoqueFeatures{
  //Fiz um método pra cada 
  public function deleteRegister($table, $id){
    $output = array();

    $allowedTables = array("produtos", "entradas", "saidas"); // Defina as tabelas permitidas
    if (!in_array($table, $allowedTables)) {
        $output['error'] = "Tabela inválida.";
        return $output;
    }

    if($table == "produtos"){
      $queryE = "DELETE FROM entradas WHERE idProdutos = :idProdutos";
      $stmtE = Connect::getInstance()->prepare($queryE);
      $stmtE->bindParam(":idProdutos", $id);
      $stmtE->execute();
      
      $queryS = "DELETE FROM saidas WHERE idProdutos = :idProdutos";
      $stmtS = Connect::getInstance()->prepare($queryS);
      $stmtS->bindParam(":idProdutos", $id);
      $stmtS->execute();
    }

    try {
      $query = "DELETE FROM ".$table." WHERE id = :idRegistro";
      $stmt = Connect::getInstance()->prepare($query);
      $stmt->bindParam(":idRegistro", $id);
      $stmt->execute();
      
      $output['success'] = "A exclusão foi realizada com sucesso!";
  } catch (PDOException $e) {
    $output['error'] = "Ocorreu um erro durante a exclusão: " . $e->getMessage();
  }
  
  return $output;
  }

  public function updateRegister($table, $id, $quantidade, $idProduto){
    $output = array();

    $allowedTables = array("entradas", "saidas"); // Defina as tabelas permitidas
    if (!in_array($table, $allowedTables)) {
        $output['error'] = "Tabela inválida.";
        return $output;
    }

    try {

      if($table == "saidas"){
        $queryQuantiaAnterior = "SELECT quantidade FROM saidas WHERE id = :idRegistro";
        $stmtQA = Connect::getInstance()->prepare($queryQuantiaAnterior);
        $stmtQA->bindParam(":idRegistro", $id);
        $stmtQA->execute();
        $valorInicial = $stmtQA->fetch()->quantidade;

        $queryVefifyQtd = "SELECT (COALESCE(totalE,0) - COALESCE(totalS,0)) AS sobra
        FROM( SELECT SUM(e.quantidade) AS totalE  FROM entradas e WHERE e.idProdutos = :idProdutos ) AS subconsultaE,
        ( SELECT SUM(s.quantidade) AS totalS FROM saidas s WHERE s.idProdutos = :idProdutos
        ) AS subconsultaS;";
        $stmtVQ = Connect::getInstance()->prepare($queryVefifyQtd);
        $stmtVQ->bindParam(":idProdutos", $idProduto);
        $stmtVQ->execute();
        $saldo = $stmtVQ->fetch()->sobra; 
        $diferenca = $quantidade - $valorInicial;

        if($diferenca > $saldo){
          $output['error'] = "Itens insuficientes para retirada";
          return $output;
        }
      }

      $query = "UPDATE ".$table." SET quantidade = :quantidade WHERE id = :idRegistro";
      $stmt = Connect::getInstance()->prepare($query);
      $stmt->bindParam(":idRegistro", $id);
      $stmt->bindParam(":quantidade", $quantidade);
      
      if($stmt->execute()){
        $output['success'] = "A atualização foi realizada com sucesso!";
      }
    } catch (PDOException $e) {
      $output['error'] = "Ocorreu um erro durante a atualização: " . $e->getMessage();
    }
    
    return $output;
  }
}

?>