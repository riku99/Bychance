export type GetTalkRoomMessagesResponse = {
  messages: {
    id: number;
    userId: string;
    text: string;
  }[];
};
