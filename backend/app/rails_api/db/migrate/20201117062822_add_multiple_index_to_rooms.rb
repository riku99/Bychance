class AddMultipleIndexToRooms < ActiveRecord::Migration[6.0]
  def change
    add_index :rooms, [:recipient_id, :sender_id], unique: true
  end
end
