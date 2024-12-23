<?php

namespace Source\Models;

use Source\Core\Connect;

class Produtos
{
    private $id;
    private $idCategoria;
    private $nome;
    private $descricao;
    private $preco;
    private $imagem;
    private $unidade_medida;
    private $codigo_produto;

    public function __construct(
        int $id = NULL,
        int $idCategoria = NULL,
        string $nome = NULL,
        string $descricao = NULL,
        float $preco = NULL,
        string $imagem = NULL,
        string $unidade_medida = NULL,
        string $codigo_produto = NULL
    )
    {
        $this->id = $id;
        $this->idCategoria = $idCategoria;
        $this->nome = $nome;
        $this->descricao = $descricao;
        $this->preco = $preco;
        $this->imagem = $imagem;
        $this->unidade_medida = $unidade_medida;
        $this->codigo_produto = $codigo_produto;
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
    public function getPreco(): ?float
    {
        return $this->preco;
    }

    /**
     * @param string|null $preco
     */
    public function setPreco(?float $preco): void
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

    /**
     * Get the value of imagem
     */ 
    public function getImagem()
    {
        return $this->imagem;
    }

    /**
     * Set the value of imagem
     *
     * @return  self
     */ 
    public function setImagem($imagem)
    {
        $this->imagem = $imagem;

        return $this;
    }

    /**
     * Get the value of unidade_medida
     */ 
    public function getUnidade_medida()
    {
        return $this->unidade_medida;
    }

    /**
     * Set the value of unidade_medida
     *
     * @return  self
     */ 
    public function setUnidade_medida($unidade_medida)
    {
        $this->unidade_medida = $unidade_medida;

        return $this;
    }

    /**
     * Get the value of codigo_produto
     */ 
    public function getCodigo_produto()
    {
        return $this->codigo_produto;
    }

    /**
     * Set the value of codigo_produto
     *
     * @return  self
     */ 
    public function setCodigo_produto($codigo_produto)
    {
        $this->codigo_produto = $codigo_produto;

        return $this;
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

    public function validateProduto($nome, $idCategoria, $codigo_produto) : bool
    {
        $query = "SELECT * FROM produtos WHERE (nome = :nome AND idCategoria = :idCategoria) OR (codigo_produto = :codigo_produto)";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":nome", $nome);
        $stmt->bindParam(":idCategoria", $idCategoria);
        $stmt->bindParam(":codigo_produto", $codigo_produto);
        $stmt->execute();
        if($stmt->rowCount() == 1){
            return true;
        } else {
            return false;
        }
    }

    public function getQuantidadeById($id): mixed
    {
        $query = "SELECT * FROM produtos WHERE id = :id";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        if($stmt->rowCount() == 1){
            $produto = $stmt->fetch();
            return $produto->quantidade;
        } else {
            return false;
        }
    }

    public function insert() : bool
    {
        $query = "INSERT INTO produtos (idCategoria, nome, descricao, preco, unidade_medida, codigo_produto) 
                    VALUES (:idCategoria, :nome, :descricao, :preco, :unidade_medida, :codigo_produto)";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":idCategoria", $this->idCategoria);
        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindValue(":descricao", $this->descricao);
        $stmt->bindParam(":preco", $this->preco);
        $stmt->bindParam(":unidade_medida", $this->unidade_medida);
        $stmt->bindParam(":codigo_produto", $this->codigo_produto);
        $stmt->execute();
        return true;
    }

    public function somaQuantidadeProdutos(int $idProduto, float $quantidade) 
    {
        $query = "UPDATE produtos SET quantidade = quantidade + :quantidade WHERE id = :idProduto";

        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":quantidade", $quantidade);
        $stmt->bindParam(":idProduto", $idProduto);
        $stmt->execute();
        return true;
    }

    public function subtraiQuantidadeProdutos(int $idProduto, float $quantidade) 
    {
        $query = "UPDATE produtos SET quantidade = quantidade - :quantidade WHERE id = :idProduto";

        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":quantidade", $quantidade);
        $stmt->bindParam(":idProduto", $idProduto);
        $stmt->execute();
        return true;
    }

    public function delete($id)
    {
        $query = "DELETE FROM produtos WHERE id = :id";

        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":id", $id);

        $stmt->execute();

        if ($stmt->rowCount() == 0) {
            return false;
        } else {
            return true;
        }
    }

    public function update($id, $nome, $descricao, $idCategoria, $preco, $unidade_medida)
    {
        // Query de atualização
        $query = "UPDATE produtos 
                SET nome = :nome, descricao = :descricao, idCategoria = :idCategoria, preco = :preco, unidade_medida = :unidade_medida
                WHERE id = :id";

        // Prepara a conexão
        $stmt = Connect::getInstance()->prepare($query);

        // Liga os parâmetros aos valores
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":nome", $nome);
        $stmt->bindParam(":descricao", $descricao);
        $stmt->bindParam(":idCategoria", $idCategoria);
        $stmt->bindParam(":preco", $preco);
        $stmt->bindParam(":unidade_medida", $unidade_medida);

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