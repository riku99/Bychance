class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :image, :introduce, :message, :display

  has_many :posts
end
