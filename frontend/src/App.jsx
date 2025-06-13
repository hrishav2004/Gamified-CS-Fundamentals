import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QuizProvider } from './contexts/QuizContext';
import { PerformanceProvider } from './contexts/PerformanceContext';
import { ChallengeProvider } from './contexts/ChallengeContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Dashboard Pages
import Overview from './pages/Dashboard/Overview';
import LearnLink from './pages/Dashboard/LearnLink';
import PracticeLink from './pages/Dashboard/PracticeLink';

// Learn Pages
import TopicList from './pages/Learn/TopicList';
import ResourceCard from './pages/Learn/ResourceCard';

// Practice Pages
import QuizSetup from './pages/Practice/QuizSetup';
import QuizPlay from './pages/Practice/QuizPlay';
import MahaQuiz from './pages/Practice/MahaQuiz';

// Performance Pages
import PerformanceHistory from './pages/Performance/PerformanceHistory';
import PerformanceChart from './pages/Performance/PerformanceChart';

// Friends Pages
import FriendList from './pages/Friends/FriendList';
import ChallengeInvite from './pages/Friends/ChallengeInvite';
import ChallengePlay from './pages/Friends/ChallengePlay';
import ChallengeResult from './pages/Friends/ChallengeResult';

// Admin Pages
import QuestionReview from './pages/Admin/QuestionReview';
import UserManagement from './pages/Admin/UserManagement';

function App() {
  return (
    <AuthProvider>
      <QuizProvider>
        <PerformanceProvider>
          <ChallengeProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  {/* Auth Routes */}
                  <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                  </Route>

                  {/* Dashboard Routes */}
                  <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<Overview />} />
                    <Route path="learn" element={<LearnLink />} />
                    <Route path="practice" element={<PracticeLink />} />
                    
                    {/* Learn Routes */}
                    <Route path="learn/topics" element={<TopicList />} />
                    <Route path="learn/resource/:id" element={<ResourceCard />} />
                    
                    {/* Practice Routes */}
                    <Route path="practice/setup" element={<QuizSetup />} />
                    <Route path="practice/quiz/:id" element={<QuizPlay />} />
                    <Route path="practice/maha-quiz" element={<MahaQuiz />} />
                    
                    {/* Performance Routes */}
                    <Route path="performance" element={<PerformanceHistory />} />
                    <Route path="performance/chart" element={<PerformanceChart />} />
                    
                    {/* Friends Routes */}
                    <Route path="friends" element={<FriendList />} />
                    <Route path="friends/challenge/invite" element={<ChallengeInvite />} />
                    <Route path="friends/challenge/play/:id" element={<ChallengePlay />} />
                    <Route path="friends/challenge/result/:id" element={<ChallengeResult />} />
                    
                    {/* Admin Routes */}
                    <Route path="admin/questions" element={<QuestionReview />} />
                    <Route path="admin/users" element={<UserManagement />} />
                  </Route>
                </Routes>
              </div>
            </Router>
          </ChallengeProvider>
        </PerformanceProvider>
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;