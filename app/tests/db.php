<?php 

class DatabaseTests
{
    private $mysqli;
    private $dbName;
    private $tableName;
    private $results = [];

    public function Setup($serverName, $dbName)
    {
        $this->dbName = $dbName;
        
        if ($serverName === 'db01') {
            $this->mysqli = Config::getDbConnectionWEB01();
        } elseif ($serverName === 'db02') {
            $this->mysqli = Config::getDbConnectionWEB02();
        }

        if ($this->mysqli->connect_error) {
            die("Connection failed: " . $this->mysqli->connect_error);
        }

        if (!$this->mysqli->select_db($this->dbName)) {
            die("Error: Could not select the database {$this->dbName}.");
        }
    }

    private function logResult($action, $status, $message)
    {
        $this->results[] = [
            'action' => $action,
            'status' => $status,
            'message' => $message,
        ];
    }

    private function createTable()
    {
        $this->tableName = "table_" . bin2hex(random_bytes(4)); 
        $query = "CREATE TABLE IF NOT EXISTS {$this->tableName} (
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";

        if ($this->mysqli->query($query) === TRUE) {
            $this->logResult("Create Table", "success", "Table {$this->tableName} created.");
            return true;
        } else {
            $this->logResult("Create Table", "error", "Error creating table: " . $this->mysqli->error);
            return false;
        }
    }

    private function insertRecords($numRecords = 5)
    {
        for ($i = 0; $i < $numRecords; $i++) {
            $name = "Name_" . bin2hex(random_bytes(3)); 
            $email = "user_" . bin2hex(random_bytes(4)) . "@example.com"; 
            $query = "INSERT INTO {$this->tableName} (name, email) VALUES ('{$name}', '{$email}')";

            if ($this->mysqli->query($query) === TRUE) {
                $this->logResult("Insert Record", "success", "Record {$i} inserted.");
            } else {
                $this->logResult("Insert Record", "error", "Error inserting record {$i}: " . $this->mysqli->error);
            }
        }
    }

    private function updateRecord()
    {
        $query = "SELECT id FROM {$this->tableName} LIMIT 1"; 
        $result = $this->mysqli->query($query);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $id = $row['id'];
            $newName = "Updated_" . bin2hex(random_bytes(3));
            $query = "UPDATE {$this->tableName} SET name='{$newName}' WHERE id={$id}";

            if ($this->mysqli->query($query) === TRUE) {
                $this->logResult("Update Record", "success", "Record with ID {$id} updated.");
            } else {
                $this->logResult("Update Record", "error", "Error updating record with ID {$id}: " . $this->mysqli->error);
            }
        } else {
            $this->logResult("Update Record", "error", "No records found to update.");
        }
    }

    private function deleteRecord()
    {
        $query = "SELECT id FROM {$this->tableName} LIMIT 1"; 
        $result = $this->mysqli->query($query);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $id = $row['id'];
            $query = "DELETE FROM {$this->tableName} WHERE id={$id}";

            if ($this->mysqli->query($query) === TRUE) {
                $this->logResult("Delete Record", "success", "Record with ID {$id} deleted.");
            } else {
                $this->logResult("Delete Record", "error", "Error deleting record with ID {$id}: " . $this->mysqli->error);
            }
        } else {
            $this->logResult("Delete Record", "error", "No records found to delete.");
        }
    }

    private function deleteTable()
    {
        $query = "DROP TABLE {$this->tableName}";
        if ($this->mysqli->query($query) === TRUE) {
            $this->logResult("Delete Database", "success", "Database {$this->dbName} deleted.");
        } else {
            $this->logResult("Delete Database", "error", "Error deleting database: " . $this->mysqli->error);
        }
    }

    public function formatManager($results)
    {
        $status = 'online';

        foreach ($results as $result) {
            if (isset($result['status']) && strtolower($result['status']) === 'error') {
                $status = 'offline';
            }
        }



        return [
            'status' => $status,
            'results' => $results,
        ];
    }

    public function runTest()
    {
        $jsonFile = 'env.json';
        if (!file_exists($jsonFile)) {
            die("Error: The JSON configuration file does not exist.");
        }

        $jsonData = file_get_contents($jsonFile);
        $data = json_decode($jsonData, true);

        if (!isset($data['config']['db-servers']['servers'])) {
            die("Error: No database servers found in the JSON configuration.");
        }

        $dbServers = $data['config']['db-servers']['servers'];

        $allResults = [];

        foreach ($dbServers as $server) {
            $host = $server['host'];
            $port = $server['port'];
            $dbName = $server['db_name']; 

            $this->Setup($server['name'], $dbName);

            if ($this->createTable()) {
                $this->insertRecords();
                $this->updateRecord();
                $this->deleteRecord();
                $this->deleteTable();
            }

            $allResults[] = [
                'host' => $host,
                'port' => $port,
                'name' => $server['name'],
                'status' => $this->formatManager($this->results)['status'],
                'backlog' => $this->results,
            ];
        }

        return json_encode($allResults, JSON_PRETTY_PRINT);
    }
}


?>