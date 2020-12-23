class OthersSerializer < ActiveModel::Serializer
    attributes :id, :name, :image, :introduce, :message, :flashes

    has_many :posts

    def flashes
        user = @instance_options[:user]
        aleady_viewed_ids = object.flashes.ids.select { |n| user.viewed_flashes.ids.include?(n) }
        flash_entities = object.flashes.map { |flash| FlashSerializer.new(flash) }
        is_all_already_viewed = aleady_viewed_ids.include?(flash_entities.last ? flash_entities.last.as_json[:id] : false)
        {
            entities: flash_entities,
            alreadyViewed: aleady_viewed_ids,
            isAllAlreadyViewed: is_all_already_viewed
        }
    end
end