#!/bin/bash
set -e

# ============================================================================
# Script de déploiement complet sur GKE - 3 namespaces
# Usage: ./deploy-all-namespaces.sh
# ============================================================================

PROJECT_ID="projet2glb"
CLUSTER="cluster-1"
ZONE="us-central1-a"
BACKEND_IMAGE="gcr.io/$PROJECT_ID/reclamations-backend:latest"
FRONTEND_IMAGE="gcr.io/$PROJECT_ID/reclamations-frontend:latest"

echo "======================================================================"
echo "🚀  Déploiement GKE - Projet: $PROJECT_ID"
echo "======================================================================"

# ── 1. Connexion au cluster ────────────────────────────────────────────────
echo ""
echo "📋 [1/7] Connexion au cluster GKE..."
gcloud config set project $PROJECT_ID
gcloud container clusters get-credentials $CLUSTER --zone $ZONE
echo "✅ Connecté au cluster $CLUSTER"

# ── 2. Build & Push images Docker ─────────────────────────────────────────
echo ""
echo "📋 [2/7] Build & Push des images Docker..."
gcloud auth configure-docker --quiet

echo "  → Build backend..."
docker build -t $BACKEND_IMAGE ./backend
echo "  → Push backend..."
docker push $BACKEND_IMAGE

echo "  → Build frontend..."
docker build -t $FRONTEND_IMAGE ./frontend
echo "  → Push frontend..."
docker push $FRONTEND_IMAGE
echo "✅ Images poussées vers GCR"

# ── 3. Suppression des anciens déploiements (racine k8s/) ──────────────────
echo ""
echo "📋 [3/7] Nettoyage des anciens déploiements (sans namespace)..."
kubectl delete -f k8s/backend-deployment.yaml --ignore-not-found=true
kubectl delete -f k8s/frontend-deployment.yaml --ignore-not-found=true
kubectl delete -f k8s/mysql-deployment.yaml --ignore-not-found=true
echo "✅ Anciens déploiements supprimés"

# ── 4. Création des namespaces ─────────────────────────────────────────────
echo ""
echo "📋 [4/7] Création des namespaces..."
kubectl apply -f k8s/namespaces.yaml
kubectl get namespaces | grep -E "test|dev|production"
echo "✅ Namespaces créés"

# ── 5. Déploiement namespace: test ────────────────────────────────────────
echo ""
echo "📋 [5/7] Déploiement namespace: test (2 replicas)..."
kubectl apply -f k8s/test/secrets.yaml
kubectl apply -f k8s/test/configmap.yaml
kubectl apply -f k8s/test/mysql-deployment.yaml
echo "  → Attente MySQL test (20s)..."
sleep 20
kubectl apply -f k8s/test/backend-deployment.yaml
kubectl apply -f k8s/test/frontend-deployment.yaml
echo "✅ Namespace test déployé"

# ── 6. Déploiement namespace: dev ─────────────────────────────────────────
echo ""
echo "📋 [6/7] Déploiement namespace: dev (2 replicas)..."
kubectl apply -f k8s/dev/secrets.yaml
kubectl apply -f k8s/dev/configmap.yaml
kubectl apply -f k8s/dev/mysql-deployment.yaml
echo "  → Attente MySQL dev (20s)..."
sleep 20
kubectl apply -f k8s/dev/backend-deployment.yaml
kubectl apply -f k8s/dev/frontend-deployment.yaml
echo "✅ Namespace dev déployé"

# ── 7. Déploiement namespace: production ──────────────────────────────────
echo ""
echo "📋 [7/7] Déploiement namespace: production (3 replicas)..."
kubectl apply -f k8s/production/secrets.yaml
kubectl apply -f k8s/production/configmap.yaml
kubectl apply -f k8s/production/mysql-deployment.yaml
echo "  → Attente MySQL production (20s)..."
sleep 20
kubectl apply -f k8s/production/backend-deployment.yaml
kubectl apply -f k8s/production/frontend-deployment.yaml
echo "✅ Namespace production déployé"

# ── Résumé ─────────────────────────────────────────────────────────────────
echo ""
echo "======================================================================"
echo "✅  DÉPLOIEMENT TERMINÉ"
echo "======================================================================"

echo ""
echo "📊 Pods par namespace:"
echo "--- test ---"
kubectl get pods -n test
echo ""
echo "--- dev ---"
kubectl get pods -n dev
echo ""
echo "--- production ---"
kubectl get pods -n production

echo ""
echo "🌐 Services (IPs externes frontend):"
echo "--- test ---"
kubectl get service frontend -n test
echo ""
echo "--- dev ---"
kubectl get service frontend -n dev
echo ""
echo "--- production ---"
kubectl get service frontend -n production

echo ""
echo "⚠️  Si EXTERNAL-IP affiche <pending>, attends 1-2 min puis relance:"
echo "   kubectl get service frontend -n production"
