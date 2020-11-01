class CreateRooms < ActiveRecord::Migration[6.0]
  def change
    create_table :rooms do |t|
      t.integer :sender_id
      t.integer :recipient_id

      t.timestamps
    end
    add_index :rooms, :sender_id
    add_index :rooms, :recipient_id
    add_index :rooms, [:recipient_id, :sender_id], unique: true
  end
end
