
// Function to detect test types from the text
export const detectTestTypes = (text: string): string[] => {
  const testTypes: string[] = [];
  
  // Check for common lab test patterns in the text
  if (text.includes("Complete Blood Count") || text.includes("CBC") || 
      text.match(/Hemoglobin|Hematocrit|RBC|WBC|Platelets|MCV|MCH|MCHC/i)) {
    testTypes.push("CBC");
  }
  
  if (text.includes("Lipid Panel") || text.match(/Cholesterol|HDL|LDL|Triglycerides/i)) {
    testTypes.push("Lipid Panel");
  }
  
  if (text.match(/TSH|T3|T4|Free T4|Thyroid|Thyroxine/i)) {
    testTypes.push("Thyroid Panel");
  }
  
  if (text.match(/Glucose|A1C|Hemoglobin A1C|HbA1c/i)) {
    testTypes.push("Glucose/A1C");
  }
  
  if (text.match(/Vitamin D|25-OH|25-hydroxyvitamin/i)) {
    testTypes.push("Vitamin D");
  }
  
  if (text.match(/Iron|Ferritin|TIBC|Transferrin/i)) {
    testTypes.push("Iron Panel");
  }
  
  if (text.match(/CRP|ESR|Inflammation|Sed Rate/i)) {
    testTypes.push("Inflammation Markers");
  }
  
  if (text.match(/ALT|AST|Bilirubin|Alkaline Phosphatase|Liver/i)) {
    testTypes.push("Liver Function");
  }
  
  if (text.match(/BUN|Creatinine|eGFR|Kidney/i)) {
    testTypes.push("Kidney Function");
  }
  
  if (text.match(/Electrolytes|Sodium|Potassium|Chloride|Magnesium|Calcium/i)) {
    testTypes.push("Electrolytes");
  }
  
  // If no test types detected, add "General Blood Panel" as fallback
  if (testTypes.length === 0) {
    testTypes.push("General Blood Panel");
  }
  
  return testTypes;
};
