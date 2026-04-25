import React from "react";
import {
TrendingUp,
CheckCircle2,
XCircle,
Shield,
Info
} from "lucide-react";

const SignalItem = ({text,type}) => (
<div className="flex items-start gap-2">
{type==="positive" ? (
<CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5"/>
):(
<XCircle className="w-4 h-4 text-red-500 mt-0.5"/>
)}
<span className="text-sm text-gray-700">
{text}
</span>
</div>
);

const ShortlistPanel = ({ result }) => {

const score = result?.match_score || 0;
const matched = result?.matched_skills || [];
const missing = result?.missing_skills || [];
const qualified = result?.qualified || false;


/* estimated probability */
let probability="Low";
let confidence="Low";

if(score>=75){
probability="High";
confidence="High";
}
else if(score>=50){
probability="Medium";
confidence="Medium";
}


/* signals */
const positiveSignals = [
`Matched ${matched.length} required skills`,
qualified
? "Profile appears qualified for role"
: "Some relevant qualifications detected",
score>50
? "Good job-role alignment"
: "Some alignment exists"
];

const negativeSignals = [
...(missing.length
? [`${missing.length} missing skills detected`]
: []),
score<50
? "Match score is currently low"
: "Further optimization possible"
];


return (
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

{/* Top hero */}
<div className="bg-indigo-600 p-8 text-center text-white">

<div className="flex justify-center items-center gap-2 mb-3">
<TrendingUp className="w-5 h-5"/>
<span className="text-xs uppercase tracking-widest font-bold">
Estimated Shortlist Probability
</span>
</div>

<h2 className="text-5xl font-black">
{probability}
</h2>

<div className="mt-4">
<span className="
inline-block
px-4 py-1 rounded-full
bg-white/15 border border-white/20
text-xs font-bold uppercase
">
{confidence} Confidence
</span>
</div>

</div>


<div className="p-6 space-y-6">

{/* explanation */}
<div className="bg-gray-50 border rounded-xl p-4 flex gap-3">
<Info className="w-4 h-4 text-indigo-500 mt-1"/>
<p className="text-sm text-gray-700 leading-relaxed">
This estimate is based on your resume-job skill match,
qualification status, and detected skill gaps.
Current match score: <b>{score}%</b>.
</p>
</div>


{/* signals */}
<div className="grid md:grid-cols-2 gap-6">

<div>
<h4 className="text-xs font-bold uppercase text-gray-500 mb-3">
Positive Signals
</h4>

<div className="space-y-3">
{positiveSignals.map((item,i)=>(
<SignalItem
key={i}
text={item}
type="positive"
/>
))}
</div>

</div>


<div>
<h4 className="text-xs font-bold uppercase text-gray-500 mb-3">
Risk Signals
</h4>

<div className="space-y-3">
{negativeSignals.map((item,i)=>(
<SignalItem
key={i}
text={item}
type="negative"
/>
))}
</div>

</div>

</div>


{/* disclaimer */}
<div className="border-t pt-5">
<div className="flex gap-2">
<Shield className="w-4 h-4 text-gray-400 mt-0.5"/>
<p className="text-xs text-gray-500 leading-relaxed">
This is only an estimated prediction, not an actual recruiter
decision. Improving missing skills can raise shortlist chances.
</p>
</div>
</div>

</div>
</div>
);
};

export default ShortlistPanel;