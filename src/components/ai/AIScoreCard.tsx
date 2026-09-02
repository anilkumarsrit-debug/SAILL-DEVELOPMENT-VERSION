import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Sparkles, Award } from 'lucide-react';

export interface AIScoreCardProps {
  score: number;
  label: string;
  feedback: string;
  metrics?: { name: string; score: number }[];
}

export const AIScoreCard: React.FC<AIScoreCardProps> = ({
  score,
  label,
  feedback,
  metrics
}) => {
  const getScoreColor = (val: number) => {
    if (val >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (val >= 70) return 'text-[#D35400] bg-[#FFF8F0] border-[#FAD7A0]';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <Card className="border-[#FAD7A0] shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#D35400]" />
          <CardTitle>{label}</CardTitle>
        </div>
        <Badge variant={score >= 85 ? 'success' : score >= 70 ? 'primary' : 'danger'}>
          <Award className="w-3.5 h-3.5 mr-1 inline" />
          {score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Practice'}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-serif font-extrabold ${getScoreColor(
              score
            )} shadow-xs`}
          >
            <span className="text-2xl">{score}</span>
            <span className="text-[10px] uppercase font-sans tracking-wider font-bold">/ 100</span>
          </div>
          <p className="text-xs sm:text-sm text-[#5D6D7E] flex-1 leading-relaxed bg-[#FFF8F0]/50 p-3 rounded-xl border border-[#FAD7A0]/50">
            {feedback}
          </p>
        </div>

        {metrics && metrics.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            {metrics.map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#2C3E50]">
                  <span>{m.name}</span>
                  <span>{m.score}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#E67E22] to-[#D35400] transition-all duration-300 rounded-full"
                    style={{ width: `${m.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
