class Flash < ApplicationRecord
    belongs_to :user
    validates :content, presence: true
    validates :content_type, presence: true
end