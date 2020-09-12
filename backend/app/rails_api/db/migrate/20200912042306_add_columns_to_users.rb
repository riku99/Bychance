class AddColumnsToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :introduce, :text
    add_column :users, :message, :text
    add_column :users, :display, :boolean
  end
end
