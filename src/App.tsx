import './App.css'
import MarkdownEditor from './components/MarkdownEditor'
import ForgotPasswordScreen from './screens/auth/forgotpassword';
import LoginScreen from './screens/auth/login';
import SignupScreen from './screens/auth/signup';
import HomePage from './screens/home'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/editor/:documentId" element={<MarkdownEditor />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App
