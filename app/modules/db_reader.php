<?php

class DatabaseReader
{
    public function startReading() {
        $allServers = $this->getAllServers("dayRecords", "serverName");
        $combinedData = $this->startProcessing($allServers);
        return $combinedData;
    }

    private function startProcessing($servers) {
        $allServerData = [];

        foreach ($servers as $serverName) {
            $retrievedData = $this->retrieveAllSimilarData($serverName);
            $calculator = $this->calculateUptime($retrievedData);

            $serverStatusReportFormat = [
                "serverName" => $serverName,
                "uptime" => $calculator['uptime'],
                "downtime" => $calculator['downtime'],
                "ip" => $retrievedData[0]['testIP'] ?? "N/A",
                "date" => date("Y-m-d"),
                "backlog" => $retrievedData[0]['backlog'] ?? "N/A",
                "incidents" => ""
            ];

            $allServerData[] = $serverStatusReportFormat;
        }

        return $allServerData;
    }

    private function calculateUptime($data) {
        $totalEntries = count($data);
        $onlineCount = 0;

        foreach ($data as $entry) {
            $onlineCount += ($entry['online'] === 'online') ? 1 : 0;
        }

        return [
            "uptime" => ($totalEntries > 0) ? ($onlineCount / $totalEntries * 100) : 0,
            "downtime" => $totalEntries - $onlineCount
        ];
    }

    private function retrieveAllSimilarData($serverName) {
        $mysqli = Config::getDbConnectionWEB02();
        $serverNameEscaped = $mysqli->real_escape_string($serverName);

        $query = "SELECT * FROM dayRecords WHERE `serverName` = '$serverNameEscaped'";
        $result = $mysqli->query($query);

        if ($result === false) {
            die("Error executing query: " . $mysqli->error);
        }

        $retrievedData = [];
        while ($row = $result->fetch_assoc()) {
            $retrievedData[] = $row;
        }

        $result->free();
        return $retrievedData;
    }

    public function getAllServers($tableName, $columnName) {
        $mysqli = Config::getDbConnectionWEB02();

        if ($mysqli->connect_error) {
            die("Connection failed: " . $mysqli->connect_error);
        }

        $tableNameEscaped = $mysqli->real_escape_string($tableName);
        $columnNameEscaped = $mysqli->real_escape_string($columnName);

        $query = "SELECT DISTINCT `$columnNameEscaped` FROM `$tableNameEscaped`";
        $result = $mysqli->query($query);

        if ($result === false) {
            die("Error executing query: " . $mysqli->error);
        }

        $servers = [];
        while ($row = $result->fetch_assoc()) {
            $servers[] = $row[$columnNameEscaped];
        }

        $result->free();
        $mysqli->close();

        return $servers;
    }

    private function generateIncidentData($data) {
        $incidents = [];

        // foreach ($data as $index => $entry) {
        //     $incidents["incident-{$index}"] = [
        //         "incidentId" => $entry['incidentId'] ?? "",
        //         "description" => $entry['description'] ?? "",
        //         "status" => $entry['status'] ?? "",
        //         "created_at" => $entry['created_at'] ?? ""
        //     ];
        // }

        return $incidents;
    }
}
