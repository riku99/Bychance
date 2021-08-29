export type TalkRoom = {
  id: number;
  timestamp: string;
  unreadMessages: {
    id: number;
  }[];
  lastMessage: {
    id: number;
    text: string;
    userId: string;
    createdAt: string;
  } | null;
  partner: {
    id: string;
  };
};
