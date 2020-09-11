class Nonce < ApplicationRecord
    validates :nonce, presence: true
end
