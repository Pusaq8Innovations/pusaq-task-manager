async function sendEmail(email, taskName, dueDate) {
    const url = 'https://api.pusaq8.com/email.php'; // Asegúrate de que esta sea la ruta correcta a tu script PHP

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                taskName: taskName,
                dueDate: dueDate,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error desconocido al enviar el correo');
        }

        const data = await response.json();
        console.log('Correo enviado exitosamente:', data);
        return data;
    } catch (error) {
        console.error('Error al enviar el correo:', error.message);
        throw error;
    }
}

export { sendEmail };