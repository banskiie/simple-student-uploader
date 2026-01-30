import Session from "@/models/Session"

const sessionResolvers = {
  Query: {
    getLabLink: async (_: any, { lab }: { lab: string }) => {
      try {
        const session = await Session.findOne({ lab })
        return session.pdf
      } catch (error) {
        throw error
      }
    },
  },
  Mutation: {
    createSession: async (
      _: any,
      { lab, pdf }: { lab: string; pdf: string },
    ) => {
      try {
        await Session.create({ lab, pdf })
        return "Good"
      } catch (error) {
        throw error
      }
    },
    setLabLink: async (_: any, { lab, pdf }: { lab: string; pdf: string }) => {
      try {
        console.log(lab, pdf)
        const session = await Session.findOneAndUpdate(
          { lab },
          { pdf },
          { new: true },
        )

        if (!session) {
          const newSession = await Session.create({ lab, pdf })
          await Session.findByIdAndUpdate(newSession._id, { lab, pdf })
        }

        return "Good"
      } catch (error) {
        throw error
      }
    },
  },
}

export default sessionResolvers
