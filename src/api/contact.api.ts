import { db } from '../db/localStorageDb';
import { ContactMessage } from '../types';
import { sanitizeInput } from '../services/sanitizer.service';
import { simulateLatency, okResponse, createdResponse, ApiResponse } from './mockClient';

export interface SubmitContactDto {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const contactApi = {
  async submitMessage(dto: SubmitContactDto): Promise<ApiResponse<ContactMessage>> {
    await simulateLatency();
    const newMsg: ContactMessage = {
      id: `msg_${Date.now()}`,
      name: sanitizeInput(dto.name),
      email: sanitizeInput(dto.email),
      phone: dto.phone ? sanitizeInput(dto.phone) : undefined,
      subject: sanitizeInput(dto.subject),
      message: sanitizeInput(dto.message),
      status: 'Unread',
      createdAt: new Date().toISOString()
    };
    db.insert<ContactMessage>('contact_messages', newMsg);
    return createdResponse(newMsg, 'Thank you! Your message has been received by our support team.');
  },

  async getMessages(): Promise<ApiResponse<ContactMessage[]>> {
    await simulateLatency();
    const msgs = db.get('contact_messages') || [];
    const sorted = [...msgs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return okResponse(sorted);
  },

  async markMessageRead(id: string): Promise<ApiResponse<boolean>> {
    await simulateLatency(50, 100);
    db.update<ContactMessage>('contact_messages', id, m => {
      m.status = 'Read';
    });
    return okResponse(true);
  },

  async updateStatus(id: string, status: 'Unread' | 'Read' | 'Resolved'): Promise<ApiResponse<boolean>> {
    await simulateLatency(50, 100);
    db.update<ContactMessage>('contact_messages', id, m => {
      m.status = status;
    });
    return okResponse(true);
  }
};
