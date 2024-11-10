<?php

class APITests
{
    // Function to check if the API responds successfully
    public function checkAPI($url, $method, $headers = [], $bodyContent = null)
    {
        $ch = curl_init(); // Initialize cURL

        // Initialize formattedHeaders as an empty array if no headers are provided
        $formattedHeaders = [];

        // Set cURL options
        curl_setopt($ch, CURLOPT_URL, $url); // Set the URL
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Return response as string
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Follow redirects

        // Set HTTP method
        if (strtoupper($method) === "POST") {
            curl_setopt($ch, CURLOPT_POST, true); // Enable POST request
            if ($bodyContent !== null) {
                // Convert body content to JSON and set as POST fields
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($bodyContent)); 
            }
        }

        // If headers are provided, set them
        if (!empty($headers)) {
            foreach ($headers as $key => $value) {
                $formattedHeaders[] = "{$key}: {$value}";
            }
        }

        // Set the content-type header for JSON
        curl_setopt($ch, CURLOPT_HTTPHEADER, array_merge(
            $formattedHeaders, 
            ["Content-Type: application/json"]
        ));

        // Execute the cURL request and get the response
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE); // Get HTTP status code

        // Close cURL connection
        curl_close($ch);

        // Return the response or status based on the HTTP code
        if ($httpCode === 200) {
            return ['status' => 'success', 'message' => "API test passed. "];
        } else {
            return ['status' => 'error', 'message' => "API test failed. "];
        }
    }

    // Function to run all API tests from the JSON configuration
    public function runAPITests()
    {
        $jsonFile = 'env.json';  // Path to the JSON file (adjust as needed)

        // Check if the JSON file exists
        if (!file_exists($jsonFile)) {
            return json_encode(['error' => "The file {$jsonFile} does not exist."]);
        }

        // Read and decode the JSON data from the file
        $jsonData = file_get_contents($jsonFile);
        $data = json_decode($jsonData, true);

        if ($data === null) {
            return json_encode(['error' => "Failed to decode JSON. Error: " . json_last_error_msg()]);
        }

        $results = []; // Array to store API test results

        // Check if the 'tests' section exists in the JSON data
        if (isset($data['config']['api']['tests'])) {
            foreach ($data['config']['api']['tests'] as $test) {
                $name = $test['name'];
                $url = $test['url'];
                $method = strtoupper($test['method']); // Ensure the method is uppercase
                $headers = isset($test['headers']) ? $test['headers'] : []; // Optional headers
                $bodyContent = isset($test['api_body_content']) ? $test['api_body_content'] : null; // Optional body content

                // Run the API test
                $result = $this->checkAPI($url, $method, $headers, $bodyContent);

                // Add the test result to the results array
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

        // Return the results as a JSON-encoded string
        return json_encode($results);
    }
}

// Example usage

?>
