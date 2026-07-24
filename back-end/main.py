from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String
from pydantic import BaseModel
import bcrypt
from groq import Groq 

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
        # Generamos el hash una sola vez para optimizar
        raw_password = "admin123".encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(raw_password, salt).decode('utf-8')

        # Lista de usuarios de prueba (Roles exactos que manda React)
        usuarios_prueba = [
            {"correo": "admin@natp.org", "rol": "admin"},
            {"correo": "empresa@dominio.com", "rol": "empresas"},
            {"correo": "gobierno@natp.org", "rol": "gobierno"},
            {"correo": "patrocinador@natp.org", "rol": "patrocinador"},
        ]

        for user_data in usuarios_prueba:
            usuario_existente = db.query(Usuario).filter(Usuario.correo == user_data["correo"]).first()
            if not usuario_existente:
                nuevo_usuario = Usuario(
                    correo=user_data["correo"],
                    contraseña=hashed_pw,
                    Rol=user_data["rol"]
                )
                db.add(nuevo_usuario)
                print(f"--> Usuario '{user_data['correo']}' (Rol: {user_data['rol']}) creado exitosamente.")
        
        db.commit()
    finally:
        db.close()

from database import SessionLocal
init_db()

# CONFIGURACIÓN DEL CLIENTE GROQ (IA)
client = Groq(api_key=("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"))

# 4. Esquemas Pydantic
class LoginRequest(BaseModel):
    email: str
    password: str
    accessRole: str
    language: str

class ChatRequest(BaseModel):
    prompt: str
    uploaded_by: str = "Usuario"  # Quién subió el evento/archivo
    item_content: str = ""        # Qué fue lo que subió

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

# 6. Endpoint de Chat con IA (Groq)
@app.post("/api/chat")
async def chat_with_ai(data: ChatRequest):
    try:
        system_instruction = (
            "Eres el asistente personal de CUSMEX. "
            "REGLAS ESTRICTAS:\n"
            "1. Cero rodeos y cero introducciones largas. Ve directo al grano.\n"
            "2. Si el usuario responde con un 'sí', 'claro' o una afirmación corta a tu pregunta anterior, NO vuelvas a preguntar lo mismo; asume de inmediato la acción y muestra la información o los eventos de hoy.\n"
            "3. Mantén las respuestas cortas (máximo 3-4 líneas) y en un tono natural y servicial."
        )

        user_message = f"Usuario: {data.uploaded_by}\nContenido subido: {data.item_content}\nComentario adicional: {data.prompt}"

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": user_message}
            ],
            temperature=0.5,
        )
        return {"response": completion.choices[0].message.content}
        
    except Exception as e:
        print("Error en el cliente de Groq:", str(e))
        raise HTTPException(status_code=500, detail=str(e))