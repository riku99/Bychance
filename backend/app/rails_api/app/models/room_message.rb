class RoomMessage < ApplicationRecord
  belongs_to :room
  belongs_to :user
  default_scope -> { order(created_at: :desc) }
end
