import { Request, Response } from "express";
import { lyzrManagerAgent } from "../client/lizr";

export const sendMessage = async (req: Request, res: Response) => {
    const { chatbotId } = req.params;
    const { message } = req.body;
    try {
        const response = await lyzrManagerAgent.sendMessage({chatbotId, message});
    
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: "Failed to send message" });
    }
}