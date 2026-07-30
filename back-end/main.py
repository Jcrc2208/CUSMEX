import os
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, relationship
from sqlalchemy import Column, String, Text, Boolean, Enum, ForeignKey
from pydantic import BaseModel, EmailStr
import bcrypt
import uuid
from groq import Groq
from faster_whisper import WhisperModel
from typing import List
from database import get_db, engine, Base, SessionLocal

# 1. Modelos de Base de Datos ajustados al esquema Nexusv2 de MySQL
class Rol(Base):
    __tablename__ = "roles"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre = Column(String(100), unique=True, nullable=False)
    descripcion = Column(Text)
    
    usuarios = relationship("Usuario", back_populates="rol")

class Organizacion(Base):
    __tablename__ = "organizaciones"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre = Column(String(255), nullable=False)
    pais = Column(String(100), nullable=False)
    sector = Column(String(150))
    descripcion = Column(Text)
    
    usuarios = relationship("Usuario", back_populates="organizacion")

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    rol_id = Column(String(36), ForeignKey('roles.id'), nullable=False)
    organizacion_id = Column(String(36), ForeignKey('organizaciones.id'), nullable=False)
    es_elegible_para_votar = Column(Boolean, default=False)
    estatus_membresia = Column(Enum('activo', 'inactivo', 'pendiente'), default='activo')
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    pais = Column(String(100), nullable=False)
    idioma_preferido = Column(Enum('es', 'en', 'fr'), default='es')

    rol = relationship("Rol", back_populates="usuarios")
    organizacion = relationship("Organizacion", back_populates="usuarios")
    perfil_negocio = relationship("PerfilNegocio", back_populates="usuario", uselist=False, cascade="all, delete")

class PerfilNegocio(Base):
    __tablename__ = "perfiles_negocio"
    usuario_id = Column(String(36), ForeignKey('usuarios.id', ondelete='CASCADE'), primary_key=True)
    interes_export_import = Column(Enum('exportador', 'importador', 'ambos', 'ninguno'), nullable=False, default='ninguno')
    ofrece = Column(Text)
    busca = Column(Text)
    linkedin_url = Column(String(500))

    usuario = relationship("Usuario", back_populates="perfil_negocio")

app = FastAPI(title="CUSMEX API - Nexusv2")

# Inicialización Faster Whisper
model_size = "base"
Whisper_Model = WhisperModel(model_size, device="cpu", compute_type="int8")

# 2. Configuración CORS para comunicación con React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración cliente Groq (IA)
client = Groq(api_key="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")

# 4. Esquemas Pydantic actualizados
class LoginRequest(BaseModel):
    email: str
    password: str
    accessRole: str = "empresas"
    language: str = "es"

class ChatRequest(BaseModel):
    prompt: str
    uploaded_by: str = "Usuario"
    item_content: str = ""

class InitialSetupRequest(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    password: str
    organizacion_nombre: str
    pais: str
    interes_comercial: List[str]
    objetivos_inversion: List[str]
    tipos_conexion: List[str]
    comites_participantes: List[str]
    acepta_terminos: bool

class AdminCreateUserRequest(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    password: str
    pais: str
    rol_id: str
    organizacion_id: str
    idioma_preferido: str = "es"
    estatus_membresia: str = "activo"
    es_elegible_para_votar: bool = False

    
@app.post("/api/v1/auth/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    print("--- INTENTO DE LOGIN ---")
    print("Email recibido:", request.email)
    print("Password recibido:", request.password)

    user = db.query(Usuario).filter(Usuario.email == request.email.strip()).first()
    
    if not user:
        print("ERROR: El usuario NO existe en la base de datos con ese correo.")
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    print("Usuario encontrado en BD:", user.email)
    print("Hash en BD:", user.password_hash)

    password_bytes = request.password.encode('utf-8')
    hash_bytes = user.password_hash.encode('utf-8')
    
    match = bcrypt.checkpw(password_bytes, hash_bytes)
    print("¿La contraseña coincide?:", match)

    if not match:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    print("Buscando rol con ID:", user.rol_id)
    try:
        rol = db.query(Rol).filter(Rol.id == user.rol_id).first()
        if not rol:
            raise HTTPException(status_code=500, detail="El usuario no tiene un rol válido asignado")
        
        rol_nombre = rol.nombre
        print("Rol asignado:", rol_nombre)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

    return {
        "message": "Login exitoso",
        "token": "token-jwt-generado-proximamente",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.nombre,
            "role": rol_nombre
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
            "2. Mantén las respuestas cortas (máximo 3-4 líneas) y en un tono natural."
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
        raise HTTPException(status_code=500, detail=str(e))

# 9. Endpoint de Onboarding Inicial conectado a MySQL
@app.post("/api/v1/setup/initial-onboarding", status_code=201)
async def initial_onboarding(data: InitialSetupRequest, db: Session = Depends(get_db)):
    if not data.acepta_terminos:
        raise HTTPException(status_code=400, detail="Debe aceptar los términos y condiciones.")

    existing_user = db.query(Usuario).filter(Usuario.email == data.email.strip()).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El correo electrónico ya se encuentra registrado.")

    try:
        rol_empresa = db.query(Rol).filter(Rol.nombre == "empresas").first()
        if not rol_empresa:
            rol_empresa = Rol(id=str(uuid.uuid4()), nombre="empresas", descripcion="Rol estándar para empresas")
            db.add(rol_empresa)
            db.flush()

        nueva_org = Organizacion(
            id=str(uuid.uuid4()),
            nombre=data.organizacion_nombre.strip(),
            pais=data.pais.strip()
        )
        db.add(nueva_org)
        db.flush()

        raw_password = data.password.encode('utf-8')
        hashed_pw = bcrypt.hashpw(raw_password, bcrypt.gensalt()).decode('utf-8')

        nuevo_usuario = Usuario(
            id=str(uuid.uuid4()),
            rol_id=rol_empresa.id,
            organizacion_id=nueva_org.id,
            nombre=data.nombre.strip(),
            apellido="Registro",
            email=data.email.strip(),
            password_hash=hashed_pw,
            pais=data.pais.strip(),
            estatus_membresia="activo"
        )
        db.add(nuevo_usuario)
        db.flush()

        nuevo_perfil = PerfilNegocio(
            usuario_id=nuevo_usuario.id,
            ofrece=",".join(data.interes_comercial),
            busca=",".join(data.objetivos_inversion)
        )
        db.add(nuevo_perfil)

        db.commit()
        db.refresh(nuevo_usuario)

        return {
            "status": "success",
            "message": "Configuración inicial completada con éxito.",
            "user": {
                "id": nuevo_usuario.id,
                "email": nuevo_usuario.email,
                "name": nuevo_usuario.nombre
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

# 10. Endpoint de Asistente de Voz
@app.post("/api/voice-assistant")
async def voice_assistant(file: UploadFile = File(...), language: str = Form(...)):
    audio_path = f"temp_{file.filename}"
    try:
        with open(audio_path, "wb") as buffer:
            buffer.write(await file.read())

        segments, _ = Whisper_Model.transcribe(audio_path, beam_size=5)
        user_text = " ".join([segment.text for segment in segments])

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": user_text}],
            temperature=0.5,
        )
        
        return {"userText": user_text, "aiText": completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(audio_path):
            os.remove(audio_path)

# ==========================================
# 11. ENDPOINTS DE ADMINISTRACIÓN (Alta y Baja)
# ==========================================

@app.post("/api/v1/admin/usuarios", status_code=201)
async def admin_crear_usuario(data: AdminCreateUserRequest, db: Session = Depends(get_db)):
    existing_user = db.query(Usuario).filter(Usuario.email == data.email.strip()).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El correo electrónico ya se encuentra registrado.")

    rol = db.query(Rol).filter(Rol.id == data.rol_id).first()
    if not rol:
        raise HTTPException(status_code=404, detail="El rol especificado no existe.")

    org = db.query(Organizacion).filter(Organizacion.id == data.organizacion_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="La organización especificada no existe.")

    try:
        raw_password = data.password.encode('utf-8')
        hashed_pw = bcrypt.hashpw(raw_password, bcrypt.gensalt()).decode('utf-8')

        nuevo_usuario = Usuario(
            id=str(uuid.uuid4()),
            rol_id=data.rol_id,
            organizacion_id=data.organizacion_id,
            nombre=data.nombre.strip(),
            apellido=data.apellido.strip(),
            email=data.email.strip(),
            password_hash=hashed_pw,
            pais=data.pais.strip(),
            idioma_preferido=data.idioma_preferido,
            estatus_membresia=data.estatus_membresia,
            es_elegible_para_votar=data.es_elegible_para_votar
        )
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)

        return {
            "status": "success",
            "message": "Usuario creado correctamente por el administrador.",
            "user": {
                "id": nuevo_usuario.id,
                "email": nuevo_usuario.email,
                "name": nuevo_usuario.nombre
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error interno al crear usuario: {str(e)}")

@app.delete("/api/v1/admin/usuarios/{usuario_id}")
async def admin_eliminar_usuario(usuario_id: str, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    try:
        db.delete(user)
        db.commit()
        return {
            "status": "success",
            "message": f"Usuario con ID {usuario_id} eliminado correctamente."
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar el usuario: {str(e)}")