<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

class SortInformation
{


    function returnUptimePercentage($array)
    {

        $dayLength = count($array);
        $onlineCount = 0;
        foreach ($array as $key) {

            if ($key['online'] == 'online') {
                $onlineCount++;
            }
        }

        return $onlineCount / $dayLength * 100;
    }

    function returnStatusForCurrentDay($array)
    {
        return $array[count($array) - 1]['online']; //last entry (current status)
    }

    function returnHistoryUptimePercentage($array)
    {

        $totalWatchTime = count($array);
        $totalUptimeAmount = 0;

        foreach ($array as $key) {
            $totalUptimeAmount += $key['uptime'];
        }

        return $totalUptimeAmount / $totalWatchTime;
    }

    function generateIncidentReport($array)
    {

        //Logic later
        return "No incidents";
    }

    function returnDowntime($array)
    {

        $downtimeCounter = 0;

        foreach ($array as $key) {
            if ($key['online'] == 'offline') {
                $downtimeCounter++;
            }
        }

        return $downtimeCounter;
    }


    function formatHistoryData($array)
    {

        $formattedData = [];
      

        for ($i = 0; $i < count($array); $i++) {

            //TODO: Add incident report logic

            $dayFormat = [
                "date" => $array[$i]['date'],
                "uptime" => $array[$i]['uptime'],
                "downtime" => $array[$i]['downtime'],
                "incidents" => "Geen incidenten",
            ];

            $formattedData[$i] = $dayFormat;
        }

        return $formattedData;
    }


    public function sort($historyData, $dayData)
    {
        //Calculate some stuff
        $uptimeForCurrentDay = $this->returnUptimePercentage($dayData);
        $downtimeForCurrentDay = $this->returnDowntime($dayData);
        $currentStatusForCurrentDay = $this->returnStatusForCurrentDay($dayData);
        $currentIncidentReport = $this->generateIncidentReport($dayData);
        $globalUptime = $this->returnHistoryUptimePercentage($historyData);
        $formattedHistoryData = $this->formatHistoryData($historyData);

        //Extra stuff
        $refactor = new refactorArrays();
        $db_retriever = new RetrievController();
        $db_reader = new DatabaseReader();
        $amountOfServices = count($db_reader->getAllServers("dayRecords", "serverName"));
        $results_webservices = $db_retriever->getWebservices($amountOfServices); //Get status of webservices
        $currentServiceStatus = $refactor->refactor2X($results_webservices);

        $data = [
            "currentDay" => [
                "uptime" => $uptimeForCurrentDay,
                "downtime" => $downtimeForCurrentDay,
                "currentStatus" => $currentStatusForCurrentDay,
                "currentDayIncidents" => $currentIncidentReport,
                "currentServiceStatus" => $currentServiceStatus
            ],
            "history" => [
                "globalUptime" => $globalUptime,
                "history_days" => $formattedHistoryData,
            ]
        ];

        return $data;
    }
}
