<?php


$servername = "localhost";
$username = "tu_usuario";
$password = "tu_contraseña";
$dbname = "tu_base_de_datos";

$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}


$usuario = $_POST['usuario'];
$contrasena = $_POST['contrasena'];


$sql = "SELECT * FROM usuarios WHERE usuario='$usuario' AND contrasena='$contrasena'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "Inicio de sesión exitoso";
} else {
    echo "Credenciales inválidas";
}

$conn->close();
?>
