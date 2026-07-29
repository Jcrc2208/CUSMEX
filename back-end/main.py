import os
# Desactiva el warning de symlinks de Hugging Face en Windows
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, relationship
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from pydantic import BaseModel, EmailStr
import bcrypt
from groq import Groq
from faster_whisper import WhisperModel
from typing import List

from database import get_db, engine, Base, SessionLocal




# 1. Definición de Modelos de Base de Datos
class Organizacion(Base):
    __tablename__ = "organizaciones"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(250), unique=True, index=True, nullable=False)
    pais = Column(String(100), nullable=False)
    
    perfil_negocio = relationship("PerfilNegocio", back_populates="organizacion", uselist=False)



class PerfilNegocio(Base):
    __tablename__ = "perfiles_negocio"
    id = Column(Integer, primary_key=True, index=True)
    organizacion_id = Column(Integer, ForeignKey("organizaciones.id"), nullable=False)
    interes_comercial = Column(Text, nullable=False)
    objetivos_inversion = Column(Text, nullable=False)
    tipos_conexion = Column(Text, nullable=False)
    comites = Column(Text, nullable=False)

    organizacion = relationship("Organizacion", back_populates="perfil_negocio")




class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    correo = Column(String(250), unique=True, index=True, nullable=False)
    contraseña = Column(String(250), nullable=False)
    Rol = Column(String(50), nullable=False)

# Crear las tablas automáticamente en la BD SQLite si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CUSMEX API")

# Inicialización del modelo Faster Whisper (Local y gratis)
model_size = "base"
Whisper_Model = WhisperModel(model_size, device="cpu", compute_type="int8")



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
        raw_password = "admin123".encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(raw_password, salt).decode('utf-8')

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

init_db()




# CONFIGURACIÓN DEL CLIENTE GROQ (IA)
client = Groq(api_key="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")


# 4. Esquemas Pydantic
class LoginRequest(BaseModel):
    email: str
    password: str
    accessRole: str
    language: str

class ChatRequest(BaseModel):
    prompt: str
    uploaded_by: str = "Usuario"
    item_content: str = ""

class ForgotPasswordSchema(BaseModel):
    email: EmailStr

class ActivateAccountSchema(BaseModel):
    token: str
    email: str
    new_password: str

class InitialSetupRequest(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    organizacion_nombre: str
    pais: str
    interes_comercial: List[str]
    objetivos_inversion: List[str]
    tipos_conexion: List[str]
    comites_participantes: List[str]
    acepta_terminos: bool



# Simulación temporal de base de datos de invitaciones
INVITATIONS_DB = {
    "TOKEN-SECRETO-123": {
        "email": "carlos.perez@example.com",
        "used": False
    }
}

ROLE_EQUIVALENCES = {
    "administrador": ["admin", "administrador"],
    "admin": ["admin", "administrador"]
}



# 5. Endpoint de Login
@app.post("/api/v1/auth/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    db_user = db.query(Usuario).filter(Usuario.correo == request.email.strip()).first()
    
    if not db_user:
        raise HTTPException(status_code=401, detail="Correo, contraseña o rol incorrectos")

    role_frontend = request.accessRole.strip().lower()
    role_bd = db_user.Rol.strip().lower()
    valid_roles = ROLE_EQUIVALENCES.get(role_frontend, [role_frontend])

    if role_bd not in valid_roles:
        raise HTTPException(status_code=401, detail="Correo, contraseña o rol incorrectos")
        
    password_bytes = request.password.encode('utf-8')
    hash_bytes = db_user.contraseña.encode('utf-8')
    
    if not bcrypt.checkpw(password_bytes, hash_bytes):
        raise HTTPException(status_code=401, detail="Correo, contraseña o rol incorrectos")
    
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



# 7. Endpoint de Recuperación de Contraseña
@app.post("/api/v1/auth/forgot-password")
async def forgot_password(data: ForgotPasswordSchema, db: Session = Depends(get_db)):
    db_user = db.query(Usuario).filter(Usuario.correo == data.email.strip()).first()
    
    if db_user:
        pass

    return {"message": "Si el correo está registrado, se han enviado las instrucciones."}



# 8. Endpoint de Activación de Cuenta por Token de Un Solo Uso
@app.post("/api/v1/auth/activate-account")
async def activate_account(data: ActivateAccountSchema, db: Session = Depends(get_db)):
    invitation = INVITATIONS_DB.get(data.token)
    
    if not invitation:
        raise HTTPException(status_code=400, detail="El token de invitación no es válido.")
    
    if invitation["used"]:
        raise HTTPException(status_code=400, detail="Este token ya fue utilizado anteriormente.")
    
    if invitation["email"] != data.email:
        raise HTTPException(status_code=400, detail="El correo no coincide con la invitación.")
    
    db_user = db.query(Usuario).filter(Usuario.correo == data.email.strip()).first()
    
    raw_password = data.new_password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_pw = bcrypt.hashpw(raw_password, salt).decode('utf-8')

    if db_user:
        db_user.contraseña = hashed_pw
    else:
        nuevo_usuario = Usuario(
            correo=data.email.strip(),
            contraseña=hashed_pw,
            Rol="empresas"
        )
        db.add(nuevo_usuario)
    
    db.commit()
    invitation["used"] = True
    
    return {
        "status": "success",
        "message": "¡Cuenta habilitada con éxito! Ya puedes iniciar sesión de forma privada."
    }



# 9. Endpoint de Configuración Inicial y Registro Onboarding
@app.post("/api/v1/setup/initial-onboarding", status_code=201)
async def initial_onboarding(data: InitialSetupRequest, db: Session = Depends(get_db)):
    if not data.acepta_terminos:
        raise HTTPException(
            status_code=400,
            detail="Debe aceptar los términos y condiciones para completar la configuración."
        )

    existing_user = db.query(Usuario).filter(Usuario.correo == data.email.strip()).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="El correo electrónico ya se encuentra registrado en el sistema."
        )

    existing_org = db.query(Organizacion).filter(Organizacion.nombre == data.organizacion_nombre.strip()).first()
    if existing_org:
        raise HTTPException(
            status_code=400,
            detail="La organización ya se encuentra dada de alta."
        )

    try:
        nueva_org = Organizacion(
            nombre=data.organizacion_nombre.strip(),
            pais=data.pais.strip()
        )
        db.add(nueva_org)
        db.flush()

        nuevo_perfil = PerfilNegocio(
            organizacion_id=nueva_org.id,
            interes_comercial=",".join(data.interes_comercial),
            objetivos_inversion=",".join(data.objetivos_inversion),
            tipos_conexion=",".join(data.tipos_conexion),
            comites=",".join(data.comites_participantes)
        )
        db.add(nuevo_perfil)

        raw_password = data.password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(raw_password, salt).decode('utf-8')

        nuevo_usuario = Usuario(
            correo=data.email.strip(),
            contraseña=hashed_pw,
            Rol="empresas"
        )
        db.add(nuevo_usuario)

        db.commit()
        db.refresh(nuevo_usuario)

        return {
            "status": "success",
            "message": "Configuración inicial y registro completados con éxito.",
            "token": "token-jwt-inicial-generado",
            "user": {
                "id": nuevo_usuario.id,
                "email": nuevo_usuario.correo,
                "role": nuevo_usuario.Rol
            }
        }

    except Exception as e:
        db.rollback()
        print("Error en el registro inicial:", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Error interno al procesar la configuración inicial: {str(e)}"
        )



# 10. Endpoint de Asistente de Voz (Faster Whisper local + Groq LLM)
@app.post("/api/voice-assistant")
async def voice_assistant(file: UploadFile = File(...), language: str = Form(...)):
    audio_path = f"temp_{file.filename}"
    try:
        with open(audio_path, "wb") as buffer:
            buffer.write(await file.read())

        segments, info = Whisper_Model.transcribe(audio_path, beam_size=5)
        user_text = " ".join([segment.text for segment in segments])

        system_instruction = (
            "Eres el asistente personal de CUSMEX. "
            "REGLAS ESTRICTAS:\n"
            "1. Cero rodeos y cero introducciones largas. Ve directo al grano.\n"
            "2. Si el usuario responde con un 'sí', 'claro' o una afirmación corta a tu pregunta anterior, NO vuelvas a preguntar lo mismo; asume de inmediato la acción y muestra la información o los eventos de hoy.\n"
            "3. Mantén las respuestas cortas (máximo 3-4 líneas) y en un tono natural y servicial."
        )

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": user_text}
            ],
            temperature=0.5,
        )
        
        ai_response_text = completion.choices[0].message.content

        return {
            "userText": user_text,
            "aiText": ai_response_text,
        }

    except Exception as e:
        print("Error en el asistente de voz:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
        
    finally:
        if os.path.exists(audio_path):
            os.remove(audio_path)