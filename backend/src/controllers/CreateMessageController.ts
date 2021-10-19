import { Request, Response } from 'express';
import { CreateMessageService } from '../services/CreateMessageService';

class CreateMessageController {
  async handle(request: Request, response: Response) {
    const { message } = request.body;
    const user_id = request.user_id;

    const service = new CreateMessageService();

    try {
      const data = await service.execute(message, user_id);

      return response.json(data);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export { CreateMessageController };
