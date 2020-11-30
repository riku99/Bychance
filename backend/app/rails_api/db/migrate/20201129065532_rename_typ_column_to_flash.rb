class RenameTypColumnToFlash < ActiveRecord::Migration[6.0]
  def change
    rename_column :flashes, :type, :content_type
  end
end
