from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String
from pydantic import BaseModel
import bcrypt

from database import get_db, engine, Base

# 1. Definición del Modelo
class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    correo = Column(String(250), unique=True, index=True, nullable=False)
    contraseña = Column(String(250), nullable=False)
    Rol = Column(String(50), nullable=False)

# Crear las tablas automáticamente en la BD SQLite si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CUSMEX API")

# 2. Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Sembrado inicial de datos (Poblado automático)
def init_db():
    db = SessionLocal()
    try:
        usuario_existente = db.query(Usuario).filter(Usuario.correo == "admin@natp.org").first()
        if not usuario_existente:
            # Generar hash de contraseña seguro en tiempo de ejecución
            raw_password = "admin123".encode('utf-8')
            salt = bcrypt.gensalt()
            hashed_pw = bcrypt.hashpw(raw_password, salt).decode('utf-8')

            # Insertar usuario admin inicial
            nuevo_admin = Usuario(
                correo="admin@natp.org",
                contraseña=hashed_pw,
                Rol="Administrador"
            )
            db.add(nuevo_admin)
            db.commit()
            print("--> Usuario 'admin@natp.org' creado exitosamente en SQLite.")
    finally:
        db.close()

from database import SessionLocal
init_db()

# 4. Esquemas Pydantic
class LoginRequest(BaseModel):
    email: str
    password: str
    accessRole: str
    language: str

ROLE_EQUIVALENCES = {
    "administrador": ["admin", "administrador"],
    "admin": ["admin", "administrador"]
}

# 5. Endpoint de Login
@app.post("/api/v1/auth/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    
    # A. Buscar al usuario únicamente por su correo
    db_user = db.query(Usuario).filter(Usuario.correo == request.email.strip()).first()
    
    if not db_user:
        raise HTTPException(status_code=401, detail="Correo, contraseña o rol incorrectos")

    # B. Validar equivalencia de roles
    role_frontend = request.accessRole.strip().lower()
    role_bd = db_user.Rol.strip().lower()
    valid_roles = ROLE_EQUIVALENCES.get(role_frontend, [role_frontend])

    if role_bd not in valid_roles:
        raise HTTPException(status_code=401, detail="Correo, contraseña o rol incorrectos")
        
    # C. Verificar contraseña con bcrypt
    password_bytes = request.password.encode('utf-8')
    hash_bytes = db_user.contraseña.encode('utf-8')
    
    if not bcrypt.checkpw(password_bytes, hash_bytes):
        raise HTTPException(status_code=401, detail="Correo, contraseña o rol incorrectos")
    
    # D. Respuesta Exitosa
    return {
        "message": "Login exitoso",
        "token": "token-jwt-generado-proximamente",
        "user": {
            "id": db_user.id,
            "email": db_user.correo,
            "role": db_user.Rol
        }
    }