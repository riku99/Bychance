export type GetApplyedGroupResponse = {
  id: number;
  applyingUser: {
    id: string;
    name: string;
    avatar: string | null;
  };
}[];
