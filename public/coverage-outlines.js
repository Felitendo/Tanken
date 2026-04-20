// Hand-simplified country outlines used to gray out areas the app doesn't
// cover. Coordinates are [lat, lng] for direct consumption by Leaflet.
// Precision is intentionally rough — these only need to look right at the
// zoom levels users see, and total payload stays a few KB.

window.COVERAGE_OUTLINES = {
  de: [
    [53.55, 7.00],   // East Frisia coast
    [53.95, 8.30],   // Wilhelmshaven
    [54.50, 8.65],   // Eiderstedt
    [54.90, 8.30],   // Sylt area
    [54.83, 9.45],   // Flensburg
    [54.50, 10.05],  // Kiel
    [54.18, 10.50],  // Travemünde
    [54.30, 11.05],  // Wismar
    [54.20, 12.10],  // Rostock
    [54.50, 13.00],  // Stralsund
    [54.65, 13.80],  // Rügen
    [53.92, 14.20],  // Usedom
    [53.40, 14.42],  // Stettin border
    [52.78, 14.13],  // Frankfurt (Oder)
    [52.30, 14.55],
    [51.95, 14.75],
    [51.30, 15.04],  // Görlitz
    [50.95, 14.85],
    [50.85, 14.30],  // Bad Schandau
    [50.40, 13.20],  // Erzgebirge
    [50.20, 12.20],  // Vogtland
    [49.70, 12.50],  // Bayerischer Wald
    [49.00, 12.40],  // Cham
    [48.95, 13.50],  // Passau border
    [48.55, 13.40],
    [47.95, 12.85],  // Berchtesgaden
    [47.55, 13.05],  // Salzburg corner
    [47.40, 11.40],  // Karwendel
    [47.50, 10.65],  // Allgäu
    [47.60, 10.00],
    [47.55, 9.55],   // Bodensee
    [47.62, 8.75],   // Schaffhausen
    [47.60, 7.60],   // Basel
    [48.20, 7.50],   // Vosges border
    [48.95, 8.10],
    [49.20, 7.00],   // Saar
    [49.50, 6.35],   // Schengen
    [50.00, 6.10],
    [50.50, 6.00],   // Aachen
    [51.05, 5.95],   // Niederrhein
    [51.85, 6.10],   // Emmerich
    [52.50, 7.00],   // Lingen border
    [53.20, 7.05],
    [53.55, 7.00],
  ],
  at: [
    [47.55, 9.55],   // Bodensee corner (also DE/CH meeting)
    [47.30, 10.10],  // Vorarlberg
    [47.00, 10.45],
    [46.85, 10.45],  // Reschenpass
    [46.65, 12.10],  // Lienz
    [46.60, 13.70],  // Villach
    [46.50, 14.55],  // Klagenfurt
    [46.55, 15.00],
    [46.65, 16.00],  // Slovenian border
    [46.85, 16.45],
    [47.00, 16.45],
    [47.40, 16.45],  // Hungarian border
    [47.70, 16.55],
    [48.00, 17.05],  // Bratislava corner
    [48.30, 17.00],
    [48.60, 16.95],
    [48.80, 16.00],  // Czech border
    [48.95, 15.30],
    [48.85, 14.65],
    [48.60, 13.80],  // Donau / German border
    [48.40, 13.45],
    [47.95, 12.85],  // Salzburg
    [47.55, 13.05],  // Saalfelden
    [47.40, 11.40],  // Karwendel
    [47.50, 10.65],  // Allgäu border
    [47.60, 10.00],
    [47.55, 9.55],
  ],
};
