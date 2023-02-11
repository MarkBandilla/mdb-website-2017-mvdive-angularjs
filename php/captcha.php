<?php

session_start();

//Creates 2 random numbers
	$number1 = rand(1,9);
	$number2 = rand(1,9);
	
//Sums up the 2 numbers
	$sum = $number1 + $number2; 
	
//Puts the result in a global variable so we can compare it with the field input
	$_SESSION['mysum'] = $sum;
	
//Sends the numbers to jquery in form of a question to display it on the page i.e. 3 + 4 =
	echo json_encode($number1 . ' + ' . $number2 . ' = ');

?>
