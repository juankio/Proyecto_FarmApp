<?php

$servername = "localhost";
$username = "root@localhost";
$password = "";
$dbname = "proyecto";

$Conexion = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$nombres = $_POST['nombres'];
$apellidos = $_POST['apellidos'];
$email = $_POST['email'];
$contrasena = $_POST['contrasena'];


$sql = "INSERT INTO datos (nombres, apellidos, email, contrasena)
VALUES ('$nombres', '$apellidos', '$email', '$contrasena')";

if ($conn->query($sql) === TRUE) {
    echo "Registro exitoso";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>

