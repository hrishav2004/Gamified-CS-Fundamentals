import React, { createContext, useContext, useState } from 'react';
import { challengeService } from '../services/challengeService';

const ChallengeContext = createContext();

export const useChallenge = () => {
  const context = useContext(ChallengeContext);
  if (!context) {
    throw new Error('useChallenge must be used within a ChallengeProvider');
  }
  return context;
};

export const ChallengeProvider = ({ children }) => {
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [challengeResult, setChallengeResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendChallengeInvite = async (friendId, quizId, message) => {
    try {
      const response = await challengeService.sendInvite(friendId, quizId, message);
      return response;
    } catch (error) {
      console.error('Failed to send challenge invite:', error);
      throw error;
    }
  };

  const acceptChallenge = async (challengeId) => {
    try {
      const response = await challengeService.acceptChallenge(challengeId);
      return response;
    } catch (error) {
      console.error('Failed to accept challenge:', error);
      throw error;
    }
  };

  const fetchActiveChallenges = async () => {
    setLoading(true);
    try {
      const response = await challengeService.getActiveChallenges();
      setActiveChallenges(response.challenges);
    } catch (error) {
      console.error('Failed to fetch active challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const startChallenge = (challenge) => {
    setCurrentChallenge(challenge);
  };

  const finishChallenge = (result) => {
    setChallengeResult(result);
    setCurrentChallenge(null);
  };

  const resetChallenge = () => {
    setCurrentChallenge(null);
    setChallengeResult(null);
  };

  const value = {
    activeChallenges,
    currentChallenge,
    challengeResult,
    loading,
    sendChallengeInvite,
    acceptChallenge,
    fetchActiveChallenges,
    startChallenge,
    finishChallenge,
    resetChallenge
  };

  return (
    <ChallengeContext.Provider value={value}>
      {children}
    </ChallengeContext.Provider>
  );
};