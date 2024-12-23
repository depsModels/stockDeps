-- Tabela de categorias
CREATE TABLE IF NOT EXISTS `categorias` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `nome` varchar(255) NOT NULL,
    `descricao` text NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS `produtos` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `idCategoria` int(11) NOT NULL,
    `nome` varchar(255) NOT NULL,
    `descricao` text NOT NULL,
    `preco` float NOT NULL,
    `quantidade` DOUBLE NOT NULL DEFAULT 0,
    `imagem` varchar(255) DEFAULT NULL,
    `unidade_medida` varchar(50) NOT NULL,
    `codigo_produto` varchar(50) NOT NULL UNIQUE,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    KEY `fk_produtos_categorias_idx` (`idCategoria`),
    CONSTRAINT `fk_produtos_categorias` FOREIGN KEY (`idCategoria`) REFERENCES `categorias` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Alterar a tabela de saídas
ALTER TABLE `produtos`
MODIFY `quantidade` DOUBLE NOT NULL;

-- Adicionar coluna 'unidade_medida' caso ela não exista
ALTER TABLE `produtos` 
ADD COLUMN IF NOT EXISTS `unidade_medida` varchar(50) NOT NULL;

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS `clientes` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `nome` varchar(255) NOT NULL,
    `cpf` varchar(14) NOT NULL,
    `celular` varchar(15) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Tabela de fornecedores
CREATE TABLE IF NOT EXISTS `fornecedores` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `nome` varchar(255) NOT NULL,
    `cnpj` varchar(18) NOT NULL,
    `email` varchar(255) NOT NULL,
    `telefone` varchar(15) NOT NULL,
    `endereco` varchar(255) NOT NULL,
    `municipio` varchar(50) NOT NULL,
    `cep` varchar(9) NOT NULL,
    `uf` varchar(2) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Tabela de entradas
CREATE TABLE IF NOT EXISTS `entradas` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `idFornecedor` int(11) NOT NULL,
    `idProdutos` int(11) NOT NULL,
    `quantidade` DOUBLE NOT NULL,
    `preco` float NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    KEY `fk_entradas_fornecedor_idx` (`idFornecedor`),
    CONSTRAINT `fk_entradas_fornecedor` FOREIGN KEY (`idFornecedor`) REFERENCES `fornecedores` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
    KEY `fk_entradas_produtos_idx` (`idProdutos`),
    CONSTRAINT `fk_entradas_produtos` FOREIGN KEY (`idProdutos`) REFERENCES `produtos` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Alterar a tabela de entradas
ALTER TABLE `entradas`
MODIFY `quantidade` DOUBLE NOT NULL;

-- Tabela de saídas
CREATE TABLE IF NOT EXISTS `saidas` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `idClientes` int(11) DEFAULT NULL,  -- Permite NULL
    `idProdutos` int(11) NOT NULL,
    `quantidade` DOUBLE NOT NULL,
    `preco` float NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    KEY `fk_saidas_clientes_idx` (`idClientes`),
    CONSTRAINT `fk_saidas_clientes` FOREIGN KEY (`idClientes`) REFERENCES `clientes` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
    KEY `fk_saidas_produtos_idx` (`idProdutos`),
    CONSTRAINT `fk_saidas_produtos` FOREIGN KEY (`idProdutos`) REFERENCES `produtos` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Alterar a tabela de saídas
ALTER TABLE `saidas`
MODIFY `quantidade` DOUBLE NOT NULL;


-- Tabela de usuários
CREATE TABLE IF NOT EXISTS `users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;