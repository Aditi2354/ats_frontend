/**
 ATS Resume Checker
 Clean Frontend Script
*/

let fileInput;
let resultsDiv;
let loadingDiv;
let analyzeBtn;
let fileStatus;

document.addEventListener("DOMContentLoaded", () => {

    fileInput = document.getElementById("atsFileInput");
    resultsDiv = document.getElementById("atsResults");
    loadingDiv = document.getElementById("atsLoading");
    analyzeBtn = document.getElementById("atsAnalyzeBtn");
    fileStatus = document.getElementById("atsFileStatus");

    initUpload();
});


/* ===========================
   Upload Handling
=========================== */

function initUpload(){

    if(!fileInput) return;

    fileInput.addEventListener("change", () => {

        const name = fileInput.files[0]?.name || "No file selected";

        if(fileStatus){
            fileStatus.textContent = name;
        }

    });

    const uploadBox = document.querySelector(".ats-upload-box");

    if(!uploadBox) return;

    uploadBox.addEventListener("dragover", (e)=>{
        e.preventDefault();
        uploadBox.style.borderColor="#4f46e5";
    });

    uploadBox.addEventListener("dragleave", ()=>{
        uploadBox.style.borderColor="#6366f1";
    });

    uploadBox.addEventListener("drop", (e)=>{

        e.preventDefault();

        const file = e.dataTransfer.files[0];

        if(file?.type !== "application/pdf"){
            alert("Please upload PDF only");
            return;
        }

        fileInput.files = e.dataTransfer.files;

        if(fileStatus){
            fileStatus.textContent = file.name;
        }

    });

}


/* ===========================
   UI Helpers
=========================== */

function showLoading(show){
    if(!loadingDiv) return;
    loadingDiv.style.display = show ? "flex" : "none";
}

function showError(message){

    resultsDiv.innerHTML = `
        <div style="background:#fee2e2;padding:20px;border-radius:8px">
            <h3 style="color:#dc2626;margin:0">Error</h3>
            <p>${message}</p>
        </div>
    `;
}

function getScoreColor(score){

    if(score>=80) return "#10b981";
    if(score>=70) return "#3b82f6";
    if(score>=60) return "#f59e0b";
    if(score>=50) return "#fb923c";
    return "#ef4444";
}


/* ===========================
   ATS Analysis
=========================== */

async function processATSAnalysis(){

    if(!fileInput || !fileInput.files[0]){
        alert("Please upload a resume PDF");
        return;
    }

    const formData = new FormData();
    formData.append("resume", fileInput.files[0]);

    resultsDiv.innerHTML="";
    showLoading(true);

    if(analyzeBtn){
        analyzeBtn.disabled=true;
    }

    try{

        const res = await fetch(API_BASE_URL+"/api/ats/check",{
            method:"POST",
            headers:{
                ...getAuthHeaders()
            },
            body:formData
        });

        const data = await res.json();
        console.log("FULL ATS RESPONSE:", data);
console.log("AI ANALYSIS:", data.ai_analysis);
console.log("AI ANALYSIS TYPE:", typeof data.ai_analysis);
        if(!res.ok || data.error){
            throw new Error(data.error || "Analysis failed");
        }

        renderResults(data);

    }
    catch(err){
        showError(err.message);
    }
    finally{

        showLoading(false);

        if(analyzeBtn){
            analyzeBtn.disabled=false;
        }

    }

}


/* ===========================
   Render Results
=========================== */

function renderResults(data){

    const color = getScoreColor(data.ats_score);

    resultsDiv.innerHTML=`

    <div style="
        border:3px solid ${color};
        padding:20px;
        border-radius:12px;
        background:${color}11;
        margin-top:20px">

        <h2 style="margin:0;color:${color}">
            ATS Compatibility
        </h2>

        <div style="
            font-size:3rem;
            font-weight:bold;
            color:${color};
            margin:10px 0">

            ${data.final_score}/100

        </div>

        <p style="margin:0">
            ${data.ats_level}: ${data.ats_description}
        </p>

    </div>

    `;

    renderSummary(data);

    renderSkills(data);
    renderAIAnalysis(data); // ⭐ NEW
}


/* ===========================
   Summary
=========================== */

function renderSummary(data){

    const items=[];

    items.push(
        data.ats_score>=70
        ? "Likely ATS compatible"
        : "May have ATS parsing issues"
    );

    if(data.detected_skills?.length){
        items.push(`Skills detected (${data.detected_skills.length})`);
    }

    if(data.sections){
        const found=Object.values(data.sections)
            .filter(s=>s.found).length;

        items.push(`${found} sections found`);
    }

    if(!items.length) return;

    resultsDiv.innerHTML+=`

    <div style="margin-top:20px;background:#f9fafb;padding:15px;border-radius:8px">

        <h3 style="margin-top:0">Summary</h3>

        ${items.map(i=>`<p>• ${i}</p>`).join("")}

    </div>

    `;
}



/* ===========================
   Skills
=========================== */

function renderSkills(data){

    if(!data.detected_skills?.length) return;

    resultsDiv.innerHTML+=`

    <div style="margin-top:20px;background:#ecfdf5;padding:15px;border-radius:8px">

        <h3 style="margin-top:0;color:#047857">
        Skills
        </h3>

        <p>
        ${data.detected_skills.join(" • ")}
        </p>

    </div>

    `;
}


/* ===========================
   AI ANALYSIS
=========================== */
/* ===========================
   AI ANALYSIS
=========================== */

function renderAIAnalysis(data) {

    if (!data.ai_analysis) return;

    const ai = data.ai_analysis;

    // Backend response can be:
    // 1. plain string
    // 2. object: { ATS_SCORE, analysis }

    const analysisText =
        typeof ai === "string"
            ? ai
            : (ai.analysis || "");

    const aiScore =
        typeof ai === "object"
            ? (ai.ATS_SCORE ?? data.ai_score ?? "N/A")
            : (data.ai_score ?? "N/A");


    /* ===========================
       Extract Reason
    =========================== */

    const reasonMatch = analysisText.match(
        /Reason:\s*([\s\S]*?)(?=\n\s*Strengths:|$)/i
    );

    const reason = reasonMatch
        ? reasonMatch[1].trim()
        : "No reason provided";


    /* ===========================
       Extract Section Helper
    =========================== */

    function extractSection(text, sectionName, nextSectionNames = []) {

        if (!text) return [];

        const escapeRegex = (value) =>
            value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const currentSection = escapeRegex(sectionName);

        let endPattern = "$";

        if (nextSectionNames.length) {

            const nextSections = nextSectionNames
                .map(name => escapeRegex(name))
                .join("|");

            endPattern = `(?=\\n\\s*(?:${nextSections})\\s*:|$)`;
        }

        const regex = new RegExp(
            `${currentSection}\\s*:\\s*([\\s\\S]*?)${endPattern}`,
            "i"
        );

        const match = text.match(regex);

        if (!match || !match[1]) return [];

        return match[1]
            .split("\n")
            .map(item =>
                item
                    .replace(/^\s*[-•*]\s*/, "")
                    .trim()
            )
            .filter(Boolean);
    }


    /* ===========================
       Extract AI Data
    =========================== */

    let strengths = extractSection(
        analysisText,
        "Strengths",
        ["Missing Keywords", "Improvements"]
    );

    let missingKeywords = extractSection(
        analysisText,
        "Missing Keywords",
        ["Improvements"]
    );

    let improvements = extractSection(
        analysisText,
        "Improvements"
    );


    /* ===========================
       Fallback Data
    =========================== */

    if (!strengths.length && Array.isArray(data.strengths)) {
        strengths = data.strengths;
    }

    if (
        !missingKeywords.length &&
        Array.isArray(data.keywords?.keywords_missing)
    ) {
        missingKeywords = data.keywords.keywords_missing;
    }


    /* ===========================
       Render UI
    =========================== */

    resultsDiv.innerHTML += `

    <div style="
        margin-top:25px;
        background:#f8fafc;
        padding:25px;
        border-radius:12px;
        border-left:6px solid #3b82f6;
        box-shadow:0 4px 12px rgba(0,0,0,0.05);
    ">

        <h3 style="
            margin-top:0;
            color:#2563eb;
            font-size:1.4rem;
            display:flex;
            align-items:center;
            gap:8px;
        ">
            🤖 AI Resume Insights
        </h3>


        <p style="
            font-size:1rem;
            margin-bottom:10px;
        ">
            <strong>AI Score:</strong>
            ${aiScore}/100
        </p>


        <p style="
            margin-bottom:20px;
            color:#374151;
            line-height:1.6;
        ">
            <strong>Reason:</strong>
            ${reason}
        </p>


        <div style="margin-bottom:20px">

            <h4 style="
                color:#16a34a;
                margin-bottom:8px;
            ">
                ✅ Strengths
            </h4>

            <ul style="
                padding-left:22px;
                line-height:1.7;
            ">
                ${
                    strengths.length
                        ? strengths
                            .map(item => `<li>${item}</li>`)
                            .join("")
                        : "<li>No strengths provided</li>"
                }
            </ul>

        </div>


        <div style="margin-bottom:20px">

            <h4 style="
                color:#dc2626;
                margin-bottom:8px;
            ">
                ⚠️ Missing Keywords
            </h4>

            <ul style="
                padding-left:22px;
                line-height:1.7;
            ">
                ${
                    missingKeywords.length
                        ? missingKeywords
                            .map(item => `<li>${item}</li>`)
                            .join("")
                        : "<li>No major missing keywords detected</li>"
                }
            </ul>

        </div>


        <div>

            <h4 style="
                color:#7c3aed;
                margin-bottom:8px;
            ">
                🚀 Improvements
            </h4>

            <ul style="
                padding-left:22px;
                line-height:1.7;
            ">
                ${
                    improvements.length
                        ? improvements
                            .map(item => `<li>${item}</li>`)
                            .join("")
                        : "<li>No improvements provided</li>"
                }
            </ul>

        </div>

    </div>
    `;
}