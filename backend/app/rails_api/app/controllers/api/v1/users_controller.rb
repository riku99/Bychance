class Api::V1::UsersController < ApplicationController
    require "net/http"
    require "aws-sdk"

    def createNonce
        nonce = params["nonce"]
        unless nonce
            render json: {error: "ログインできません。ログインをやり直してください"}
            return
        end
        new_nonce = Nonce.new(nonce: nonce)
        if new_nonce.save
            render json: {nonce: true}
        end
    end

    def firstLogin
        token = params["token"]
        body = {id_token: token, client_id: "1654890866"} # credentialsに変更
        uri = URI.parse("https://api.line.me/oauth2/v2.1/verify")
        response = Net::HTTP.post_form(uri, body)
        parsed_response = JSON.parse(response.body)

        if parsed_response["error"]
            render json: {error: "ログインエラー"}
            return
        end

        unless nonce = Nonce.find_by(nonce: parsed_response["nonce"])
            render json: {error: "ログインエラー"}
            return
        end

        if uid = parsed_response["sub"]
            user_name = parsed_response["name"]
            user_image = parsed_response["picture"]
            uid_hash = uid.crypt(Rails.application.credentials.salt[:salt_key])
            unless (User.find_by(uid: uid_hash))
                user = User.new(name: user_name, uid: uid_hash, image: user_image, display: false)
                user.save
            end
            render json: {name: user_name, image: user_image, introduce: "", message: nil, display: false}
        end
        nonce.destroy
    end

    def subsequentLogin
        unless user = authorizationProcess(request.headers)
            return {error: "ログインエラー"}
        end
        render json: {id: user.id, name: user.name, image: user.image, introduce: user.introduce, message: nil, display: false}
    end

    def edit
        unless user = authorizationProcess(request.headers)
            return {error: "ログインできません。ログインをやり直してください"}
        end
        name = user_params["name"]
        introduce = user_params["introduce"]
        if image = user_params["image"]
            url = createImagePath(image, "user", `#{user.id}`)
            else
                url = user.image
        end
        unless user.update(name: name, introduce: introduce, image: url, display: user.display, message: user.message)
            render json: {invalid: user.errors.full_messages[0]}
            return
        end
        render json: {name: user.name, image: user.image, introduce: user.introduce, message: user.message, display: user.display}
    end

    private

    def user_params
        params.require(:user).permit(:name, :introduce, :image)
    end
end
