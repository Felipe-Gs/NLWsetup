import Fastify from "fastify";
import cors from '@fastify/cors'
import { AppRoutes } from "./routes";

const app = Fastify();

app.register(cors, {
    origin: true,
})

app.register(AppRoutes)

app.listen({
    port: 3333, host: '0.0.0.0'
}).then(()=>{
    console.log('http server running')
})