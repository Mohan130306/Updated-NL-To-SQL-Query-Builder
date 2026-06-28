import logging
from sqlalchemy.orm import Session
from app.models.role import Role, Permission
from app.db.database import engine, SessionLocal
from app.db.base import Base

# Import all models to ensure they are registered with Base.metadata
import app.models

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ROLE_PERMISSIONS = {
    "admin": [
        "SELECT", "INSERT", "UPDATE", "DELETE", 
        "CREATE", "ALTER", "DROP", "Manage Users"
    ],
    "data_engineer": [
        "SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "ALTER"
    ],
    "power_user": [
        "SELECT", "INSERT", "UPDATE", "DELETE"
    ],
    "auditor": [
        "SELECT" # restricted logic applied in UI
    ],
    "viewer": [
        "SELECT" # restricted logic applied in UI
    ]
}

def init_db(db: Session) -> None:
    # We will safely attempt to create tables
    Base.metadata.create_all(bind=engine)
    
    # 1. Update/Create Roles
    for role_name, perms in ROLE_PERMISSIONS.items():
        role = db.query(Role).filter(Role.name == role_name).first()
        if not role:
            logger.info(f"Creating role: {role_name}")
            role = Role(name=role_name, description=f"{role_name.replace('_', ' ').capitalize()} role")
            db.add(role)
            db.commit()
            db.refresh(role)
            
            for perm in perms:
                permission = Permission(role_id=role.id, permission=perm)
                db.add(permission)
            db.commit()
        else:
            logger.info(f"Role {role_name} already exists.")
            
    # 2. Seed default users
    from app.core.security import get_password_hash
    from app.models.user import User
    
    users_to_seed = [
        {"email": "admin@college.edu", "first": "Admin", "last": "User", "role": "admin", "pass": "adminpass"},
        {"email": "engineer@college.edu", "first": "Data", "last": "Engineer", "role": "data_engineer", "pass": "engineerpass"},
        {"email": "power@college.edu", "first": "Power", "last": "User", "role": "power_user", "pass": "powerpass"},
        {"email": "auditor@college.edu", "first": "System", "last": "Auditor", "role": "auditor", "pass": "auditorpass"},
        {"email": "viewer@college.edu", "first": "Read", "last": "Only", "role": "viewer", "pass": "viewerpass"},
    ]
    
    for u in users_to_seed:
        existing = db.query(User).filter(User.email == u["email"]).first()
        if not existing:
            logger.info(f"Creating user: {u['email']}")
            role = db.query(Role).filter(Role.name == u["role"]).first()
            if role:
                user = User(
                    email=u["email"],
                    first_name=u["first"],
                    last_name=u["last"],
                    password_hash=get_password_hash(u["pass"]),
                    role_id=role.id,
                    is_active=True
                )
                db.add(user)
                db.commit()

if __name__ == "__main__":
    logger.info("Initializing database...")
    db = SessionLocal()
    try:
        init_db(db)
        logger.info("Database initialization complete.")
    finally:
        db.close()
