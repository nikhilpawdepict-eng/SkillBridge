import { Router, Request, Response } from 'express';
import { retrieveSkillBridgeContext } from '../services/ragService.js';
import { ChatTurn, GeminiServiceError, generateGeminiResponse } from '../services/geminiService.js';
import { verifyAuthToken } from '../services/authToken.js';

export const chatRouter = Router();
const conversations = new Map<string, ChatTurn[]>();
const MAX_TURNS = 20;

chatRouter.post('/', async (req: Request, res: Response) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  const conversationId = typeof req.body?.conversationId === 'string' && req.body.conversationId.trim()
    ? req.body.conversationId.trim()
    : `conversation-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  if (!message) return res.status(400).json({ error: 'Message is required' });
  if (message.length > 8000) return res.status(413).json({ error: 'Message is too long' });

  const token = typeof req.headers.authorization === 'string' ? req.headers.authorization.replace(/^Bearer\s+/i, '') : '';
  const auth = token ? verifyAuthToken(token) : null;
  try {
    const history = conversations.get(conversationId) || [];
    const context = await retrieveSkillBridgeContext(message, auth?.userId);
    const answer = await generateGeminiResponse(message, history, context);
    const nextHistory = [...history, { role: 'user' as const, text: message }, { role: 'model' as const, text: answer }].slice(-MAX_TURNS);
    conversations.set(conversationId, nextHistory);
    return res.json({ message: answer, conversationId });
  } catch (error) {
    if (error instanceof GeminiServiceError) {
      console.error(`[Gemini:${error.code}] ${error.message}`);
      return res.status(error.status).json({ error: 'The AI assistant is temporarily unavailable. Check the server configuration and try again.' });
    }
    console.error('[Chat:unexpected] Unhandled provider error:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(503).json({ error: 'The AI assistant is temporarily unavailable. Check the server configuration and try again.' });
  }
});

chatRouter.delete('/:conversationId', (req: Request, res: Response) => {
  conversations.delete(req.params.conversationId);
  return res.json({ success: true });
});
