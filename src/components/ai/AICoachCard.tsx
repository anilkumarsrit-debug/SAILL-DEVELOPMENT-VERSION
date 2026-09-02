import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Bot, Lightbulb } from 'lucide-react';

export interface AICoachCardProps {
  coachName?: string;
  advice: string;
  suggestions?: string[];
  actionButton?: React.ReactNode;
}

export const AICoachCard: React.FC<AICoachCardProps> = ({
  coachName = 'SAILL AI Pronunciation Coach',
  advice,
  suggestions,
  actionButton
}) => {
  return (
    <Card className="bg-gradient-to-br from-[#FFF8F0] to-white border-[#FAD7A0]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#D35400] text-white rounded-xl shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>{coachName}</CardTitle>
            <span className="text-[11px] font-bold text-[#D35400] uppercase font-mono tracking-wider">
              Real-time Feedback
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs sm:text-sm text-[#2C3E50] leading-relaxed font-medium bg-white p-3.5 rounded-xl border border-[#FAD7A0]/60 shadow-2xs">
          "{advice}"
        </p>

        {suggestions && suggestions.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <h5 className="text-xs font-extrabold text-[#2C3E50] flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Actionable Tips:
            </h5>
            <ul className="space-y-1 pl-5 list-disc text-xs text-[#5D6D7E]">
              {suggestions.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {actionButton && <div className="pt-2">{actionButton}</div>}
      </CardContent>
    </Card>
  );
};
