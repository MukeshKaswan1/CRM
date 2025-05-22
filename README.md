# Syndie

A brief overview of the project, its purpose, and main functionality.

## How to Run the Project

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/syndie.git
    cd syndie
    ```
2. **Install dependencies for both frontend and backend:**
    ```bash
    cd backend
    yarn install
    # or npm install
    cd ../frontend
    yarn install
    # or npm install
    ```
3. **Start the backend server:**
    ```bash
    cd backend
    node app.js
    # or
    yarn start
    ```
    The backend will run at `http://localhost:8001`.

4. **Start the frontend development server:**
    ```bash
    cd frontend
    yarn dev
    # or npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

## Tech Stack Used

- **Frontend:** Next.js (React), TypeScript, Tailwind CSS, Radix UI, Lucide Icons
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Styling:** Tailwind CSS
- **Other:** Axios, react-csv, class-variance-authority

## Folder Structure

```
syndie/
├── backend/
│   ├── app.js
│   ├── package.json
│   ├── bin/
│   ├── config/
│   ├── models/
│   ├── public/
│   └── routes/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
├── README.md
```

## Features Implemented

- Dashboard for managing leads and conversations
- CRUD operations for leads and conversations
- Filtering and searching leads
- Export leads to CSV
- AI-powered suggestions for next actions on leads
- Responsive UI
- API integration between frontend and backend
- Error handling and form validation
