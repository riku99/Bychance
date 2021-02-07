module LoginHelper
    def create_user_data(user)
        posts = user.posts.map { |p| PostSerializer.new(p) }
        room_arr = []
        messages_arr = []
        rooms = user.sender_rooms.eager_load(:room_messages).order("room_messages.created_at DESC").eager_load(:sender, :recipient) + user.recipient_rooms.eager_load(:room_messages).order("room_messages.created_at DESC").eager_load(:sender, :recipient)
        rooms.each do |r|
            room_arr << RoomSerializer.new(r, { user: user })
            r.room_messages.each do |m|
                messages_arr << RoomMessageSerializer.new(m)
            end
        end
        chat_partners = room_arr.map do |room|
            partner = User.find_by(id: room.partner)
            if partner
                AnotherUserSerializer.new(partner, user: user)
            end
        end
        flashes = user.flashes
        #not_expired_flashes = flashes.select { |f| (Time.zone.now - f.created_at) / (60 * 60) < 2 } あとで直す
        not_expired_flashes = flashes.select { |f| true } 
        flash_entities= not_expired_flashes.map { |f| FlashSerializer.new(f)}
        {
            user: UserSerializer.new(user),
            posts: posts,
            rooms: room_arr,
            chatPartners: chat_partners,
            messages: messages_arr,
            flashes: flash_entities
        }
    end
end