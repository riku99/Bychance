class AddIndexUserFlashViewing < ActiveRecord::Migration[6.0]
  def change
    add_index :user_flash_viewings, [:user_id, :flash_id], unique: true
  end
end
