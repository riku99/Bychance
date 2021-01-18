class Api::V1::PostsController < ApplicationController
  before_action :check_access_token
  def create
    if @user
      text = post_params['text']
      image = post_params['image']
      image_url = create_s3_object_path(image, 'post', "#{@user.id}")
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

  

  private

  def post_params
    params.require(:post).permit(:id, :postId, :text, :image)
  end
end
