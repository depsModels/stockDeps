<?php

namespace Source\Models;

use PDOException;
use Source\Core\Connect;

class Categorias
{
    private $id;
    private $nome;
    private $descricao;

    /**
     * @param $id
     * @param $nome
     * @param $descricao
     */
    public function __construct(
        $id = null, 
        $nome = null, 
        $descricao = null
    )
    {
        $this->id = $id;
        $this->nome = $nome;
        $this->descricao = $descricao;
    }

    /**
     * @return mixed|null
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed|null $id
     */
    public function setId($id): void
    {
        $this->id = $id;
    }

    /**
     * @return mixed|null
     */
    public function getNome()
    {
        return $this->nome;
    }

    /**
     * @param mixed|null $nome
     */
    public function setNome($nome): void
    {
        $this->nome = $nome;
    }

    /**
     * @return mixed
     */
    public function getDescricao()
    {
        return $this->descricao;
    }

    /**
     * @param mixed $descricao
     */
    public function setDescricao($descricao): void
    {
        $this->descricao = $descricao;
    }

    public function selectAll ()
    {
        $query = "SELECT * FROM categorias";
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
    try {
        $query = "INSERT INTO categorias (nome, descricao) 
                  VALUES (:nome, :descricao)";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":descricao", $this->descricao);

        // Executa a query e verifica se foi bem-sucedida
        if ($stmt->execute()) {
            return true; // Sucesso
        } else {
            return false; // Falha
        }

    } catch (PDOException $e) {
        // Captura a exceção e faz log ou trata o erro
        error_log("Erro ao inserir categoria: " . $e->getMessage());
        return false;
    }
}

public function findByName($nome) : bool
{
    $query = "SELECT * FROM categorias WHERE nome = :nome";
    $stmt = Connect::getInstance()->prepare($query);
    $stmt->bindParam(":nome", $nome);
    $stmt->execute();
    if($stmt->rowCount() == 1){
        return true;
    } else {
        return false;
    }
}

public function findById($id) : bool
{
    $query = "SELECT * FROM categorias WHERE id = :id";
    $stmt = Connect::getInstance()->prepare($query);
    $stmt->bindParam(":id", $id);
    $stmt->execute();
    if($stmt->rowCount() == 1){
        return true;
    } else {
        return false;
    }
}

public function findNameById($id)
{
    $query = "SELECT nome FROM categorias WHERE id = :id";
    $stmt = Connect::getInstance()->prepare($query);
    $stmt->bindParam(":id", $id);
    $stmt->execute();

    // Verifica se a consulta retornou algum resultado
    if ($stmt->rowCount() == 1) {
        // Retorna o nome da categoria
        $result = $stmt->fetch();
        return $result->nome; // Retorna o nome da categoria
    } else {
        return false; // Se não encontrar a categoria
    }
}


public function delete($id)
    {
        $query = "DELETE FROM categorias WHERE id = :id";

        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":id", $id);

        $stmt->execute();

        if ($stmt->rowCount() == 0) {
            return false;
        } else {
            return true;
        }
    }

    public function update($id, $nome, $descricao)
    {
        // Query de atualização
        $query = "UPDATE categorias 
                SET nome = :nome, descricao = :descricao 
                WHERE id = :id";

        // Prepara a conexão
        $stmt = Connect::getInstance()->prepare($query);

        // Liga os parâmetros aos valores
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":nome", $nome);
        $stmt->bindParam(":descricao", $descricao);

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