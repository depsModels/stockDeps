<?php

namespace Source\Models;

use Source\Core\Connect;

class Saidas
{
    private $id;
    private $idClientes;
    private $idProdutos;
    private $quantidade;
    private $preco;

    public function __construct(
        ?int $id = NULL,
        ?int $idClientes = NULL,
        ?int $idProdutos = NULL,
        ?float $quantidade = NULL,
        ?float $preco = NULL
    )
    {
        $this->id = $id;
        $this->idClientes = $idClientes;
        $this->idProdutos = $idProdutos;
        $this->quantidade = $quantidade;
        $this->preco = $preco;
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
    public function getIdClientes(): ?int
    {
        return $this->idClientes;
    }

    /**
     * @param string|null $name
     */
    public function setIdClientes(?int $idClientes): void
    {
        $this->idClientes = $idClientes;
    }

    /**
     * @return string|null
     */
    public function getIdProdutos(): ?int
    {
        return $this->idProdutos;
    }

    /**
     * @param string|null $idProdutos
     */
    public function setIdProdutos(?int $idProdutos): void
    {
        $this->idProdutos = $idProdutos;
    }

    /**
     * @return string|null
     */
    public function getQuantidade(): ?int
    {
        return $this->quantidade;
    }

    /**
     * @param string|null $quantidade
     */
    public function setQuantidade(?int $quantidade): void
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

    public function selectInfoSaidaById($id)
    {
        $query = "SELECT * FROM saidas WHERE id = :id";
        
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(':id', $id);

        $stmt->execute();
        
        // Verifica se há resultados
        if ($stmt->rowCount() == 0) {
            return false; // Nenhum registro encontrado
        } else {
            // Retorna os valores da saida
            return $stmt->fetch();
        }
    }

    public function insert()
    {

        $query = "INSERT INTO saidas (idClientes, idProdutos, quantidade, preco) 
                    VALUES (:idClientes, :idProdutos, :quantidade, :preco)";
        $stmt = Connect::getInstance()->prepare($query);

        // Verifica se idClientes é null para não passar um valor inválido
        if ($this->idClientes == null) {
            $stmt->bindValue(":idClientes", null); // Passa explicitamente NULL
        } else {
            $stmt->bindValue(":idClientes", $this->idClientes); // Passa como inteiro
        }
        $stmt->bindParam(":idProdutos", $this->idProdutos);
        $stmt->bindParam(":quantidade", $this->quantidade);
        $stmt->bindParam(":preco", $this->preco);
        $stmt->execute();
        return true;
    }
    
    public function delete($id)
    {
        $query = "DELETE FROM saidas WHERE id = :id";

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
        $query = "UPDATE saidas 
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
