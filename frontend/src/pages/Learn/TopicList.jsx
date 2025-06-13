import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';

const TopicList = () => {
  const [searchParams] = useSearchParams();
  const selectedTopic = searchParams.get('topic');

  const topics = {
    'operating-systems': {
      title: 'Operating Systems',
      icon: '💻',
      description: 'Learn about the software that manages computer hardware and software resources.',
      lessons: [
        { id: 1, title: 'Introduction to Operating Systems', duration: '15 min', completed: true },
        { id: 2, title: 'Process Management', duration: '20 min', completed: true },
        { id: 3, title: 'Memory Management', duration: '25 min', completed: false },
        { id: 4, title: 'File Systems', duration: '18 min', completed: false },
        { id: 5, title: 'I/O Management', duration: '22 min', completed: false },
        { id: 6, title: 'Deadlocks', duration: '20 min', completed: false }
      ]
    },
    'databases': {
      title: 'Databases',
      icon: '🗄️',
      description: 'Master database concepts, SQL, and data management principles.',
      lessons: [
        { id: 1, title: 'Database Fundamentals', duration: '12 min', completed: true },
        { id: 2, title: 'Relational Model', duration: '18 min', completed: false },
        { id: 3, title: 'SQL Basics', duration: '25 min', completed: false },
        { id: 4, title: 'Database Design', duration: '30 min', completed: false },
        { id: 5, title: 'Normalization', duration: '22 min', completed: false },
        { id: 6, title: 'Transactions and ACID', duration: '20 min', completed: false }
      ]
    },
    'algorithms': {
      title: 'Algorithms',
      icon: '🧮',
      description: 'Explore algorithmic thinking and problem-solving techniques.',
      lessons: [
        { id: 1, title: 'Algorithm Analysis', duration: '20 min', completed: false },
        { id: 2, title: 'Sorting Algorithms', duration: '25 min', completed: false },
        { id: 3, title: 'Searching Algorithms', duration: '18 min', completed: false },
        { id: 4, title: 'Divide and Conquer', duration: '22 min', completed: false },
        { id: 5, title: 'Dynamic Programming', duration: '30 min', completed: false },
        { id: 6, title: 'Greedy Algorithms', duration: '20 min', completed: false }
      ]
    }
  };

  const currentTopic = selectedTopic ? topics[selectedTopic] : null;

  if (currentTopic) {
    return (
      <div className="space-y-6">
        {/* Topic Header */}
        <Card className="bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex items-center space-x-4">
            <div className="text-5xl">{currentTopic.icon}</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {currentTopic.title}
              </h1>
              <p className="text-gray-600">
                {currentTopic.description}
              </p>
            </div>
          </div>
        </Card>

        {/* Progress Overview */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Course Progress
            </h2>
            <div className="text-sm text-gray-600">
              {currentTopic.lessons.filter(l => l.completed).length} of {currentTopic.lessons.length} completed
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-secondary-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(currentTopic.lessons.filter(l => l.completed).length / currentTopic.lessons.length) * 100}%` 
              }}
            ></div>
          </div>
        </Card>

        {/* Lessons List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Lessons</h2>
          {currentTopic.lessons.map((lesson) => (
            <Card 
              key={lesson.id} 
              className={`border-l-4 ${
                lesson.completed 
                  ? 'border-l-secondary-500 bg-secondary-50' 
                  : 'border-l-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    lesson.completed 
                      ? 'bg-secondary-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {lesson.completed ? '✓' : lesson.id}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Duration: {lesson.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {lesson.completed && (
                    <span className="text-secondary-600 text-sm font-medium">
                      Completed
                    </span>
                  )}
                  <Button 
                    variant={lesson.completed ? "outline" : "primary"} 
                    size="sm"
                  >
                    {lesson.completed ? 'Review' : 'Start'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show all topics if none selected
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Choose a Topic to Learn 📚
        </h1>
        <p className="text-lg text-gray-600">
          Select a CS fundamental topic to start your learning journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(topics).map(([key, topic]) => (
          <Card key={key} className="text-center" hover>
            <div className="text-4xl mb-4">{topic.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {topic.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {topic.description}
            </p>
            <div className="text-sm text-gray-500 mb-4">
              {topic.lessons.length} lessons
            </div>
            <Button 
              variant="primary" 
              className="w-full"
              onClick={() => window.location.href = `/learn/topics?topic=${key}`}
            >
              Start Learning
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TopicList;