class Api::V1::PostsController < ApplicationController
  before_action :checkAccessToken
  def create
    if @user
      text = post_params['text']
      image = post_params['image']
      image_url = createImagePath(image, 'post', "#{@user.id}")
      post = @user.posts.new(text: text, image: image_url)
      if post.save
        render json: post
      else
        render json: { invalid: post.errors.full_messages[0] }, status: 400
      end
    else
      render json: { loginError: true }, status: 401
    end
  end

  def destroy
    if @user
      post = Post.find_by(id: params['postId'])
      if post.user == @user
        post.destroy
        render json: { success: true }
      else
        render json: { invalid: '他のユーザーの投稿は削除できません' },
               status: 400
      end
    else
      render json: { loginError: true }, status: 401
    end
  end

  private

  def post_params
    params.require(:post).permit(:postId, :text, :image)
  end
end
