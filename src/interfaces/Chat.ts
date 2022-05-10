interface ChatInfo {
  roomHash: string;
  members: string[];
  messageCount: number;
  recent?: RecentMessage;
}

interface RecentMessage {
  publicKey: string;
  content: string;
  createdAt: string;
}

export { ChatInfo };
