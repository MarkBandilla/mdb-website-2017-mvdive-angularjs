<?php
die();
$date = date("Ymd.His");

rename("../app.db.js","../app.db.".$date.".js");

$file = fopen("../app.db.js","w");

if(fwrite($file, $_POST['db'])) echo 'success';
else echo 'failed';

fclose($file);

?>