<?php
require 'vendor/autoload.php';
use \Firebase\JWT\JWT;
use Zend\Config\Config;
use Zend\Config\Factory;

$app = new \Slim\App;

$app->post('/login', 'loginUser');
$app->get('/user', 'user');
$app->post('/register', 'registerUser');

$app->run();

function user($request, $response) {
  $authHeader = $request->getHeader('Authorization');
  $config = Factory::fromFile('config.php', true);
  $secret = $config->get('jwtKey');

  list($jwt) = sscanf( $authHeader[0], 'Bearer %s');

  if ($jwt) {
    try {
      $token = JWT::decode($jwt, $secret, array('HS256'));
      $email = $token->email;
      echo json_encode(array('display' => $email));
    } catch (Exception $e) {
      return $response->withStatus(401);
    }
  }
  
}

function loginUser($request, $response) {
  $email = $request->getParam('email');
  $password = $request->getParam('password');

  $sql = "SELECT * FROM users WHERE email = :email";
  try {
    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
  } catch (PDOException $e) {
    echo json_encode('{"error":{"text":'. $e->getMessage() . '}}');
  }

  if($stmt->rowCount() > 0) {
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $hashedPassword = $result['password'];

    if(password_verify($password, $hashedPassword)) {
      $config = Factory::fromFile('config.php', true);

      $key = $config->get('jwtKey');
      //Set time for 60 minutes before expiring for testing
      $token = array(
        "iss" => "Slim JWT",
        "email" => $email,
        "sub" => $result['id'],
        "iat" => time(),
        "exp" => time() + (60*60)
      );
      $jwt = JWT::encode($token, $key);
      echo json_encode(array("token" => $jwt, "displayName" => $email));
    } else {
      return $response->withStatus(401);
    }
  }
}

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
  $config = Factory::fromFile('config.php', true);
  $db = $config->get('database')->get('params');
  $dbh = new PDO("mysql:host=$db[host];dbname=$db[dbname]", $db['username'], $db['password']);
  $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  return $dbh;
}

?>