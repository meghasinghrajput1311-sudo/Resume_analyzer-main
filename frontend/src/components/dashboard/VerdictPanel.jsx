import React from "react";
import {
CheckCircle2,
AlertTriangle,
ArrowRightCircle,
Star
} from "lucide-react";

const VerdictPanel = ({ result }) => {

const score = result?.match_score || 0;
const qualified = result?.qualified || false;
const matched = result?.matched_skills || [];
const missing = result?.missing_skills || [];


/* dynamic verdict */
let grade="Needs Work";
if(score>=80) grade="Excellent";
else if(score>=65) grade="Strong";
else if(score>=50) grade="Good";

const summary =
qualified
? "Your resume shows promising alignment with this role."
: "Your resume has potential, but skill gaps reduce competitiveness.";

const strengths = [
`${matched.length} skills aligned with job`,
qualified
? "Candidate appears technically qualified"
: "Some relevant qualifications present",
"Resume contains transferable skills"
];

const gaps = missing.length
? missing.slice(0,4).map(skill=>`Missing ${skill}`)
: ["No major critical gaps found"];

const nextSteps = [
"Add missing skills to projects or experience",
"Tailor resume summary to this job",
"Improve ATS keyword coverage"
];

return (
<div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">

{/* Header */}
<div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 text-white">

<div className="flex justify-between items-start flex-wrap gap-6">

<div>
<div className="flex items-center gap-2 mb-3">
<Star className="w-5 h-5 fill-indigo-300 text-indigo-300"/>
<h3 className="text-xl font-bold">
Final Verdict
</h3>
</div>

<p className="text-indigo-100 text-sm max-w-2xl">
{summary}
</p>
</div>


<div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/20 text-center">
<div className="text-5xl font-black">
{score}
</div>

<div className="text-xs uppercase tracking-widest mt-1 text-indigo-200 font-bold">
Overall Score
</div>

<div className="mt-3 px-4 py-1 bg-white text-indigo-700 rounded-full text-xs font-black uppercase">
{grade}
</div>
</div>

</div>
</div>



{/* Content */}
<div className="p-8">

<div className="grid md:grid-cols-3 gap-8">

{/* Strengths */}
<div>
<h4 className="text-xs font-bold uppercase tracking-widest text-green-600 flex items-center mb-4">
<CheckCircle2 className="w-4 h-4 mr-2"/>
Top Strengths
</h4>

<div className="space-y-3">
{strengths.map((item,i)=>(
<div key={i} className="flex items-start">
<div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"/>
<span className="text-sm text-gray-700">
{item}
</span>
</div>
))}
</div>

</div>



{/* Gaps */}
<div>
<h4 className="text-xs font-bold uppercase tracking-widest text-red-600 flex items-center mb-4">
<AlertTriangle className="w-4 h-4 mr-2"/>
Critical Gaps
</h4>

<div className="space-y-3">
{gaps.map((item,i)=>(
<div key={i} className="flex items-start">
<div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"/>
<span className="text-sm text-gray-700">
{item}
</span>
</div>
))}
</div>

</div>



{/* Next Steps */}
<div>
<h4 className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center mb-4">
<ArrowRightCircle className="w-4 h-4 mr-2"/>
Next Steps
</h4>

<div className="space-y-3">
{nextSteps.map((step,i)=>(
<div
key={i}
className="flex gap-3 p-3 rounded-xl bg-indigo-50 border border-indigo-100"
>
<div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
{i+1}
</div>

<span className="text-sm font-medium text-indigo-900">
{step}
</span>

</div>
))}
</div>

</div>

</div>

</div>


{/* Footer */}
<div className="bg-gray-50 border-t p-4 text-center">
<p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
Analysis generated • {new Date().toLocaleDateString()}
</p>
</div>

</div>
);
};

export default VerdictPanel;