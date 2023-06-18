import { createServer } from 'http';
import 'dotenv/config';
import { appRouter } from './routers/app-router.js';
const port = process.env.PORT;

const server = createServer((req, res) => {
  const { method, url } = req;
  appRouter.handleRoutes(method, url, req, res);
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
