import express, { Request, Response, NextFunction } from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/dis'
// import staticRouter from './routes/statics.routes'
import tweetsRouter from './routes/tweets.routes'
import bookmarksRouter from './routes/bookmarks.routes'
import likesRouter from './routes/likes.routes'
import cors from 'cors'
// import '~/utils/s3';
import { createServer } from "http";
import { Server } from "socket.io";
import Conversation from './models/schemas/Conversations.schema'
import conversationsRouter from './routes/conversations.routes'
import { ObjectId } from 'mongodb'
config()
const app = express()
const httpServer = createServer(app);
const port = 4000
// console.log(isProduction)
databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  // databaseService.indexFollowers()
})
initFolder()

app.use(cors())
app.use(express.json())
app.use('/users', usersRouter)
// app.use('/medias', mediasRouter)
app.use('/tweets', tweetsRouter)
// app.use('/static', staticRouter)
app.use('/bookmarks', bookmarksRouter)
app.use('/likes', likesRouter)
app.use('/conversations', conversationsRouter)

//c1 doc hinh
app.use('/medias', express.static(UPLOAD_IMAGE_DIR))

// c1 doc video
// app.use('/medias', express.static(UPLOAD_VIDEO_DIR))

app.use(defaultErrorHandler)

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});

const users: {
  [key: string]: {
    socket_id: string
  }
} = {}

io.on("connection", (socket) => {
  // console.log(`user ${socket.id} connected`)
  const users_id = socket.handshake.auth._id
  console.log("users_id", users_id)
  users[users_id] = {
    socket_id: socket.id
  }

  console.log("users", users)

  socket.on('private message', async (data) => {
    const receiver_socket_id = users[data.to]?.socket_id
    if (!receiver_socket_id) {
      return
    }

    console.log("asdsa", socket.id)

    await databaseService.conversations.insertOne(
      new Conversation({
        sender_id: new ObjectId(data.from),
        receiver_id: new ObjectId(data.to),
        content: data.content
      })
    )
    socket.to(receiver_socket_id).emit("private receiver message", {
      content: data.content,
      from: users_id
    })
  })

  // socket.on('hello', (data) => {
  //   console.log("data", data)  
  // })

  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnect`)
    delete users[users_id]
  })
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
