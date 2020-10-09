class Api::V1::PostsController < ApplicationController
    def create
        unless user = checkAccessToken(post_params["id"], request.headers)
            return {loginError: true}
        end
        text = post_params["text"]
        image = post_params["image"]
        image_url = createImagePath(image, "post", "#{user.id}")
        post = user.posts.new(text: text, image: image_url)
        if post.save
            render json: {success: {id: post.id, text: text, image: image_url} }
            return
        else
            render json:  {invalid: post.errors.full_messages}
            return
        end
    end

    private
    def post_params
        params.require(:post).permit(:id, :text, :image)
    end
end
