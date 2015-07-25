<?php
/**
 * Created by PhpStorm.
 * User: vitaly
 * Date: 13.07.15
 * Time: 23:51
 */
include('db.php');

$word = $_REQUEST['searchWord'];

$con = mysql_connect($dbhost, $dbuser, $dbpasswd);
if(!$con) { die('{"status":false,"message":"Error connection to db"}'); }
mysql_select_db($dbname);

if(isset($word)) {
    $query = "SELECT c.catname, q.* FROM questions AS q, categories AS c WHERE q.catid = c.id AND (question LIKE '%" . $word . "%' "
        ."OR answer1 LIKE '%" . $word . "%'"
        ."OR answer2 LIKE '%" . $word . "%'"
        ."OR answer3 LIKE '%" . $word . "%'"
        ."OR answer4 LIKE '%" . $word . "%'"
        ."OR answer5 LIKE '%" . $word . "%') ORDER BY c.id";
    //echo $query;
    if($result = mysql_query($query)) {
        $array = array();
        while($r = mysql_fetch_assoc($result)) {
            array_push($array, $r);
        }
        echo '{"status":true,"result":'.json_encode($array).'}';
    } else { echo '{"status":false,"message":"Error executing query to db"}'; }
} else { echo '{"status":false,"message":"Not enough parameters"}'; }

mysql_close($con);

?>