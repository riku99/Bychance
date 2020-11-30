class FlashSerializer < ActiveModel::Serializer
    attributes :id, :content, :contentType, :timestamp

    def contentType
        object.content_type
    end

    def timestamp
        object.created_at
    end
end