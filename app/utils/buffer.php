<?php

class BufferGenerator {
    private $dataFetcher;

    public function __construct($dataFetcher) {
        $this->dataFetcher = $dataFetcher;
    }

    public function generateBuffer($year, $month) {
        $buffer = [];
        for ($i = 0; $i >= -2; $i--) {
            $bufferMonth = $month + $i;
            $bufferYear = $year;

            if ($bufferMonth < 1) {
                $bufferMonth += 12;
                $bufferYear--;
            }

            $monthKey = "$bufferYear-$bufferMonth";
            if (!isset($buffer[$monthKey])) {
                $monthData = $this->dataFetcher->fetchMonthlyData($bufferYear, $bufferMonth);
                $globalUptime = $this->dataFetcher->calculateGlobalUptime($monthData);

                $buffer[$monthKey] = [
                    'data' => $monthData,
                    'globalUptime' => $globalUptime,
                ];
            }
        }

        return $buffer;
    }
}
