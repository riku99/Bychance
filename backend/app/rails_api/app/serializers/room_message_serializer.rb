class RoomMessageSerializer < ActiveModel::Serializer
    attributes :id, :text, :read
    attribute :room_id, key: :roomId
    attribute :user_id, key: :userId
    attribute :created_at, key: :timestamp
end