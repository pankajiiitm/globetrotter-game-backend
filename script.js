import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import axios from "axios";
import Destination from "./models/Destination.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const cities =  [
  { city: "Paris", country: "France" },
  { city: "Tokyo", country: "Japan" },
  { city: "New York", country: "USA" },
  { city: "London", country: "UK" },
  { city: "Sydney", country: "Australia" },
  { city: "Berlin", country: "Germany" },
  { city: "Rome", country: "Italy" },
  { city: "Toronto", country: "Canada" },
  { city: "Moscow", country: "Russia" },
  { city: "Dubai", country: "UAE" },
  { city: "Mumbai", country: "India" },
  { city: "Beijing", country: "China" },
  { city: "Rio de Janeiro", country: "Brazil" },
  { city: "Cape Town", country: "South Africa" },
  { city: "Bangkok", country: "Thailand" },
  { city: "Singapore", country: "Singapore" },
  { city: "Istanbul", country: "Turkey" },
  { city: "Seoul", country: "South Korea" },
  { city: "Mexico City", country: "Mexico" },
  { city: "Los Angeles", country: "USA" },
  { city: "Madrid", country: "Spain" },
  { city: "Vienna", country: "Austria" },
  { city: "Stockholm", country: "Sweden" },
  { city: "Lisbon", country: "Portugal" },
  { city: "Hanoi", country: "Vietnam" },
  { city: "Jakarta", country: "Indonesia" },
  { city: "Buenos Aires", country: "Argentina" },
  { city: "Cairo", country: "Egypt" },
  { city: "Nairobi", country: "Kenya" },
  { city: "Helsinki", country: "Finland" },
];

const generateCityData = async () => {
  const cityData = [];

  for (const { city, country } of cities) {
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`
      );
      const extract = response.data.extract || "";

      const sentences = extract.split(". ");

      cityData.push({
        city,
        country,
        clues: [
          sentences.length > 0 ? `This city is known for ${sentences[0]}.` : "Clue not available.",
          `It is one of the most visited places in ${country}.`,
        ],
        fun_fact: [
          sentences.length > 1 ? `Did you know? ${sentences[1]}.` : "Fun fact not available.",
          sentences.length > 2 ? `A famous landmark here is ${sentences[2]}.` : "Landmark info missing.",
        ],
        trivia: [
          sentences.length > 3 ? `The city's history includes ${sentences[3]}.` : "Historical info missing.",
          `Many tourists love visiting ${city} for its culture and food!`,
        ],
      });
    } catch (error) {
      console.error(`Failed to fetch data for ${city}:`, error.message);
    }
  }

  return cityData;
};

const importData = async () => {
  try {
    await connectDB();

    // Wait for Mongoose connection
    if (mongoose.connection.readyState !== 1) {
      console.log("Waiting for database connection...");
      await new Promise((resolve) => mongoose.connection.once("open", resolve));
    }

    console.log("Fetching city data...");
    const cityData = await generateCityData();

    console.log("Inserting data into MongoDB...");
    await Destination.insertMany(cityData);

    console.log("Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error with data import:", error);
    process.exit(1);
  }
};

importData();
