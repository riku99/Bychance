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

# オプションとしてuserインスタンスを渡さなければいけない
class AnotherUserSerializer < ActiveModel::Serializer
  attributes :id, :name, :image, :introduce, :message, :flashes

  has_many :posts

  def flashes
      user = @instance_options[:user]
      #not_expired_flashes = object.flashes.select { |flash| (Time.zone.now - flash.created_at) / (60 * 60) < 2 } あとで直す
      not_expired_flashes = object.flashes.select { |flash| true }
      already_viewed_flashes = not_expired_flashes.select { |n| user.viewed_flashes.ids.include?(n.id) }
      aleady_viewed_ids = already_viewed_flashes.map { |f| f.id }
      flash_entities = not_expired_flashes.map { |flash| FlashSerializer.new(flash) }
      is_all_already_viewed = aleady_viewed_ids.include?(flash_entities.last ? flash_entities.last.as_json[:id] : false)
      {
          entities: flash_entities,
          alreadyViewed: aleady_viewed_ids,
          isAllAlreadyViewed: is_all_already_viewed
      }
  end
end
