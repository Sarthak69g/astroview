// src/lib/india-locations.ts
//
// Client-side search over the offline India places dataset
// (src/data/india-locations.json — see scripts/generate-india-locations.mjs
// for where it comes from and how it was cleaned).
//
// 24,982 towns/cities across all 36 states/UTs and 749 districts, each
// with real lat/long already attached — so picking one is instant, no
// network round-trip needed. Used by PlaceAutocomplete.tsx for the Kundli
// Generator + Kundli Matching "place of birth" field.
//
// The dataset is dynamically imported (not a static top-level import) so
// its ~1.7MB stays out of every route's main bundle and only loads for
// people who actually open a Kundli page.

export interface IndiaLocation {
  name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  pincode: string;
}

// Raw on-disk shape: [name, district, state, lat, lon, pincode] tuples —
// see generate-india-locations.mjs for why tuples instead of objects
// (roughly 30% smaller on disk than the equivalent array of objects).
type RawRow = [string, string, string, number, number, string];

let cache: IndiaLocation[] | null = null;
let loadingPromise: Promise<IndiaLocation[]> | null = null;

async function loadDataset(): Promise<IndiaLocation[]> {
  if (cache) return cache;
  if (loadingPromise) return loadingPromise;
  loadingPromise = import("@/data/india-locations.json").then((mod) => {
    const rows = (mod.default ?? mod) as unknown as RawRow[];
    const parsed = rows.map(
      ([name, district, state, latitude, longitude, pincode]): IndiaLocation => ({
        name,
        district,
        state,
        latitude,
        longitude,
        pincode,
      }),
    );
    cache = parsed;
    return parsed;
  });
  return loadingPromise;
}

// Kick the dataset load off early (e.g. as soon as the birth-details form
// mounts) so it's likely already cached by the time the person finishes
// typing their first couple of characters.
export function preloadIndiaLocations(): void {
  void loadDataset();
}

export interface LocationMatch extends IndiaLocation {
  /** Lower score = better match. Used only to sort results. */
  score: number;
}

// ---------------------------------------------------------------------
// Major-cities ranking boost
// ---------------------------------------------------------------------
// The raw post-office dataset has no notion of "how famous is this
// place" — a tiny hamlet that happens to also be called "Jaipur" (there's
// one in Mancherial district, Telangana) scores exactly as well as an
// entry for the actual state capital, and can even outrank it if the
// capital's post-office records are all suffixed ("Jaipur City",
// "Jaipur G.P.O.", "Jaipur R.S.") while the hamlet's is bare "Jaipur".
//
// Fix: a small curated list of ~140 major cities (state/UT capitals +
// well-known metros) with their own coordinates. A query that matches one
// of these is always shown first, ahead of anything from the raw dataset,
// regardless of naming quirks in the underlying post-office records.
// Coordinates below are each city's approximate centre — fine as a
// default pick; anyone who needs a specific locality within the city for
// a more precise chart can still pick one of the dataset rows shown below
// it (e.g. a specific neighbourhood's post office).
interface MajorCity {
  name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
}

const MAJOR_CITIES: MajorCity[] = [
  // National capital
  {
    name: "New Delhi",
    district: "New Delhi",
    state: "Delhi",
    latitude: 28.6139,
    longitude: 77.209,
  },
  { name: "Delhi", district: "Delhi", state: "Delhi", latitude: 28.7041, longitude: 77.1025 },

  // State capitals
  {
    name: "Amaravati",
    district: "Guntur",
    state: "Andhra Pradesh",
    latitude: 16.5417,
    longitude: 80.5152,
  },
  {
    name: "Itanagar",
    district: "Papum Pare",
    state: "Arunachal Pradesh",
    latitude: 27.0844,
    longitude: 93.6053,
  },
  { name: "Dispur", district: "Kamrup", state: "Assam", latitude: 26.1433, longitude: 91.7898 },
  {
    name: "Guwahati",
    district: "Kamrup Metropolitan",
    state: "Assam",
    latitude: 26.1445,
    longitude: 91.7362,
  },
  { name: "Patna", district: "Patna", state: "Bihar", latitude: 25.5941, longitude: 85.1376 },
  {
    name: "Raipur",
    district: "Raipur",
    state: "Chhattisgarh",
    latitude: 21.2514,
    longitude: 81.6296,
  },
  { name: "Panaji", district: "North Goa", state: "Goa", latitude: 15.4909, longitude: 73.8278 },
  {
    name: "Gandhinagar",
    district: "Gandhinagar",
    state: "Gujarat",
    latitude: 23.2156,
    longitude: 72.6369,
  },
  {
    name: "Ahmedabad",
    district: "Ahmedabad",
    state: "Gujarat",
    latitude: 23.0225,
    longitude: 72.5714,
  },
  {
    name: "Chandigarh",
    district: "Chandigarh",
    state: "Chandigarh",
    latitude: 30.7333,
    longitude: 76.7794,
  },
  {
    name: "Shimla",
    district: "Shimla",
    state: "Himachal Pradesh",
    latitude: 31.1048,
    longitude: 77.1734,
  },
  {
    name: "Srinagar",
    district: "Srinagar",
    state: "Jammu and Kashmir",
    latitude: 34.0837,
    longitude: 74.7973,
  },
  {
    name: "Jammu",
    district: "Jammu",
    state: "Jammu and Kashmir",
    latitude: 32.7266,
    longitude: 74.857,
  },
  { name: "Leh", district: "Leh", state: "Ladakh", latitude: 34.1526, longitude: 77.5771 },
  { name: "Ranchi", district: "Ranchi", state: "Jharkhand", latitude: 23.3441, longitude: 85.3096 },
  {
    name: "Bengaluru",
    district: "Bangalore",
    state: "Karnataka",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  {
    name: "Bangalore",
    district: "Bangalore",
    state: "Karnataka",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  {
    name: "Thiruvananthapuram",
    district: "Thiruvananthapuram",
    state: "Kerala",
    latitude: 8.5241,
    longitude: 76.9366,
  },
  {
    name: "Bhopal",
    district: "Bhopal",
    state: "Madhya Pradesh",
    latitude: 23.2599,
    longitude: 77.4126,
  },
  {
    name: "Mumbai",
    district: "Mumbai",
    state: "Maharashtra",
    latitude: 19.076,
    longitude: 72.8777,
  },
  {
    name: "Imphal",
    district: "Imphal West",
    state: "Manipur",
    latitude: 24.817,
    longitude: 93.9368,
  },
  {
    name: "Shillong",
    district: "East Khasi Hills",
    state: "Meghalaya",
    latitude: 25.5788,
    longitude: 91.8933,
  },
  { name: "Aizawl", district: "Aizawl", state: "Mizoram", latitude: 23.7271, longitude: 92.7176 },
  { name: "Kohima", district: "Kohima", state: "Nagaland", latitude: 25.6751, longitude: 94.1086 },
  {
    name: "Bhubaneswar",
    district: "Khordha",
    state: "Odisha",
    latitude: 20.2961,
    longitude: 85.8245,
  },
  {
    name: "Puducherry",
    district: "Puducherry",
    state: "Puducherry",
    latitude: 11.9416,
    longitude: 79.8083,
  },
  {
    name: "Chandigarh",
    district: "Chandigarh",
    state: "Punjab",
    latitude: 30.7333,
    longitude: 76.7794,
  },
  { name: "Jaipur", district: "Jaipur", state: "Rajasthan", latitude: 26.9124, longitude: 75.7873 },
  {
    name: "Gangtok",
    district: "East Sikkim",
    state: "Sikkim",
    latitude: 27.3389,
    longitude: 88.6065,
  },
  {
    name: "Chennai",
    district: "Chennai",
    state: "Tamil Nadu",
    latitude: 13.0827,
    longitude: 80.2707,
  },
  {
    name: "Hyderabad",
    district: "Hyderabad",
    state: "Telangana",
    latitude: 17.385,
    longitude: 78.4867,
  },
  {
    name: "Agartala",
    district: "West Tripura",
    state: "Tripura",
    latitude: 23.8315,
    longitude: 91.2868,
  },
  {
    name: "Lucknow",
    district: "Lucknow",
    state: "Uttar Pradesh",
    latitude: 26.8467,
    longitude: 80.9462,
  },
  {
    name: "Dehradun",
    district: "Dehradun",
    state: "Uttarakhand",
    latitude: 30.3165,
    longitude: 78.0322,
  },
  {
    name: "Kolkata",
    district: "Kolkata",
    state: "West Bengal",
    latitude: 22.5726,
    longitude: 88.3639,
  },

  // Major metros / well-known cities beyond capitals
  { name: "Pune", district: "Pune", state: "Maharashtra", latitude: 18.5204, longitude: 73.8567 },
  {
    name: "Nagpur",
    district: "Nagpur",
    state: "Maharashtra",
    latitude: 21.1458,
    longitude: 79.0882,
  },
  {
    name: "Nashik",
    district: "Nashik",
    state: "Maharashtra",
    latitude: 19.9975,
    longitude: 73.7898,
  },
  { name: "Thane", district: "Thane", state: "Maharashtra", latitude: 19.2183, longitude: 72.9781 },
  {
    name: "Aurangabad",
    district: "Aurangabad",
    state: "Maharashtra",
    latitude: 19.8762,
    longitude: 75.3433,
  },
  { name: "Surat", district: "Surat", state: "Gujarat", latitude: 21.1702, longitude: 72.8311 },
  {
    name: "Vadodara",
    district: "Vadodara",
    state: "Gujarat",
    latitude: 22.3072,
    longitude: 73.1812,
  },
  { name: "Rajkot", district: "Rajkot", state: "Gujarat", latitude: 22.3039, longitude: 70.8022 },
  {
    name: "Kanpur",
    district: "Kanpur Nagar",
    state: "Uttar Pradesh",
    latitude: 26.4499,
    longitude: 80.3319,
  },
  {
    name: "Varanasi",
    district: "Varanasi",
    state: "Uttar Pradesh",
    latitude: 25.3176,
    longitude: 82.9739,
  },
  { name: "Agra", district: "Agra", state: "Uttar Pradesh", latitude: 27.1767, longitude: 78.0081 },
  {
    name: "Prayagraj",
    district: "Prayagraj",
    state: "Uttar Pradesh",
    latitude: 25.4358,
    longitude: 81.8463,
  },
  {
    name: "Allahabad",
    district: "Prayagraj",
    state: "Uttar Pradesh",
    latitude: 25.4358,
    longitude: 81.8463,
  },
  {
    name: "Noida",
    district: "Gautam Buddha Nagar",
    state: "Uttar Pradesh",
    latitude: 28.5355,
    longitude: 77.391,
  },
  {
    name: "Ghaziabad",
    district: "Ghaziabad",
    state: "Uttar Pradesh",
    latitude: 28.6692,
    longitude: 77.4538,
  },
  {
    name: "Meerut",
    district: "Meerut",
    state: "Uttar Pradesh",
    latitude: 28.9845,
    longitude: 77.7064,
  },
  {
    name: "Aligarh",
    district: "Aligarh",
    state: "Uttar Pradesh",
    latitude: 27.8974,
    longitude: 78.088,
  },
  {
    name: "Bareilly",
    district: "Bareilly",
    state: "Uttar Pradesh",
    latitude: 28.367,
    longitude: 79.4304,
  },
  {
    name: "Moradabad",
    district: "Moradabad",
    state: "Uttar Pradesh",
    latitude: 28.8386,
    longitude: 78.7733,
  },
  {
    name: "Coimbatore",
    district: "Coimbatore",
    state: "Tamil Nadu",
    latitude: 11.0168,
    longitude: 76.9558,
  },
  {
    name: "Madurai",
    district: "Madurai",
    state: "Tamil Nadu",
    latitude: 9.9252,
    longitude: 78.1198,
  },
  {
    name: "Tiruchirappalli",
    district: "Tiruchirappalli",
    state: "Tamil Nadu",
    latitude: 10.7905,
    longitude: 78.7047,
  },
  { name: "Salem", district: "Salem", state: "Tamil Nadu", latitude: 11.6643, longitude: 78.146 },
  {
    name: "Visakhapatnam",
    district: "Visakhapatnam",
    state: "Andhra Pradesh",
    latitude: 17.6868,
    longitude: 83.2185,
  },
  {
    name: "Vijayawada",
    district: "Krishna",
    state: "Andhra Pradesh",
    latitude: 16.5062,
    longitude: 80.648,
  },
  {
    name: "Tirupati",
    district: "Chittoor",
    state: "Andhra Pradesh",
    latitude: 13.6288,
    longitude: 79.4192,
  },
  {
    name: "Guntur",
    district: "Guntur",
    state: "Andhra Pradesh",
    latitude: 16.3067,
    longitude: 80.4365,
  },
  {
    name: "Warangal",
    district: "Warangal",
    state: "Telangana",
    latitude: 17.9689,
    longitude: 79.5941,
  },
  { name: "Kochi", district: "Ernakulam", state: "Kerala", latitude: 9.9312, longitude: 76.2673 },
  {
    name: "Kozhikode",
    district: "Kozhikode",
    state: "Kerala",
    latitude: 11.2588,
    longitude: 75.7804,
  },
  {
    name: "Thrissur",
    district: "Thrissur",
    state: "Kerala",
    latitude: 10.5276,
    longitude: 76.2144,
  },
  { name: "Kollam", district: "Kollam", state: "Kerala", latitude: 8.8932, longitude: 76.6141 },
  { name: "Mysuru", district: "Mysore", state: "Karnataka", latitude: 12.2958, longitude: 76.6394 },
  { name: "Mysore", district: "Mysore", state: "Karnataka", latitude: 12.2958, longitude: 76.6394 },
  { name: "Hubli", district: "Dharwad", state: "Karnataka", latitude: 15.3647, longitude: 75.124 },
  {
    name: "Mangaluru",
    district: "Dakshina Kannada",
    state: "Karnataka",
    latitude: 12.9141,
    longitude: 74.856,
  },
  {
    name: "Mangalore",
    district: "Dakshina Kannada",
    state: "Karnataka",
    latitude: 12.9141,
    longitude: 74.856,
  },
  {
    name: "Indore",
    district: "Indore",
    state: "Madhya Pradesh",
    latitude: 22.7196,
    longitude: 75.8577,
  },
  {
    name: "Gwalior",
    district: "Gwalior",
    state: "Madhya Pradesh",
    latitude: 26.2183,
    longitude: 78.1828,
  },
  {
    name: "Jabalpur",
    district: "Jabalpur",
    state: "Madhya Pradesh",
    latitude: 23.1815,
    longitude: 79.9864,
  },
  {
    name: "Ujjain",
    district: "Ujjain",
    state: "Madhya Pradesh",
    latitude: 23.1765,
    longitude: 75.7885,
  },
  {
    name: "Jodhpur",
    district: "Jodhpur",
    state: "Rajasthan",
    latitude: 26.2389,
    longitude: 73.0243,
  },
  {
    name: "Udaipur",
    district: "Udaipur",
    state: "Rajasthan",
    latitude: 24.5854,
    longitude: 73.7125,
  },
  { name: "Kota", district: "Kota", state: "Rajasthan", latitude: 25.2138, longitude: 75.8648 },
  {
    name: "Bikaner",
    district: "Bikaner",
    state: "Rajasthan",
    latitude: 28.0229,
    longitude: 73.3119,
  },
  { name: "Ajmer", district: "Ajmer", state: "Rajasthan", latitude: 26.4499, longitude: 74.6399 },
  { name: "Alwar", district: "Alwar", state: "Rajasthan", latitude: 27.5665, longitude: 76.625 },
  {
    name: "Faridabad",
    district: "Faridabad",
    state: "Haryana",
    latitude: 28.4089,
    longitude: 77.3178,
  },
  {
    name: "Gurugram",
    district: "Gurugram",
    state: "Haryana",
    latitude: 28.4595,
    longitude: 77.0266,
  },
  {
    name: "Gurgaon",
    district: "Gurugram",
    state: "Haryana",
    latitude: 28.4595,
    longitude: 77.0266,
  },
  { name: "Panipat", district: "Panipat", state: "Haryana", latitude: 29.3909, longitude: 76.9635 },
  { name: "Ludhiana", district: "Ludhiana", state: "Punjab", latitude: 30.901, longitude: 75.8573 },
  { name: "Amritsar", district: "Amritsar", state: "Punjab", latitude: 31.634, longitude: 74.8723 },
  {
    name: "Jalandhar",
    district: "Jalandhar",
    state: "Punjab",
    latitude: 31.326,
    longitude: 75.5762,
  },
  { name: "Patiala", district: "Patiala", state: "Punjab", latitude: 30.3398, longitude: 76.3869 },
  {
    name: "Jamshedpur",
    district: "East Singhbhum",
    state: "Jharkhand",
    latitude: 22.8046,
    longitude: 86.2029,
  },
  {
    name: "Dhanbad",
    district: "Dhanbad",
    state: "Jharkhand",
    latitude: 23.7957,
    longitude: 86.4304,
  },
  {
    name: "Bhilai",
    district: "Durg",
    state: "Chhattisgarh",
    latitude: 21.1938,
    longitude: 81.3509,
  },
  {
    name: "Siliguri",
    district: "Darjeeling",
    state: "West Bengal",
    latitude: 26.7271,
    longitude: 88.3953,
  },
  {
    name: "Durgapur",
    district: "Paschim Bardhaman",
    state: "West Bengal",
    latitude: 23.5204,
    longitude: 87.3119,
  },
  {
    name: "Asansol",
    district: "Paschim Bardhaman",
    state: "West Bengal",
    latitude: 23.6739,
    longitude: 86.9524,
  },
  {
    name: "Howrah",
    district: "Howrah",
    state: "West Bengal",
    latitude: 22.5958,
    longitude: 88.2636,
  },
  {
    name: "Haridwar",
    district: "Haridwar",
    state: "Uttarakhand",
    latitude: 29.9457,
    longitude: 78.1642,
  },
  {
    name: "Nainital",
    district: "Nainital",
    state: "Uttarakhand",
    latitude: 29.3919,
    longitude: 79.4542,
  },
  {
    name: "Nellore",
    district: "Nellore",
    state: "Andhra Pradesh",
    latitude: 14.4426,
    longitude: 79.9865,
  },
];

// Simple, dependency-free ranked prefix/contains search across name,
// district, and state. Local + synchronous once the dataset is loaded, so
// no debounce is needed — filtering ~25k short strings takes low
// single-digit milliseconds even on modest devices.
export function searchLocations(all: IndiaLocation[], query: string, limit = 8): LocationMatch[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  // Tier -2 / -1: curated major cities, always shown first regardless of
  // how the raw post-office dataset happens to have named things.
  const majorMatches: LocationMatch[] = [];
  const majorKeys = new Set<string>();
  for (const c of MAJOR_CITIES) {
    const n = c.name.toLowerCase();
    if (n === q || n.startsWith(q)) {
      const key = `${c.name.toLowerCase()}|${c.district.toLowerCase()}|${c.state.toLowerCase()}`;
      if (majorKeys.has(key)) continue; // dedupe aliases pointing at the same place
      majorKeys.add(key);
      majorMatches.push({
        name: c.name,
        district: c.district,
        state: c.state,
        latitude: c.latitude,
        longitude: c.longitude,
        pincode: "",
        score: n === q ? -2 : -1,
      });
    }
  }
  majorMatches.sort((a, b) => a.score - b.score || a.name.length - b.name.length);

  const results: LocationMatch[] = [];
  for (const loc of all) {
    const name = loc.name.toLowerCase();
    const district = loc.district.toLowerCase();
    const state = loc.state.toLowerCase();

    // Skip anything that would just duplicate a major-city row already
    // pinned to the top (same name + district + state).
    const key = `${name}|${district}|${state}`;
    if (majorKeys.has(key)) continue;

    let score: number | null = null;
    if (name === q) score = 0;
    else if (name.startsWith(q)) score = 1;
    else if (district.startsWith(q)) score = 2;
    else if (state.startsWith(q)) score = 3;
    else if (name.includes(q)) score = 4;
    else if (district.includes(q)) score = 5;
    if (score !== null) results.push({ ...loc, score });
  }
  results.sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    return a.name.length - b.name.length; // shorter/more-exact names first within a tier
  });

  return [...majorMatches, ...results].slice(0, limit);
}

export { loadDataset as loadIndiaLocations };