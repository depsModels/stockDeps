<?php

namespace Source\Models;

use Source\Core\Connect;

class Saidas
{
    private $id;
    private $idCategoria;
    private $idClientes;
    private $idProdutos;
    private $quantidade;

    public function __construct(
        int $id = NULL,
        int $idCategoria = NULL,
        string $idClientes = NULL,
        string $idProdutos = NULL,
        string $quantidade = NULL
    )
    {
        $this->id = $id;
        $this->idCategoria = $idCategoria;
        $this->idClientes = $idClientes;
        $this->idProdutos = $idProdutos;
        $this->quantidade = $quantidade;
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @param int|null $id
     */
    public function setId(?int $id): void
    {
        $this->id = $id;
    }

    /**
     * @return string|null
     */
    public function getIdCategoria(): ?int
    {
        return $this->idCategoria;
    }

    /**
     * @param string|null $name
     */
    public function setIdCategoria(?int $idCategoria): void
    {
        $this->idCategoria = $idCategoria;
    }

    /**
     * @return string|null
     */
    public function getIdClientes(): ?string
    {
        return $this->idClientes;
    }

    /**
     * @param string|null $name
     */
    public function setIdClientes(?string $idClientes): void
    {
        $this->idClientes = $idClientes;
    }

    /**
     * @return string|null
     */
    public function getIdProdutos(): ?string
    {
        return $this->idProdutos;
    }

    /**
     * @param string|null $idProdutos
     */
    public function setIdProdutos(?string $idProdutos): void
    {
        $this->idProdutos = $idProdutos;
    }

    /**
     * @return string|null
     */
    public function getQuantidade(): ?string
    {
        return $this->quantidade;
    }

    /**
     * @param string|null $quantidade
     */
    public function setQuantidade(?string $quantidade): void
    {
        $this->quantidade = $quantidade;
    }

    public function selectAll ()
    {
        $query = "SELECT * FROM saidas";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->execute();

        if($stmt->rowCount() == 0){
            return false;
        } else {
            return $stmt->fetchAll();
        }
    }

    public function insert()
    {
        $output = array();

        $queryVefifyQtd = "SELECT (COALESCE(totalE,0) - COALESCE(totalS,0)) AS sobra
        FROM( SELECT SUM(e.quantidade) AS totalE  FROM entradas e WHERE e.idProdutos = :idProdutos ) AS subconsultaE,
        ( SELECT SUM(s.quantidade) AS totalS FROM saidas s WHERE s.idProdutos = :idProdutos
        ) AS subconsultaS;
        ";
        $stmt = Connect::getInstance()->prepare($queryVefifyQtd);
        $stmt->bindParam(":idProdutos", $this->idProdutos);
        $stmt->execute();
        $result = $stmt->fetch();        

        if($this->quantidade > $result->sobra){
            $output['error'] = "Quantidade insuficiente para retirada";
            return false  ;
        }

        $query = "INSERT INTO saidas (idCategoria, idClientes, idProdutos, quantidade) VALUES (:idCategoria, :idClientes, :idProdutos, :quantidade)";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":idCategoria", $this->idCategoria);
        $stmt->bindParam(":idClientes", $this->idClientes);
        $stmt->bindParam(":idProdutos", $this->idProdutos);
        $stmt->bindValue(":quantidade", $this->quantidade);
        $stmt->execute();

        $output['success'] = "Saída inserida com sucesso";
        return true;
    }
    
    /*

    public function getArray() : array
    {
        return ["user" => [
            "id" => $this->getId(),
            "name" => $this->getName(),
            "email" => $this->getEmail(),
            "document" => $this->getDocument(),
            "photo" => $this->getPhoto()
        ]];
    }

    */

}
