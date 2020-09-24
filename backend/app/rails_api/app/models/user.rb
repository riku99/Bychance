class User < ApplicationRecord
    has_many :posts, dependent: :destroy
    validates :uid, presence: true
    validates :name, presence: true, length: { maximum: 20 }
    validates :introduce, length: { maximum: 100 }
    validates :message, length: { maximum: 50 }
    validates :display, presence: true
end
