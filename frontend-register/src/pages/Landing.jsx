import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Landing = () => {
  const navigate = useNavigate();

  const handleSelection = (isVgu) => {
    navigate(`/events?isVgu=${isVgu}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-primary">Welcome to Panache 2026</h1>
        <p className="mt-4 text-lg text-muted-foreground">The annual festival of fashion, innovation, and entrepreneurship.</p>
      </div>
      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Button onClick={() => handleSelection(true)} size="lg">
          I am a VGU Student
        </Button>
        <Button onClick={() => handleSelection(false)} variant="secondary" size="lg">
          I am from another college
        </Button>
      </div>
    </div>
  );
};

export default Landing;
