# schemas/pydantic_schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date, time

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
    rol_id: str = "empresas"
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
    estatus_cita: Optional[str] = None
    estatus: Optional[str] = Field(None, description="Debe ser CONFIRMADA, RECHAZADA o CANCELADA")
    motivo_rechazo: Optional[str] = ""

class CrearCitaB2B(BaseModel):
    solicitante_id: str
    destinatario_id: str
    titulo: str
    proposito_reunion: str
    mensaje_propuesta: Optional[str] = None
    fecha: date
    hora_inicio: time
    hora_fin: time