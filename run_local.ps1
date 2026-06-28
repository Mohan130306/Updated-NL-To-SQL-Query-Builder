Write-Host "Setting up backend..."
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
Write-Host "Seeding database..."
$env:PYTHONPATH="."
python -m app.db.init_db
Write-Host "Starting FastAPI server in the background..."
Start-Process -NoNewWindow -FilePath "uvicorn" -ArgumentList "app.main:app", "--reload"
cd ..

Write-Host "Setting up frontend..."
cd frontend
npm install
Write-Host "Starting React app..."
npm run dev
