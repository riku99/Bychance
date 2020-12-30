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
end

class UserEditItemSerializer < ActiveModel::Serializer
  attributes :id, :name, :image, :introduce, :message
end
