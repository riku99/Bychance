class AddColumnToUserRoomMessageReads < ActiveRecord::Migration[6.0]
  def change
    add_reference :user_room_message_reads, :room, index: true
  end
end
