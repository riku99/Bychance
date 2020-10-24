class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :image, :introduce, :message, :display, :lat, :lng

  has_many :posts
end

class UserWithoutPostsSerializer < ActiveModel::Serializer
  attributes :id, :name, :image, :introduce, :message, :display
end
