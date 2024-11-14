<?php

class HistroryFetcher {
    private $mysqli;

    public function __construct($mysqli) {
        $this->mysqli = $mysqli;
    }

    public function fetchMonthlyData($year, $month) {
        $query = "SELECT date, uptime, downtime, incidents FROM dayRecordsArchive 
                  WHERE YEAR(date) = ? AND MONTH(date) = ? ORDER BY date ASC";
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param("ii", $year, $month);
        $stmt->execute();
        $result = $stmt->get_result();

        $data = [];
        while ($row = $result->fetch_assoc()) {
            $dateKey = date("Y-m-d", strtotime($row['date']));
            $data[$dateKey] = [
                'uptime' => $row['uptime'],
                'downtime' => $row['downtime'],
                'incidents' => $row['incidents']
            ];
        }
        return $data;
    }

 

    public function calculateGlobalUptime($data) {
        $totalUptime = 0;
        $totalDays = count($data);

        foreach ($data as $dayData) {
            $totalUptime += $dayData['uptime'];
        }

        return $totalDays > 0 ? round($totalUptime / $totalDays, 2) : 0;
    }
}
