# api/routes/networking.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from models.orm_models import Usuario, Organizacion, PerfilNegocio

router = APIRouter(prefix="/api/v1", tags=["Networking y Perfiles"])

@router.get("/networking/perfiles")
def obtener_perfiles_networking(
    search: Optional[str] = None,
    organizacion: Optional[str] = None,
    pais: Optional[str] = None,
    db: Session = Depends(get_db)
):
    try:
        query = db.query(Usuario, Organizacion, PerfilNegocio).join(
            Organizacion, Usuario.organizacion_id == Organizacion.id
        ).outerjoin(
            PerfilNegocio, Usuario.id == PerfilNegocio.usuario_id
        )

        if search:
            term = f"%{search}%"
            query = query.filter((Usuario.nombre.ilike(term)) | (Organizacion.nombre.ilike(term)))
        if organizacion:
            query = query.filter(Organizacion.nombre == organizacion)
        if pais:
            query = query.filter(Usuario.pais == pais)

        resultados = query.all()
        perfiles_formateados = []

        for user, org, perfil in resultados:
            iniciales = f"{user.nombre[0].upper()}{user.apellido[0].upper() if user.apellido else ''}"
            offering_list = [i.strip() for i in perfil.ofrece.split(",")] if perfil and perfil.ofrece else ["Comercio B2B"]
            looking_for_list = [i.strip() for i in perfil.busca.split(",")] if perfil and perfil.busca else ["Socios"]

            perfiles_formateados.append({
                "id": user.id, "name": f"{user.nombre} {user.apellido}", "role": "Representante de Negocios",
                "organization": org.nombre, "company": org.nombre, "country": user.pais,
                "preferredLanguage": user.idioma_preferido, "matchPercentage": 92,
                "matchReason": "Coincidencia directa basada en intereses comerciales.",
                "avatar": iniciales, "linkedinUrl": perfil.linkedin_url if perfil and perfil.linkedin_url else "https://linkedin.com",
                "offering": offering_list, "lookingFor": looking_for_list,
                "commercialProfile": perfil.interes_export_import.capitalize() if perfil else "Comercial"
            })

        return {"status": "success", "data": perfiles_formateados}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al consultar perfiles: {str(e)}")