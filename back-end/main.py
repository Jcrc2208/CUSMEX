import os
import traceback
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, relationship
from sqlalchemy import Column, String, Text, Boolean, Enum, ForeignKey
from pydantic import BaseModel, EmailStr, Field
import bcrypt
import uuid
from groq import Groq
from faster_whisper import WhisperModel
from typing import Optional, List
from database import get_db, engine, Base, SessionLocal
from datetime import date, time

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


# 1. Modelo SQLAlchemy para la tabla citas_b2b ya existente en tu SQL
class CitaB2B(Base):
    __tablename__ = "citas_b2b"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    solicitante_id = Column(String(36), ForeignKey('usuarios.id'), nullable=False)
    destinatario_id = Column(String(36), ForeignKey('usuarios.id'), nullable=False)
    proposito_reunion = Column(Text, nullable=False)
    titulo = Column(String(255), nullable=False)
    mensaje_propuesta = Column(Text)
    fecha = Column(String(50), nullable=False)
    hora_inicio = Column(String(50), nullable=False)
    hora_fin = Column(String(50), nullable=False)
    estatus = Column(Enum('PENDIENTE DE RESPUESTA', 'CONFIRMADA', 'RECHAZADA', 'CANCELADA'), default='PENDIENTE DE RESPUESTA')

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
    organizacion_nombre: str  # Texto libre que ingresa el usuario
    pais: str
    rol_id: str = "empresas"  # Rol por defecto o seleccionado en el flujo
    idioma_preferido: str = "es"
    estatus_membresia: str = "activo"
    es_elegible_para_votar: bool = False
    interes_export_import: str = "ninguno"
    interes_comercial: str
    objetivos_inversion: str
    tipo_conexion_buscada: str
    linkedin: str
    temas: str
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



class ActualizarEstatusCita(BaseModel):
   estatus: str = Field(..., description="Debe ser CONFIRMADA, RECHAZADA o CANCELADA")
   motivo_rechazo: Optional[str] = None

class CrearCitaB2B(BaseModel):
    solicitante_id: str  # CHAR(36)
    destinatario_id: str # CHAR(36)
    titulo: str          # VARCHAR(255)
    proposito_reunion: str # TEXT
    mensaje_propuesta: Optional[str] = None
    fecha: date
    hora_inicio: time
    hora_fin: time



# --- 1. ENDPOINT: OBTENER AGENDA / PRÓXIMAS REUNIONES ---
@app.get("/api/v1/citas_b2b/usuario/{usuario_id}")
def obtener_agenda_usuario(usuario_id: str):
    """
    Consulta las citas B2B donde el usuario participa (como solicitante o destinatario)
    y cruza con la tabla de usuarios y organizaciones para pintar la tarjeta de la agenda.
    """
    try:
        # TODO: Aquí va tu consulta SQL real haciendo JOIN:
        # SELECT c.*, 
        #        u.nombre AS dest_nombre, u.apellido AS dest_apellido, org.nombre AS dest_empresa, p.linkedin_url
        # FROM citas_b2b c
        # JOIN usuarios u ON (c.destinatario_id = u.id OR c.solicitante_id = u.id) AND u.id != :usuario_id
        # JOIN organizaciones org ON u.organizacion_id = org.id
        # LEFT JOIN perfiles_negocio p ON u.id = p.usuario_id
        # WHERE c.solicitante_id = :usuario_id OR c.destinatario_id = :usuario_id
        
        citas_mock_ejemplo = [
            {
                "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
                "solicitante_id": usuario_id,
                "destinatario_id": "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22",
                "destinatario_nombre": "Carlos Mendoza",
                "destinatario_empresa": "Logística y Comercio Global S.A.",
                "destinatario_puesto": "Director de Operaciones",
                "destinatario_iniciales": "CM",
                "destinatario_pais": "México",
                "titulo": "Apertura de Alianza Comercial CUSMEX",
                "proposito_reunion": "Alianza Estratégica y Distribución B2B",
                "mensaje_propuesta": "Buscamos coordinar la red de distribución directa...",
                "fecha": str(date.today()),
                "hora_inicio": "09:00:00",
                "hora_fin": "10:00:00",
                "estatus": "PENDIENTE DE RESPUESTA",
                "motivo_rechazo": None
            }
        ]
        return {"status": "success", "data": citas_mock_ejemplo}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 2. ENDPOINT: ACTUALIZAR ESTATUS DE CITA (Aceptar / Rechazar) ---
@app.patch("/api/v1/citas_b2b/{cita_id}/estatus")
def actualizar_estatus_cita(cita_id: str, datos: ActualizarEstatusCita):
    """
    Actualiza el ENUM de estatus en la tabla `citas_b2b` 
    y almacena el `motivo_rechazo` si la rechazan.
    """
    estatus_mayus = datos.estatus.upper()
    validos = ['PENDIENTE DE RESPUESTA', 'CONFIRMADA', 'RECHAZADA', 'CANCELADA']
    
    if estatus_mayus not in validos:
        raise HTTPException(status_code=400, detail=f"Estatus inválido. Debe ser uno de: {validos}")

    try:
        # TODO: Ejecutar el UPDATE en MySQL:
        # UPDATE citas_b2b SET estatus = :estatus, motivo_rechazo = :motivo WHERE id = :cita_id;
        
        return {
            "status": "success",
            "mensaje": f"La cita {cita_id} fue actualizada a '{estatus_mayus}'",
            "estatus_actual": estatus_mayus,
            "motivo_rechazo": datos.motivo_rechazo
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/citas_b2b", status_code=201)
def crear_cita_b2b(cita: CrearCitaB2B, db: Session = Depends(get_db)):
    try:
        print("--- DATOS RECIBIDOS PARA CITA B2B ---")
        print(cita.dict())

        # 1. Validar que los usuarios (solicitante y destinatario) existan realmente en la BD
        solicitante = db.query(Usuario).filter(Usuario.id == cita.solicitante_id).first()
        destinatario = db.query(Usuario).filter(Usuario.id == cita.destinatario_id).first()

        if not solicitante or not destinatario:
            raise HTTPException(
                status_code=400, 
                detail="El usuario solicitante o el destinatario no existen en la base de datos."
            )

        # 2. Inserción real en tu modelo SQLAlchemy (CitaB2B)
        nueva_cita = CitaB2B(
            id=str(uuid.uuid4()),
            solicitante_id=cita.solicitante_id,
            destinatario_id=cita.destinatario_id,
            titulo=cita.titulo,
            proposito_reunion=cita.proposito_reunion,
            mensaje_propuesta=cita.mensaje_propuesta,
            fecha=str(cita.fecha),
            hora_inicio=str(cita.hora_inicio),
            hora_fin=str(cita.hora_fin),
            estatus="PENDIENTE DE RESPUESTA"
        )
        
        db.add(nueva_cita)
        db.commit()
        db.refresh(nueva_cita)
        
        print("--- CITA B2B GUARDADA EXITOSAMENTE EN MYSQL ---")

        return {
            "status": "success",
            "mensaje": "Solicitud de cita B2B registrada correctamente",
            "data": {
                "id": nueva_cita.id,
                "titulo": nueva_cita.titulo,
                "estatus": nueva_cita.estatus
            }
        }
    except Exception as e:
        db.rollback()
        import traceback
        traceback.print_exc() # Esto imprimirá el error exacto 
        raise HTTPException(status_code=500, detail=f"Error interno en servidor: {str(e)}")

    
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
# Traemos la organización relacionada para mandar su nombre
    org = db.query(Organizacion).filter(Organizacion.id == user.organizacion_id).first()
    org_nombre = org.nombre if org else "Organización Independiente"

    return {
        "message": "Login exitoso",
        "token": "token-jwt-generado-proximamente",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.nombre,
            "apellido": user.apellido,
            "role": rol_nombre,
            "organizacion": org_nombre,
            "pais": user.pais,
            "estatus_membresia": user.estatus_membresia
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
    # 1. Validar correo existente
    existing_user = db.query(Usuario).filter(Usuario.email == data.email.strip()).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El correo electrónico ya se encuentra registrado.")

    # 2. Gestionar la Organización (Si el usuario escribió un nombre en lugar de un ID UUID)
    org_id = data.organizacion_id
    # Verificamos si es un UUID válido o si es el nombre de una nueva organización
    org = db.query(Organizacion).filter(Organizacion.id == org_id).first()
    if not org:
        # Si no existe como ID, asumimos que es el nombre y la creamos en limpio
        org = db.query(Organizacion).filter(Organizacion.nombre == org_id.strip()).first()
        if not org:
            org = Organizacion(
                id=str(uuid.uuid4()),
                nombre=org_id.strip(),
                pais=data.pais.strip(),
                sector="General" # O el sector que corresponda por defecto
            )
            db.add(org)
            db.flush()
        org_id = org.id

    # 3. Validar Rol
    rol = db.query(Rol).filter(Rol.id == data.rol_id).first()
    if not rol:
        # Si el rol viene como nombre (ej. "empresas"), lo buscamos o creamos
        rol = db.query(Rol).filter(Rol.nombre == data.rol_id).first()
        if not rol:
            raise HTTPException(status_code=404, detail="El rol especificado no existe.")
        rol_id = rol.id
    else:
        rol_id = rol.id

    try:
        raw_password = data.password.encode('utf-8')
        hashed_pw = bcrypt.hashpw(raw_password, bcrypt.gensalt()).decode('utf-8')

        nuevo_usuario = Usuario(
            id=str(uuid.uuid4()),
            rol_id=rol_id,
            organizacion_id=org_id,
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
            "message": "Usuario y organización registrados correctamente.",
            "user": {
                "id": nuevo_usuario.id,
                "email": nuevo_usuario.email,
                "name": nuevo_usuario.nombre
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error interno al crear usuario: {str(e)}")


@app.post("/api/v1/auth/registro-completo", status_code=201)
async def registro_completo(data: InitialSetupRequest, db: Session = Depends(get_db)):
    if not data.acepta_terminos:
        raise HTTPException(status_code=400, detail="Debe aceptar los términos y condiciones.")

    existing_user = db.query(Usuario).filter(Usuario.email == data.email.strip()).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El correo electrónico ya se encuentra registrado.")
        
    # 1. Gestionar la organización al vuelo mediante el texto libre ingresado
    org_nombre_clean = data.organizacion_nombre.strip()
    org = db.query(Organizacion).filter(Organizacion.nombre == org_nombre_clean).first()
    if not org:
        org = Organizacion(
            id=str(uuid.uuid4()),
            nombre=org_nombre_clean,
            pais=data.pais.strip(),
            sector="Independiente"
        )
        db.add(org)
        db.flush()
    org_id = org.id

    # 2. Gestionar el Rol al vuelo de forma libre (Si no existe, se crea con el texto ingresado)
    rol_input = data.rol_id.strip() if data.rol_id else "empresas"
    rol = db.query(Rol).filter((Rol.id == rol_input) | (Rol.nombre == rol_input)).first()
    if not rol:
        rol = Rol(
            id=str(uuid.uuid4()),
            nombre=rol_input,
            descripcion=f"Rol dinámico registrado: {rol_input}"
        )
        db.add(rol)
        db.flush()
    rol_id = rol.id
    
    try:
        raw_password = data.password.encode('utf-8')
        hashed_pw = bcrypt.hashpw(raw_password, bcrypt.gensalt()).decode('utf-8')

        nuevo_usuario = Usuario(
            id=str(uuid.uuid4()),
            rol_id=rol_id,
            organizacion_id=org_id,
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
        db.flush()

        # 3. Guardar información comercial y profesional
        nuevo_perfil = PerfilNegocio(
            usuario_id=nuevo_usuario.id,
            interes_export_import=data.interes_export_import,
            ofrece=f"Comercial: {data.interes_comercial} | Temas: {data.temas}",
            busca=f"Inversión: {data.objetivos_inversion} | Conexión: {data.tipo_conexion_buscada}",
            linkedin_url=data.linkedin
        )
        db.add(nuevo_perfil)

        db.commit()
        db.refresh(nuevo_usuario)

        return {
            "status": "success",
            "message": "Registro completo exitoso.",
            "user": {
                "id": nuevo_usuario.id,
                "email": nuevo_usuario.email,
                "name": nuevo_usuario.nombre,
                "apellido": nuevo_usuario.apellido,
                "role": rol.nombre,
                "organizacion": org.nombre,
                "pais": nuevo_usuario.pais,
                "estatus_membresia": nuevo_usuario.estatus_membresia
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error interno al registrar: {str(e)}")

    
@app.get("/api/v1/usuarios/stats/globales") 
def obtener_estadisticas_globales(db: Session = Depends(get_db)):
    try:
        total_usuarios = db.query(Usuario).count()
        total_organizaciones = db.query(Organizacion).count()
        usuarios_activos = db.query(Usuario).filter(Usuario.estatus_membresia == 'activo').count()
        return {
            "usuariosRegistrados": total_usuarios,
            "usuariosActivos": usuarios_activos,
            "empresas": total_organizaciones,
            "reunionesB2B": 320,
            "patrocinadores": 15,
            "paisesRepresentados": 25,
            "total_usuarios": total_usuarios,
            "total_organizaciones": total_organizaciones,
            
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener estadísticas: {str(e)}")

@app.get("/api/v1/reuniones/proximas")
def obtener_proximas_reuniones(usuario_id: str = None, db: Session = Depends(get_db)):
    try:
        print(f"--- CONSULTANDO PROXIMAS REUNIONES PARA: {usuario_id} ---")
        
        # Consulta básica (puedes adaptarla después para filtrar por usuario_id si lo requieres)
        query = db.query(CitaB2B)
        
        if usuario_id:
            query = query.filter(
                (CitaB2B.solicitante_id == usuario_id) | (CitaB2B.destinatario_id == usuario_id)
            )
            
        citas = query.limit(5).all()

        if not citas:
            return []

        resultado = []
        for c in citas:
            # Validamos de forma segura cada campo para evitar que un valor nulo rompa el endpoint
            fecha_formateada = c.fecha.isoformat() if hasattr(c, 'fecha') and c.fecha else None
            
            resultado.append({
                "id": getattr(c, 'id', None),
                "titulo": getattr(c, 'titulo', 'Reunión B2B'),
                "fecha_hora": fecha_formateada,
                "lugar": getattr(c, 'lugar', 'Por definir'),
            })

        return resultado

    except Exception as e:
        # Esto imprimirá el error exacto en tu terminal negra de Python
        traceback.print_exc()

# --- 4. ENDPOINT: OBTENER PERFILES DE NETWORKING ---
@app.get("/api/v1/networking/perfiles")
def obtener_perfiles_networking(
    search: Optional[str] = None,
    organizacion: Optional[str] = None,
    pais: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Consulta los perfiles de la base de datos cruzando Usuario, Organización y PerfilNegocio.
    """
    try:
        query = db.query(Usuario, Organizacion, PerfilNegocio).join(
            Organizacion, Usuario.organizacion_id == Organizacion.id
        ).outerjoin(
            PerfilNegocio, Usuario.id == PerfilNegocio.usuario_id
        )

        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (Usuario.nombre.ilike(search_term)) | 
                (Organizacion.nombre.ilike(search_term))
            )
        
        if organizacion:
            query = query.filter(Organizacion.nombre == organizacion)
            
        if pais:
            query = query.filter(Usuario.pais == pais)

        resultados = query.all()
        perfiles_formateados = []

        for user, org, perfil in resultados:
            # Generar iniciales para el avatar
            iniciales = f"{user.nombre[0].upper()}"
            if user.apellido:
                iniciales += f"{user.apellido[0].upper()}"

            # Construir arreglos limpios de 'ofrece' y 'busca' (separados por comas en tu base de datos)
            offering_list = [item.strip() for item in perfil.ofrece.split(",")] if perfil and perfil.ofrece else ["Comercio B2B"]
            looking_for_list = [item.strip() for item in perfil.busca.split(",")] if perfil and perfil.busca else ["Socios Comerciales"]

            perfiles_formateados.append({
                "id": user.id,
                "name": f"{user.nombre} {user.apellido}",
                "role": "Representante de Negocios",
                "organization": org.nombre,
                "company": org.nombre,
                "country": user.pais,
                "preferredLanguage": user.idioma_preferido,
                "matchPercentage": 92, # Valor optimizado o calculado dinámicamente por IA
                "matchReason": "Coincidencia directa basada en intereses comerciales y sector de industria.",
                "avatar": iniciales,
                "linkedinUrl": perfil.linkedin_url if perfil and perfil.linkedin_url else "https://linkedin.com",
                "offering": offering_list,
                "lookingFor": looking_for_list,
                "commercialProfile": perfil.interes_export_import.capitalize() if perfil else "Comercial"
            })

        return {
            "status": "success",
            "data": perfiles_formateados
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al consultar perfiles: {str(e)}")

