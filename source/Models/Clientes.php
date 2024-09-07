<?php

namespace Source\Models;

use Source\Core\Connect;
use \PDO;
class Clientes
{
    private $id;
    private $nome;
    private $cpf;
    private $email;
    private $celular;
    private $cidade;
    private $bairro;
    private $uf;

    public function __construct(
        int $id = NULL,
        string $nome = NULL,
        string $cpf = NULL,
        string $email = NULL,
        string $celular = NULL,
        string $cidade= NULL,
        string $bairro = NULL,
        string $uf = NULL
    )
    {
        $this->id = $id;
        $this->nome = $nome;
        $this->cpf = $cpf;
        $this->email = $email;
        $this->celular = $celular;
        $this->cidade = $cidade;
        $this->bairro = $bairro;
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
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * @param string|null $email
     */
    public function setEmail(?string $email): void
    {
        $this->email = $email;
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

    /**
     * @return string|null
     */
    public function getCidade(): ?string
    {
        return $this->cidade;
    }

    /**
     * @param string|null $cidade
     */
    public function setCidade(?string $cidade): void
    {
        $this->cidade = $cidade;
    }

    /**
     * @return mixed
     */
    public function getBairro(): ?string
    {
        return $this->bairro;
    }

    /**
     * @param mixed $bairro
     */
    public function setBairro($bairro): void
    {
        $this->bairro = $bairro;
    }



    public function getUf(): ?string
    {
        return $this->uf;
    }

   /**
     * @param mixed $uf
     */
    public function setUf($uf): void
    {
        $this->uf = $uf;
    }

    public function selectAll ()
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

    public function findByIdName($nome) 
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
    /*finalizar a insert*/

    public function insert() 
    {
        $query = "INSERT INTO clientes (nome, cpf, email, celular, cidade, bairro, uf) 
                  VALUES (:nome, :cpf, :email, :celular, :cidade, :bairro, :uf)";

        $stmt = Connect::getInstance()->prepare($query);

        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":cpf", $this->cpf);
        $stmt->bindValue(":email", $this->email);
        $stmt->bindParam(":celular",$this->celular);
        $stmt->bindParam(":cidade",$this->cidade);
        $stmt->bindParam(":bairro",$this->bairro);
        $stmt->bindParam(":uf",$this->uf);

        $stmt->execute();

        return true;
    }

    /*

    public function validate (string $email, string $password) : bool
    {
        $query = "SELECT * FROM users WHERE email LIKE :email";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        if($stmt->rowCount() == 0){
            $this->message = "Usuário e/ou Senha não cadastrados!";
            return false;
        } else {
            $user = $stmt->fetch();
            if(!password_verify($password, $user->password)){
                $this->message = "Usuário e/ou Senha não cadastrados!";
                return false;
            }
        }

        $this->id = $user->id;
        $this->name = $user->name;
        $this->email = $user->email;
        $this->document = $user->document;
        $this->message = "Usuário Autorizado, redirect to APP!";

        $arrayUser = [
            "id" => $this->id,
            "name" => $this->name,
            "email" => $this->email,
            "photo" => $this->photo,
        ];

        $_SESSION["user"] = $arrayUser;
        setcookie("user","Logado",time()+60*60,"/");
        return true;
    }

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