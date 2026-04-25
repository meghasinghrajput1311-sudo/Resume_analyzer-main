import React, { useState } from "react";
import {
  Lightbulb,
  Check,
  Copy,
  Sparkles
} from "lucide-react";

const ActionCard = ({ action }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(action.example_rewrite);
    setCopied(true);
    setTimeout(() => setCopied(false),2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">

      <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
        {action.priority} Priority
      </span>

      <div>
        <h4 className="text-sm font-bold text-gray-900">
          {action.action}
        </h4>

        <p className="text-xs text-gray-500 italic mt-1">
          {action.reason}
        </p>
      </div>

      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100 relative">
        <div className="flex items-center mb-2">
          <Sparkles className="w-3 h-3 text-indigo-500 mr-1"/>
          <span className="text-[10px] font-bold uppercase text-indigo-600">
            Suggested Rewrite
          </span>
        </div>

        <p className="text-xs text-gray-700">
          {action.example_rewrite}
        </p>

        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-1"
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-500"/>
          ) : (
            <Copy className="w-3 h-3 text-gray-400"/>
          )}
        </button>
      </div>

    </div>
  );
};


const ImprovementPanel = ({ result }) => {

  const [activeTab, setActiveTab] = useState("Skills");

  const missingSkills = result?.missing_skills || [];

  const tabs = [
    "Skills",
    "Projects",
    "Keywords"
  ];


  const priority_actions = missingSkills.map(skill => ({
    section:"Skills",
    priority:"High",
    action:`Add ${skill} to Resume`,
    reason:`${skill} appears in job requirements but not your resume.`,
    example_rewrite:
      `Built practical projects using ${skill} and applied it in real-world tasks.`
  }));


  const projectActions = missingSkills.map(skill => ({
    section:"Projects",
    priority:"Medium",
    action:`Create project using ${skill}`,
    reason:`Projects help prove practical knowledge.`,
    example_rewrite:
      `Developed a project using ${skill} demonstrating hands-on implementation.`
  }));


  const keywordActions = missingSkills.map(skill => ({
    section:"Keywords",
    priority:"High",
    action:`Include keyword ${skill}`,
    reason:`Improve ATS keyword coverage.`,
    example_rewrite:
      `${skill}`
  }));


  const allActions = [
    ...priority_actions,
    ...projectActions,
    ...keywordActions
  ];


  const filteredActions =
    allActions.filter(
      item => item.section===activeTab
    );


  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      <div className="p-6 border-b border-gray-50">
        <div className="flex items-center space-x-2 mb-1">
          <Lightbulb className="w-5 h-5 text-indigo-500"/>
          <h3 className="text-lg font-bold">
            Improvement Plan
          </h3>
        </div>

        <p className="text-sm text-gray-500">
          Actions to improve your resume match.
        </p>
      </div>


      <div className="px-6 pt-4 border-b flex">
        {tabs.map(tab=>(
          <button
            key={tab}
            onClick={()=>setActiveTab(tab)}
            className={`px-4 py-3 text-xs font-bold border-b-2 ${
              activeTab===tab
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>


      <div className="p-6">
        {filteredActions.length > 0 ? (

          <div className="space-y-4">
            {filteredActions.map((action,idx)=>(
              <ActionCard
                key={idx}
                action={action}
              />
            ))}
          </div>

        ) : (

          <div className="text-center py-12">
            <Check className="w-8 h-8 mx-auto text-green-500 opacity-50"/>
            <p className="mt-4 font-bold text-gray-500">
              No major improvements needed
            </p>
          </div>

        )}
      </div>

    </div>
  );
};

export default ImprovementPanel;