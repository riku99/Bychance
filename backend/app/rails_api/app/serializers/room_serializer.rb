class RoomSerializer < ActiveModel::Serializer
    attributes :id, :partner, :messages
    attribute :updated_at, key: :timestamp

    def partner
        user = @instance_options[:user]
        user.id == object.sender.id ? OthersSerializer.new(object.recipient, user: @instance_options[:user]) : OthersSerializer.new(object.sender, user: @instance_options[:user])
    end

    def messages
        object.room_messages.ids
    end
end