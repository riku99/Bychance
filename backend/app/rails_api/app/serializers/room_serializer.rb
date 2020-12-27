class RoomSerializer < ActiveModel::Serializer
    attributes :id, :partner, :messages
    attribute :updated_at, key: :timestamp

    def partner
        user =  @instance_options[:user]
        object.sender.id ? OthersSerializer.new(object.recipient, user: user) : OthersSerializer.new(object.sender, user: user)
    end

    def messages
        object.room_messages.ids
    end
end