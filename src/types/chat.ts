export interface Contact {
  id: string;
  avatar: string;
  isActive: boolean;
  lastActivity?: number;
  name: string;
  threadId?: string;
}

interface Attachment {
  id: string;
  url: string;
}

export interface Message {
  id: string;
  attachments: Attachment[];
  body: string;
  contentType: string;
  createdAt: number;
  authorId: string;
  participants?:string;
}

export interface Participant {
  id: string;
  avatar: string | null;
  lastActivity?: number;
  name: string;
}

export interface Thread {
  id?: string;
  messages: Message[];
  participantIds: string[];
  participants?: Participant[];
  type: 'ONE_TO_ONE' | 'GROUP';
  unreadCount?: number;
}
