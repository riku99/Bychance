class RemoveSenderIdAndRecipientIdFromRooms < ActiveRecord::Migration[6.0]
  def change
    remove_column :rooms, :recipient_id, :integer
    remove_column :rooms, :sender_id, :integer
  end
end
