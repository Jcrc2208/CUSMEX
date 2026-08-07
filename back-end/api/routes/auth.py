# api/routes/auth.py
import uuid
import bcrypt
import traceback
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.orm_models import Usuario, Rol, Organizacion, PerfilNegocio
from schemas.pydantic_schemas import LoginRequest, InitialSetupRequest
from services.auth_service import crear_token_acceso, verificar_token_acceso


router = APIRouter(prefix="/api/v1", tags=["Autenticación y Registro"])

@router.post("/auth/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.email == request.email.strip()).first()
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    if not bcrypt.checkpw(request.password.encode('utf-8'), user.password_hash.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    try:
        rol = db.query(Rol).filter(Rol.id == user.rol_id).first()
        rol_nombre = rol.nombre if rol else "empresas"
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

    org = db.query(Organizacion).filter(Organizacion.id == user.organizacion_id).first()
    org_nombre = org.nombre if org else "Organización Independiente"

    return {
        "message": "Login exitoso",
        "token": crear_token_acceso(data={"sub": user.id}),
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

@router.post("/setup/initial-onboarding", status_code=201)
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

        hashed_pw = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

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
            ofrece=str(data.interes_comercial),
            busca=str(data.objetivos_inversion)
        )
        db.add(nuevo_perfil)
        db.commit()
        db.refresh(nuevo_usuario)

        return {
            "status": "success",
            "message": "Configuración inicial completada con éxito.",
            "user": {"id": nuevo_usuario.id, "email": nuevo_usuario.email, "name": nuevo_usuario.nombre}
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

@router.post("/auth/registro-completo", status_code=201)
async def registro_completo(data: InitialSetupRequest, db: Session = Depends(get_db)):
    if not data.acepta_terminos:
        raise HTTPException(status_code=400, detail="Debe aceptar los términos y condiciones.")

    existing_user = db.query(Usuario).filter(Usuario.email == data.email.strip()).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El correo electrónico ya se encuentra registrado.")
        
    org = db.query(Organizacion).filter(Organizacion.nombre == data.organizacion_nombre.strip()).first()
    if not org:
        org = Organizacion(id=str(uuid.uuid4()), nombre=data.organizacion_nombre.strip(), pais=data.pais.strip(), sector="Independiente")
        db.add(org)
        db.flush()

    rol_input = data.rol_id.strip() if data.rol_id else "empresas"
    rol = db.query(Rol).filter((Rol.id == rol_input) | (Rol.nombre == rol_input)).first()
    if not rol:
        rol = Rol(id=str(uuid.uuid4()), nombre=rol_input, descripcion=f"Rol dinámico: {rol_input}")
        db.add(rol)
        db.flush()
    
    try:
        hashed_pw = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        nuevo_usuario = Usuario(
            id=str(uuid.uuid4()),
            rol_id=rol.id,
            organizacion_id=org.id,
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
                "id": nuevo_usuario.id, "email": nuevo_usuario.email, "name": nuevo_usuario.nombre,
                "apellido": nuevo_usuario.apellido, "role": rol.nombre, "organizacion": org.nombre,
                "pais": nuevo_usuario.pais, "estatus_membresia": nuevo_usuario.estatus_membresia
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error interno al registrar: {str(e)}")