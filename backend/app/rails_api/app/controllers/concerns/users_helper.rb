require "net/http"
require "aws-sdk"

module UsersHelper
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
    
    def createImagePath(image, model, id)
        base_data = image.sub %r/data:((image|application)\/.{3,}),/, ''
        decoded_data = Base64.decode64(base_data)
        s3 = Aws::S3::Resource.new({
            :region => 'ap-northeast-1',
            credentials: Aws::Credentials.new( Rails.application.credentials.aws[:access_key_id], Rails.application.credentials.aws[:secret_access_key])
        })
        bucket = s3.bucket("r-message-app")
        file_name = Time.new.strftime("%Y%m%d%H%M%S")
        obj = bucket.object("#{model}/#{id}/#{file_name}")
        obj.put(body: decoded_data)
        obj.public_url
    end
    
end