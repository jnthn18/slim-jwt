<?php
require 'vendor/autoload.php';
use \Firebase\JWT\JWT;

$app = new \Slim\App;

$container = $app->getContainer();

$container["jwt"] = function ($container) {
  return new StdClass;
};

$app->add(new \Slim\Middleware\JwtAuthentication([
  "path" => "/user",
  "secret" => "thegreathoudini",
  "error" => function($request, $response, $arguments) {
    $data["status"] = "error";
    $data["message"] = $arguments["message"];
    return $response
      ->withHeader('Content-Type', "application/json")
      ->write(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
  },
  "callback" => function ($request, $response, $arguments) use ($container) {
    $container["jwt"] = $arguments["decoded"];
  }
]));

$app->post('/login', 'loginUser');
$app->get('/user', 'user');
$app->get('/user/auth', 'auth');
$app->post('/register', 'registerUser');

$app->run();

function auth($request, $response){
  $decoded = $request->getAttribute("token");
  echo json_encode($decoded);
}

function user($request, $response) {
  $decoded = $request->getAttribute("token");
  echo json_encode($decoded);
  // print_r($app->jwt);
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
      $key = "thegreathoudini";
      //Set time for 25 seconds before expiring for testing
      $token = array(
        "iss" => "Slim JWT",
        "email" => $email,
        "sub" => $result['id'],
        "iat" => time(),
        "exp" => time() + (25)
      );
      $jwt = JWT::encode($token, $key, 'HS256');
      echo json_encode(array("token" => $jwt));
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
  $dbhost="127.0.0.1";
  $dbuser="root";
  $dbpass="";
  $dbname="slim-jwt";
  $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
  $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  return $dbh;
}

?>