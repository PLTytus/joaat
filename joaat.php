<?php

function int32($i){
	return $i & 0xFFFFFFFF;
}

function signedInt32($i){
	return $i | (-($i & 0x80000000));
}

function signedInt8($i){
	return $i | (-($i & 0x80));
}

function joaat($str, $cat=null, $m=1/*1|-1*/){
	$hash = 0;
	foreach(str_split(mb_strtolower($str)) as $c){
		$hash = int32($hash + signedInt8(ord($c)));
		$hash = int32($hash + ($hash << 10));
		$hash = int32($hash ^ ($hash >> 6));
	}
	$hash = int32($hash + ($hash << 3));
	$hash = int32($hash ^ ($hash >> 11));
	$hash = int32($hash + ($hash << 15));
	
	if($cat !== null) $hash += joaat($cat)["unsigned"] * $m;

	return [
		"hex" => strtoupper(dechex($hash)),
		"unsigned" => $hash,
		"signed" => signedInt32($hash),
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