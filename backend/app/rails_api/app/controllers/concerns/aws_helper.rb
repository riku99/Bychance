require 'net/http'
require 'aws-sdk'
require "mini_magick"

module AwsHelper
  def create_s3_object_path(data, model, id, ext = nil)
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
    file_name = SecureRandom.urlsafe_base64
    pure_data = data.sub %r{data:((image|application)\/.{3,}),}, ''
    decoded_data = Base64.decode64(pure_data)
    image = MiniMagick::Image.read(decoded_data)
    #image.resize("1000x1000") スクショを投稿する形にしてからは画質担保の関係でリサイズしない
    image.write("tmp/image/#{file_name}")
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
    obj = bucket.object("#{model}/#{id}/#{file_name}")
    obj.put(body: File.open("tmp/image/#{file_name}"), content_type: type)
    File.delete("tmp/image/#{file_name}")
    "https://#{Rails.application.credentials.aws[:cloud_front_origin]}/#{model}/#{id}/#{file_name}"
  end
end
