class CreateStories < ActiveRecord::Migration[6.0]
  def change
    create_table :stories do |t|
      t.string :content
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
