# api/routes/admin.py
import uuid
import bcrypt
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.orm_models import Usuario, Rol, Organizacion
from schemas.pydantic_schemas import AdminCreateUserRequest

router = APIRouter(prefix="/api/v1", tags=["Administración y Estadísticas"])

@router.post("/admin/usuarios", status_code=201)
async def admin_crear_usuario(data: AdminCreateUserRequest, db: Session = Depends(get_db)):
    if db.query(Usuario).filter(Usuario.email == data.email.strip()).first():
        raise HTTPException(status_code=400, detail="El correo electrónico ya se encuentra registrado.")

    org = db.query(Organizacion).filter(Organizacion.id == data.organizacion_id).first()
    if not org:
        org = db.query(Organizacion).filter(Organizacion.nombre == data.organizacion_id.strip()).first()
        if not org:
            org = Organizacion(id=str(uuid.uuid4()), nombre=data.organizacion_id.strip(), pais=data.pais.strip(), sector="General")
            db.add(org)
            db.flush()

    rol = db.query(Rol).filter(Rol.id == data.rol_id).first()
    if not rol:
        rol = db.query(Rol).filter(Rol.nombre == data.rol_id).first()
        if not rol:
            raise HTTPException(status_code=404, detail="El rol especificado no existe.")

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
        db.commit()
        db.refresh(nuevo_usuario)

        return {
            "status": "success",
            "message": "Usuario y organización registrados correctamente.",
            "user": {"id": nuevo_usuario.id, "email": nuevo_usuario.email, "name": nuevo_usuario.nombre}
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

@router.get("/usuarios/stats/globales")
def obtener_estadisticas_globales(db: Session = Depends(get_db)):
    try:
        total_usuarios = db.query(Usuario).count()
        total_organizaciones = db.query(Organizacion).count()
        usuarios_activos = db.query(Usuario).filter(Usuario.estatus_membresia == 'activo').count()
        return {
            "usuariosRegistrados": total_usuarios, "usuariosActivos": usuarios_activos,
            "empresas": total_organizaciones, "reunionesB2B": 320, "patrocinadores": 15,
            "paisesRepresentados": 25, "total_usuarios": total_usuarios, "total_organizaciones": total_organizaciones
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener estadísticas: {str(e)}")