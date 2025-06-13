import React, { createContext, useContext, useState } from 'react';
import { quizService } from '../services/quizService';

const QuizContext = createContext();

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchQuizzes = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await quizService.getQuizzes(filters);
      setQuizzes(response.quizzes);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizById = async (id) => {
    setLoading(true);
    try {
      const response = await quizService.getQuizById(id);
      setCurrentQuiz(response.quiz);
      return response.quiz;
    } catch (error) {
      console.error('Failed to fetch quiz:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async (quizId, answers, timeSpent) => {
    try {
      const response = await quizService.submitQuiz(quizId, answers, timeSpent);
      setQuizResults(response.performance);
      return response;
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      throw error;
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setQuizResults(null);
  };

  const value = {
    quizzes,
    currentQuiz,
    quizResults,
    loading,
    fetchQuizzes,
    fetchQuizById,
    submitQuiz,
    resetQuiz
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};