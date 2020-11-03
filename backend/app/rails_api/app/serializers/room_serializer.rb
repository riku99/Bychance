class RoomSerializer < ActiveModel::Serializer
    attributes :id, :partner

    def partner
        user_id = @instance_options[:user]
        user_id == object.sender.id ? OthersSerializer.new(object.recipient) : OthersSerializer.new(object.sender)
    end

    has_many :room_messages, key: :messages
end