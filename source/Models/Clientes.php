<?php

namespace Source\Models;

use Source\Core\Connect;
use \PDO;
class Clientes
{
    private $id;
    private $nome;
    private $cpf;
    private $celular;

    public function __construct(
        int $id = NULL,
        string $nome = NULL,
        string $cpf = NULL,
        string $celular = NULL
    )
    {
        $this->id = $id;
        $this->nome = $nome;
        $this->cpf = $cpf;
        $this->celular = $celular;
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
    public function getNome(): ?string
    {
        return $this->nome;
    }

    /**
     * @param string|null $name
     */
    public function setNome(?string $nome): void
    {
        $this->nome = $nome;
    }

    /**
     * @return string|null
     */
    public function getCpf(): ?string
    {
        return $this->cpf;
    }

    /**
     * @param string|null $name
     */
    public function setCpf(?string $cpf): void
    {
        $this->cpf = $cpf;
    }

    /**
     * @return string|null
     */
    public function getCelular(): ?string
    {
        return $this->celular;
    }

    /**
     * @param string|null $celular
     */
    public function setCelular(?string $celular): void
    {
        $this->celular = $celular;
    }

    public function selectAll (): array|bool
    {
        $query = "SELECT * FROM clientes";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->execute();

        if($stmt->rowCount() == 0){
            return false;
        } else {
            return $stmt->fetchAll();
        }
    }

    public function findByIdName($nome): mixed 
    {
        $query = "SELECT * FROM clientes WHERE nome = :nome";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":nome", $nome);
        $stmt->execute();

        if($stmt->rowCount() == 0){
            return false;
        } else {
            $cliente = $stmt->fetch();
            return $cliente->id;
        }
    }
    

    public function findByCpf($cpf) : bool
    {
        $query = "SELECT * FROM clientes WHERE cpf = :cpf";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":cpf", $cpf);
        $stmt->execute();
        if($stmt->rowCount() == 1){
            return true;
        } else {
            return false;
        }
    }

    public function getHistoricoSaidas($idCliente): array|string
    {
        $query = "SELECT p.nome AS nomeProduto, c.nome as nomeCategoria, s.quantidade, s.created_at FROM saidas s JOIN produtos p ON s.idProdutos = p.id 
        JOIN categorias c ON s.idCategoria = c.id WHERE s.idClientes = :idCliente;";
         $stmt = Connect::getInstance()->prepare($query);
         $stmt->bindParam(":idCliente", $idCliente);
         $stmt->execute();
         $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);

         $output = array();

         if(!$resultados){
            $output['error'] = "Nenhum registro encontrado";
            return $output['error'];
        }

        return $resultados;
    }

    public function getDadosCliente($idCliente): array|string
    {
        $query = "SELECT * FROM clientes WHERE id = :idCliente;";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":idCliente", $idCliente);
        $stmt->execute();
        $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $output = array();

        if(!$resultados){
           $output['error'] = "Não foi possível realizar a consulta";
           return $output['error'];
       }

       return $resultados;
    }

    public function insert(): bool 
    {
        $query = "INSERT INTO clientes (nome, cpf, celular) 
                  VALUES (:nome, :cpf, :celular)";

        $stmt = Connect::getInstance()->prepare($query);

        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":cpf", $this->cpf);
        $stmt->bindParam(":celular",$this->celular);

        $stmt->execute();

        return true;
    }

    public function delete($id)
    {
        $query = "DELETE FROM clientes WHERE id = :id";

        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":id", $id);

        $stmt->execute();

        if ($stmt->rowCount() == 0) {
            return false;
        } else {
            return true;
        }
    }

    public function update($id, $nome, $cpf, $celular)
    {
        // Query de atualização
        $query = "UPDATE clientes 
                SET nome = :nome, cpf = :cpf, celular = :celular 
                WHERE id = :id";

        // Prepara a conexão
        $stmt = Connect::getInstance()->prepare($query);

        // Liga os parâmetros aos valores
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":nome", $nome);
        $stmt->bindParam(":cpf", $cpf);
        $stmt->bindParam(":celular", $celular);

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