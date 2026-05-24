import asyncio, os, uuid
from datetime import datetime, timezone, timedelta
from pathlib import Path
from dotenv import load_dotenv
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")
import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient

def hash_pw(pw):
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def now_iso():
    return datetime.now(timezone.utc).isoformat()

def today_str():
    return (datetime.now(timezone.utc) - timedelta(hours=3)).strftime("%Y-%m-%d")

DEMO_USERS = [
    {"id": "admin-seed-001", "email": "admin@bayer.com", "name": "Administrador", "role": "admin", "pw": "admin123"},
    {"id": "op-seed-001", "email": "operador@bayer.com", "name": "Operador Linha", "role": "user", "pw": "op123"},
]

SAMPLE_ITEMS = [
    {"product": "Nativo", "abbr": "NAT", "unit": "Linha 1", "sc": "SC-001", "batch": "LOT-NAT-001", "qty": 1200.0, "sit": "A preparar", "mat": "Disponivel"},
    {"product": "Verango", "abbr": "VER", "unit": "Linha 2", "sc": "SC-002", "batch": "LOT-VER-001", "qty": 800.0, "sit": "Em fabrica", "mat": "Disponivel"},
    {"product": "Fox Xpro", "abbr": "FXX", "unit": "Linha 1", "sc": "SC-003", "batch": "LOT-FXX-001", "qty": 2400.0, "sit": "Preparado", "mat": "Disponivel"},
    {"product": "Oberon", "abbr": "OBE", "unit": "Linha 3", "sc": "SC-004", "batch": "LOT-OBE-001", "qty": 600.0, "sit": "A preparar", "mat": "Baixo"},
    {"product": "Belt", "abbr": "BEL", "unit": "Linha 2", "sc": "SC-005", "batch": "LOT-BEL-001", "qty": 1000.0, "sit": "A preparar", "mat": "Disponivel"},
    {"product": "Connect", "abbr": "CON", "unit": "Linha 4", "sc": "SC-006", "batch": "LOT-CON-001", "qty": 1500.0, "sit": "Em fabrica", "mat": "Disponivel"},
    {"product": "Movento", "abbr": "MOV", "unit": "Linha 1", "sc": "SC-007", "batch": "LOT-MOV-001", "qty": 900.0, "sit": "Preparado", "mat": "Disponivel"},
    {"product": "Sphere Max", "abbr": "SPH", "unit": "Linha 3", "sc": "SC-008", "batch": "LOT-SPH-001", "qty": 1800.0, "sit": "A preparar", "mat": "Disponivel"},
]

async def main():
    url = os.environ.get("MONGO_URL")
    db_name = os.environ.get("DB_NAME")
    if not url or not db_name:
        print("ERROR: configure MONGO_URL e DB_NAME no arquivo backend/.env")
        return
    print("Conectando ao MongoDB: " + db_name + "...")
    client = AsyncIOMotorClient(url)
    db = client[db_name]
    await db.users.create_index("email", unique=True)
    await db.production_items.create_index("id", unique=True)
    await db.products.create_index("id", unique=True)
    print("
Criando usuarios...")
    for u in DEMO_USERS:
        email = u["email"]
        role = u["role"]
        if await db.users.find_one({"email": email}):
            print("  [skip] " + email + " ja existe")
            continue
        await db.users.insert_one({"id": u["id"], "email": email, "password_hash": hash_pw(u["pw"]), "name": u["name"], "role": role, "created_at": now_iso()})
        print("  [ok] " + email + " (" + role + ") criado")
    today = today_str()
    print("
Inserindo " + str(len(SAMPLE_ITEMS)) + " itens para " + today + "...")
    for it in SAMPLE_ITEMS:
        doc = {"id": str(uuid.uuid4()), "date": today, "unit": it["unit"], "sc": it["sc"], "product": it["product"], "product_abbr": it["abbr"], "batch": it["batch"], "quantity": it["qty"], "quantity_unit": "kg", "material_status": it["mat"], "situation": it["sit"], "observation": "", "created_by": "admin-seed-001", "created_at": now_iso(), "updated_at": now_iso()}
        await db.production_items.insert_one(doc)
    u_c = await db.users.count_documents({})
    i_c = await db.production_items.count_documents({})
    print("
Seed concluido! Usuarios: " + str(u_c) + "  Itens: " + str(i_c))
    print("  admin@bayer.com  / admin123")
    print("  operador@bayer.com / op123")
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
