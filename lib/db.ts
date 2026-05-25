import mongoose from "mongoose"
import { setServers } from "node:dns/promises"

setServers(["1.1.1.1", "8.8.8.8"])

const URI = process.env.MONGODB_URI

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return // Already connected
  if (!URI)
    throw new Error("Invalid MongoDB Connection. Please check your .env file.")

  try {
    await mongoose.connect(URI, {
      dbName: "submission-portal",
      appName: "submission-portal",
    })
    console.log("💻 Connected to MongoDB")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}
