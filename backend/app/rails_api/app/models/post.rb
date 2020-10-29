class Post < ApplicationRecord
  belongs_to :user
  validates :image, presence: true
  default_scope -> { order(created_at: :desc) }
end
