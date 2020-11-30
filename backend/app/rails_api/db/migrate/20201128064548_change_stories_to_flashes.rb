class ChangeStoriesToFlashes < ActiveRecord::Migration[6.0]
  def change
    rename_table :stories, :flashes
  end
end
