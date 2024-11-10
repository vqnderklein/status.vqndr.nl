<?php
date_default_timezone_set('Europe/Amsterdam');

error_reporting(E_ALL);
ini_set('display_errors', 1);

include('utils/config.php');
include('utils/insert.php');
include('tests/web.php');
include('tests/api.php');
include('tests/db.php');
include('tests/mail.php');

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
$dbProgramm = new InsertData();

// insert webserver information into database
$webserverStatus = new WebserverTests();
$webserverArray = json_decode($webserverStatus->webserverTests(), true);
$insert = $dbProgramm->insertIntoDatabase($webserverArray, $conn);

//insert api information into database
$apiTests = new APITests();
$webserverApiArray = json_decode($apiTests->runAPITests(), true);
$insert = $dbProgramm->insertIntoDatabase($webserverApiArray, $conn);

//insert db information into database
$dbTests = new DatabaseTests();
$webserverDbArray = json_decode($dbTests->runTest(), true);
$insert = $dbProgramm->insertIntoDatabase($webserverDbArray, $conn);

//insert mail information into database
$mailServiceCheck = new MailTests();
$webserverMailArray = json_decode($mailServiceCheck->runTest(), true);
$insert = $dbProgramm->insertIntoDatabase($webserverMailArray, $conn);