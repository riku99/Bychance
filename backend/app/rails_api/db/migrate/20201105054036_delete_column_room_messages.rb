class DeleteColumnRoomMessages < ActiveRecord::Migration[6.0]
  def up
    remove_column :room_messages, :room
  end

  def down
    add_column :room_message, :room, :string
  end
end
