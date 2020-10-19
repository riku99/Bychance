class Api::V1::UsersController < ApplicationController
    require "net/http"
    require "aws-sdk"

    def u
        use = User.first
        posts = use.posts
        render json: use
    end

    def createNonce
        nonce = params["nonce"]
        unless nonce
            render json: {error: true}
            return
        end
        new_nonce = Nonce.new(nonce: nonce)
        if new_nonce.save
            render json: {nonce: true}
        else
            render json: {error: true}
        end
    end

    def firstLogin
        token = getToken(request.headers)
        body = {id_token: token, client_id: Rails.application.credentials.line[:client_id]}
        uri = URI.parse("https://api.line.me/oauth2/v2.1/verify")
        response = Net::HTTP.post_form(uri, body)
        parsed_response = JSON.parse(response.body)

        unless nonce = Nonce.find_by(nonce: parsed_response["nonce"])
            render json: {loginError: true}
            nonce.destroy
            return
        end

        if uid = parsed_response["sub"]
            user_name = parsed_response["name"]
            user_image = parsed_response["picture"]
            uid_hash = uid.crypt(Rails.application.credentials.salt[:salt_key])
            token = User.new_token
            token_hash = token.crypt(Rails.application.credentials.salt[:salt_key])
            if user = User.find_by(uid: uid_hash)
                user.update_attribute(:token, token_hash)
                posts = user.posts
                render json: {
                    success: {
                        user: UserSerializer.new(user),
                        posts: posts.map { |p| PostSerializer.new(p)},
                        token: token
                    }
                }
            else
                user = User.create(
                    name: user_name,
                    uid: uid_hash,
                    token: token_hash,
                    image: user_image,
                    display: false
                )
                render json: {
                    success: {
                        user: UserSerializer.new(user),
                        posts: [],
                        token: token
                    }
                }
            end
            nonce.destroy
        end

        if parsed_response["error"]
            render json: {loginError: true}
            nonce.destroy
            return
        end
    end

    def subsequentLogin
        if user = checkAccessToken(params["id"], request.headers)
            render json: user
            return
        else
            render json: {loginError: true}, status: 404
        end
        
    end

    def edit
        unless user = checkAccessToken(user_params["id"] ,request.headers)
            render json: {loginError: true}
            return
        end
        name = user_params["name"]
        introduce = user_params["introduce"]
        if image = user_params["image"]
            url = createImagePath(image, "user", `#{user.id}`)
        else
            url = user.image
        end
        if user.update(name: name, introduce: introduce, image: url)
            render json: {success: UserSerializer.new(user)}
            return
        else
            render json: {invalid: user.errors.full_messages[0]}
        end
    end

    private

    def user_params
        params.require(:user).permit(:id, :name, :introduce, :image)
    end
end
