require 'net/http'
require 'aws-sdk'

module UsersHelper
  def createImagePath(image, model, id)
    base_data = image.sub %r{data:((image|application)\/.{3,}),}, ''
    decoded_data = Base64.decode64(base_data)
    s3 =
      Aws::S3::Resource.new(
        {
          region: 'ap-northeast-1',
          credentials:
            Aws::Credentials.new(
              Rails.application.credentials.aws[:access_key_id],
              Rails.application.credentials.aws[:secret_access_key]
            )
        }
      )
    bucket = s3.bucket('r-message-app')
    file_name = Time.new.strftime('%Y%m%d%H%M%S')
    obj = bucket.object("#{model}/#{id}/#{file_name}")
    obj.put(body: decoded_data)
    obj.public_url
  end
end
