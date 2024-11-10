<?php

class DatabaseCleanController
{
    function startCleaning()
    {
        $conn = Config::getDbConnectionWEB02();
        $sql = "DELETE FROM dayRecords";
        if ($conn->query($sql) === TRUE) {
            return true;
        } else {
           return false;
        }
        $conn->close();
    }
}
