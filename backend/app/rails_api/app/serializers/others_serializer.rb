class OthersSerializer < ActiveModel::Serializer
    attributes :id, :name, :image, :introduce, :message

    has_many :posts
    has_many :flashes
end