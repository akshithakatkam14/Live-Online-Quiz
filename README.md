# 🎯 Live Online Quiz Application

A modern, responsive web-based quiz application with user authentication, multiple topics, and real-time leaderboard tracking.



## ✨ Features

### 🔐 Authentication System
- **User Registration** - Create account with name, email, and password
- **User Login** - Secure login with email/password
- **Session Management** - Persistent login sessions
- **Logout Functionality** - Easy account logout

### 📚 Quiz Features
- **Multiple Topics** - 10+ quiz categories including:
  - General Knowledge
  - Programming
  - Science
  - History
  - Sports
  - Movies
  - Geography
  - Math
  - Technology
  - Literature
- **Randomized Questions** - Questions shuffled for each quiz
- **Real-time Progress** - Visual progress bar and question counter
- **Instant Feedback** - Immediate correct/incorrect answers
- **Score Tracking** - Points system with configurable scoring
- **Leaderboard** - Top scores with timestamps
- **Statistics** - Quiz performance analytics

### 🎨 Modern UI/UX
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Beautiful Animations** - Smooth transitions and gradient backgrounds
- **Glass-morphism Design** - Modern backdrop blur effects
- **Intuitive Interface** - User-friendly navigation
- **Error Handling** - Clear error and success messages

### 🔧 Admin Panel
- **Question Management** - Add, edit, and view questions
- **Score Management** - View and clear all scores
- **Statistics Dashboard** - Comprehensive quiz statistics
- **Settings Configuration** - Customize questions per quiz and points per answer

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required!



## 📱 How to Use

### 1. Authentication
- **Sign Up**: Click "Sign Up" tab, fill in your details, and create an account
- **Login**: Click "Login" tab, enter your email and password
- **Logout**: Click the "Logout" button when done

### 2. Taking a Quiz
1. Enter your display name (can be different from account name)
2. Select a topic from the dropdown
3. Click "Start Quiz"
4. Answer questions by clicking on options
5. View your score and accuracy at the end
6. Check the leaderboard to see your ranking

### 3. Admin Panel
1. Click "Admin Panel" button
2. Navigate through tabs:
   - **Questions**: Add new questions or view existing ones
   - **Scores**: View and manage all quiz scores
   - **Statistics**: View quiz analytics
   - **Settings**: Configure quiz parameters

## 🛠️ Project Structure

```
quiz-application/
├── public/
│   └── quiz/
│       ├── index.html          # Main HTML file
│       ├── style.css           # Complete CSS with responsive design
│       ├── app.js              # JavaScript with authentication & quiz logic
│       └── README.md           # This file
└── README.md                   # Main project README
```

## 🔧 Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with:
  - CSS Grid and Flexbox
  - Custom properties (CSS Variables)
  - Animations and transitions
  - Glass-morphism effects
- **Vanilla JavaScript (ES6+)** - Pure JavaScript, no frameworks:
  - Classes and modules
  - LocalStorage API
  - DOM manipulation
  - Event handling

## 📊 Data Storage

The application uses **localStorage** for client-side data persistence:

- **Users** - Registered user accounts
- **Questions** - Quiz questions database
- **Scores** - Quiz results and leaderboard
- **Settings** - Application configuration

## 🎯 Features in Detail

### Question Management
- Add questions with multiple choice options
- Categorize questions by topic
- View all questions in JSON format
- Automatic question ID generation

### Scoring System
- Configurable points per correct answer (default: 20)
- Total score calculation
- Accuracy percentage calculation
- Leaderboard ranking by score

### Statistics
- Total questions in database
- Total quiz attempts
- Average score across all quizzes
- Questions per topic breakdown

## 🔒 Security Notes

- **Client-side Authentication**: This is a demo application with client-side authentication
- **localStorage**: All data is stored locally in the browser
- **No Server**: No backend server required
- **For Production**: Consider implementing server-side authentication and database storage







## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Akshithakatkam**
- GitHub: [@akshithakatkam14](https://github.com/akshithakatkam14)
- Email: akshithakatkam14@gmail.com

## 🙏 Acknowledgments

- Modern CSS techniques for glass-morphism effects
- Vanilla JavaScript for lightweight, fast performance
- Responsive design principles for mobile-first development
- Community feedback and suggestions

---

⭐ **Star this repository if you found it helpful!**

🌟 **Enjoy quizzing!**
