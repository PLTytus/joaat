<?php

function joaat($s, $c=null, $m=1/*1|-1*/){
	$hex = hash("joaat", strtolower($s));
	$int = base_convert($hex, 16, 10);

	if($c !== null){
		$int += joaat($c)["unsigned"] * $m;
		$hex = base_convert($int, 10, 16);
	}

	return [
		"hex" => strtoupper($hex),
		"unsigned" => $int,
		"signed" => $int | (-($int & 0x80000000)),
	];
}

if($_SERVER["REQUEST_METHOD"] == "POST"){
	$response = false;

	if(!empty($_POST["string"]) && !empty($_POST["category"])){
		$s = strtolower(trim($_POST["string"]));
		$c = strtolower(trim($_POST["category"]));

		$response = [
			"string" => joaat($s),
			"plus" => joaat($s, $c, 1),
			"minus" => joaat($s, $c, -1),
			"category" => joaat($c),
		];
	}

	echo json_encode($response);
}

?>