<?php

namespace Source\Models;

use Source\Core\Connect;

class Entradas
{
    private $id;
    private $idCategoria;
    private $idProdutos;
    private $quantidade;

    public function __construct(
        int $id = NULL,
        int $idCategoria = NULL,
        int $idProdutos = NULL,
        int $quantidade = NULL
    )
    {
        $this->id = $id;
        $this->idCategoria = $idCategoria;
        $this->idProdutos = $idProdutos;
        $this->quantidade = $quantidade;
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
    public function getIdCategoria()
    {
        return $this->idCategoria;
    }

    /**
     * @param string|null $name
     */
    public function setIdCategoria($idCategoria): void
    {
        $this->idCategoria = $idCategoria;
    }

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

    public function selectAll ()
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

    public function insert() : bool
    {
        $query = "INSERT INTO entradas (idCategoria, idProdutos, quantidade) VALUES (:idCategoria, :idProdutos, :quantidade)";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":idCategoria", $this->idCategoria);
        $stmt->bindParam(":idProdutos", $this->idProdutos);
        $stmt->bindValue(":quantidade", $this->quantidade);
        $stmt->execute();
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
