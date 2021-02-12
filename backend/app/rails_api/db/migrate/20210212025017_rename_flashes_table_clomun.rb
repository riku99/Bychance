class RenameFlashesTableClomun < ActiveRecord::Migration[6.0]
  def change
    rename_column :flashes, :content, :source
    rename_column :flashes, :content_type, :source_type
  end
end
