# SEAAL Local Messaging App 💧

Professional messaging platform for **SEAAL** (Société des Eaux et de l’Assainissement d’Alger), focused on the 2026-2028 transformation plan.

## Setup Instructions (Laragon)

To run this project locally on Laragon, follow these steps:

### 1. Requirements
- **Laragon Full** (with PHP 8.x and MySQL)
- **Composer**
- **Node.js & NPM**

### 2. Installation
1.  **Clone the repository** into your Laragon `www` folder:
    ```bash
    git clone https://github.com/kl7sr/sentence.git
    ```
2.  **Open Laragon Terminal** and navigate to the project:
    ```bash
    cd sentence
    ```
3.  **Install PHP Dependencies**:
    ```bash
    composer install
    ```
4.  **Install JS Dependencies & Build**:
    ```bash
    npm install && npm run build
    ```

### 3. Environment & Database
1.  **Create a database** named `sentence` (or `sutnance2`) in Laragon MySQL.
2.  **Copy Environment File**:
    ```bash
    cp .env.example .env
    ```
3.  **Generate App Key**:
    ```bash
    php artisan key:generate
    ```
4.  **Update `.env`**: Configure `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` to match your Laragon settings.

### 4. Running
1.  **Migrate & Seed** (This will set up the SEAAL departments and admin):
    ```bash
    php artisan migrate --seed
    ```
2.  **Access the app**: reload Laragon services and visit `http://sentence.test` (or run `php artisan serve`).

## Admin Credentials
- **Email**: `admin@admin.com`
- **Password**: `admin123`

---
*Developed for SEAAL - Digital Transformation Action Plan 2026-2028.*
