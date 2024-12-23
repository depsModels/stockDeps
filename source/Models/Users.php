<?php

namespace Source\Models;

use Source\Core\Connect;

class Users
{
    private $user;
    private $password;

    public function __construct(
        ?string $user = NULL,
        ?string $password = NULL
    ) {
        $this->user = $user;
        $this->password = $password;
    }

    /**
     * @return string|null
     */
    public function getUser(): ?string
    {
        return $this->user;
    }

    /**
     * @param string|null $user
     */
    public function setUser(?string $user): void
    {
        $this->user = $user;
    }

    /**
     * @return string|null
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    /**
     * @param string|null $password
     */
    public function setPassword(?string $password): void
    {
        $this->password = $password;
    }

    public function selectAll()
    {
        $query = "SELECT * FROM users";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->execute();

        if ($stmt->rowCount() == 0) {
            return false;
        } else {
            return $stmt->fetchAll();
        }
    }

    public function selectUserByName($user)
    {
        $query = "SELECT * FROM users WHERE user = :user";
        
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(':user', $user);

        $stmt->execute();
        
        if ($stmt->rowCount() == 0) {
            return false; // Nenhum registro encontrado
        } else {
            return $stmt->fetch();
        }
    }

    public function insert()
    {
        $query = "INSERT INTO users (user, password) 
                    VALUES (:user, :password)";
        $stmt = Connect::getInstance()->prepare($query);

        $stmt->bindParam(":user", $this->user);
        $stmt->bindParam(":password", $this->password);
        $stmt->execute();
        return true;
    }
    
    public function delete($user)
    {
        $query = "DELETE FROM users WHERE user = :user";

        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":user", $user);

        $stmt->execute();

        if ($stmt->rowCount() == 0) {
            return false;
        } else {
            return true;
        }
    }

    public function updatePassword($user, $password)
    {
        $query = "UPDATE users 
                SET password = :password 
                WHERE user = :user";

        $stmt = Connect::getInstance()->prepare($query);

        $stmt->bindParam(":user", $user);
        $stmt->bindParam(":password", $password);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return true;
        } else {
            return false;
        }
    }
}
