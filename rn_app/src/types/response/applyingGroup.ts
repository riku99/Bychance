type UserData = {
  id: string;
  name: string;
  avatar: string | null;
};

export type GetApplyingGroupsResponse = {
  id: number;
  appliedUser: UserData;
}[];

export type GetAppliedGroupsResponse = {
  id: number;
  applyingUser: UserData;
}[];
