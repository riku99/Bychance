class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :image, :introduce, :message, :display, :lat, :lng

  def lat
    crypt = User.create_geolocation_crypt
    lat = crypt.decrypt_and_verify(object.lat)
    lat.to_f
  end

  def lng
    crypt = User.create_geolocation_crypt
    lng = crypt.decrypt_and_verify(object.lng)
    lng.to_f
  end

  has_many :posts
  has_many :rooms
end

class UserWithoutPostsSerializer < ActiveModel::Serializer
  attributes :id, :name, :image, :introduce, :message, :display
end

class OthersSerializer < ActiveModel::Serializer
  attributes :id, :name, :image, :introduce, :message

  has_many :posts
end
