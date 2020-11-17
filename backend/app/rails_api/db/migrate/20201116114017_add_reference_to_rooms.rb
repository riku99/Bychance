class AddReferenceToRooms < ActiveRecord::Migration[6.0]
  def change
    add_reference :rooms, :sender, foreign_key: { to_table: :users }
    add_reference :rooms, :recipient, foreign_key: { to_table: :users }
  end
end
