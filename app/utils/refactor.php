<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

class refactorArrays
{

    public function refactor2X($array)
    {
        $newArray = [];
        $arraySize = count($array);
        $fieldNames = array_keys($array[0]);

        for ($i = 0; $i < $arraySize; $i++) {
            $value1 = $array[$i][$fieldNames[0]];
            $value2 = $array[$i][$fieldNames[1]];
            $newArray[$value1] = $value2;
        }

        return $newArray;
    }
}
