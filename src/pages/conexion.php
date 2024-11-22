<?php




    $conexion = mysqli_connect("localhost", "root", "", "proyecto");

    if($conexion){
        echo 'Conectado exitosamente a la base de datos';
    }else{
        echo 'no se ha podido conectar a la base de datos'
    }