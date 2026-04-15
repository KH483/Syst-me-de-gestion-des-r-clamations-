# Gestion des Réclamations Clients

Application web complète de gestion des réclamations clients.

## Technologies

| Couche | Technologie |
|--------|-------------|
| Backend | Spring Boot 3.2 (Java 21) |
| Frontend | Angular 17 + Bootstrap |
| Base de données | MySQL 8 |
| Sécurité | JWT (JSON Web Token) |
| Documentation API | Swagger / OpenAPI |

## Architecture

```
reclamations-app/
├── backend/     → API REST Spring Boot
└── frontend/    → Application Angular
```

## Prérequis

- Java 21
- Node.js 20+
- MySQL 8
- Maven (via mvnw)

## Installation et démarrage

### Base de données

Créer la base de données MySQL :
```sql
CREATE DATABASE reclamations_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Configurer les identifiants dans `backend/src/main/resources/application.properties` :
```properties
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe
```

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

L'API démarre sur `http://localhost:9090`
Documentation Swagger : `http://localhost:9090/swagger-ui.html`

### Frontend

```bash
cd frontend
npm install
ng serve
```

L'application démarre sur `http://localhost:4200`

## Comptes par défaut

| Utilisateur | Mot de passe | Rôle |
|-------------|--------------|------|
| admin | admin123 | Agent SAV |
| agent1 | agent123 | Agent SAV |
| client1 | client123 | Client |

## Fonctionnalités

### Client
- Inscription et connexion
- Créer / modifier / supprimer une réclamation (avant traitement)
- Consulter ses réclamations et leur statut
- Voir l'historique des actions
- Ajouter des messages
- Noter la réclamation après traitement (1-5)
- Exporter la réclamation en PDF

### Agent SAV
- Voir toutes les réclamations
- S'auto-affecter une réclamation
- Changer le statut (EN_ATTENTE → EN_COURS → TRAITÉE)
- Ajouter des réponses et notes internes
- Supprimer des réclamations
- Voir ses statistiques personnelles
- Exporter en PDF

## Modèle de données

- **Client** — utilisateur qui soumet des réclamations
- **AgentSAV** — agent qui traite les réclamations
- **Reclamation** — réclamation avec statut, produit, description, note
- **SuiviReclamation** — historique des actions sur une réclamation
