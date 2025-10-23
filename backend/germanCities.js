// German Cities Database
// Comprehensive list of major German cities by state

const germanCities = {
  // Baden-Württemberg
  "Baden-Württemberg": [
    "Stuttgart", "Mannheim", "Karlsruhe", "Freiburg im Breisgau", "Heidelberg",
    "Ulm", "Heilbronn", "Pforzheim", "Reutlingen", "Esslingen am Neckar",
    "Ludwigsburg", "Tübingen", "Villingen-Schwenningen", "Konstanz", "Sindelfingen",
    "Aalen", "Baden-Baden", "Friedrichshafen", "Göppingen", "Schwäbisch Gmünd"
  ],
  
  // Bayern (Bavaria)
  "Bayern": [
    "München", "Nürnberg", "Augsburg", "Würzburg", "Regensburg", "Ingolstadt",
    "Fürth", "Erlangen", "Bayreuth", "Bamberg", "Aschaffenburg", "Landshut",
    "Kempten", "Rosenheim", "Neu-Ulm", "Schweinfurt", "Passau", "Freising",
    "Straubing", "Dachau", "Lauf an der Pegnitz", "Landsberg am Lech"
  ],
  
  // Berlin
  "Berlin": ["Berlin"],
  
  // Brandenburg
  "Brandenburg": [
    "Potsdam", "Cottbus", "Brandenburg an der Havel", "Frankfurt (Oder)",
    "Oranienburg", "Falkensee", "Königs Wusterhausen", "Eberswalde",
    "Bernau bei Berlin", "Rathenow", "Neuruppin", "Schwedt/Oder"
  ],
  
  // Bremen
  "Bremen": ["Bremen", "Bremerhaven"],
  
  // Hamburg
  "Hamburg": ["Hamburg"],
  
  // Hessen
  "Hessen": [
    "Frankfurt am Main", "Wiesbaden", "Kassel", "Darmstadt", "Offenbach am Main",
    "Hanau", "Gießen", "Marburg", "Fulda", "Rüsselsheim am Main", "Wetzlar",
    "Bad Homburg vor der Höhe", "Rodgau", "Oberursel", "Dreieich", "Langen"
  ],
  
  // Mecklenburg-Vorpommern
  "Mecklenburg-Vorpommern": [
    "Rostock", "Schwerin", "Neubrandenburg", "Stralsund", "Greifswald",
    "Wismar", "Güstrow", "Waren (Müritz)", "Parchim", "Neustrelitz"
  ],
  
  // Niedersachsen
  "Niedersachsen": [
    "Hannover", "Braunschweig", "Oldenburg", "Osnabrück", "Wolfsburg",
    "Göttingen", "Salzgitter", "Hildesheim", "Delmenhorst", "Wilhelmshaven",
    "Lüneburg", "Celle", "Garbsen", "Hameln", "Lingen (Ems)", "Langenhagen"
  ],
  
  // Nordrhein-Westfalen
  "Nordrhein-Westfalen": [
    "Köln", "Düsseldorf", "Dortmund", "Essen", "Duisburg", "Bochum",
    "Wuppertal", "Bielefeld", "Bonn", "Münster", "Mönchengladbach", "Gelsenkirchen",
    "Aachen", "Krefeld", "Oberhausen", "Hagen", "Hamm", "Mülheim an der Ruhr",
    "Leverkusen", "Solingen", "Herne", "Neuss", "Paderborn", "Bottrop",
    "Recklinghausen", "Remscheid", "Moers", "Siegen", "Gütersloh"
  ],
  
  // Rheinland-Pfalz
  "Rheinland-Pfalz": [
    "Mainz", "Ludwigshafen am Rhein", "Koblenz", "Trier", "Kaiserslautern",
    "Worms", "Neuwied", "Neustadt an der Weinstraße", "Speyer", "Frankenthal",
    "Bad Kreuznach", "Idar-Oberstein", "Pirmasens", "Zweibrücken"
  ],
  
  // Saarland
  "Saarland": [
    "Saarbrücken", "Neunkirchen", "Homburg", "Völklingen", "Sankt Ingbert",
    "Merzig", "Blieskastel", "Dillingen/Saar", "Lebach", "Püttlingen"
  ],
  
  // Sachsen
  "Sachsen": [
    "Dresden", "Leipzig", "Chemnitz", "Zwickau", "Plauen", "Görlitz",
    "Freiberg", "Bautzen", "Freital", "Pirna", "Radebeul", "Meißen",
    "Döbeln", "Riesa", "Glauchau", "Weißwasser/O.L.", "Annaberg-Buchholz"
  ],
  
  // Sachsen-Anhalt
  "Sachsen-Anhalt": [
    "Magdeburg", "Halle (Saale)", "Dessau-Roßlau", "Wittenberg", "Stendal",
    "Weißenfels", "Merseburg", "Bernburg (Saale)", "Naumburg (Saale)",
    "Wernigerode", "Halberstadt", "Sangerhausen", "Köthen (Anhalt)"
  ],
  
  // Schleswig-Holstein
  "Schleswig-Holstein": [
    "Kiel", "Lübeck", "Flensburg", "Neumünster", "Norderstedt", "Elmshorn",
    "Pinneberg", "Wedel", "Ahrensburg", "Geesthacht", "Henstedt-Ulzburg",
    "Reinbek", "Bad Oldesloe", "Schleswig", "Husum", "Heide"
  ],
  
  // Thüringen
  "Thüringen": [
    "Erfurt", "Jena", "Gera", "Weimar", "Gotha", "Nordhausen", "Eisenach",
    "Suhl", "Altenburg", "Mühlhausen/Thüringen", "Ilmenau", "Saalfeld/Saale",
    "Arnstadt", "Greiz", "Sonneberg", "Meiningen"
  ]
};

// Get all German cities as a flat array
const getAllGermanCities = () => {
  const allCities = [];
  Object.values(germanCities).forEach(stateCities => {
    allCities.push(...stateCities);
  });
  return allCities.sort();
};

// Get cities by state
const getCitiesByState = (state) => {
  return germanCities[state] || [];
};

// Get all states
const getGermanStates = () => {
  return Object.keys(germanCities);
};

// Search cities by name (partial match)
const searchGermanCities = (searchTerm) => {
  const allCities = getAllGermanCities();
  return allCities.filter(city => 
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Get popular/major cities (top 50)
const getMajorGermanCities = () => {
  return [
    "Berlin", "Hamburg", "München", "Köln", "Frankfurt am Main", "Stuttgart",
    "Düsseldorf", "Leipzig", "Dortmund", "Essen", "Bremen", "Dresden",
    "Hannover", "Nürnberg", "Duisburg", "Bochum", "Wuppertal", "Bielefeld",
    "Bonn", "Münster", "Mannheim", "Karlsruhe", "Augsburg", "Wiesbaden",
    "Mönchengladbach", "Gelsenkirchen", "Aachen", "Braunschweig", "Chemnitz",
    "Kiel", "Krefeld", "Halle (Saale)", "Magdeburg", "Freiburg im Breisgau",
    "Oberhausen", "Lübeck", "Erfurt", "Mainz", "Rostock", "Kassel",
    "Hagen", "Saarbrücken", "Hamm", "Mülheim an der Ruhr", "Potsdam",
    "Ludwigshafen am Rhein", "Oldenburg", "Leverkusen", "Osnabrück", "Solingen"
  ];
};

module.exports = {
  germanCities,
  getAllGermanCities,
  getCitiesByState,
  getGermanStates,
  searchGermanCities,
  getMajorGermanCities
};