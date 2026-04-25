import React from 'react';
import { getScoreRingColor } from '../../utils/scoreColors';

const CircularProgress = ({ score, label, size = 120 }) => {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const strokeColor = getScoreRingColor(score);

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90">
          <circle
            cx={size/2}
            cy={size/2}
            r={radius}
            fill="transparent"
            stroke="#eee"
            strokeWidth="8"
          />
          <circle
            cx={size/2}
            cy={size/2}
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">
            {score}%
          </span>
        </div>
      </div>

      <span>{label}</span>
    </div>
  );
};


const ScoreOverview = ({ result }) => {

  const score = result?.match_score || 0;
  const qualified = result?.qualified || false;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-8">
        Resume Match Overview
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        <CircularProgress
          score={score}
          label="Job Match"
        />

        <div>
          <h3 className="font-bold mb-3">
            Matched Skills
          </h3>

          {(result?.matched_skills || []).map((skill,i)=>(
            <span
              key={i}
              className="inline-block m-1 px-3 py-1 bg-green-100 rounded"
            >
              {skill}
            </span>
          ))}
        </div>

        <div>
          <h3 className="font-bold mb-3">
            Missing Skills
          </h3>

          {(result?.missing_skills || []).map((skill,i)=>(
            <span
              key={i}
              className="inline-block m-1 px-3 py-1 bg-red-100 rounded"
            >
              {skill}
            </span>
          ))}

          <p className="mt-6 font-semibold">
            Qualified:
            {qualified ? " Yes" : " No"}
          </p>
        </div>

      </div>
    </div>
  );
};

export default ScoreOverview;