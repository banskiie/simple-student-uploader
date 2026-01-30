import { model, models, Schema } from "mongoose"

const Session = new Schema(
  {
    lab: {
      type: String,
    },
    pdf: {
      type: String,
    },
  },
  { timestamps: true },
)

export default models.Session || model("Session", Session)
