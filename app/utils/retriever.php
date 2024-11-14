<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include('sort.php');

class RetrievController
{

    public function getWebServers()
    {

        $conn =  Config::getDbConnectionWEB02();
       
        $sql1 = "SELECT uptime, downtime, incidents, date FROM dayRecordsArchive WHERE serverName = 'web01' ORDER BY date DESC, id DESC LIMIT 89;";
        $result1 = $conn->query($sql1);
        if (!$result1) {
            die("Error executing first query: " . $conn->error);
        }

        $sql2 = "SELECT online, incidents FROM dayRecords ORDER BY date DESC, id DESC;";
        $result2 = $conn->query($sql2);
        if (!$result2) {
            die("Error executing second query: " . $conn->error);
        }

        $data1 = [];
        while ($row = $result1->fetch_assoc()) {
            $data1[] = $row;
        }

        $data2 = [];
        while ($row = $result2->fetch_assoc()) {
            $data2[] = $row;
        }

       
        $sortInformation = new SortInformation();
        $data = $sortInformation->sort($data1, $data2);;
        

        $result1->free();
        $result2->free();

        return $data;
    }

    public function getWebServices($cap) {

        $conn =  Config::getDbConnectionWEB02();
       
        $sql = "SELECT  serverName, online FROM dayRecords ORDER BY date DESC, id DESC LIMIT $cap;";
        $result = $conn->query($sql);
        if (!$result) {
            die("Error executing first query: " . $conn->error);
        }

        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        return $data;
    }
}
