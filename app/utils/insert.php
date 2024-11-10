<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

class InsertData
{

    public function insertIntoDatabase($webserverArray, $conn)
    {
        $time = date("H:i");

        foreach ($webserverArray as $test) {
            $status = ($test['status'] == "success" || $test['status'] == 'online') ? "online" : "offline";
            $serverName = $test['name'];
            $ip = $test['host'] . ":" . $test['port'];

            $backlog = isset($test['backlog']) ? json_encode($test['backlog'], JSON_PRETTY_PRINT) : "-";

            $stmt = $conn->prepare("INSERT INTO dayRecords (id, online, serverName, testIP, date, backlog) VALUES (?, ?, ?, ?, ?, ?)");

            if ($stmt === false) {
                die("Prepare failed: " . $conn->error);
            }

            $id = 1;

            $stmt->bind_param("isssss", $id, $status, $serverName, $ip, $time, $backlog);

            if ($stmt->execute()) {
            } else {
                echo "Error: " . $stmt->error;
            }

            $stmt->close();
        }
    }

    public function insertIntoLongDatabase($db_results, $conn) {


        foreach ($db_results as $collumn) {
            $serverName = $collumn['serverName'];
            $uptime = $collumn['uptime'];
            $downtime = $collumn['downtime'];
            $ip = $collumn['ip'];
            $time = $collumn['date'];
            $incidents = json_encode($collumn['incidents'], JSON_PRETTY_PRINT);
            $id = 1;
            $backlog = $collumn['backlog'];

            $stmt = $conn->prepare("INSERT INTO `dayRecordsArchive`(`id`, `serverName`, `uptime`, `downtime`, `ip`, `date`, `incidents`, `backlog`)  VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

            if ($stmt === false) {
                die("Prepare failed: " . $conn->error);
            }

            $stmt->bind_param("isssssss", $id, $serverName, $uptime, $downtime, $ip, $time, $incidents, $backlog);

            if ($stmt->execute()) {
            } else {
                echo "Error: " . $stmt->error;
            }

            $stmt->close();
        }

    }
}
