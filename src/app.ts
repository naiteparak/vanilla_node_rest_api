import { createServer, IncomingMessage, ServerResponse } from 'http';
import 'dotenv/config';
import { appRouter } from './routers/app-router';
const port = process.env.PORT;

const server = createServer(
  async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    await appRouter.handleRoutes(req, res);
  },
);

server.listen(port, (): void => {
  console.log(`Server listening on port ${port}`);
});
