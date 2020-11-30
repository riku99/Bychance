class AddColumnToFlash < ActiveRecord::Migration[6.0]
  def change
    add_column :flashes, :type, :string, null: false
  end
end
