

export const ranges = {
    creatine: [
        { min: 0.15, max: 0.7, color: "#ffc800", legend: "Low" },
        { min: 0.7, max: 1.2, color: "#64c800", background: true, legend: "In Range" },
        { min: 1.2, max: 1.5, color: "#ffc800", legend: "High" },
    ],
    chloride: [
        { min: 78, max: 90, color: "#ffc800", legend: "Low" },
        { min: 90, max: 110, color: "#64c800", background: true, legend: "In Range" },
        { min: 110, max: 115, color: "#ffc800", legend: "High" },
    ],
    fasting_glucose: [
        { min: 52, max: 70, color: "#ffc800", legend: "Low" },
        { min: 70, max: 100, color: "#64c800", background: true, legend: "In Range" },
        { min: 100, max: 125, color: "#ffc800", legend: "High" },
        { min: 125, max: 150, color: "#c80000", legend: "Very High" },
    ],
    potassium: [
        { min: 1.2, max: 3.6, color: "#ffc800", legend: "Low" },
        { min: 3.6, max: 5.2, color: "#64c800", background: true, legend: "In Range" },
        { min: 5.2, max: 5.5, color: "#ffc800", legend: "High" },
        { min: 5.5, max: 9.2, color: "#c80000", legend: "Very High" },
    ],
    sodium: [],
    total_calcium: [],
    total_protein: []
}