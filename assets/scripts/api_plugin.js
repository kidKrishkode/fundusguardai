(function () {
    const toggleBtn = document.getElementById('theme-toggle-btn');

    const toggleIcon = document.getElementById('theme-toggle-icon');
    const html = document.documentElement;
    function updateIcon(isDark) {
        if (toggleIcon) {
            toggleIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
        }
    }
    const storedTheme = localStorage.getItem('fg_theme');
    const isDarkInit = storedTheme ? storedTheme === 'dark' : true;
    if (isDarkInit) {
        html.classList.add('dark');
    }
    else {
        html.classList.remove('dark');
    }
    updateIcon(isDarkInit);
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            const isDark = html.classList.toggle('dark');
            localStorage.setItem('fg_theme', isDark ? 'dark' : 'light');
            updateIcon(isDark);
        });
    }
    const nav = document.querySelector('nav[data-active-classes]');
    if (nav) {
        const activeClasses = (nav.getAttribute('data-active-classes') || '').split(' ').filter(Boolean);
        const currentPath = window.location.pathname.toLowerCase();
        nav.querySelectorAll('a[data-path]').forEach(link => {
            const path = link.getAttribute('data-path');
            const href = link.getAttribute('href') || '';
            if (currentPath.includes(path) || currentPath.endsWith(href.replace('./', '')) || (path === 'api-docs' && (currentPath.endsWith('api.html') || currentPath === '' || currentPath.endsWith('/')))) {
                activeClasses.forEach(c => link.classList.add(c));
            }
        });
    }
})();

(function initApiDocumentationEngine() {
    // 1. Language code playground registry
    const snippets = {
        react: `// React Integration with Grad-CAM & Cup-to-Disc inference
import React, { useState } from 'react';
import { useFundusInference, HeatmapCanvas } from '@fundusguard/react';

export function ClinicalTriagePanel({ patientId = "PAT-9081" }) {
const [file, setFile] = useState(null);
const { runInference, result, loading, error } = useFundusInference({
apiKey: process.env.REACT_APP_FUNDUSGUARD_TOKEN,
modelVariant: "v1.0-spi-owl",
zeroRetention: true
});

const handleUpload = async (e) => {
const selected = e.target.files[0];
setFile(selected);
await runInference({
fundusImage: selected,
biometrics: { iopOD: 21.4, iopOS: 27.8, pachyOS: 520, age: 64 }
});
};

return (
<div className="p-4 bg-surface-container rounded-lg space-y-4">
<input type="file" accept="image/png,image/jpeg,application/dicom" onChange={handleUpload} />
{loading && <p>Segmenting optic cup & computing ISNT compliance...</p>}
{result && (
  <div className="grid grid-cols-2 gap-4">
    <HeatmapCanvas overlayData={result.segmentationContours} baseImage={file} />
    <div>
      <h4>CDR: {result.cupToDiscRatio.toFixed(3)}</h4>
      <p>Status: {result.glaucomaRisk} (Confidence: {result.confidence * 100}%)</p>
      <span>ISNT Rule: {result.isntCompliance ? "Pass" : "Notch Violation"}</span>
    </div>
  </div>
)}
</div>
);
}`,
        node: `// Node.js Backend Microservice Pipeline
import fs from 'node:fs/promises';
import { FundusGuardClient } from '@fundusguard/ai-sdk';

const fundus = new FundusGuardClient({
apiKey: process.env.FUNDUSGUARD_API_KEY,
timeoutMs: 8000,
maxRetries: 3
});

async function screenPatientScan(imagePath, patientTelemetry) {
const imageBuffer = await fs.readFile(imagePath);

const analysis = await fundus.diagnose({
imageBuffer,
eyeLaterality: 'OD',
patientIOP: patientTelemetry.iopMmHg, // e.g. 24.5
cornealThicknessUm: patientTelemetry.cctMicrons,
options: {
computeGradCAM: true,
anonymizeMetadata: true
}
});

console.log(\`[Glaucoma Diagnostic Alert] CDR: \${analysis.cupToDiscRatio}\`);
console.log(\`ISNT Conformity: \${analysis.isntRule.passes ? "VALID" : "VIOLATED"}\`);
return analysis;
}`,
        python: `# Python FastAPI / Scientific Diagnostic Worker
from fundusguard import FundusClient, GlaucomaInferenceConfig
import numpy as np
from PIL import Image

client = FundusClient(
api_key="fg_live_9a7bc018fe84b9c1d2e",
environment="production",
enforce_zero_retention=True
)

def evaluate_retinal_biometrics(image_path: str, iop_reading: float):
# Ingest PIL Image, NumPy matrix, or raw path
result = client.analyze_fundus(
  image=image_path,
  intraocular_pressure={"OD": 18.2, "OS": iop_reading},
  compute_isnt_quadrants=True,
  export_vector_contours=True
)

print(f"Computed Cup-to-Disc Ratio: {result.cup_to_disc_ratio:.3f}")
print(f"Glaucoma Probability: {result.glaucoma_probability * 100:.1f}%")
print(f"Clinical Action: {result.clinical_recommendation}")

# Export contours for PACS plotting
result.save_contour_svg("annotated_optic_disc.svg")
return result`,
        vanilla: `// Vanilla JavaScript Browser Ingestion (Direct Fetch)
async function submitFundusScan(fileInput, iopValue) {
const formData = new FormData();
formData.append("fundus_image", fileInput.files[0]);
formData.append("intraocular_pressure", iopValue);
formData.append("eye_laterality", "OS");

try {
const response = await fetch("https://api.fundusguard.ai/v2/inference/glaucoma-detect", {
method: "POST",
headers: {
  "Authorization": "Bearer fg_live_9a7bc018fe"
  // Browser automatically computes multipart boundaries
},
body: formData
});

if (!response.ok) {
throw new Error(\`Inference failed with status: \${response.status}\`);
}

const payload = await response.json();
console.log("Inference ID:", payload.inference_id);
console.log("Cup-to-Disc Ratio:", payload.prediction.cup_to_disc_ratio);
return payload;
} catch (err) {
console.error("Clinical inference request error:", err);
}
}`,
        java: `// Enterprise Java / Spring Boot Microservice
import ai.fundusguard.sdk.FundusGuardClient;
import ai.fundusguard.sdk.model.Biometrics;
import ai.fundusguard.sdk.model.GlaucomaReport;
import java.io.File;

public class DiagnosticService {
private final FundusGuardClient client = FundusGuardClient.builder()
  .apiKey(System.getenv("FUNDUSGUARD_API_KEY"))
  .connectTimeoutSeconds(10)
  .build();

public GlaucomaReport evaluateStudy(File fundusImage, double iopOS) {
  Biometrics biometrics = Biometrics.builder()
      .intraocularPressureOS(iopOS)
      .cornealThicknessUm(530)
      .build();

  GlaucomaReport report = client.analyze(fundusImage, biometrics);
  System.out.printf("Patient CDR: %.3f | Severity: %s%n", 
      report.getCupToDiscRatio(), 
      report.getSeverityLevel());
      
  return report;
}
}`
    };

    const runtimeBadges = {
        react: "Client-Side Hook",
        node: "Node.js v18+",
        python: "Python 3.9 - 3.12",
        vanilla: "Standard Browser Fetch",
        java: "JDK 17+ Enterprise"
    };

    // Tab buttons & code display
    const langButtons = document.querySelectorAll(".lang-tab-btn");
    const codeDisplay = document.getElementById("playground-code-display");
    const runtimeBadge = document.getElementById("active-runtime-badge");
    const copyCodeBtn = document.getElementById("copy-code-btn");
    const copyCodeLabel = document.getElementById("copy-code-label");

    langButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            langButtons.forEach(b => {
                b.classList.remove("active", "bg-primary-container", "text-on-primary-container");
                b.classList.add("text-text-secondary");
            });
            btn.classList.add("active", "bg-primary-container", "text-on-primary-container");
            btn.classList.remove("text-text-secondary");

            const targetLang = btn.getAttribute("data-lang");
            if (snippets[targetLang] && codeDisplay) {
                codeDisplay.textContent = snippets[targetLang];
            }
            if (runtimeBadge && runtimeBadges[targetLang]) {
                runtimeBadge.textContent = runtimeBadges[targetLang];
            }
        });
    });

    // Copy playground snippet to clipboard
    if (copyCodeBtn && copyCodeLabel && codeDisplay) {
        copyCodeBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(codeDisplay.textContent).then(() => {
                copyCodeLabel.textContent = "Copied!";
                setTimeout(() => {
                    copyCodeLabel.textContent = "Copy Snippet";
                }, 2000);
            }).catch(() => {
                copyCodeLabel.textContent = "Copied!";
                setTimeout(() => {
                    copyCodeLabel.textContent = "Copy Snippet";
                }, 2000);
            });
        });
    }

    // Node package tabs switcher
    const nodeTabs = document.querySelectorAll(".node-tab-btn");
    const nodeCmdDisplay = document.getElementById("node-install-cmd");
    const copyNodeBtn = document.getElementById("copy-node-btn");
    const copyNodeText = document.getElementById("copy-node-text");

    nodeTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            nodeTabs.forEach(t => {
                t.classList.remove("text-primary", "bg-surface-container-high");
                t.classList.add("text-text-secondary");
            });
            tab.classList.add("text-primary", "bg-surface-container-high");
            tab.classList.remove("text-text-secondary");
            if (nodeCmdDisplay) {
                nodeCmdDisplay.textContent = tab.getAttribute("data-cmd");
            }
        });
    });

    if (copyNodeBtn && nodeCmdDisplay && copyNodeText) {
        copyNodeBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(nodeCmdDisplay.textContent).then(() => {
                copyNodeText.textContent = "Copied!";
                setTimeout(() => { copyNodeText.textContent = "Copy"; }, 2000);
            });
        });
    }

    // Python package tabs switcher
    const pyTabs = document.querySelectorAll(".py-tab-btn");
    const pyCmdDisplay = document.getElementById("py-install-cmd");
    const copyPyBtn = document.getElementById("copy-py-btn");
    const copyPyText = document.getElementById("copy-py-text");

    pyTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            pyTabs.forEach(t => {
                t.classList.remove("text-primary", "bg-surface-container-high");
                t.classList.add("text-text-secondary");
            });
            tab.classList.add("text-primary", "bg-surface-container-high");
            tab.classList.remove("text-text-secondary");
            if (pyCmdDisplay) {
                pyCmdDisplay.textContent = tab.getAttribute("data-cmd");
            }
        });
    });

    if (copyPyBtn && pyCmdDisplay && copyPyText) {
        copyPyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(pyCmdDisplay.textContent).then(() => {
                copyPyText.textContent = "Copied!";
                setTimeout(() => { copyPyText.textContent = "Copy"; }, 2000);
            });
        });
    }
})();
