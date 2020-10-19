class Api::V1::PostsController < ApplicationController
    def create
        unless user = checkAccessToken(post_params["user"], request.headers)
            return {loginError: true}
        end
        text = post_params["text"]
        image = post_params["image"]
        image_url = createImagePath(image, "post", "#{user.id}")
        post = user.posts.new(text: text, image: image_url)
        if post.save
            render json: {success: PostSerializer.new(post)}
            return
        else
            render json: {invalid: post.errors.full_messages[0]}
            return
        end
    end

    def destroy
        puts post_params["user"]
        unless user = checkAccessToken(post_params["user"], request.headers)
            render json: {loginError: true}
            return
        end
        post = Post.find_by(id: post_params["id"])
        if post.user == user
            post.destroy
            render json: {success: true}
            return
        else
            render json: {invalid: "他のユーザーの投稿は削除できません"}
            return
        end
    end

    private
    def post_params
        params.require(:post).permit(:id, :user, :text, :image)
    end
end
