<?php
/**
 * Created by PhpStorm.
 * User: glavnyjpolzovatel
 * Date: 13.07.15
 * Time: 15:02
 */
include('../db.php');

$method = $_SERVER['REQUEST_METHOD'] || 'GET';
$id = $_REQUEST['id'];
$email = $_REQUEST['email'];

$con = mysql_connect($dbhost, $dbuser, $dbpasswd);
if(!$con) { die('{"status":false,"message":"Error connection to db"}'); }
mysql_select_db($dbname);


switch ($method) {
    case 'GET':
        get($id);
        break;
    case 'POST':
        addCode($email);
        break;
    case 'PUT':
        break;
    case 'DELETE':
        break;
}

function addCode($email) {
    if(isset($email)) {
        $code = crypt($email);
        $query = "insert into registration values(0, '$email', '$code', 0)";
        if(mysql_query($query)) {
            $array = array();
            $array['id'] = mysql_insert_id();
            $array['email'] = $email;
            $array['code'] = $code;
            echo '{"status":true,"result":'.json_encode($array).'}';
        } else { echo '{"status":false,"message":"Error executing query to db"}'; }
    } else { echo '{"status":false,"message":"Not set parameter"}'; }
}

function get($id) {
    if($id) {
        $query = 'select * from registration where id = ' . $id;
    } else {
        $query = 'select * from registration';
    }
    if($result = mysql_query($query)) {
        $array = array();
        while($r = mysql_fetch_assoc($result)) {
            array_push($array, $r);
        }
        echo '{"status":true,"result":'.json_encode($array).'}';
    } else { echo '{"status":false,"message":"Error executing query to db"}'; }
}

mysql_close($con);

?>