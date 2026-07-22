from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# NOTA: Reemplaza "root" y "tu_contraseña" con las credenciales de tu MySQL local.
# Si usas herramientas como XAMPP, WAMP o MAMP, el usuario suele ser "root" y la contraseña va vacía "".
# Ejemplo sin contraseña: "mysql+pymysql://root:@localhost:3306/prueba_cusmex"

SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost:3306/prueba_cusmex"

# Al usar MySQL, ya no necesitamos el connect_args={"check_same_thread": False} que era exclusivo de SQLite
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependencia para inyectar la sesión de la base de datos en los endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()