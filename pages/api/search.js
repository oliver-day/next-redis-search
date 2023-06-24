import { searchCars } from "@/lib/redis";

export default async function handler(req, res) {
  const { query } = req.query;

  const cars = await searchCars(query);
  res.status(200).json({ cars });
};
