class ChangeReadDefaultOnRoomMessages < ActiveRecord::Migration[6.0]
  def change
    change_column_default :room_messages, :read, from: nil, to: false
  end
end
