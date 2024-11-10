<?php 

error_reporting(E_ALL);
ini_set('display_errors', 1);

include('../utils/config.php');
include('../utils/retriever.php');

$db_retriever = new RetrievController();
$results = $db_retriever->getWebservice();
print_r($results);

?>