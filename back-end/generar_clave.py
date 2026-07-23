import bcrypt

clave = b"admin123"
# Generamos el hash criptográfico real
hash_real = bcrypt.hashpw(clave, bcrypt.gensalt())

print("\nCopia el siguiente hash (sin espacios extra):")
print(hash_real.decode('utf-8'))
print("\n")