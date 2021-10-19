import { Request, Response } from 'express';
import { GetLast3MessagesService } from '../services/GetLast3MessagesService';

class GetLast3MessagesController {
  async handle(request: Request, response: Response) {
    const service = new GetLast3MessagesService();

    try {
      const data = await service.execute();

      return response.json(data);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export { GetLast3MessagesController };
