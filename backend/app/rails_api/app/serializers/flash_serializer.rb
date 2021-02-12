class FlashSerializer < ActiveModel::Serializer
    attributes :id, :source, :sourceType, :timestamp

    def sourceType
        object.source_type
    end

    def timestamp
        object.created_at
    end
end