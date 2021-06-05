import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Post} from './Post';
import {RootState, AppDispatch} from '../../../stores/index';
import {deletePostThunk} from '../../../apis/posts/deletePost';
import {
  MyPageStackRouteProp,
  UserPageStackRouteProp,
} from '../../../screens/types';
import {displayShortMessage} from '../../../helpers/shortMessages/displayShortMessage';

type Props = {
  route: MyPageStackRouteProp<'Post'> | UserPageStackRouteProp<'Post'>;
};

export const Container = ({route}: Props) => {
  const user = useSelector((state: RootState) => {
    return state.userReducer.user!.id;
  });
  const dispatch: AppDispatch = useDispatch();
  const deletePost = async (postId: number) => {
    const result = await dispatch(deletePostThunk({postId}));
    if (deletePostThunk.fulfilled.match(result)) {
      displayShortMessage('削除しました', 'success');
    }
  };
  return <Post post={route.params} user={user} deletePost={deletePost} />;
};
