<?php

namespace Source\Models;

use Source\Core\Connect;

class Produtos
{
    private $id;
    private $idCategoria;
    private $nome;
    private $preco;
    private $descricao;

    public function __construct(
        int $id = NULL,
        int $idCategoria = NULL,
        string $nome = NULL,
        string $preco = NULL,
        string $descricao = NULL
    )
    {
        $this->id = $id;
        $this->idCategoria = $idCategoria;
        $this->nome = $nome;
        $this->preco = $preco;
        $this->descricao = $descricao;
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
    public function getPreco(): ?string
    {
        return $this->preco;
    }

    /**
     * @param string|null $preco
     */
    public function setPreco(?string $preco): void
    {
        $this->preco = $preco;
    }

    /**
     * @return string|null
     */
    public function getDescricao(): ?string
    {
        return $this->descricao;
    }

    /**
     * @param string|null $descricao
     */
    public function setDescricao(?string $descricao): void
    {
        $this->descricao = $descricao;
    }

    public function selectAll ()
    {
        $query = "SELECT * FROM produtos";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->execute();

        if($stmt->rowCount() == 0){
            return false;
        } else {
            return $stmt->fetchAll();
        }
    }

    public function validateProdutos($nome, $idCategoria) : bool
    {
        $query = "SELECT * FROM produtos WHERE nome = :nome AND idCategoria = :idCategoria";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":nome", $nome);
        $stmt->bindParam(":idCategoria", $idCategoria);
        $stmt->execute();
        if($stmt->rowCount() == 1){
            return true;
        } else {
            return false;
        }
    }

    public function insert() : bool
    {
        $query = "INSERT INTO produtos (idCategoria, nome, preco, descricao) VALUES (:idCategoria, :nome, :preco, :descricao)";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":idCategoria", $this->idCategoria);
        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":preco", $this->preco);
        $stmt->bindValue(":descricao", $this->descricao);
        $stmt->execute();
        return true;
    }

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

}