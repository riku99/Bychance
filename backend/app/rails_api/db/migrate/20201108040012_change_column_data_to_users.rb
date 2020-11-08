class ChangeColumnDataToUsers < ActiveRecord::Migration[6.0]
  def change
    change_column :users, :lat, :string
    change_column :users, :lng, :string
  end
end
