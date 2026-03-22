# AI-Based Plant Disease Detection System
## Web & Mobile Application - Product Requirements Document (PRD)

**Version:** 1.0 — Initial Release
**Status:** Draft
**Document Type:** Product Requirements Document (PRD)
**Target Users:** Farmers, Agricultural Students, Researchers, Agri-Tech Companies
**Prepared By:** Product Team
**Date:** 20 March 2026

### 1. Overview
The AI-Based Plant Disease Detection System is a full-stack application designed to help farmers and agricultural professionals identify plant diseases using leaf images. The system leverages deep learning (CNN) to analyze images and provide accurate disease predictions along with treatment suggestions.

The platform will be available as both a web application and a mobile application, ensuring accessibility in real-world farming environments — including areas with limited connectivity.

### 2. Objectives
*   Detect plant diseases using image classification (CNN-based AI model)
*   Provide accurate and fast predictions with confidence scoring
*   Assist farmers with clear treatment and fertilizer recommendations
*   Reduce crop loss and improve overall agricultural productivity
*   Build a scalable, real-world AI-powered full-stack system

### 3. Target Users
*   **Farmers:** Primary users who need quick, on-field disease identification
*   **Agri Students:** Academic users studying plant pathology and AI applications
*   **Researchers:** Scientists validating model predictions and expanding datasets
*   **Agri-Tech Cos.:** Companies integrating disease detection into larger farm platforms

### 4. Key Features
#### 4.1 User Features
*   User Registration & Login (email/password with JWT authentication)
*   Upload plant leaf images via camera capture or gallery selection
*   View instant disease prediction results with confidence score
*   Access full prediction history and past reports

#### 4.2 AI Features
*   Image classification using Convolutional Neural Network (CNN)
*   Disease detection with percentage confidence score
*   Multi-class classification supporting multiple disease categories

#### 4.3 Smart Features
*   Treatment suggestions tailored to each detected disease
*   Fertilizer and pesticide recommendations
*   Multi-language support (English, Telugu, Hindi)
*   Offline mode support for rural connectivity (advanced, future scope)

### 5. System Architecture
#### 5.1 Component Overview
*   **Frontend:** Web App (React.js / Next.js) and Mobile App (React Native / Flutter)
*   **Backend API:** Node.js + Express — handles auth, uploads, and ML routing
*   **AI Model Service:** Python Flask/FastAPI — CNN model for disease classification
*   **Database:** MongoDB Atlas — stores users, predictions, and history
*   **Cloud Storage:** AWS S3 / Firebase Storage — stores uploaded leaf images

#### 5.2 Architecture Flow
1.  User opens the app and uploads or captures a leaf image
2.  Image is sent securely to the backend API server
3.  Backend forwards the image to the AI Model Service (Flask API)
4.  CNN model processes the image and returns prediction + confidence
5.  Backend stores the result in MongoDB and responds to the frontend
6.  App displays disease name, confidence score, and treatment guidance

### 6. Technology Stack
*   **Frontend (Web):** React.js / Next.js
*   **Frontend (Mobile):** React Native / Flutter
*   **Backend:** Node.js with Express.js
*   **AI / ML:** Python, TensorFlow / Keras, OpenCV
*   **Database:** MongoDB Atlas
*   **Cloud Storage:** AWS S3 / Firebase Storage
*   **Deployment:** Vercel (Frontend), Render / Railway (Backend), Separate Flask server (AI)
*   **Authentication:** JWT (JSON Web Tokens)

### 7. Data Requirements
#### 7.1 Dataset
*   **Dataset:** PlantVillage Dataset (publicly available)
*   **Volume:** 50,000+ labeled plant leaf images
*   **Species:** Tomato, Potato, Corn, Apple, Grape, and more
*   **Labels:** Healthy vs. diseased (multi-class classification)

#### 7.2 Image Preprocessing
*   Resize all images to 224 x 224 pixels
*   Normalize pixel values to [0, 1] range
*   Apply data augmentation (rotation, flipping, zoom) to improve model generalization
*   Remove noisy or corrupted images from training set

### 8. Functional Requirements
#### 8.1 User Authentication
*   Users can register with name, email, and password
*   Passwords stored securely using bcrypt hashing
*   Login returns a JWT token valid for session management
*   Protected routes require valid JWT in request header

#### 8.2 Image Upload
*   Web: drag-and-drop or file browser upload
*   Mobile: native camera capture or gallery picker
*   Accepted formats: JPEG, PNG (max 5 MB)
*   Image uploaded to cloud storage (S3/Firebase) before processing

#### 8.3 Disease Detection
*   Image forwarded from backend to Flask AI service via REST
*   CNN model returns predicted disease class and confidence %
*   Result stored in Predictions collection linked to userId

#### 8.4 History Tracking
*   Users can view all past prediction records
*   Each record shows image thumbnail, disease name, confidence, and date
*   Option to delete individual history records

#### 8.5 Treatment Suggestions
*   Based on predicted disease, system returns curated treatment steps
*   Includes recommended pesticides, organic remedies, and preventive actions

### 9. Non-Functional Requirements
*   **Performance:** Prediction response time under 5 seconds end-to-end
*   **Scalability:** Support concurrent users with horizontal scaling
*   **Security:** JWT auth, HTTPS, input sanitization, secure image handling
*   **Usability:** Farmer-friendly UI, minimal steps to get a result
*   **Availability:** 99.5% uptime target; graceful error handling for offline scenarios
*   **Compatibility:** Web: modern browsers; Mobile: Android 8+, iOS 13+

### 10. AI Model Requirements
#### 10.1 Architecture
*   **Model Type:** Convolutional Neural Network (CNN)
*   **Base Architecture:** Transfer learning using MobileNetV2 or VGG16
*   **Input:** 224 x 224 RGB image tensor
*   **Output:** Softmax probability distribution across disease classes

#### 10.2 Model Layers
*   Convolutional Layers — feature extraction from leaf texture/color
*   Max Pooling Layers — spatial dimensionality reduction
*   Dropout Layers — regularization to prevent overfitting
*   Fully Connected (Dense) Layers — learned classification
*   Output Layer — Softmax activation, N classes

#### 10.3 Training Details
*   Optimizer: Adam with learning rate 0.001
*   Loss Function: Categorical Crossentropy
*   Target Accuracy: > 90% on validation set
*   Model saved as .h5 file and served via Flask REST API

### 11. Database Design
#### 11.1 Users Collection
*   **Id:** Auto-generated unique identifier
*   **Name:** Full name of the user
*   **Email:** Unique email address (indexed)
*   **Password:** Bcrypt-hashed password

#### 11.2 Predictions Collection
*   **Id:** Auto-generated unique identifier
*   **userId:** Reference to the user who uploaded
*   **imageUrl:** Cloud storage URL of the uploaded image
*   **disease:** Predicted disease class name
*   **confidence:** Prediction confidence score (0.0 — 1.0)
*   **date:** Timestamp of the prediction

### 12. API Design
#### 12.1 Authentication Endpoints
*   `POST /api/register` - Register a new account
*   `POST /api/login` - Authenticate and receive JWT token

#### 12.2 Prediction Endpoints
*   `POST /api/predict` - Upload image and get disease prediction
*   `GET /api/history` - Retrieve prediction history for logged-in user
*   `DELETE /api/history/:id` - Delete a specific prediction record

### 13. UI / UX Design
#### 13.1 App Screens
*   **Splash Screen:** Animated logo with brand name and tagline
*   **Login / Signup:** Clean form with email, password; social login optional
*   **Home Screen:** Upload image CTA (camera + gallery), recent prediction preview
*   **Result Screen:** Disease name, confidence bar, description, treatment steps
*   **History Screen:** Scrollable list of past predictions with thumbnails and dates

#### 13.2 Design Principles
*   Minimal and intuitive interface optimized for low-literacy rural users
*   High contrast colors and large tap targets for field use
*   Offline-first state management for unreliable connectivity
*   Localized text (English, Telugu, Hindi) via i18n framework

### 14. Success Metrics
*   **Model Accuracy:** > 90% on PlantVillage validation set
*   **Response Time:** < 5 seconds from image upload to result display
*   **User Retention:** > 60% monthly active user return rate
*   **Prediction Volume:** > 1,000 predictions per week at launch
*   **User Satisfaction:** > 4.0 / 5.0 average app store rating

### 15. Risks & Challenges
*   **Poor image quality reducing accuracy:** Implement image quality check before processing; prompt user to retake
*   **Limited dataset for uncommon crops:** Use transfer learning & data augmentation; expand dataset iteratively
*   **AI model deployment complexity:** Containerize Flask API with Docker; use managed platforms (Render)
*   **Internet dependency in rural areas:** Cache last results locally; design for intermittent connectivity
*   **Model bias / hallucinated results:** Display confidence threshold; show "uncertain" below 60% confidence

### 16. Future Enhancements
*   Expand support to additional plant species and regional crops
*   Real-time camera detection using live video feed
*   Integration with IoT soil and weather sensors
*   GPS-based crop advisory system tailored to location
*   AI chatbot for farmers to ask follow-up questions
*   Drone-based aerial crop monitoring (long-term roadmap)
*   Government scheme notifications and subsidy alerts

### 17. Conclusion
This PRD defines the complete requirements for the AI-Based Plant Disease Detection System — a practical, impactful application of deep learning in agriculture. By combining a trained CNN model with a robust full-stack web and mobile platform, the system empowers farmers to detect crop diseases early, take informed action, and ultimately reduce agricultural losses.
