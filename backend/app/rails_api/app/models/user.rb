class User < ApplicationRecord
    has_many :posts, dependent: :destroy
    validates :uid, presence: true
    validates :token, presence: true
    validates :name, presence: true, length: { maximum: 20 }
    validates :introduce, length: { maximum: 100 }
    validates :message, length: { maximum: 50 }

    def User.new_token
        SecureRandom.urlsafe_base64
    end

    def User.digest(arg)
        arg.crypt(Rails.application.credentials.salt[:salt_key])
    end
end
