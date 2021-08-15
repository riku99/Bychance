export type TalkRoom = {
  id: number;
  timestamp: string;
  unreadMessages: {
    id: number;
  }[];
  lastMessage: string;
  partner: {
    id: string;
    name: string;
    avatar: string | null;
  };
};
