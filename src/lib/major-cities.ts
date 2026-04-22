/**
 * Static list of major DE / AT cities used by the route scan-point picker to
 * snap scan points onto urban centres when they fall along the driven route.
 *
 * Cut-off is ~100k inhabitants for DE and ~50k for AT — small enough that a
 * typical cross-country route has only a handful of hits, big enough that
 * any such hit reliably hosts enough stations to matter for the cheapest-
 * price search. Population is used as the priority tiebreaker (larger city
 * wins when two candidates fall into the same scan slot).
 *
 * Populations are from 2023/2024 municipal statistics, rounded to the
 * nearest 1 000 — good enough for ranking, not a source of truth.
 */
export interface MajorCity {
  name: string;
  lat: number;
  lng: number;
  pop: number;
}

export const MAJOR_CITIES: readonly MajorCity[] = [
  // ── Germany ──────────────────────────────────────────────────────
  { name: 'Berlin', lat: 52.5200, lng: 13.4050, pop: 3_700_000 },
  { name: 'Hamburg', lat: 53.5511, lng: 9.9937, pop: 1_840_000 },
  { name: 'München', lat: 48.1351, lng: 11.5820, pop: 1_490_000 },
  { name: 'Köln', lat: 50.9375, lng: 6.9603, pop: 1_080_000 },
  { name: 'Frankfurt am Main', lat: 50.1109, lng: 8.6821, pop: 760_000 },
  { name: 'Stuttgart', lat: 48.7758, lng: 9.1829, pop: 630_000 },
  { name: 'Düsseldorf', lat: 51.2277, lng: 6.7735, pop: 620_000 },
  { name: 'Leipzig', lat: 51.3397, lng: 12.3731, pop: 610_000 },
  { name: 'Dortmund', lat: 51.5136, lng: 7.4653, pop: 590_000 },
  { name: 'Essen', lat: 51.4556, lng: 7.0116, pop: 580_000 },
  { name: 'Bremen', lat: 53.0793, lng: 8.8017, pop: 570_000 },
  { name: 'Dresden', lat: 51.0504, lng: 13.7373, pop: 560_000 },
  { name: 'Hannover', lat: 52.3759, lng: 9.7320, pop: 540_000 },
  { name: 'Nürnberg', lat: 49.4521, lng: 11.0767, pop: 520_000 },
  { name: 'Duisburg', lat: 51.4344, lng: 6.7623, pop: 500_000 },
  { name: 'Bochum', lat: 51.4818, lng: 7.2197, pop: 370_000 },
  { name: 'Wuppertal', lat: 51.2562, lng: 7.1508, pop: 360_000 },
  { name: 'Bielefeld', lat: 52.0302, lng: 8.5325, pop: 335_000 },
  { name: 'Bonn', lat: 50.7374, lng: 7.0982, pop: 335_000 },
  { name: 'Münster', lat: 51.9607, lng: 7.6261, pop: 320_000 },
  { name: 'Karlsruhe', lat: 49.0069, lng: 8.4037, pop: 310_000 },
  { name: 'Mannheim', lat: 49.4875, lng: 8.4660, pop: 310_000 },
  { name: 'Augsburg', lat: 48.3705, lng: 10.8978, pop: 300_000 },
  { name: 'Wiesbaden', lat: 50.0782, lng: 8.2398, pop: 280_000 },
  { name: 'Gelsenkirchen', lat: 51.5177, lng: 7.0857, pop: 270_000 },
  { name: 'Mönchengladbach', lat: 51.1805, lng: 6.4428, pop: 261_000 },
  { name: 'Braunschweig', lat: 52.2689, lng: 10.5268, pop: 250_000 },
  { name: 'Aachen', lat: 50.7753, lng: 6.0839, pop: 249_000 },
  { name: 'Chemnitz', lat: 50.8278, lng: 12.9214, pop: 245_000 },
  { name: 'Kiel', lat: 54.3233, lng: 10.1228, pop: 245_000 },
  { name: 'Halle', lat: 51.4970, lng: 11.9680, pop: 240_000 },
  { name: 'Magdeburg', lat: 52.1205, lng: 11.6276, pop: 240_000 },
  { name: 'Freiburg im Breisgau', lat: 47.9990, lng: 7.8421, pop: 231_000 },
  { name: 'Krefeld', lat: 51.3388, lng: 6.5853, pop: 227_000 },
  { name: 'Mainz', lat: 49.9929, lng: 8.2473, pop: 220_000 },
  { name: 'Lübeck', lat: 53.8655, lng: 10.6866, pop: 217_000 },
  { name: 'Erfurt', lat: 50.9848, lng: 11.0299, pop: 215_000 },
  { name: 'Oberhausen', lat: 51.4963, lng: 6.8628, pop: 210_000 },
  { name: 'Rostock', lat: 54.0887, lng: 12.1403, pop: 210_000 },
  { name: 'Kassel', lat: 51.3127, lng: 9.4797, pop: 205_000 },
  { name: 'Hagen', lat: 51.3671, lng: 7.4633, pop: 190_000 },
  { name: 'Potsdam', lat: 52.3906, lng: 13.0645, pop: 185_000 },
  { name: 'Saarbrücken', lat: 49.2401, lng: 6.9969, pop: 180_000 },
  { name: 'Hamm', lat: 51.6806, lng: 7.8158, pop: 180_000 },
  { name: 'Ludwigshafen', lat: 49.4774, lng: 8.4452, pop: 175_000 },
  { name: 'Mülheim an der Ruhr', lat: 51.4327, lng: 6.8824, pop: 170_000 },
  { name: 'Oldenburg', lat: 53.1435, lng: 8.2146, pop: 170_000 },
  { name: 'Osnabrück', lat: 52.2799, lng: 8.0472, pop: 165_000 },
  { name: 'Leverkusen', lat: 51.0459, lng: 6.9880, pop: 165_000 },
  { name: 'Heidelberg', lat: 49.3988, lng: 8.6724, pop: 160_000 },
  { name: 'Solingen', lat: 51.1652, lng: 7.0672, pop: 160_000 },
  { name: 'Darmstadt', lat: 49.8728, lng: 8.6512, pop: 160_000 },
  { name: 'Herne', lat: 51.5368, lng: 7.2257, pop: 156_000 },
  { name: 'Neuss', lat: 51.2044, lng: 6.6924, pop: 155_000 },
  { name: 'Regensburg', lat: 49.0134, lng: 12.1016, pop: 155_000 },
  { name: 'Paderborn', lat: 51.7189, lng: 8.7575, pop: 153_000 },
  { name: 'Ingolstadt', lat: 48.7665, lng: 11.4258, pop: 140_000 },
  { name: 'Offenbach am Main', lat: 50.0955, lng: 8.7761, pop: 140_000 },
  { name: 'Fürth', lat: 49.4771, lng: 10.9887, pop: 135_000 },
  { name: 'Würzburg', lat: 49.7913, lng: 9.9534, pop: 130_000 },
  { name: 'Ulm', lat: 48.4011, lng: 9.9876, pop: 130_000 },
  { name: 'Heilbronn', lat: 49.1427, lng: 9.2109, pop: 130_000 },
  { name: 'Pforzheim', lat: 48.8923, lng: 8.7010, pop: 130_000 },
  { name: 'Wolfsburg', lat: 52.4227, lng: 10.7865, pop: 125_000 },
  { name: 'Göttingen', lat: 51.5412, lng: 9.9158, pop: 120_000 },
  { name: 'Bottrop', lat: 51.5215, lng: 6.9289, pop: 117_000 },
  { name: 'Reutlingen', lat: 48.4914, lng: 9.2043, pop: 115_000 },
  { name: 'Koblenz', lat: 50.3569, lng: 7.5890, pop: 114_000 },
  { name: 'Bremerhaven', lat: 53.5395, lng: 8.5809, pop: 113_000 },
  { name: 'Erlangen', lat: 49.5897, lng: 11.0120, pop: 113_000 },
  { name: 'Bergisch Gladbach', lat: 50.9858, lng: 7.1328, pop: 111_000 },
  { name: 'Remscheid', lat: 51.1786, lng: 7.1897, pop: 110_000 },
  { name: 'Trier', lat: 49.7495, lng: 6.6372, pop: 110_000 },
  { name: 'Recklinghausen', lat: 51.6140, lng: 7.1978, pop: 110_000 },
  { name: 'Jena', lat: 50.9272, lng: 11.5866, pop: 110_000 },
  { name: 'Moers', lat: 51.4541, lng: 6.6370, pop: 104_000 },
  { name: 'Salzgitter', lat: 52.1536, lng: 10.3331, pop: 104_000 },
  { name: 'Siegen', lat: 50.8749, lng: 8.0243, pop: 102_000 },
  { name: 'Hildesheim', lat: 52.1548, lng: 9.9511, pop: 100_000 },
  { name: 'Kaiserslautern', lat: 49.4401, lng: 7.7491, pop: 100_000 },
  { name: 'Gütersloh', lat: 51.9069, lng: 8.3794, pop: 100_000 },
  { name: 'Cottbus', lat: 51.7563, lng: 14.3329, pop: 100_000 },

  // ── Austria ──────────────────────────────────────────────────────
  { name: 'Wien', lat: 48.2082, lng: 16.3738, pop: 1_950_000 },
  { name: 'Graz', lat: 47.0707, lng: 15.4395, pop: 290_000 },
  { name: 'Linz', lat: 48.3069, lng: 14.2858, pop: 205_000 },
  { name: 'Salzburg', lat: 47.8095, lng: 13.0550, pop: 155_000 },
  { name: 'Innsbruck', lat: 47.2692, lng: 11.4041, pop: 130_000 },
  { name: 'Klagenfurt', lat: 46.6228, lng: 14.3053, pop: 100_000 },
  { name: 'Villach', lat: 46.6111, lng: 13.8558, pop: 63_000 },
  { name: 'Wels', lat: 48.1575, lng: 14.0289, pop: 62_000 },
  { name: 'Sankt Pölten', lat: 48.2057, lng: 15.6288, pop: 55_000 },
  { name: 'Dornbirn', lat: 47.4125, lng: 9.7417, pop: 50_000 },
];
