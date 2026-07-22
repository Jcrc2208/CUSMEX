from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String
from pydantic import BaseModel
import bcrypt  # <-- Importamos la librería moderna directamente

from database import get_db, engine, Base

# 1. Definición del Modelo 
class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    correo = Column(String(250), unique=True, index=True, nullable=False)
    contraseña = Column(String(250), nullable=False)
    Rol = Column(String(50), nullable=False)

app = FastAPI(title="CUSMEX API")

# 2. Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Esquema de datos que envía el Frontend
class LoginRequest(BaseModel):
    email: str
    password: str
    accessRole: str
    language: str

# 4. Endpoint de Login conectado a MariaDB/MySQL
@app.post("/api/v1/auth/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    
    # A. Buscar al usuario en la base de datos
    db_user = db.query(Usuario).filter(
        Usuario.correo == request.email, 
        Usuario.Rol == request.accessRole
    ).first()
    
    # B. Validar si el usuario no existe
    if not db_user:
        raise HTTPException(status_code=401, detail="Correo, contraseña o rol incorrectos")
        
    # C. Verificar contraseña con bcrypt
    # bcrypt requiere que los textos sean convertidos a "bytes" (encode utf-8) antes de comparar
    password_bytes = request.password.encode('utf-8')
    hash_bytes = db_user.contraseña.encode('utf-8')
    
    if not bcrypt.checkpw(password_bytes, hash_bytes):
        raise HTTPException(status_code=401, detail="Correo, contraseña o rol incorrectos")
    
    # D. Si todo es correcto, permitimos el acceso
    return {
        "message": "Login exitoso",
        "token": "token-jwt-generado-proximamente",
        "user": {
            "id": db_user.id,
            "email": db_user.correo,
            "role": db_user.Rol
        }
    }