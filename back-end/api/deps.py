# api/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from services.auth_service import verificar_token_acceso
from models.orm_models import Usuario

security = HTTPBearer()

def obtener_usuario_actual(
    credentials: HTTPAuthorizationCredentials = Depends(security), 
    db: Session = Depends(get_db)
) -> Usuario:
    """
    Intercepta el header 'Authorization: Bearer <token>', 
    valida el JWT, extrae el ID del usuario y lo busca en la base de datos.
    """
    token = credentials.credentials
    user_id = verificar_token_acceso(token)
    
    # Buscamos al usuario real en la base de datos
    user = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="El usuario asociado al token ya no existe"
        )
    
    return user # Devolvemos el objeto usuario completo listo para usarse