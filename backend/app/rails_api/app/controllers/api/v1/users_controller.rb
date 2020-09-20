class Api::V1::UsersController < ApplicationController
    require "net/http"

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
        body = {id_token: token, client_id: "1654890866"}
        uri = URI.parse("https://api.line.me/oauth2/v2.1/verify")
        response = Net::HTTP.post_form(uri, body)
        # 文字列のレスポンスをJSONとしてrubyハッシュに解析
        parsed_response = JSON.parse(response.body)

        if parsed_response["error"]
            render json: {error: "ログインできません。ログインをやり直してください"}
            return
        end

        unless nonce = Nonce.find_by(nonce: parsed_response["nonce"])
            render json: {error: "ログインできません。ログインをやり直してください"}
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
        token = params["token"]
        uri = URI.parse("https://api.line.me/oauth2/v2.1/verify?access_token=#{token}")
        response = Net::HTTP.get_response(uri)
        unless response.code == "200"
            render json: {error: "ログインできません。ログインをやり直してください"}
            return
        end
        uri = URI.parse("https://api.line.me/v2/profile")
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = uri.scheme === "https"
        headers = {"Authorization" => "Bearer #{token}"}
        request = Net::HTTP::Get.new(uri.path)
        request.initialize_http_header(headers)
        response = http.request(request)
        unless response.code == "200"
            render json: {error: "ログインできません。ログインをやり直してください"}
            return
        end

        response_body = JSON.parse(response.body)
        uid = response_body["userId"]
        uid_hash = uid.crypt(Rails.application.credentials.salt[:salt_key])
        user = User.find_by(uid: uid_hash)
        if user
            render json: {name: user.name, image: user.image, introduce: user.introduce, message: nil, display: false}
        end
    end

    def edit
        token = params["token"]
        unless user = checkAccessToken(token)
            return 
        end
        name = params["name"]
        introduce = params["introduce"]
        
        unless user.update(name: name, introduce: introduce, image: user.image, display: user.display, message: user.message)
            render json: {invalid: user.errors.full_messages[0]}
            return
        end
        render json: {name: user.name, image: user.image, introduce: user.introduce, message: user.message, display: user.display}
    end

    private

    def checkAccessToken(token)
        uri = URI.parse("https://api.line.me/oauth2/v2.1/verify?access_token=#{token}")
        response = Net::HTTP.get_response(uri)
        unless response.code == "200"
            render json: {error: "ログインできません。ログインをやり直してください"}
            return false
        end
        uri = URI.parse("https://api.line.me/v2/profile")
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = uri.scheme === "https"
        headers = {"Authorization" => "Bearer #{token}"}
        request = Net::HTTP::Get.new(uri.path)
        request.initialize_http_header(headers)
        response = http.request(request)
        unless response.code == "200"
            render json: {error: "ログインできません。ログインをやり直してください"}
            return false
        end
        response_body = JSON.parse(response.body)
        uid = response_body["userId"]
        uid_hash = uid.crypt(Rails.application.credentials.salt[:salt_key])
        user = User.find_by(uid: uid_hash)
    end
end
