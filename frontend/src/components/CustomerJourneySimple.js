import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, ArrowRight, Clock, Users, BarChart3, Zap } from 'lucide-react';

const CustomerJourneySimple = () => {
  const [selectedStage, setSelectedStage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Journey stages data - lightweight version
  const journeyStages = [
    {
      id: 1,
      title: "Initial Contact",
      description: "Customer reaches out via preferred channel",
      details: "Multi-channel intake system captures customer intent and context across phone, email, chat, and social media. AI instantly analyzes sentiment and urgency.",
      icon: Users,
      color: '#00FF41',
      metrics: ["<5s", "Response Time", "99.9%", "Channel Uptime"]
    },
    {
      id: 2,
      title: "AI Analysis",
      description: "Sub-50ms intent classification and routing",
      details: "Advanced NLP and machine learning models analyze customer intent, historical context, and emotional state to determine optimal routing and response strategy.",
      icon: BarChart3,
      color: '#00DDFF',
      metrics: ["47ms", "Avg Analysis Time", "94%", "Intent Accuracy"]
    },
    {
      id: 3,
      title: "Smart Routing",
      description: "Optimal agent matching or automation",
      details: "Intelligent routing engine matches customers to the best-suited agent based on expertise, availability, and customer profile. 70% of interactions are fully automated.",
      icon: Zap,
      color: '#FFD700',
      metrics: ["70%", "Automation Rate", "15%", "Routing Time"]
    },
    {
      id: 4,
      title: "Resolution",
      description: "Efficient problem solving with AI assistance",
      details: "Agents are empowered with real-time AI insights, suggested responses, and knowledge base integration. Continuous learning improves resolution quality.",
      icon: Clock,
      color: '#00FF41',
      metrics: ["4.2 min", "Avg Handle Time", "96%", "First Call Resolution"]
    }
  ];

  return (
    <div className="py-12">
      {/* Lightweight Timeline Visualization */}
      <div className="flex items-center justify-between max-w-4xl mx-auto mb-12">
        {journeyStages.map((stage, index) => (
          <div key={stage.id} className="flex flex-col items-center">
            <button
              onClick={() => {
                setSelectedStage(stage);
                setShowModal(true);
              }}
              className="relative group mb-4"
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 hover:scale-110"
                style={{ 
                  backgroundColor: `${stage.color}20`,
                  borderColor: stage.color
                }}
              >
                <stage.icon size={24} style={{ color: stage.color }} />
              </div>
              
              {/* Connecting Line */}
              {index < journeyStages.length - 1 && (
                <div 
                  className="absolute top-8 left-16 w-20 h-0.5 -z-10"
                  style={{ backgroundColor: stage.color, opacity: 0.6 }}
                />
              )}
            </button>
            
            <div className="text-center max-w-32">
              <h3 className="text-sm font-semibold text-white mb-1">{stage.title}</h3>
              <p className="text-xs text-gray-400">{stage.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stage Details Modal */}
      {showModal && selectedStage && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <Card className="bg-[rgb(26,28,30)] border-2 border-[#00FF41] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#00FF41]/20 rounded-xl flex items-center justify-center border border-[#00FF41]/50">
                    <selectedStage.icon size={24} className="text-[#00FF41]" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">{selectedStage.title}</CardTitle>
                    <p className="text-[#00FF41]">Stage {selectedStage.id} of 4</p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowModal(false)}
                  size="sm"
                  variant="ghost"
                  className="text-[rgb(161,161,170)] hover:text-white"
                >
                  <X size={20} />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Process Details</h4>
                <p className="text-[rgb(218,218,218)] leading-relaxed">
                  {selectedStage.details}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Key Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-[rgb(38,40,42)] rounded-xl border border-[rgb(63,63,63)]">
                    <div className="text-2xl font-bold text-[#00FF41] mb-1">{selectedStage.metrics[0]}</div>
                    <div className="text-[rgb(161,161,170)] text-sm">{selectedStage.metrics[1]}</div>
                  </div>
                  <div className="text-center p-4 bg-[rgb(38,40,42)] rounded-xl border border-[rgb(63,63,63)]">
                    <div className="text-2xl font-bold text-[#00DDFF] mb-1">{selectedStage.metrics[2]}</div>
                    <div className="text-[rgb(161,161,170)] text-sm">{selectedStage.metrics[3]}</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[rgb(63,63,63)]">
                <Button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-[#00FF41] text-[rgb(17,17,19)] hover:bg-[#00e83a] rounded-xl"
                >
                  Continue Journey
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CustomerJourneySimple;