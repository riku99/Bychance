class UserFlashViewing < ApplicationRecord
  belongs_to :user
  belongs_to :flash
end
