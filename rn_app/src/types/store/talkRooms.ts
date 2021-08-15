export type TalkRoom = {
  id: number;
  timestamp: string;
  unreadMessages: {
    id: number;
  }[];
  lastMessage: {
    id: number;
    text: string | null;
  }[];
  partner: {
    id: string;
    name: string;
    avatar: string | null;
  };
};
