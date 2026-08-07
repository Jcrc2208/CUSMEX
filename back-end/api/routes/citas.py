# api/routes/citas.py
import uuid
import traceback
from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.orm_models import CitaB2B, Usuario, Organizacion, Rol
from schemas.pydantic_schemas import CrearCitaB2B, ActualizarEstatusCita

router = APIRouter(prefix="/api/v1", tags=["Citas y Reuniones B2B"])

@router.get("/citas_b2b/usuario/{usuario_id}")
def obtener_agenda_usuario(usuario_id: str):
    try:
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

@router.post("/citas_b2b", status_code=201)
def crear_cita_b2b(cita: CrearCitaB2B, db: Session = Depends(get_db)):
    try:
        solicitante = db.query(Usuario).filter(Usuario.id == cita.solicitante_id).first()
        destinatario = db.query(Usuario).filter(Usuario.id == cita.destinatario_id).first()

        if not solicitante or not destinatario:
            raise HTTPException(status_code=400, detail="El usuario solicitante o destinatario no existen.")

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

        return {
            "status": "success",
            "mensaje": "Solicitud de cita B2B registrada correctamente",
            "data": {"id": nueva_cita.id, "titulo": nueva_cita.titulo, "estatus": nueva_cita.estatus}
        }
    except Exception as e:
        db.rollback()
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

@router.patch("/citas_b2b/{cita_id}/estatus")
def actualizar_estatus_cita_b2b(cita_id: str, payload: ActualizarEstatusCita, db: Session = Depends(get_db)):
    try:
        cita = db.query(CitaB2B).filter(CitaB2B.id == cita_id).first()
        if not cita:
            raise HTTPException(status_code=404, detail="Cita B2B no encontrada.")

        estatus_final = payload.estatus_cita or payload.estatus
        if estatus_final:
            cita.estatus = estatus_final
            
        db.commit()
        db.refresh(cita)

        return {
            "status": "success",
            "mensaje": "Estatus actualizado con éxito",
            "data": {"id": cita.id, "estatus": cita.estatus}
        }
    except Exception as e:
        db.rollback()
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.get("/reuniones/proximas")
def obtener_proximas_reuniones(usuario_id: str = None, tipo: str = "destinatario", db: Session = Depends(get_db)):
    try:
        if not usuario_id or not str(usuario_id).strip():
            return []

        es_solicitante = str(tipo).lower() == "solicitante"

        # tipo="solicitante"  => MIS REUNIONES (citas que nosotros pedimos, muestra al destinatario)
        # tipo="destinatario" => SOLICITUDES (citas que nos piden, muestra al solicitante)
        if es_solicitante:
            query = (
                db.query(CitaB2B, Usuario, Organizacion, Rol)
                .join(Usuario, CitaB2B.destinatario_id == Usuario.id)
                .join(Organizacion, Usuario.organizacion_id == Organizacion.id)
                .outerjoin(Rol, Usuario.rol_id == Rol.id)
                .filter(CitaB2B.solicitante_id == usuario_id)
            )
        else:
            query = (
                db.query(CitaB2B, Usuario, Organizacion, Rol)
                .join(Usuario, CitaB2B.solicitante_id == Usuario.id)
                .join(Organizacion, Usuario.organizacion_id == Organizacion.id)
                .outerjoin(Rol, Usuario.rol_id == Rol.id)
                .filter(CitaB2B.destinatario_id == usuario_id)
            )
        query = query.order_by(CitaB2B.created_at.desc())
        filas = query.limit(5).all()
        if not filas:
            return []

        def formato_hora(valor):
            if not valor: return "09:00"
            try:
                partes = str(valor).split(":")
                if len(partes) >= 2: return f"{int(partes[0]):02d}:{int(partes[1]):02d}"
            except Exception: pass
            return "09:00"

        resultado = []
        for c, solicitante, org, rol in filas:
            fecha_formateada = c.fecha.isoformat() if hasattr(c, 'fecha') and c.fecha else None
            nombre_solicitante = f"{solicitante.nombre} {solicitante.apellido}".strip()
            iniciales = f"{solicitante.nombre[0].upper() if solicitante.nombre else ''}{solicitante.apellido[0].upper() if solicitante.apellido else ''}"

            resultado.append({
                "id": c.id, "titulo": c.titulo, "proposito_reunion": c.proposito_reunion,
                "propuesta_valor": c.mensaje_propuesta, "fecha": fecha_formateada, "fecha_hora": fecha_formateada,
                "hora_inicio": formato_hora(c.hora_inicio), "hora_fin": formato_hora(c.hora_fin),
                "solicitante_id": c.solicitante_id, "destinatario_id": c.destinatario_id,
                "estatus_cita": c.estatus, "destinatario_nombre": nombre_solicitante,
                "destinatario_iniciales": iniciales, "destinatario_empresa": org.nombre if org else 'Por definir',
                "destinatario_puesto": rol.nombre if rol else 'Representante', "destinatario_pais": solicitante.pais or '',
            })
        return resultado
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")