import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import EvaluationNotes from './EvaluationNotes';
import ParentEvaluations from '../components/ParentEvaluations';

const Evaluations = () => {
  const { userRole } = useAuth();

  // For parents, show the parent version of evaluations
  if (userRole === 'orang_tua') {
    return <ParentEvaluations />;
  }

  // For teachers and other roles, show the teacher version
  return <EvaluationNotes />;
};

export default Evaluations;
