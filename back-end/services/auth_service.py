def authenticate_user(email, password):
    # Simulación de consulta a base de datos
    # En producción: NO guardes contraseñas en texto plano (usa passlib)
    if email == "user@example.com" and password == "password123":
        return True
    return False

def generate_token(email):
    # Simulación de generación de token JWT
    # En producción: usa una librería como PyJWT para generar tokens seguros
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  # Aquí iría tu JWT real