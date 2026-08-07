# models/orm_models.py
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base

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
    created_at = Column(DateTime, default=datetime.utcnow)