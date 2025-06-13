import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Card from '../../components/Card';
import Button from '../../components/Button';

const QuestionReview = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('pending'); // pending, approved, all
  const [selectedTopic, setSelectedTopic] = useState('');

  const topics = [
    'Operating Systems',
    'Databases',
    'Networks',
    'Algorithms',
    'Data Structures',
    'Computer Architecture'
  ];

  useEffect(() => {
    loadQuestions();
  }, [filter, selectedTopic]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (filter === 'pending') filters.approved = 'false';
      if (filter === 'approved') filters.approved = 'true';
      if (selectedTopic) filters.topic = selectedTopic;

      const response = await adminService.getQuestions(filters);
      setQuestions(response.questions);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveQuestion = async (questionId) => {
    try {
      await adminService.approveQuestion(questionId);
      setQuestions(prev => prev.map(q => 
        q._id === questionId ? { ...q, isApproved: true } : q
      ));
    } catch (error) {
      console.error('Failed to approve question:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Question Review Panel ⚙️
        </h1>
        <p className="text-lg text-gray-600">
          Review and approve questions submitted by users.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field w-auto"
            >
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="all">All Questions</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="input-field w-auto"
            >
              <option value="">All Topics</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          <div className="flex-1"></div>
          
          <Button onClick={loadQuestions} loading={loading}>
            Refresh
          </Button>
        </div>
      </Card>

      {/* Questions List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
        </div>
      ) : questions.length === 0 ? (
        <Card className="text-center py-8">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No questions found
          </h3>
          <p className="text-gray-600">
            {filter === 'pending' 
              ? 'No questions pending review at the moment.'
              : 'No questions match your current filters.'
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <Card key={question._id} className="border-l-4 border-l-primary-500">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                    <span className="text-sm text-gray-600">{question.topic}</span>
                    <span className="text-sm text-gray-600">•</span>
                    <span className="text-sm text-gray-600">{question.points} points</span>
                    {question.isApproved && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        ✓ Approved
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {question.question}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded border ${
                          option.isCorrect 
                            ? 'border-green-300 bg-green-50 text-green-800' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {option.isCorrect && <span className="text-green-600">✓</span>}
                          <span>{option.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {question.explanation && (
                    <div className="p-3 bg-blue-50 rounded-lg mb-4">
                      <h4 className="font-medium text-blue-900 mb-1">Explanation:</h4>
                      <p className="text-blue-800 text-sm">{question.explanation}</p>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    Created by: {question.createdBy?.username || 'Unknown'} • 
                    {new Date(question.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="ml-4 flex flex-col space-y-2">
                  {!question.isApproved && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleApproveQuestion(question._id)}
                    >
                      Approve
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Review Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {questions.filter(q => !q.isApproved).length}
            </div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {questions.filter(q => q.isApproved).length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {questions.length}
            </div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(questions.map(q => q.createdBy?.username)).size}
            </div>
            <div className="text-sm text-gray-600">Contributors</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuestionReview;