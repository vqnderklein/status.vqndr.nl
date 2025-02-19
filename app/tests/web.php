<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);


class WebserverTests
{
    public function isServerOnline($host, $port, $timeout = 10)
    {
        $connection = @fsockopen($host, $port, $errno, $errstr, $timeout);
        if (is_resource($connection)) {
            fclose($connection);
            return true;  // Server is online
        } else {
            return false; // Server is offline
        }
    }

    public function runTest()
    {
        $jsonFile = 'env.json';

        if (!file_exists($jsonFile)) {
            return json_encode(['error' => "The file {$jsonFile} does not exist."]);
        }

        $jsonData = file_get_contents($jsonFile);
        $data = json_decode($jsonData, true);

        if ($data === null) {
            return json_encode(['error' => "Failed to decode JSON. Error: " . json_last_error_msg()]);
        }

        $results = []; 

        if (isset($data['config']['web']['servers'])) {
            foreach ($data['config']['web']['servers'] as $server) {
                $host = $server['host'];
                $port = $server['port'];
                $name = $server['name'];

                $status = $this->isServerOnline($host, $port) ? 'online' : 'offline';

                $results[] = [
                    'name' => $name,
                    'host' => $host,
                    'port' => $port,
                    'status' => $status
                ];
            }
        } else {
            return json_encode(['error' => "No servers found in the JSON file."]);
        }

        return json_encode($results);
    }
}

?>