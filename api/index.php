<?php
require 'vendor/autoload.php';
use \Firebase\JWT\JWT;
use Zend\Config\Config;
use Zend\Config\Factory;

$app = new \Slim\App;

$app->get('/authenticate', 'authenticate');
$app->get('/identity', 'identity');
$app->post('/login', 'loginUser');
$app->post('/register', 'registerUser');

$app->run();

function authenticate($request, $response) {
  $authHeader = $request->getHeader('Authorization');
  $config = Factory::fromFile('config.php', true);
  $secret = $config->get('jwtKey');

  list($jwt) = sscanf( $authHeader[0], 'Bearer %s');

  if ($jwt) {
    try {
      $token = JWT::decode($jwt, $secret, array('HS256'));
      return $response->withJson(array('isAuth' => true), 200);
    } catch (Exception $e) {
      return $response->withJson(array('isAuth' => false), 200);
    }
  } else {
    return $response->withJson(array('isAuth' => false), 200);
  }
}

function identity($request, $response) {
  $authHeader = $request->getHeader('Authorization');
  $config = Factory::fromFile('config.php', true);
  $secret = $config->get('jwtKey');

  list($jwt) = sscanf( $authHeader[0], 'Bearer %s');

  if ($jwt) {
    try {
      $token = JWT::decode($jwt, $secret, array('HS256'));
      return $response->withJson(array('identity' => $token), 200);
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
    echo json_encode($e->getMessage());
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
      return $response->withJson(array("token" => $jwt, "displayName" => $email), 200);
    } else {
      return $response->withJson(array("token" => null, "displayName" => null), 200);
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
    echo json_encode($e->getMessage());
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
      echo json_encode($e->getMessage());
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