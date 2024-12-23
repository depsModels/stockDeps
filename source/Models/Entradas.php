<?php

namespace Source\Models;

use Source\Core\Connect;

class Entradas
{
    private $id;
    private $idFornecedor;
    private $idProdutos;
    private $quantidade;
    private $preco;

    public function __construct(
        int $id = NULL,
        int $idFornecedor = NULL,
        int $idProdutos = NULL,
        float $quantidade = NULL,
        float $preco = NULL
    )
    {
        $this->id = $id;
        $this->idFornecedor = $idFornecedor;
        $this->idProdutos = $idProdutos;
        $this->quantidade = $quantidade;
        $this->preco = $preco;
    }

    /**
     * @return int|null
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int|null $id
     */
    public function setId($id): void
    {
        $this->id = $id;
    }

    /**
     * @return string|null
     */


    /**
     * @return string|null
     */
    public function getIdProdutos()
    {
        return $this->idProdutos;
    }

    /**
     * @param string|null $idProdutos
     */
    public function setIdProdutos($idProdutos): void
    {
        $this->idProdutos = $idProdutos;
    }

    /**
     * @return string|null
     */
    public function getQuantidade()
    {
        return $this->quantidade;
    }

    /**
     * @param string|null $quantidade
     */
    public function setQuantidade($quantidade): void
    {
        $this->quantidade = $quantidade;
    }
    
    /**
     * Get the value of preco
     */ 
    public function getPreco()
    {
        return $this->preco;
    }

    /**
     * Set the value of preco
     *
     * @return  self
     */ 
    public function setPreco($preco)
    {
        $this->preco = $preco;

        return $this;
    }

    public function selectAll (): array|bool
    {
        $query = "SELECT * FROM entradas";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->execute();

        if($stmt->rowCount() == 0){
            return false;
        } else {
            return $stmt->fetchAll();
        }
    }

    public function selectInfoEntradaById($id)
    {
        $query = "SELECT * FROM entradas WHERE id = :id";
        
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(':id', $id);

        $stmt->execute();
        
        // Verifica se há resultados
        if ($stmt->rowCount() == 0) {
            return false; // Nenhum registro encontrado
        } else {
            // Retorna os valores da entrada
            return $stmt->fetch();
        }
    }

    public function insert() : bool
    {
        $query = "INSERT INTO entradas (idFornecedor, idProdutos, quantidade, preco) 
                    VALUES (:idFornecedor, :idProdutos, :quantidade, :preco)";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":idFornecedor", $this->idFornecedor);
        $stmt->bindParam(":idProdutos", $this->idProdutos);
        $stmt->bindParam(":quantidade", $this->quantidade);
        $stmt->bindParam(":preco", $this->preco);
        $stmt->execute();
        return true;
    }

    public function delete($id)
    {
        $query = "DELETE FROM entradas WHERE id = :id";

        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":id", $id);

        $stmt->execute();

        if ($stmt->rowCount() == 0) {
            return false;
        } else {
            return true;
        }
    }

    public function update($id, $quantidade, $preco)
    {
        // Query de atualização
        $query = "UPDATE entradas 
                SET quantidade = :quantidade, preco = :preco 
                WHERE id = :id";

        // Prepara a conexão
        $stmt = Connect::getInstance()->prepare($query);

        // Liga os parâmetros aos valores
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":quantidade", $quantidade);
        $stmt->bindParam(":preco", $preco);

        // Executa a query
        $stmt->execute();

        // Retorna se houve alterações
        if ($stmt->rowCount() > 0) {
            return true;
        } else {
            return false;
        }
    }

}
