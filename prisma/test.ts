import { db } from "../src/server/db"

async function main() {
  // Fetch all sessions
  const allSessions = await db.sessions.findMany({
    include: {
      users: true,
      messages: true,
    },
  })
  console.log("Sessions:", allSessions)

  // Fetch all users
  const allUsers = await db.users.findMany({
    include: {
      sessions: true,
      messages: true,
    },
  })
  console.log("Users:", allUsers)

  // Fetch all messages
  const allMessages = await db.messages.findMany({
    include: {
      sessions: true,
      users: true,
    },
  })
  console.log("Messages:", allMessages)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
