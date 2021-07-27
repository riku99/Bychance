import {Flash} from '~/stores/flashes';

// 自分以外のユーザーが持つデータ。データそのもの(entiites)以外にも閲覧データとか必要なので定義
export type FlashesData = {
  entities: Flash[];
  alreadyViewed: number[];
  isAllAlreadyViewed?: boolean;
};
