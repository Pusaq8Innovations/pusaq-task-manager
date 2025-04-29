<?php
// Configuración de cabeceras
header('Content-Type: application/json');

// Función para responder con errores
function errorResponse($message, $statusCode = 400) {
    http_response_code($statusCode);
    echo json_encode(["error" => $message]);
    exit();
}

// Validar método de la solicitud
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse("Solo se permiten solicitudes POST", 405);
}

// Leer y decodificar el cuerpo JSON
$input = json_decode(file_get_contents('php://input'), true);

// Validar datos de entrada
if (!isset($input['email']) || !filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    errorResponse("El campo 'email' es requerido y debe ser válido.");
}
if (!isset($input['taskName']) || empty($input['taskName'])) {
    errorResponse("El campo 'taskName' es requerido.");
}
if (!isset($input['dueDate']) || empty($input['dueDate'])) {
    errorResponse("El campo 'dueDate' es requerido.");
}

$email = $input['email'];
$taskName = $input['taskName'];
$dueDate = $input['dueDate'];

// Asunto del correo
$subject = "New Task Assigned to you";

// Cuerpo del correo electrónico (usando tu HTML como plantilla)
$htmlContent = '<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <style>
        .content p {
            margin: 0 0 15px;
            line-height: 1.6;
        }
    </style>
    <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #007bff; color: #ffffff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">New Task Assigned</h1>
        </div>
        <div style="padding: 20px; color: #333333;">
            <p>Hello,</p>
            <p>A new task has been assigned to you in the task management system.</p>
            <p><strong>Task Details:</strong></p>
            <ul>
                <li><strong>Title:</strong> ' . htmlspecialchars($taskName) . '</li>
                <li><strong>Due Date:</strong> ' . htmlspecialchars($dueDate) . '</li>
            </ul>
            <p>Please review the task and take the necessary actions.</p>
            <a href="https://pusaq8innovations.github.io/pusaq-task-manager/dashboard.html"
                style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007bff;color: #ffffff; text-decoration: none; border-radius: 5px;">View
                Task</a>
        </div>
        <div style="text-align: center; padding: 10px; background-color: #f9f9f9; color: #777777;">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>';

// Cabeceras del correo
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: no-reply@pusaq8.com" . "\r\n";

// Enviar el correo
if (mail($email, $subject, $htmlContent, $headers)) {
    echo json_encode(["success" => true, "message" => "Correo enviado exitosamente."]);
} else {
    errorResponse("Error al enviar el correo.", 500);
}
?>