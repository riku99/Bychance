class RoomSerializer < ActiveModel::Serializer
    attributes :id, :partner, :messages, :unreadNumber
    attribute :updated_at, key: :timestamp

    def partner
        user =  @instance_options[:user]
        object.sender.id == user.id ? OthersSerializer.new(object.recipient, user: user) : OthersSerializer.new(object.sender, user: user)
    end

    def messages
        object.room_messages.ids
    end

    def unreadNumber
        user =  @instance_options[:user]
        UserRoomMessageRead.get_unread_room_message_number(object, user.id)
    end
end