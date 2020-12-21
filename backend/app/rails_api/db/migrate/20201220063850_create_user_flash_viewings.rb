class CreateUserFlashViewings < ActiveRecord::Migration[6.0]
  def change
    create_table :user_flash_viewings do |t|
      t.references :user, null: false, foreign_key: true
      t.references :flash, null: false, foreign_key: true

      t.timestamps
    end
  end
end
