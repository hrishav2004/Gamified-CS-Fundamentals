import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';

const ResourceCard = () => {
  const { id } = useParams();

  // Mock resource data - in real app, this would come from API
  const resource = {
    id: id,
    title: 'Process Management in Operating Systems',
    topic: 'Operating Systems',
    difficulty: 'Intermediate',
    duration: '20 minutes',
    content: {
      overview: 'Learn about how operating systems manage processes, including process creation, scheduling, and termination.',
      sections: [
        {
          title: 'What is a Process?',
          content: 'A process is a program in execution. It includes the program code, current activity, and allocated resources.',
          keyPoints: [
            'Process vs Program distinction',
            'Process states (New, Ready, Running, Waiting, Terminated)',
            'Process Control Block (PCB)'
          ]
        },
        {
          title: 'Process Creation',
          content: 'Processes can create other processes through system calls like fork() in Unix systems.',
          keyPoints: [
            'Parent and child processes',
            'Process hierarchy',
            'Resource sharing between processes'
          ]
        },
        {
          title: 'Process Scheduling',
          content: 'The OS scheduler determines which process runs at any given time.',
          keyPoints: [
            'Scheduling algorithms (FCFS, SJF, Round Robin)',
            'Context switching',
            'Scheduling criteria (CPU utilization, throughput, response time)'
          ]
        }
      ],
      examples: [
        {
          title: 'Process States Diagram',
          description: 'Visual representation of how processes transition between different states.'
        },
        {
          title: 'Fork() System Call Example',
          description: 'Code example showing how new processes are created in Unix systems.'
        }
      ]
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-primary-600 font-medium">{resource.topic}</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">{resource.difficulty}</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">{resource.duration}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {resource.title}
            </h1>
            <p className="text-gray-600">
              {resource.content.overview}
            </p>
          </div>
          <div className="text-4xl">💻</div>
        </div>
      </Card>

      {/* Content Sections */}
      <div className="space-y-6">
        {resource.content.sections.map((section, index) => (
          <Card key={index}>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {section.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {section.content}
            </p>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Key Points:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {section.keyPoints.map((point, pointIndex) => (
                  <li key={pointIndex}>{point}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      {/* Examples Section */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Examples & Illustrations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resource.content.examples.map((example, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">
                {example.title}
              </h3>
              <p className="text-sm text-gray-600">
                {example.description}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Navigation */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 mb-1">
              Ready to test your knowledge?
            </h3>
            <p className="text-sm text-gray-600">
              Take a quiz on this topic to reinforce your learning.
            </p>
          </div>
          <div className="flex space-x-3">
            <Link to="/learn/topics?topic=operating-systems">
              <Button variant="outline">
                Back to Lessons
              </Button>
            </Link>
            <Link to="/practice/setup?topic=Operating Systems">
              <Button variant="primary">
                Take Quiz
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Progress Tracking */}
      <Card className="bg-secondary-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Lesson Completed!
              </h3>
              <p className="text-sm text-gray-600">
                You've earned 50 XP for completing this lesson.
              </p>
            </div>
          </div>
          <div className="text-2xl">🎉</div>
        </div>
      </Card>
    </div>
  );
};

export default ResourceCard;