from pydantic import BaseModel, EmailStr
from typing import List, Optional

class InitialSetupRequest(BaseModel):
    # Datos de Usuario
    nombre: str
    email: EmailStr
    password: str
    
    # Organización
    organizacion_nombre: str
    pais: str
    
    # Perfil Comercial
    interes_comercial: List[str]
    objetivos_inversion: List[str]
    tipos_conexion: List[str]
    
    # Comités y Términos
    comites_participantes: List[str]
    acepta_terminos: bool