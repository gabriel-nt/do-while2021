import { Request, Response } from 'express';
import { ProfileUserService } from '../services/ProfileUserService';

class ProfileUserController {
  async handle(request: Request, response: Response) {
    const user_id = request.user_id;
    const service = new ProfileUserService();

    try {
      const data = await service.execute(user_id);

      return response.json(data);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export { ProfileUserController };
