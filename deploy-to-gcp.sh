#!/bin/bash

# ============================================================================
# Script de déploiement sur Google Cloud Platform (GKE)
# Projet: projet2GLB (projet2glb)
# Cluster: cluster-1 (us-central1-a)
# Namespaces: test | dev | production
# ============================================================================

NAMESPACE=${1:-dev}

echo "🚀 Déploiement sur GCP - Projet: projet2glb | Namespace: $NAMESPACE"
echo "======================================================================"

# ── Étape 1: Configuration GCloud ──────────────────────────────────────────
echo ""
echo "📋 Étape 1: Configuration de gcloud..."
gcloud config set project projet2glb
gcloud container clusters get-credentials cluster-1 --zone us-central1-a

# ── Étape 2: Activer les services nécessaires ──────────────────────────────
echo ""
echo "📋 Étape 2: Activation des services GCP..."
gcloud services enable containerregistry.googleapis.com
gcloud services enable container.googleapis.com

# ── Étape 3: Authentification Docker ───────────────────────────────────────
echo ""
echo "📋 Étape 3: Configuration de Docker pour GCR..."
gcloud auth configure-docker

# ── Étape 4: Build et Push des images Docker ───────────────────────────────
echo ""
echo "📋 Étape 4: Construction et push des images Docker..."

docker build -t gcr.io/projet2glb/reclamations-backend:latest ./backend
docker push gcr.io/projet2glb/reclamations-backend:latest

docker build -t gcr.io/projet2glb/reclamations-frontend:latest ./frontend
docker push gcr.io/projet2glb/reclamations-frontend:latest

# ── Étape 5: Création des namespaces ───────────────────────────────────────
echo ""
echo "📋 Étape 5: Création des namespaces..."
kubectl apply -f k8s/namespaces.yaml

# ── Étape 6: Déploiement sur le namespace cible ────────────────────────────
echo ""
echo "📋 Étape 6: Déploiement sur le namespace [$NAMESPACE]..."

kubectl apply -f k8s/$NAMESPACE/secrets.yaml
kubectl apply -f k8s/$NAMESPACE/configmap.yaml

echo "  → Déploiement de MySQL..."
kubectl apply -f k8s/$NAMESPACE/mysql-deployment.yaml

echo "  → Attente du démarrage de MySQL (30 secondes)..."
sleep 30

echo "  → Déploiement du Backend..."
kubectl apply -f k8s/$NAMESPACE/backend-deployment.yaml

echo "  → Attente du démarrage du Backend (20 secondes)..."
sleep 20

echo "  → Déploiement du Frontend..."
kubectl apply -f k8s/$NAMESPACE/frontend-deployment.yaml

# ── Étape 7: Vérification du déploiement ───────────────────────────────────
echo ""
echo "📋 Étape 7: Vérification du déploiement..."
kubectl get pods -n $NAMESPACE
echo ""
kubectl get services -n $NAMESPACE

# ── Étape 8: Obtenir l'URL du Frontend ─────────────────────────────────────
echo ""
echo "📋 Étape 8: Récupération de l'adresse IP externe du Frontend..."
echo "⏳ Attente de l'attribution de l'IP externe..."
kubectl get service frontend -n $NAMESPACE --watch

echo ""
echo "✅ Déploiement terminé sur le namespace [$NAMESPACE]!"
echo ""
echo "Commandes utiles:"
echo "  → Voir les pods:            kubectl get pods -n $NAMESPACE"
echo "  → Voir les services:        kubectl get services -n $NAMESPACE"
echo "  → Logs backend:             kubectl logs -l app=backend -n $NAMESPACE"
echo "  → Logs frontend:            kubectl logs -l app=frontend -n $NAMESPACE"
echo "  → Logs mysql:               kubectl logs -l app=mysql -n $NAMESPACE"
echo ""
echo "Déployer sur un autre namespace:"
echo "  → ./deploy-to-gcp.sh test"
echo "  → ./deploy-to-gcp.sh dev"
echo "  → ./deploy-to-gcp.sh production"
