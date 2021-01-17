require 'net/http'
require 'aws-sdk'

module AwsHelper
  def create_s3_object_path(data, model, id, ext = nil)
    pure_data = data.sub %r{data:((image|application)\/.{3,}),}, ''
    decoded_data = Base64.decode64(pure_data)
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
    case ext
      when "mov" then
        type = "video/quicktime"
      when "mp4" then
        type = "video/mp4"
      when "png" then
        type = "image/png"
      when "jpeg", "jpg" then
        type = "image/jpeg"
      else
        type = nil
    end
    obj.put(body:decoded_data, content_type: type)
    "https://#{Rails.application.credentials.aws[:cloud_front_origin]}/#{model}/#{id}/#{file_name}"
  end
end
