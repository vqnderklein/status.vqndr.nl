<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

class MailTests {

    private $results = [];

    function runTest() {
        
        $data = $this->retrieveJSONdate();
        
        foreach ($data['config']['mail']['servers'] as $server) {
            $host = $server['host'];
            $port = $server['port'];  
            $name = $server['name'];
            
            $serverStatus = $this->checkMailServer($host, $port);
            
            $mailFunctionStatus = $this->checkMailFunction();
            
            $allChecksPassed = $this->checkAllConditions($serverStatus, $mailFunctionStatus);

            $status = $allChecksPassed ? 'online' : 'offline';
            
            $this->results[] = [
                'name' => $name,
                'host' => $host,
                'port' => $port,
                'status' => $status,
            ];
        }

        return json_encode($this->results, JSON_PRETTY_PRINT);
    }

    function retrieveJSONdate() {

        $jsonFile = 'env.json';

        if (!file_exists($jsonFile)) {
            echo "The file {$jsonFile} does not exist.\n";
            exit; 
        }
        
        $jsonData = file_get_contents($jsonFile);
        
        $data = json_decode($jsonData, true);
        
        if ($data === null) {
            echo "Failed to decode JSON. Error: " . json_last_error_msg() . "\n";
            exit; 
        }
        
        if (isset($data['config']['mail']['servers'])) {
           return $data;
        } else {
            echo "No servers found in the JSON file.\n";
            exit;
        }
    }
    
    
    function checkMailServer($host, $port, $timeout = 10) {
        $connection = @fsockopen($host, $port, $errno, $errstr, $timeout);
        if ($connection) {
            fclose($connection);
            return true; // Server is reachable
        } else {
            return false; // Server is not reachable
        }
    }
    
    function checkMailFunction($to = "afvang@vqndr.nl", $subject = "Test Email", $message = "This is a test email.", $headers = "From: noreply@vqndr.nl") {
        return mail($to, $subject, $message, $headers); 
    }

    function checkAllConditions($serverStatus, $mailFunctionStatus) {
        return $serverStatus && $mailFunctionStatus;
    }
}

?>
