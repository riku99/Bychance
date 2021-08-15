export type TalkRoom = {
  id: number;
  timestamp: string;
  unreadMessages: {
    id: number;
  }[];
  lastMessage: {
    id: number;
    text: string;
  }[];
  partner: {
    id: string;
    name: string;
    avatar: string;
  };
};
