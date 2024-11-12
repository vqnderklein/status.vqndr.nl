<?php 

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

include('../utils/config.php');
include('db_reader.php');
include('../utils/retriever.php');
include('../utils/refactor.php');

$db_retriever = new RetrievController();
$results_webservers = $db_retriever->getWebServers(); //Get status of webservers

$db_reader = new DatabaseReader();
$amountOfServices = count($db_reader->getAllServers("dayRecords", "serverName"));

$results_webservices = $db_retriever->getWebservices($amountOfServices); //Get status of webservices


$refactor = new refactorArrays();
$newArray = $refactor->refactor2X($results_webservices);

echo json_encode($results_webservers, JSON_PRETTY_PRINT);

?>