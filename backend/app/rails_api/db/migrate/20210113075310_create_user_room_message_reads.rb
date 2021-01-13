class CreateUserRoomMessageReads < ActiveRecord::Migration[6.0]
  def change
    create_table :user_room_message_reads do |t|
      t.references :user, null: false, foreign_key: true
      t.references :room_message, null: false, foreign_key: true

      t.timestamps
    end

    add_index :user_room_message_reads, [:user_id, :room_message_id], unique: true
  end
end
