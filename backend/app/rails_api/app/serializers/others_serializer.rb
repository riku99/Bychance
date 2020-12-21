class OthersSerializer < ActiveModel::Serializer
    attributes :id, :name, :image, :introduce, :message, :flashes

    has_many :posts

    def flashes
        user = @instance_options[:user]
        aleady_viewed_ids = user.viewing_flashes.ids
        entities = object.flashes.map { |flash| FlashSerializer.new(flash) }
        {
            entities: entities,
            alreadyViewed: object.flashes.ids.select { |n| aleady_viewed_ids.include?(n)}
        }
    end
end