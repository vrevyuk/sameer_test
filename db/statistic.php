<?php
/**
 * Created by PhpStorm.
 * User: vitaly
 * Date: 13.07.15
 * Time: 23:51
 */
include('db.php');

$con = mysql_connect($dbhost, $dbuser, $dbpasswd);
if(!$con) { die('{"status":false,"message":"Error connection to db"}'); }
mysql_select_db($dbname);

$query = 'select count(*) as cnt, used from registration group by used';
if($result = mysql_query($query)) {
    $array = array();
    while($r = mysql_fetch_assoc($result)) {
        array_push($array, $r);
    }
    $query2 = "SELECT COUNT(*) AS cnt, c.catname FROM questions AS q, categories AS c WHERE q.catid = c.id GROUP BY q.catid";
    if($result2 = mysql_query($query2)) {
        $array2 = array();
        while($r2 = mysql_fetch_assoc($result2)) {
            array_push($array2, $r2);
        }
        $status = true;
    } else { $status = false; $message = "Error executing query to db"; }
} else { $status = false; $message = "Error executing query to db"; }

if($status) {
    echo '{"status":true,"result":{"codes":'.json_encode($array).',"questions":'.json_encode($array2).'}}';
} else {
    echo '{"status":false,"message":"'.$message.'"}';
}

mysql_close($con);

?>