import React from "react";
import { getScoreColor, getScoreBgColor } from "../../utils/scoreColors";
import { Target, Check, X, Award } from "lucide-react";

const SkillTag = ({ label, type }) => (
  <span
    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
      type === "matched"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {label}
  </span>
);

const MatchPanel = ({ result }) => {
  const score = result?.match_score || 0;
  const matchedSkills = result?.matched_skills || [];
  const missingSkills = result?.missing_skills || [];
  const qualified = result?.qualified || false;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-5">
          <h3 className="text-lg font-bold text-gray-900">
            Job Match Analysis
          </h3>

          <div className="text-right">
            <div className={`text-3xl font-black ${getScoreColor(score)}`}>
              {score}%
            </div>
            <p className="text-xs text-gray-400 uppercase font-bold">
              Match Score
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-5">
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${getScoreBgColor(score)} transition-all duration-700`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Qualified */}
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold ${
            qualified
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          <Award className="w-4 h-4" />
          {qualified
            ? "You appear qualified for this role"
            : "You may need more matching skills"}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-8">

        {/* Matched Skills */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-bold mb-3">
            <Check className="w-4 h-4 text-green-500" />
            Matched Skills ({matchedSkills.length})
          </h4>

          {matchedSkills.length ? (
            <div className="flex flex-wrap gap-2">
              {matchedSkills.map((skill, i) => (
                <SkillTag
                  key={i}
                  label={skill}
                  type="matched"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No matched skills detected.
            </p>
          )}
        </div>

        {/* Missing Skills */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-bold mb-3">
            <X className="w-4 h-4 text-red-500" />
            Missing Skills ({missingSkills.length})
          </h4>

          {missingSkills.length ? (
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, i) => (
                <SkillTag
                  key={i}
                  label={skill}
                  type="missing"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No major skill gaps found.
            </p>
          )}
        </div>

        {/* Recommendation */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <h4 className="flex items-center gap-2 text-sm font-bold text-indigo-700 mb-2">
            <Target className="w-4 h-4" />
            Recommendation
          </h4>

          <p className="text-sm text-indigo-700 leading-relaxed">
            Add more of the missing job keywords into projects, skills section,
            and resume summary to improve your match score.
          </p>
        </div>

      </div>
    </div>
  );
};

export default MatchPanel;