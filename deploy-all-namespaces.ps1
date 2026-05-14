# ============================================================================
# Script de déploiement complet sur GKE - 3 namespaces (PowerShell)
# Usage: .\deploy-all-namespaces.ps1
# ============================================================================

# Namespace cible : "test", "dev", "production", ou "all" (defaut)
param(
    [string]$Namespace = "all"
)

$PROJECT_ID     = "projet2glb"
$CLUSTER        = "cluster-1"
$ZONE           = "us-central1-a"
$BACKEND_IMAGE  = "gcr.io/$PROJECT_ID/reclamations-backend:latest"
$FRONTEND_IMAGE = "gcr.io/$PROJECT_ID/reclamations-frontend:latest"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  Deploiement GKE - Projet: $PROJECT_ID | Namespace: $Namespace" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

# ── 1. Vérification Docker ─────────────────────────────────────────────────
Write-Host "`n[0/7] Verification Docker Desktop..." -ForegroundColor Yellow
$dockerOk = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR: Docker Desktop n'est pas lance. Demarre-le et relance ce script." -ForegroundColor Red
    exit 1
}
Write-Host "OK Docker Desktop est actif" -ForegroundColor Green

# ── 2. Connexion au cluster ────────────────────────────────────────────────
Write-Host "`n[1/7] Connexion au cluster GKE..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID
gcloud container clusters get-credentials $CLUSTER --zone $ZONE
Write-Host "OK Connecte au cluster $CLUSTER" -ForegroundColor Green

# ── 3. Build & Push images Docker ─────────────────────────────────────────
Write-Host "`n[2/7] Build & Push des images Docker..." -ForegroundColor Yellow
gcloud auth configure-docker --quiet

Write-Host "  -> Build backend..."
docker build -t $BACKEND_IMAGE ./backend
if ($LASTEXITCODE -ne 0) { Write-Host "ERREUR build backend" -ForegroundColor Red; exit 1 }

Write-Host "  -> Push backend..."
docker push $BACKEND_IMAGE
if ($LASTEXITCODE -ne 0) { Write-Host "ERREUR push backend" -ForegroundColor Red; exit 1 }

Write-Host "  -> Build frontend..."
docker build -t $FRONTEND_IMAGE ./frontend
if ($LASTEXITCODE -ne 0) { Write-Host "ERREUR build frontend" -ForegroundColor Red; exit 1 }

Write-Host "  -> Push frontend..."
docker push $FRONTEND_IMAGE
if ($LASTEXITCODE -ne 0) { Write-Host "ERREUR push frontend" -ForegroundColor Red; exit 1 }

Write-Host "OK Images poussees vers GCR" -ForegroundColor Green

# ── 4. Création des namespaces (kubectl create, ignore si existe deja) ─────
Write-Host "`n[4/7] Creation des namespaces..." -ForegroundColor Yellow
kubectl create namespace test       2>$null
kubectl create namespace dev        2>$null
kubectl create namespace production 2>$null
kubectl get namespaces | Select-String -Pattern "test|dev|production"
Write-Host "OK Namespaces crees" -ForegroundColor Green

# ── 5. Namespace: test ────────────────────────────────────────────────────
if ($Namespace -eq "all" -or $Namespace -eq "test") {
    Write-Host "`n[5/7] Deploiement namespace: test (2 replicas)..." -ForegroundColor Yellow
    kubectl apply -f k8s/test/secrets.yaml
    kubectl apply -f k8s/test/configmap.yaml
    kubectl apply -f k8s/test/mysql-deployment.yaml
    Write-Host "  -> Attente MySQL test (20s)..."
    Start-Sleep -Seconds 20
    kubectl apply -f k8s/test/backend-deployment.yaml
    kubectl apply -f k8s/test/frontend-deployment.yaml
    Write-Host "OK Namespace test deploye" -ForegroundColor Green
}

# ── 6. Namespace: dev ─────────────────────────────────────────────────────
if ($Namespace -eq "all" -or $Namespace -eq "dev") {
    Write-Host "`n[6/7] Deploiement namespace: dev (2 replicas)..." -ForegroundColor Yellow
    kubectl apply -f k8s/dev/secrets.yaml
    kubectl apply -f k8s/dev/configmap.yaml
    kubectl apply -f k8s/dev/mysql-deployment.yaml
    Write-Host "  -> Attente MySQL dev (20s)..."
    Start-Sleep -Seconds 20
    kubectl apply -f k8s/dev/backend-deployment.yaml
    kubectl apply -f k8s/dev/frontend-deployment.yaml
    Write-Host "OK Namespace dev deploye" -ForegroundColor Green
}

# ── 7. Namespace: production ──────────────────────────────────────────────
if ($Namespace -eq "all" -or $Namespace -eq "production") {
    Write-Host "`n[7/7] Deploiement namespace: production (3 replicas)..." -ForegroundColor Yellow
    kubectl apply -f k8s/production/secrets.yaml
    kubectl apply -f k8s/production/configmap.yaml
    kubectl apply -f k8s/production/mysql-deployment.yaml
    Write-Host "  -> Attente MySQL production (20s)..."
    Start-Sleep -Seconds 20
    kubectl apply -f k8s/production/backend-deployment.yaml
    kubectl apply -f k8s/production/frontend-deployment.yaml
    Write-Host "OK Namespace production deploye" -ForegroundColor Green
}

# ── Résumé ─────────────────────────────────────────────────────────────────
Write-Host "`n======================================================================" -ForegroundColor Cyan
Write-Host "  DEPLOIEMENT TERMINE" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

Write-Host "`nPods par namespace:" -ForegroundColor Yellow
if ($Namespace -eq "all" -or $Namespace -eq "test") {
    Write-Host "--- test ---"; kubectl get pods -n test
}
if ($Namespace -eq "all" -or $Namespace -eq "dev") {
    Write-Host "`n--- dev ---"; kubectl get pods -n dev
}
if ($Namespace -eq "all" -or $Namespace -eq "production") {
    Write-Host "`n--- production ---"; kubectl get pods -n production
}

Write-Host "`nServices (IPs externes frontend):" -ForegroundColor Yellow
if ($Namespace -eq "all" -or $Namespace -eq "test") {
    Write-Host "--- test ---"; kubectl get service frontend -n test
}
if ($Namespace -eq "all" -or $Namespace -eq "dev") {
    Write-Host "`n--- dev ---"; kubectl get service frontend -n dev
}
if ($Namespace -eq "all" -or $Namespace -eq "production") {
    Write-Host "`n--- production ---"; kubectl get service frontend -n production
}

Write-Host "`nSi EXTERNAL-IP affiche <pending>, attends 1-2 min puis relance:" -ForegroundColor Yellow
Write-Host "   kubectl get service frontend -n production"
