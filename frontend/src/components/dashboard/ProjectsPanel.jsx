import React from "react";
import { Briefcase, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { getScoreColor, getScoreBgColor } from "../../utils/scoreColors";

const ProjectsPanel = ({ result }) => {

  const resumeSkills = result?.resume_skills || [];
  const matchedSkills = result?.matched_skills || [];
  const missingSkills = result?.missing_skills || [];
  const score = result?.match_score || 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-4">

          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-bold text-gray-900">
              Project Relevance
            </h3>
          </div>

          <div className="text-right">
            <span className={`text-2xl font-black ${getScoreColor(score)}`}>
              {score}%
            </span>

            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
              Relevance
            </p>
          </div>

        </div>

        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={getScoreBgColor(score)}
            style={{ width: `${score}%`, height:"100%" }}
          />
        </div>
      </div>


      {/* Body */}
      <div className="p-6 space-y-6">

        {/* Skills Found */}
        <div>
          <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Resume Skills Found
          </h4>

          <div className="flex flex-wrap gap-2">
            {resumeSkills.map((skill,i)=>(
              <span
                key={i}
                className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>


        {/* Relevant Skills */}
        <div>
          <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Skills Relevant to Job
          </h4>

          <div className="flex flex-wrap gap-2">
            {matchedSkills.length ? (
              matchedSkills.map((skill,i)=>(
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No relevant project skills detected.
              </p>
            )}
          </div>
        </div>


        {/* Missing Skills */}
        <div>
          <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            Skills To Add In Projects
          </h4>

          <div className="flex flex-wrap gap-2">
            {missingSkills.length ? (
              missingSkills.map((skill,i)=>(
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No missing skills detected.
              </p>
            )}
          </div>
        </div>


        {/* Suggestion Box */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <h4 className="font-bold text-indigo-700 mb-2">
            Project Improvement Tip
          </h4>

          <p className="text-sm text-indigo-700 leading-relaxed">
            Add projects involving{" "}
            {missingSkills.slice(0,3).join(", ") || "job-relevant skills"}
            {" "}to increase project relevance and ATS score.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ProjectsPanel;