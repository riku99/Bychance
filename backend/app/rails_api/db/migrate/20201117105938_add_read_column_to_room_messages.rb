class AddReadColumnToRoomMessages < ActiveRecord::Migration[6.0]
  def change
    add_column :room_messages, :read, :boolean
  end
end
