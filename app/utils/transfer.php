<?php 

error_reporting(E_ALL);
ini_set('display_errors', 1);

include('config.php');
include('insert.php');
include('../modules/db_reader.php');
include('../modules/db_cleaner.php');

$secret = Config::getKey();
if(isset($_GET['secret'])) {
    if($secret !== $_GET['secret']) {
        http_response_code(403);
        exit;
    }
} else {
    http_response_code(403);
    exit();
}

$conn = Config::getDbConnectionWEB02();

//retrieve database data
$db_reader = new DatabaseReader();
$db_results = $db_reader->startReading();


//insert into long database
$db_logic = new InsertData();
$insert = $db_logic->insertIntoLongDatabase($db_results, $conn);


//clean the day database
$db_cleaner = new DatabaseCleanController();
$clean = $db_cleaner->startCleaning();
?>