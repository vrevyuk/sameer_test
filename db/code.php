<?php
/**
 * Created by PhpStorm.
 * User: glavnyjpolzovatel
 * Date: 13.07.15
 * Time: 15:02
 */
include('db.php');

$method = $_REQUEST['act'];
if(!isset($method)) { $method = 'get'; }
$id = $_REQUEST['id'];
$email = $_REQUEST['email'];

$con = mysql_connect($dbhost, $dbuser, $dbpasswd);
if(!$con) { die('{"status":false,"message":"Error connection to db"}'); }
mysql_select_db($dbname);

switch ($method) {
    case 'get':
        get($id);
        break;
    case 'post':
        addCode($email);
        break;
    case 'put':
        break;
    case 'delete':
        delete($id);
        break;
}

function delete($id) {
    $query = "delete from registration where id = " . $id;
    if(mysql_query($query)) {
        echo '{"status":true}';
    } else { echo '{"status":false,"message":"Error executing query to db"}'; }
}

function addCode($email) {
    if(isset($email)) {
        $code = crc32($email);
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
        $query = 'select * from registration where id = ' . $id . ' order by id desc';
    } else {
        $query = 'select * from registration order by id desc';
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