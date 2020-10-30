class User < ApplicationRecord
  attr_accessor :distance
  has_many :posts, dependent: :destroy
  validates :uid, presence: true
  validates :token, presence: true
  validates :name, presence: true, length: { maximum: 20 }
  validates :introduce, length: { maximum: 100 }
  validates :message, length: { maximum: 50 }

  acts_as_mappable default_units: :kms, default_formula: :sphere, distance_field_name: :distance

  def User.new_token
    SecureRandom.urlsafe_base64
  end

  def User.digest(arg)
    arg.crypt(Rails.application.credentials.salt[:salt_key])
  end

  def sort_by_distance(lat, lng)
    self.distance = distance_from([lat, lng])
  end
end
