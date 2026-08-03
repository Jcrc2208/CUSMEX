import qrcode


# Simulamos el registro que después saldrá de SQLite
def simular_registro_db():
    # Datos de prueba ingresados por ti
    registro_simulado = {
        "id": 1042,
        "nombre": "Juan Carlos Andres De La Cruz",
        "puesto": "Ingeniero en Software Jr.",
        "email": "jcrc2208@gmail.com",
    }
    return registro_simulado


def generar_qr_desde_datos(datos: dict):
    # Convertimos el diccionario a un formato de texto estructurado para el QR
    # (Puedes concatenar los campos o usar formato JSON/texto plano)
    contenido_qr = f"ID: {datos['id']}\nNombre: {datos['nombre']}\npuesto: {datos['puesto']}\nEmail: {datos['email']}"

    # Configuramos el objeto QR
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4,
    )

    qr.add_data(contenido_qr)
    qr.make(fit=True)

    # Creamos la imagen y la guardamos
    img = qr.make_image(fill_color="black", back_color="white")
    nombre_archivo = f"qr_usuario_{datos['id']}.png"
    img.save(nombre_archivo)

    print(f"¡Código QR generado, Guardado como: {nombre_archivo}")


if __name__ == "__main__":
    # 1. Obtenemos los datos simulados
    datos_usuario = simular_registro_db()

    # 2. Generamos el código QR con esos datos
    generar_qr_desde_datos(datos_usuario)