# main.py
import os
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importación de Rutas Modulares
from api.routes import auth, citas, networking, admin, ai

app = FastAPI(title="CUSMEX API - Nexusv2")

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusión de Routers
app.include_router(auth.router)
app.include_router(citas.router)
app.include_router(networking.router)
app.include_router(admin.router)
app.include_router(ai.router)
