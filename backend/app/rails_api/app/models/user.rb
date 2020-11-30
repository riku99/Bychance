class User < ApplicationRecord
  attr_accessor :distance
  has_many :posts, dependent: :destroy
  has_many :sender_rooms, class_name: "Room" ,foreign_key: :sender_id
  has_many :recipient_rooms, class_name: "Room", foreign_key: :recipient_id
  has_many :room_messages
  has_many :flashes
  validates :uid, presence: true
  validates :token, presence: true
  validates :name, presence: true, length: { maximum: 20 }
  validates :introduce, length: { maximum: 100 }
  validates :message, length: { maximum: 50 }

  acts_as_mappable default_units: :kms, default_formula: :sphere

  def User.new_token
    SecureRandom.urlsafe_base64
  end

  def User.digest(arg)
    arg.crypt(Rails.application.credentials.salt[:salt_key])
  end

  def get_distance(lat, lng)
    self.distance = distance_from([lat, lng])
  end

  def User.create_geolocation_crypt
    key_len = ActiveSupport::MessageEncryptor.key_len
    secret = Rails.application.key_generator.generate_key(Rails.application.credentials.salt[:geolocation_key], key_len)
    crypt = ActiveSupport::MessageEncryptor.new(secret)
  end
end
