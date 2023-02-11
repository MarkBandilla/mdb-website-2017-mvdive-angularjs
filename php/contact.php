<?php

// var_dump($_POST); die();

require_once 'phpmailer/PHPMailerAutoload.php';

$mailer = new PHPMailer;

$mailer->SMTPDebug = 2;

$mailer->isSMTP();
$mailer->SMTPAuth = true;

$mailer->Host = "vps8753.inmotionhosting.com";
$mailer->Username = "reservation@mvdive.com";
$mailer->Password = "d1v3mvr";
$mailer->SMTPSecure = "ssl";
$mailer->Port = 465;

$mailer->isHTML();

$mailer->Subject = $_POST['subject'];

$body = "";
foreach($_POST as $key => $value) {
    $body = $body . ucfirst($key) . ": " . $value . "<br>";
}
$mailer->Body = $body;
// $mailer->Body = "Name: ". $_POST['name'].
// 	"<br>Email: ". $_POST['email'].
// 	"<br>Message: <br>". $_POST['message'];


$mailer->setFrom("reservation@mvdive.com", "Reservation");
$mailer->AddAddress("reservation@mvdive.com", "Reservation");
// $mailer->AddCC("", "");

if($mailer->send()) {
	echo "success";
} else {
	echo "failed";
}