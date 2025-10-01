from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, status, Response
from typing import Optional
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import shutil, os
from models import Blog, User
from database import get_db, Base, engine
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel

security = HTTPBearer()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    gender: str
    phone: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not credentials or not credentials.credentials:
        raise credentials_exception
    
    try:
        print(f"Received token: {credentials.credentials}")
        
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise credentials_exception
    except JWTError as e:
        print(f"JWT decoding error: {e}")
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    
    if user is None:
        raise credentials_exception
    
    return {"id": user.id, "username": user.email}


@app.post("/blogs")
async def create_blog(
    title: str = Form(...),
    content: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    image_url = ""
    if image:
        file_location = os.path.join(UPLOAD_DIR, image.filename)
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = f"/uploads/{image.filename}"
        print(f"Image uploaded: {image.filename}")
    else:
        print("No image provided")

    print(f"Creating blog for user {current_user['id']}: {title}")

    blog = Blog(
        title=title,
        content=content,
        user_id=current_user['id'],
        image_url=image_url
    )
    db.add(blog)
    db.commit()
    db.refresh(blog)
    print(f"Blog created with ID: {blog.id}")
    return blog

@app.post("/signup", response_model=dict)
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    db_user = User(
        fullname=user.full_name,
        email=user.email,
        gender=user.gender,
        phone=user.phone,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"msg": "User created successfully", "user_id": db_user.id}

@app.post("/login", response_model=Token)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/blogs")
def get_blogs(db: Session = Depends(get_db)):
    blogs = db.query(Blog).all()
    result = []
    for blog in blogs:
        result.append({
            "id": blog.id,
            "title": blog.title,
            "author": blog.owner.fullname if blog.owner else "Unknown",
            "created_at": blog.created_at,
            "content": blog.content,
            "image_url": blog.image_url
        })
    return result

@app.get("/blogs/{blog_id}")
def get_blog(blog_id: int, db: Session = Depends(get_db)):
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {
        "id": blog.id,
        "title": blog.title,
        "author": blog.owner.fullname if blog.owner else "Unknown",
        "created_at": blog.created_at,
        "content": blog.content,
        "image_url": blog.image_url
    }

@app.get("/myblogs")
def get_my_blogs(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    blogs = db.query(Blog).filter(Blog.user_id == current_user['id']).all()
    result = []
    for blog in blogs:
        result.append({
            "id": blog.id,
            "title": blog.title,
            "author": blog.owner.fullname if blog.owner else "Unknown",
            "created_at": blog.created_at,
            "content": blog.content,
            "image_url": blog.image_url
        })
    return result

@app.put("/blogs/{blog_id}")
async def update_blog(
    blog_id: int,
    title: str = Form(...),
    content: str = Form(...),
    image: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    if blog.user_id != current_user['id']:
        raise HTTPException(status_code=403, detail="Not authorized to update this blog")
    
    blog.title = title
    blog.content = content
    blog.updated_at = datetime.utcnow()
    
    if image:
        file_location = os.path.join(UPLOAD_DIR, image.filename)
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        blog.image_url = f"/uploads/{image.filename}"
    
    db.commit()
    db.refresh(blog)
    return {"message": "Blog updated successfully"}

@app.delete("/blogs/{blog_id}")
def delete_blog(blog_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    if blog.user_id != current_user['id']:
        raise HTTPException(status_code=403, detail="Not authorized to delete this blog")
    db.delete(blog)
    db.commit()
    return {"message": "Blog deleted successfully"}

@app.post("/logout/")
def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Logged out successfully"}
