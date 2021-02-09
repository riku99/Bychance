class RoomMessage < ApplicationRecord
  belongs_to :room
  belongs_to :user

  has_many :user_room_message_reads, dependent: :destroy
end
