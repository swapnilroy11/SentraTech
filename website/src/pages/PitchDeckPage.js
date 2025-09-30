import React from 'react';
import PitchDeck from '../components/PitchDeck';
import SEOManager from '../components/SEOManager';

const PitchDeckPage = () => {
  return (
    <>
      <SEOManager 
        title="SentraTech Pitch Deck - Pre-Seed Investment Opportunity"
        description="Interactive pitch deck for SentraTech's $2.5M pre-seed funding round. AI-powered customer support automation startup seeking strategic investors."
        keywords="SentraTech pitch deck, pre-seed funding, AI customer support, investment opportunity, startup pitch"
      />
      <PitchDeck />
    </>
  );
};

export default PitchDeckPage;