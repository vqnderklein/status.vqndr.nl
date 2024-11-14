<?php 

error_reporting(E_ALL);
ini_set('display_errors', 1);

include('../utils/buffer.php');
include('../utils/hist.php');
include('../utils/config.php');
include('../utils/sort.php');

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

$conn = Config::getDbConnectionWEB02();

if (!isset($_GET['month']) || !isset($_GET['year']) || !isset($_GET['action'])) {
    echo json_encode(['error' => 'Missing parameters.']);
    exit;
}

$month = (int)$_GET['month'];
$year = (int)$_GET['year'];
$action = $_GET['action'];

$retriever = new RetrievController();
$array = $retriever->getWebServices(1);

$sortFunction = new SortInformation();
$currentDayUptime = $sortFunction->returnHistoryUptimePercentage($array);
$currentStatus = $sortFunction->returnStatusForCurrentDay($array);

$dataFetcher = new HistroryFetcher($conn);
$bufferGenerator = new BufferGenerator($dataFetcher);

$response = [];
if ($action === "initial" || $action === "expand") {
    $response = $bufferGenerator->generateBuffer($year, $month);
} else {
    echo json_encode(['error' => 'Invalid action.']);
    exit;
}

$conn->close();

echo json_encode($response);

?>