import { collection, addDoc, getDocs, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";

const buses = [
  {
    name: "Toyota Hiace Grand Cabin",
    luxuryClass: "Luxury Gold",
    from: "Karachi",
    to: "Lahore",
    date: "2026-04-10",
    time: "09:00 PM",
    busNumber: "KHI-4580",
    price: 4200,
    seats: 15,
    availableSeats: 15,
    currentLocation: { lat: 24.8607, lng: 67.0011 }, // Karachi
    destinationCoords: { lat: 31.5204, lng: 74.3587 } // Lahore
  },
  {
    name: "Executive High-Roof Hiace",
    luxuryClass: "Executive",
    from: "Islamabad",
    to: "Multan",
    date: "2026-04-11",
    time: "10:30 AM",
    busNumber: "ISL-9921",
    price: 2600,
    seats: 15,
    availableSeats: 15,
    currentLocation: { lat: 33.6844, lng: 73.0479 }, // Islamabad
    destinationCoords: { lat: 30.1575, lng: 71.5249 } // Multan
  },
  {
    name: "Royal Flycoach Transit",
    luxuryClass: "Flycoach",
    from: "Rawalpindi",
    to: "Peshawar",
    date: "2026-04-12",
    time: "08:15 AM",
    busNumber: "RWP-1022",
    price: 1450,
    seats: 15,
    availableSeats: 15,
    currentLocation: { lat: 33.5651, lng: 73.0160 }, // Rawalpindi
    destinationCoords: { lat: 34.0151, lng: 71.5249 } // Peshawar
  },
  {
    name: "Green Line Hi-Ace",
    luxuryClass: "Flycoach",
    from: "Faisalabad",
    to: "Lahore",
    date: "2026-04-12",
    time: "07:30 AM",
    busNumber: "FSD-3321",
    price: 950,
    seats: 15,
    availableSeats: 15,
    currentLocation: { lat: 31.4504, lng: 73.1350 }, // Faisalabad
    destinationCoords: { lat: 31.5204, lng: 74.3587 } // Lahore
  },
  {
    name: "Kohat Express Transit",
    luxuryClass: "Standard",
    from: "Hangu",
    to: "Kohat",
    date: "2026-04-13",
    time: "08:30 AM",
    busNumber: "KHT-552",
    price: 450,
    seats: 15,
    availableSeats: 15,
    currentLocation: { lat: 33.5351, lng: 71.0581 }, // Hangu
    destinationCoords: { lat: 33.5869, lng: 71.4414 } // Kohat
  }
];

export const seedSampleData = async () => {
  try {
    // Check if data already exists to avoid duplicates
    const snapshot = await getDocs(collection(db, "buses"));
    if (snapshot.docs.length > 0) {
      console.log("Data already exists. Skipping seeding.");
      return "Data already exists.";
    }

    for (const bus of buses) {
      await addDoc(collection(db, "buses"), bus);
    }
    
    console.log("Seeding complete!");
    return "Demo data seeded successfully!";
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
};
