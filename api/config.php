<?php
  $dbhost="127.0.0.1";
  $dbuser="root";
  $dbpass="";
  $dbname="slim-jwt";
return array(
  'webhost' => 'www.example.com',
  'database' => array(
    'adapter' => 'pdo_mysql',
    'params' => array(
      'host' => '127.0.0.1',
      'username' => 'root',
      'password' => '',
      'dbname' => 'slim-jwt'
    )
  ),
  'jwtKey' => 'thegreathoudini'
);

?>