

const INITIAL_DATA = {
  // Municipal Areas / Wards
  areas: [
    { id: "ward-4", name: "Ward 4 - North Sector", district: "Central" },
    { id: "ward-7", name: "Ward 7 - Riverfront District", district: "East" },
    { id: "ward-12", name: "Ward 12 - Old Town Commercial", district: "South" },
    { id: "ward-3", name: "Ward 3 - Metro Transit Corridor", district: "West" },
    { id: "ward-9", name: "Ward 9 - Greenfield Suburbs", district: "North-East" }
  ],

  // Area name to ID mapping for development context lookup
  areaNameToId: {
    "Ward 4 - North Sector": "ward-4",
    "Ward 7 - Riverfront District": "ward-7", 
    "Ward 12 - Old Town Commercial": "ward-12",
    "Ward 3 - Metro Transit Corridor": "ward-3",
    "Ward 9 - Greenfield Suburbs": "ward-9"
  },

  // Issue Categories
  categories: [
    { id: "water", name: "Water Supply & Sanitation", icon: "💧" },
    { id: "roads", name: "Road Infrastructure & Potholes", icon: "🛣️" },
    { id: "waste", name: "Waste Management & Drainage", icon: "🗑️" },
    { id: "lighting", name: "Street Lighting & Public Safety", icon: "💡" },
    { id: "transit", name: "Public Transit & Accessibility", icon: "🚌" },
    { id: "parks", name: "Public Parks & Civic Spaces", icon: "🌳" }
  ],

  // Multilingual indicators for Digital Public Infrastructure
  languages: [
    { code: "en", label: "English (English)" },
    { code: "hi", label: "हिन्दी (Hindi)" },
    { code: "bn", label: "বাংলা (Bengali)" },
    { code: "es", label: "Español (Spanish)" },
    { code: "ta", label: "தமிழ் (Tamil)" },
    { code: "mr", label: "मराठी (Marathi)" }
  ],

  // Sample/Demo Data (Strictly labeled as Demo Data in UI)
  issues: []
};
