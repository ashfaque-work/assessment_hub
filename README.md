# **Assessment Hub API**

A backend application for managing users, categories, questions, and answers in an assessment platform. This project is built with **Node.js**, **Express**, and **MongoDB** and includes features like user authentication, category management, question uploads, and answer tracking.

---

## **Features**

- **User Management**
  - Signup, login, and email verification.
  - Update user profile, including profile picture.
  
- **Category Management**
  - Create, update, and fetch categories.
  - Fetch category stats (total questions per category).

- **Question Management**
  - Bulk upload questions using a CSV file.
  - Fetch questions by category.
  - Flexible search functionality (supports tokenized search).
  
- **Answer Tracking**
  - Submit answers for questions.
  - Search for submitted answers by keyword and timestamp.

---

## **Tech Stack**

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Uploads**: Multer
- **Email Service**: Mailtrap (for testing)

---

### **User Management**

| Method | Endpoint                | Description                          |
|--------|-------------------------|--------------------------------------|
| POST   | `/api/users/signup`     | User signup and email verification.  |
| POST   | `/api/users/login`      | User login.                          |
| GET    | `/api/users/profile`    | Fetch user profile.                  |
| PUT    | `/api/users/profile`    | Update user profile.                 |
| POST   | `/api/answers`          | Submit an answer.                    |
| GET    | `/api/questions-search` | Search for questions.                |

---

### **Category Management**

| Method | Endpoint                | Description                     |
|--------|-------------------------|---------------------------------|
| GET    | `/api/categories`       | Fetch all categories.           |
| GET    | `/api/categories/stats` | Fetch category stats.           |
| POST   | `/api/categories`       | Create a new category.          |
| PUT    | `/api/categories/:id`   | Update an existing category.    |

---

### **Question Management**

| Method | Endpoint                        | Description                     |
|--------|---------------------------------|---------------------------------|
| GET    | `/api/questions/category/:id`   | Fetch questions by category.    |
| POST   | `/api/questions/upload`         | Bulk upload questions via CSV.  |

---

### **How to Add This to Your Project**
1. **Create the `README.md` file** in the root directory of your project.
2. **Paste** the content above into the `README.md`.
3. **Commit and push** your changes to GitHub:
   ```bash
   git add README.md
   git commit -m "Added README"
   git push origin main
