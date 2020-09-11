class User < ApplicationRecord
    validates :uid, presence: true
    validates :name, presence: true, length: { maximum: 20 }
end
