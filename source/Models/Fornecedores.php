<?php

namespace Source\Models;

use Source\Core\Connect;
use \PDO;
class Fornecedores
{
    private $id;
    private $nome;
    private $cnpj;
    private $email;
    private $telefone;
    private $endereco;
    private $municipio;
    private $cep;
    private $uf;

    public function __construct(
        int $id = NULL,
        string $nome = NULL,
        string $cnpj = NULL,
        string $email = NULL,
        string $telefone = NULL,
        string $endereco = NULL,
        string $municipio = NULL,
        string $cep = NULL,
        string $uf = NULL
    )
    {
        $this->id = $id;
        $this->nome = $nome;
        $this->cnpj = $cnpj;
        $this->email = $email;
        $this->telefone = $telefone;
        $this->endereco = $endereco;
        $this->municipio = $municipio;
        $this->cep = $cep;
        $this->uf = $uf;
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
     * Get the value of cnpj
     */ 
    public function getCnpj()
    {
            return $this->cnpj;
    }

    /**
     * Set the value of cnpj
     *
     * @return  self
     */ 
    public function setCnpj($cnpj)
    {
            $this->cnpj = $cnpj;

            return $this;
    }

    /**
     * Get the value of email
     */ 
    public function getEmail()
    {
            return $this->email;
    }

    /**
     * Set the value of email
     *
     * @return  self
     */ 
    public function setEmail($email)
    {
            $this->email = $email;

            return $this;
    }

    /**
     * Get the value of telefone
     */ 
    public function getTelefone()
    {
            return $this->telefone;
    }

    /**
     * Set the value of telefone
     *
     * @return  self
     */ 
    public function setTelefone($telefone)
    {
            $this->telefone = $telefone;

            return $this;
    }

    /**
     * Get the value of endereco
     */ 
    public function getEndereco()
    {
        return $this->endereco;
    }

    /**
     * Set the value of endereco
     *
     * @return  self
     */ 
    public function setEndereco($endereco)
    {
        $this->endereco = $endereco;

        return $this;
    }

    public function getMunicipio()
    {
        return $this->municipio;
    }

    /**
     * Set the value of municipio
     *
     * @return  self
     */ 

    public function setMunicipio($municipio)
    {
        $this->municipio = $municipio;

        return $this;
    }

    /**
     * Get the value of cep
     */ 

    public function getCep()
    {
        return $this->cep;
    }

    /**
     * Set the value of cep
     *
     * @return  self
     */ 

    public function setCep($cep)
    {
        $this->cep = $cep;

        return $this;
    }

    /**
     * Get the value of uf
     */ 

    public function getUf()
    {
        return $this->uf;
    }

    /**
     * Set the value of uf
     *
     * @return  self
     */ 

    public function setUf($uf)
    {
        $this->uf = $uf;

        return $this;
    }

public function findByIdName($nome) 
{
    $query = "SELECT * FROM fornecedores WHERE nome = :nome";
    $stmt = Connect::getInstance()->prepare($query);
    $stmt->bindParam(":nome", $nome);
    $stmt->execute();

    if($stmt->rowCount() == 0){
        return false;
    } else {
        $fornecedor = $stmt->fetch();
        return $fornecedor->id;
    }
}

public function getHistoricoSaidas($idCliente){
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

public function getDadosCliente($idCliente){
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

/*
public function update()
{
    $query = "UPDATE users SET name = :name, email = :email, photo = :photo, document = :document WHERE id = :id";
    $stmt = Connect::getInstance()->prepare($query);
    $stmt->bindParam(":name",$this->name);
    $stmt->bindParam(":email",$this->email);
    $stmt->bindParam(":photo",$this->photo);
    $stmt->bindParam(":document",$this->document);
    $stmt->bindParam(":id",$this->id);
    $stmt->execute();
    $arrayUser = [
        "id" => $this->id,
        "name" => $this->name,
        "email" => $this->email,
        "photo" => $this->photo,
        "document" => $this->document
    ];
    $_SESSION["user"] = $arrayUser;
    $this->message = "Usuário alterado com sucesso!";
}

*/

public function insert() 
{
    $query = "INSERT INTO fornecedores (nome, cnpj, email, telefone, endereco, municipio, cep, uf) 
              VALUES (:nome, :cnpj, :email, :telefone, :endereco, :municipio, :cep, :uf)";

    $stmt = Connect::getInstance()->prepare($query);

    $stmt->bindParam(":nome", $this->nome);
    $stmt->bindParam(":cnpj", $this->cnpj);
    $stmt->bindParam(":email",$this->email);
    $stmt->bindParam(":telefone",$this->telefone);
    $stmt->bindParam(":endereco",$this->endereco);
    $stmt->bindParam(":municipio",$this->municipio);
    $stmt->bindParam(":cep",$this->cep);
    $stmt->bindParam(":uf",$this->uf);
    $stmt->execute();
    return true;
}

public function delete($id)
    {
        $query = "DELETE FROM fornecedores WHERE id = :id";

        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":id", $id);

        $stmt->execute();

        if ($stmt->rowCount() == 0) {
            return false;
        } else {
            return true;
        }
    }

    public function update($id, $nome, $cnpj, $email, $telefone, $endereco, $municipio, $cep, $uf)
    {
        // Query de atualização
        $query = "UPDATE fornecedores 
                SET nome = :nome, cnpj = :cnpj, email = :email, telefone = :telefone, endereco = :endereco, municipio = :municipio, cep = :cep, uf = :uf 
                WHERE id = :id";

        // Prepara a conexão
        $stmt = Connect::getInstance()->prepare($query);

        // Liga os parâmetros aos valores
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":nome", $nome);
        $stmt->bindParam(":cnpj", $cnpj);
        $stmt->bindParam(":email",$email);
        $stmt->bindParam(":telefone",$telefone);
        $stmt->bindParam(":endereco",$endereco);
        $stmt->bindParam(":municipio",$municipio);
        $stmt->bindParam(":cep",$cep);
        $stmt->bindParam(":uf",$uf);

        // Executa a query
        $stmt->execute();

        // Retorna se houve alterações
        if ($stmt->rowCount() > 0) {
            return true;
        } else {
            return false;
        }
    }

public function selectAll ()
{
    $query = "SELECT * FROM fornecedores";
    $stmt = Connect::getInstance()->prepare($query);
    $stmt->execute();

    if($stmt->rowCount() == 0){
        return false;
    } else {
        return $stmt->fetchAll();
    }
}

public function findByCnpj($cnpj) : bool
{
    $query = "SELECT * FROM fornecedores WHERE cnpj = :cnpj";
    $stmt = Connect::getInstance()->prepare($query);
    $stmt->bindParam(":cnpj", $cnpj);
    $stmt->execute();
    if($stmt->rowCount() == 1){
        return true;
    } else {
        return false;
    }
}

} 