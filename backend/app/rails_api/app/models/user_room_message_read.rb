class UserRoomMessageRead < ApplicationRecord
  belongs_to :user
  belongs_to :room_message

  scope :get_unread_room_message_number, -> (room, user_id) do
    room_message_number_without_me = room.room_messages.where("user_id != ?", user_id).length
    aleady_read_room_message_number = where(room_id: room.id, user_id: user_id).length
    room_message_number_without_me - aleady_read_room_message_number
  end

end
