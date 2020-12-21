class Flash < ApplicationRecord
    belongs_to :user

    has_many :user_flash_viewings, dependent: :destroy
    has_many :viewed_users, through: :user_flash_viewings, source: :user

    validates :content, presence: true
    validates :content_type, presence: true
end