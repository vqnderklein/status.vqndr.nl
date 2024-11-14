<?php

class APITests
{
    public function checkAPI($url, $method, $headers = [], $bodyContent = null)
    {
        $ch = curl_init(); 

        $formattedHeaders = [];

        curl_setopt($ch, CURLOPT_URL, $url); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); 

        if (strtoupper($method) === "POST") {
            curl_setopt($ch, CURLOPT_POST, true); 
            if ($bodyContent !== null) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($bodyContent)); 
            }
        }

        if (!empty($headers)) {
            foreach ($headers as $key => $value) {
                $formattedHeaders[] = "{$key}: {$value}";
            }
        }

        curl_setopt($ch, CURLOPT_HTTPHEADER, array_merge(
            $formattedHeaders, 
            ["Content-Type: application/json"]
        ));

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE); 

        curl_close($ch);

        if ($httpCode === 200) {
            return ['status' => 'success', 'message' => "API test passed. "];
        } else {
            return ['status' => 'error', 'message' => "API test failed. "];
        }
    }

    public function runTest()
    {
        $jsonFile = 'env.json';  

        if (!file_exists($jsonFile)) {
            return json_encode(['error' => "The file {$jsonFile} does not exist."]);
        }

        $jsonData = file_get_contents($jsonFile);
        $data = json_decode($jsonData, true);

        if ($data === null) {
            return json_encode(['error' => "Failed to decode JSON. Error: " . json_last_error_msg()]);
        }

        $results = []; 

        if (isset($data['config']['api']['tests'])) {
            foreach ($data['config']['api']['tests'] as $test) {
                $name = $test['name'];
                $url = $test['url'];
                $method = strtoupper($test['method']); 
                $headers = isset($test['headers']) ? $test['headers'] : []; 
                $bodyContent = isset($test['api_body_content']) ? $test['api_body_content'] : null; // Optional body content

                $result = $this->checkAPI($url, $method, $headers, $bodyContent);

                $results[] = [
                    'name' => $name,
                    'host' => 'web01',
                    'ip' => 'Applicatie',
                    'port' => 'API',
                    'status' => $result['status'],
                ];
            }
        } else {
            return json_encode(['error' => "No API tests found in the JSON data."]);
        }

        return json_encode($results);
    }
}


?>
