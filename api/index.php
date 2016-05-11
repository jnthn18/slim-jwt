<?php
require 'vendor/autoload.php';

$app = new \Slim\App;

$app->post('/register', 'registerUser');

$app->run();

function registerUser($request, $response) {
  $email = $request->getParam('email');
  $password = $request->getParam('password');
  $first_name = $request->getParam('firstName');
  $last_name = $request->getParam('lastName');

  $hash = password_hash($password, PASSWORD_DEFAULT);
  //Check to see if Username exists
  $sql = "SELECT email FROM users WHERE email = :email";
  try {
    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
  } catch (PDOException $e) {
    echo json_encode('{"error":{"text":'. $e->getMessage() . '}}');
  }
  
  if($stmt->rowCount() > 0){
    echo json_encode('That email is already in use.');
  } else {
    // Insert User to database
    $sql = "INSERT INTO users (email, password, first_name, last_name) VALUES (:email, :password, :first_name, :last_name)";
    try {
      $db = getConnection();
      $stmt = $db->prepare($sql);
      $stmt->bindParam(':email', $email);
      $stmt->bindParam(':password', $hash);
      $stmt->bindParam(':first_name', $first_name);
      $stmt->bindParam(':last_name', $last_name);
      $stmt->execute();
    } catch (PDOException $e) {
      echo json_encode('{"error":{"text":'. $e->getMessage() . '}}');
    }
    echo json_encode("User: ".$first_name." ".$last_name." created");
  }
}

function getConnection() {
  $dbhost="127.0.0.1";
  $dbuser="root";
  $dbpass="";
  $dbname="slim-jwt";
  $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
  $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  return $dbh;
}

?>