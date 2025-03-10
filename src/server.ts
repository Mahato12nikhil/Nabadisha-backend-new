import Fastify from 'fastify'
import {app} from './app.js'
import { loadEnv } from './utils/loadEnv.js';

loadEnv();
// start the server
const server = Fastify({logger: true});
server.register(app,{
    isAwesomeApp:true
 });
server.listen({port: Number(process.env.PORT) || 5000}).then(() => {
  server.log.info('Server has started successfully...');
});