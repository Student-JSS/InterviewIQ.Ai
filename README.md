# InterviewIQ.ai

InterviewIQ.AI is a full-stack web application designed to help users prepare for interviews using AI-powered simulations. It allows users to upload their resumes, generate personalized interview questions, practice technical and HR rounds, and receive intelligent feedback. The platform follows a scalable SaaS architecture with a credit-based system and integrated payments.

## Features

- **Resume Upload**: Upload and process PDF resumes for analysis  
- **AI Question Generation**: Generate interview questions based on resume content  
- **Interview Practice**: Practice both technical and HR interview rounds  
- **Feedback System**: Get intelligent performance feedback  
- **Credit System**: Usage controlled via credit-based access  
- **Payments Integration**: Purchase credits securely using Razorpay  
- **Authentication**: Google login with Firebase Authentication  
- **Validation**: Backend validation for secure and consistent data handling  
- **File Handling**: Resume upload and processing support  
- **Frontend**: Responsive UI with smooth animations using Framer Motion  

## Project Structure

### Backend (`InterviewIQ-Backend`)

- `src/`
  - `config/`: Configuration files (DB, environment setup)
  - `controllers/`: Route handlers for authentication, interviews, payments, and users
  - `middlewares/`: Authentication, error handling, and request validation
  - `models/`: Mongoose models (User, Resume, Credits, Sessions)
  - `routes/`: API route definitions
  - `services/`: Business logic for AI processing and interview generation
  - `utils/`: Helper functions and utilities
- `package.json`, `tsconfig.json`

### Frontend (`InterviewIQ-Frontend`)

- `src/`
  - `components/`: Reusable UI components
  - `pages/`: Application pages (dashboard, interview, login, etc.)
  - `context/`: Global state management
  - `utils/`: Helper utilities
  - `assets/`: Images and static files
- `public/`
- `package.json`, `vite.config.js`

## Getting Started

### Backend

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:

   Create a `.env` file in the `InterviewIQ-Backend` directory:

   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FIREBASE_CONFIG=your_firebase_config
   ```

   Do not commit `.env` to version control.

3. Start the server:
   ```bash
   npm run dev
   ```

### Frontend

1. Install dependencies:
   ```bash
   npm install
   ```

2. (Optional) Create `.env` file in `InterviewIQ-Frontend`:

   ```env
   VITE_API_URL=http://localhost:5173/
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Technologies Used

- **Frontend**: React.js, Vite, JavaScript, CSS, Framer Motion  
- **Backend**: Node.js, Express.js, MongoDB, Mongoose  
- **Authentication**: Firebase Google Authentication, JWT  
- **Payments**: Razorpay  
- **File Uploads**: Multer  

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.

---

InterviewIQ.ai aims to provide a realistic and efficient interview preparation experience using AI. The modular architecture ensures scalability, maintainability, and ease of future enhancements.