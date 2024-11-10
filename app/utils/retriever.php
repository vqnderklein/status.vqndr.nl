<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

class RetrievController
{

    public function getWebservice()
    {

        $conn =  Config::getDbConnectionWEB02();


        // First query to select the last 89 records from `dayRecordsArchive`
        // First query: selects the last 89 records from `dayRecordsArchive` for 'web01', ordered by `date` descending and then by `id` descending
        $sql1 = "
SELECT * 
FROM dayRecordsArchive 
WHERE serverName = 'web01'
ORDER BY date DESC, id DESC  
LIMIT 89;
";
        $result1 = $conn->query($sql1);
        if (!$result1) {
            die("Error executing first query: " . $conn->error);
        }

        // Second query: selects the first record from `dayRecords`, ordered by `date` ascending and then by `id` ascending
        $sql2 = "
SELECT online 
FROM dayRecords 
ORDER BY date DESC, id DESC  
LIMIT 1;
";
        $result2 = $conn->query($sql2);
        if (!$result2) {
            die("Error executing second query: " . $conn->error);
        }

        // Process each result set individually if needed
        $data1 = [];
        while ($row = $result1->fetch_assoc()) {
            $data1[] = $row;
        }

        $data2 = [];
        while ($row = $result2->fetch_assoc()) {
            $data2[] = $row;
        }

        $data = array_merge($data1, $data2);
     

        // Free results if needed
        $result1->free();
        $result2->free();

        return $data;
    }
}
