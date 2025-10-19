# LangHub - A Multi-language Learning Platform

LangHub is an online learning platform designed to help users prepare for language proficiency tests such as TOEIC and IELTS. With a friendly interface and powerful features, LangHub provides a realistic practice environment, helping users track their progress and achieve their target scores.



## Key Features

* **Realistic Exam Practice**: Offers full practice tests for TOEIC and IELTS with question formats that closely match the actual exams.
* **Instant Scoring**: Get immediate results for the Listening and Reading sections, allowing users to quickly assess their performance.
* **Detailed Analysis**: Track your learning progress with detailed analytics and performance reports.
* **Integrated Audio Player**: Features a built-in audio player for listening sections, simulating the real test experience.
* **Modern User Interface**: Built with modern and highly customizable UI components from `shadcn/ui` to deliver the best user experience.
* **User and Class Management**: Teachers can create classes, add students via CSV files, and assign tests.
* **Admin Dashboard**: A powerful admin panel powered by Payload CMS to manage all platform data.

---

## Tech Stack

* **Frontend**:
    * Next.js
    * React
    * TypeScript
    * Tailwind CSS
    * shadcn/ui
    * tRPC
* **Backend**:
    * Payload CMS
    * PostgreSQL
* **Core Libraries**:
    * `react-hook-form` & `zod` for form management and data validation.
    * `recharts` for displaying charts and statistics.
    * `date-fns` for date and time handling.
    * `lexicalEditor` as the rich text editor.

---

## Getting Started

To run the project on your local machine, follow these steps:

1.  **Install dependencies**:
    ```bash
    pnpm install
    ```
2.  **Set up the database**:
    * Create a PostgreSQL database.
    * Copy the `.env.example` file to `.env` and fill in your database connection details in the `DATABASE_URI` variable.
3.  **Run the development server**:
    ```bash
    pnpm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Available Scripts

* `pnpm run build`: Builds the app for production.
* `pnpm run start`: Starts the production server.
* `pnpm run lint`: Lints the codebase.
* `pnpm run generate:types`: Generates TypeScript types from your Payload config.
* `pnpm run db:fresh`: Drops and recreates the database.
* `pnpm run db:seed`: Seeds the database with sample data.

---

## Project Structure

The project is structured using a modular approach for easy maintenance and scalability:

* `src/app/`: Contains the pages and layouts for the Next.js application.
* `src/collections/`: Defines the data models (collections) for Payload CMS.
* `src/components/`: Contains reusable UI components.
* `src/modules/`: Groups files related to a specific feature (e.g., `auth`, `dashboard`).
* `src/trpc/`: Contains tRPC router definitions and procedures.

---

## API and Data Handling

LangHub uses **tRPC** to create type-safe APIs between the client and server. The tRPC routers are defined in `src/trpc/routers/`, providing endpoints for operations like authentication, test management, and progress tracking.

**Payload CMS** serves as the headless backend, providing a powerful admin UI and REST/GraphQL APIs for content management. Data models are defined in the `src/collections/` directory.

---

## Authentication and User Management

User authentication is handled by Payload CMS, supporting different user roles such as `super-admin`, `business` (teachers), and `user` (students). Users can sign up, log in, and manage their profiles. Teachers can manage their classes and students.
