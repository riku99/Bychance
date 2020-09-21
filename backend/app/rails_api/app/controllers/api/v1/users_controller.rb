class Api::V1::UsersController < ApplicationController
    require "date"
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
            render json: {id: user.id, name: user.name, image: user.image, introduce: user.introduce, message: nil, display: false}
        end
    end

    def edit
        unless user = authorizationProcess(request.headers)
            return {error: "ログインできません。ログインをやり直してください"}
        end
        name = user_params["name"]
        introduce = user_params["introduce"]
        if image = user_params["image"]
            url = createImagePath(image, "user/#{user.id}/#{Date.today.strftime("%Y%m%d%H%M")}.jpeg")
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

    def getAccessToken(headers)
        headers["Authorization"].sub("Bearer ", '')
    end

    def authorizationProcess(arg)
        token = getAccessToken(arg)
        checkAccessToken(token)
    end

    def createImagePath(image, file_name)
        base_data = image.sub %r/data:((image|application)\/.{3,}),/, ''
        decoded_data = Base64.decode64(base_data)
        s3 = Aws::S3::Resource.new({
            :region => 'ap-northeast-1',
            credentials: Aws::Credentials.new( Rails.application.credentials.aws[:access_key_id], Rails.application.credentials.aws[:secret_access_key])
        })
        bucket = s3.bucket("r-message-app")
        obj = bucket.object(file_name)
        obj.put(body: decoded_data)
        obj.public_url
    end

    def user_params
        params.require(:user).permit(:name, :introduce, :image)
    end
end
