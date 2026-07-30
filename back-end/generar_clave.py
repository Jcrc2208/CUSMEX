import bcrypt

# Genera el hash real y válido para la contraseña '123456'
password = "123456".encode('utf-8')
hashed = bcrypt.hashpw(password, bcrypt.gensalt()).decode('utf-8')
print("Copia este hash:", hashed)