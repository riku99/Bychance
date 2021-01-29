class RemoveReadFromRoomMessage < ActiveRecord::Migration[6.0]
  def change
    remove_column :room_messages, :read
  end
end
