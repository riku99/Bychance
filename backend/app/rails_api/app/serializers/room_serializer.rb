class RoomSerializer < ActiveModel::Serializer
    attributes :id, :partner, :messages
    attribute :updated_at, key: :timestamp

    def partner
        user_id = @instance_options[:user]
        user_id == object.sender.id ? OthersSerializer.new(object.recipient) : OthersSerializer.new(object.sender)
    end

    def messages
        object.room_messages.ids
    end
end