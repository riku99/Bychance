class RoomSerializer < ActiveModel::Serializer
    attributes :id, :partner, :messages, :unreadNumber, :latestMessage
    attribute :updated_at, key: :timestamp

    def partner
        user =  @instance_options[:user]
        object.sender.id == user.id ? object.recipient.id : object.sender.id
    end

    def messages
        object.room_messages.ids
    end

    def unreadNumber
        user =  @instance_options[:user]
        UserRoomMessageRead.get_unread_room_messages_number(object, user.id)
    end

    def latestMessage
        object.room_messages.first ? object.room_messages.first.text : nil
    end
end